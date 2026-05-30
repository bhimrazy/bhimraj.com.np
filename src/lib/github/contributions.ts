import { Effect, Schedule } from "effect";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { fetchEffect, HttpError, isRetryableHttpError } from "@/lib/http";
import { log, REQUEST_CONCURRENCY } from "./client";
import { contributorEntrySchema } from "./schemas";

const DEFAULT_TIMEOUT_MS = 5000;
const CONTRIBUTORS_REVALIDATE_SECONDS = 60 * 60 * 24; // 24 hours

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
function fetchRepoCommits(
  repo: string,
  username: string,
  maxRetries: number,
  delayMs: number,
): Promise<number | null> {
  const program = fetchRepoContributors(repo, username).pipe(
    Effect.retry({
      schedule: Schedule.spaced(`${delayMs} millis`),
      times: maxRetries,
      while: isRetryableHttpError,
    }),
    Effect.tapError((error) =>
      Effect.sync(() =>
        log.warn(
          "contributions request failed",
          { repo, username, status: error.status },
          error,
        ),
      ),
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
        { concurrency: REQUEST_CONCURRENCY },
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
