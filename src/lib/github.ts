import { Effect, Schedule } from "effect";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import {
  fetchEffect,
  HttpError,
  isRetryableHttpError,
  jsonEffect,
} from "@/lib/http";
import { logger } from "@/lib/logger";

const GITHUB_API = "https://api.github.com";
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 2;
const CONTRIBUTIONS_CONCURRENCY = 3;
const CONTRIBUTORS_REVALIDATE_SECONDS = 60 * 60 * 24; // 24 hours
const log = logger.withPrefix("[github]");

const repoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
});

const searchSchema = z.object({
  items: z.array(repoSchema),
});

const contributorEntrySchema = z.object({
  author: z.object({ login: z.string() }).nullable(),
  total: z.number().int().nonnegative().optional(),
  weeks: z.array(z.object({ c: z.number().int().nonnegative() })),
});

interface GitHubStarsOptions {
  /** Fetch stars for a single repo instead of summing across all the user's repos. */
  repo?: string;
  /** Value returned when the request fails. Defaults to 0. */
  fallback?: number;
}

/**
 * Returns a GitHub stargazers count.
 *
 * By default it sums the stars across all of the user's public repositories
 * that have at least one star. Pass `repo` to get the count for a single
 * repository instead.
 *
 * Cached for an hour via the `use cache` directive (Cache Components).
 *
 * Note: the search endpoint caps results at 100 repos (GitHub's `per_page`
 * limit), which comfortably covers a typical user.
 *
 * @param username - GitHub username (e.g. "bhimrazy")
 * @param options  - Optional `repo` and `fallback` overrides
 */
export async function getGitHubStars(
  username: string,
  options: GitHubStarsOptions = {},
): Promise<number> {
  "use cache";
  cacheLife("hours");

  const { repo, fallback = 0 } = options;

  const url = repo
    ? `${GITHUB_API}/repos/${username}/${repo}`
    : `${GITHUB_API}/search/repositories?${new URLSearchParams({
        order: "desc",
        per_page: "100",
        q: `user:${username} stars:>0`,
        sort: "updated",
      })}`;
  const logContext = { repo, username };

  const program = fetchEffect(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).pipe(
    Effect.retry({
      schedule: Schedule.spaced("400 millis"),
      times: DEFAULT_RETRIES,
      while: isRetryableHttpError,
    }),
    Effect.flatMap((res) =>
      repo
        ? jsonEffect(res, repoSchema).pipe(
            Effect.map((data) => data.stargazers_count),
          )
        : jsonEffect(res, searchSchema).pipe(
            Effect.map((data) =>
              data.items.reduce((sum, r) => sum + r.stargazers_count, 0),
            ),
          ),
    ),
    Effect.tapError((error) =>
      Effect.sync(() => {
        log.warn(
          "stars request failed",
          {
            ...logContext,
            status: error.status,
          },
          error,
        );
      }),
    ),
    Effect.catchAll(() => Effect.succeed(fallback)),
  );

  return Effect.runPromise(program);
}

function parseContributors(body: string) {
  return Effect.try({
    try: () => JSON.parse(body) as unknown,
    catch: () => new HttpError("Invalid GitHub contributors JSON"),
  }).pipe(
    Effect.flatMap((json) => {
      const parsed = z.array(contributorEntrySchema).safeParse(json);
      if (!parsed.success) {
        return Effect.fail(new HttpError("Invalid GitHub contributors data"));
      }
      return Effect.succeed(parsed.data);
    }),
  );
}

function fetchRepoContributors(
  repo: string,
  username: string,
): Effect.Effect<number, HttpError> {
  const url = new URL(
    "graphs/contributors-data",
    `https://github.com/${repo}/`,
  );

  return fetchEffect(
    url,
    {
      cache: "force-cache",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      next: {
        revalidate: CONTRIBUTORS_REVALIDATE_SECONDS,
        tags: [`github-contributors:${repo}`],
      },
    },
    DEFAULT_TIMEOUT_MS,
  ).pipe(
    Effect.flatMap((res) => {
      if (res.status === 202) {
        return Effect.fail(
          new HttpError("GitHub contributors data is warming", {
            retryable: true,
            status: res.status,
          }),
        );
      }

      return Effect.tryPromise({
        try: () => res.text(),
        catch: () => new HttpError("GitHub contributors response failed"),
      });
    }),
    Effect.flatMap((body) => {
      const trimmedBody = body.trim();
      if (!trimmedBody) {
        return Effect.fail(
          new HttpError("GitHub contributors data is empty", {
            retryable: true,
          }),
        );
      }
      return parseContributors(trimmedBody);
    }),
    Effect.map((data) => {
      const entry = data.find(
        (c) => c.author?.login.toLowerCase() === username.toLowerCase(),
      );
      if (!entry) return 0;
      return entry.total ?? entry.weeks.reduce((sum, w) => sum + w.c, 0);
    }),
  );
}

/**
 * Returns a single repo's commit count for `username`, matching the number
 * shown in the repo's Insights → Contributors tab.
 *
 * This hits the same endpoint the Insights UI renders from, which needs no
 * auth and isn't bound by the REST API's 60/hour limit. GitHub responds with
 * HTTP 202 (and an empty body) while it warms its stats cache, so Effect polls
 * until the data is ready. Counts are for the default branch only, and the
 * contributor list is capped at the top contributors — a user outside that
 * set reads as 0.
 */
async function fetchRepoCommits(
  repo: string,
  username: string,
  maxRetries: number,
  delayMs: number,
): Promise<number | null> {
  const logContext = { repo, username };
  const program = fetchRepoContributors(repo, username).pipe(
    Effect.retry({
      schedule: Schedule.spaced(`${delayMs} millis`),
      times: maxRetries,
      while: isRetryableHttpError,
    }),
    Effect.tapError((error) =>
      Effect.sync(() => {
        log.warn(
          "contributions request failed",
          {
            ...logContext,
            status: error.status,
          },
          error,
        );
      }),
    ),
    Effect.catchAll(() => Effect.succeed(null)),
  );

  return Effect.runPromise(program);
}

/**
 * Sums a user's commit contributions across the given repos.
 *
 * Cached for an hour via the `use cache` directive and tagged
 * `github-contributions` for on-demand revalidation.
 *
 * @param username - GitHub username (e.g. "bhimrazy")
 * @param repos    - "owner/repo" slugs to sum across
 * @param fallback - Value returned if every repo fails to resolve (default: 0)
 */
export async function getGitHubContributions(
  username: string,
  repos: string[],
  fallback = 0,
): Promise<number> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-contributions");

  try {
    const entries = await Effect.runPromise(
      Effect.all(
        repos.map((repo) =>
          Effect.promise(
            async () =>
              [repo, await fetchRepoCommits(repo, username, 2, 500)] as const,
          ),
        ),
        { concurrency: CONTRIBUTIONS_CONCURRENCY },
      ),
    );
    const total = entries.reduce((sum, [, count]) => sum + (count ?? 0), 0);
    const hasResolvedRepo = entries.some(([, count]) => count !== null);
    return hasResolvedRepo ? total : fallback;
  } catch (error) {
    log.warn("contributions request error", { username }, error);
    return fallback;
  }
}
