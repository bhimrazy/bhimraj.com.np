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

const prCountSchema = z.object({
  total_count: z.number().int().nonnegative(),
});

const ecosystemRepoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  description: z.string().nullable(),
});

const contributorEntrySchema = z.object({
  author: z.object({ login: z.string() }).nullable(),
  total: z.number().int().nonnegative().optional(),
  weeks: z.array(z.object({ c: z.number().int().nonnegative() })),
});

const featuredRepoSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  html_url: z.string(),
});

const stargazersSchema = z.array(z.object({ starred_at: z.string() }));

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
        per_page: "500",
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

export type LightningAIRepoStat = {
  name: string;
  fullName: string;
  description: string;
  prs: number;
  stars: number;
  forks: number;
};

export type LightningAIEcosystemStats = {
  totalPrs: number;
  repos: LightningAIRepoStat[];
};

const LIGHTNING_AI_REPOS: ReadonlyArray<{ name: string; fullName: string }> = [
  { name: "LitData", fullName: "Lightning-AI/litdata" },
  { name: "LitServe", fullName: "Lightning-AI/LitServe" },
  { name: "PyTorch Lightning", fullName: "Lightning-AI/pytorch-lightning" },
  { name: "LitGPT", fullName: "Lightning-AI/litgpt" },
];

export async function getLightningAIEcosystemStats(
  username: string,
): Promise<LightningAIEcosystemStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-lightning-ecosystem");

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const fetchTotalPrs = fetchEffect(
    `${GITHUB_API}/search/issues?${new URLSearchParams({
      q: `author:${username} org:Lightning-AI is:pr is:merged`,
      per_page: "1",
    })}`,
    { headers },
  ).pipe(
    Effect.flatMap((res) => jsonEffect(res, prCountSchema)),
    Effect.map((d) => d.total_count),
    Effect.catchAll(() => Effect.succeed(208)),
  );

  const fetchRepoStats = Effect.all(
    LIGHTNING_AI_REPOS.map(({ name, fullName }) =>
      Effect.all([
        fetchEffect(`${GITHUB_API}/repos/${fullName}`, { headers }).pipe(
          Effect.flatMap((res) => jsonEffect(res, ecosystemRepoSchema)),
          Effect.catchAll(() =>
            Effect.succeed({
              stargazers_count: 0,
              forks_count: 0,
              description: null,
            }),
          ),
        ),
        fetchEffect(
          `${GITHUB_API}/search/issues?${new URLSearchParams({
            q: `author:${username} repo:${fullName} is:pr is:merged`,
            per_page: "1",
          })}`,
          { headers },
        ).pipe(
          Effect.flatMap((res) => jsonEffect(res, prCountSchema)),
          Effect.map((d) => d.total_count),
          Effect.catchAll(() => Effect.succeed(0)),
        ),
      ]).pipe(
        Effect.map(([repoData, prs]) => ({
          name,
          fullName,
          description: repoData.description ?? "",
          prs,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        })),
      ),
    ),
    { concurrency: CONTRIBUTIONS_CONCURRENCY },
  );

  const [totalPrs, repos] = await Promise.all([
    Effect.runPromise(fetchTotalPrs),
    Effect.runPromise(fetchRepoStats),
  ]);

  return {
    totalPrs,
    repos: [...repos].sort((a, b) => b.prs - a.prs),
  };
}

export type OSSStats = {
  totalCommits: number;
  totalPrs: number;
};

/**
 * Broader OSS contribution stats across all tracked repos (not just Lightning AI).
 * Commits are summed across `repos`; PRs are fetched per non-own-repo entry.
 */
export async function getOSSStats(
  username: string,
  repos: string[],
): Promise<OSSStats> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-oss-stats");

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // External repos = those not owned by the user themselves
  const externalRepos = repos.filter(
    (r) => !r.toLowerCase().startsWith(`${username.toLowerCase()}/`),
  );

  // Group Lightning AI repos under the org search (1 call) and fetch the rest individually
  const lightningRepos = externalRepos.filter((r) =>
    r.startsWith("Lightning-AI/"),
  );
  const otherRepos = externalRepos.filter(
    (r) => !r.startsWith("Lightning-AI/"),
  );

  const prPrograms = [
    ...(lightningRepos.length > 0
      ? [
          fetchEffect(
            `${GITHUB_API}/search/issues?${new URLSearchParams({
              q: `author:${username} org:Lightning-AI is:pr is:merged`,
              per_page: "1",
            })}`,
            { headers },
          ).pipe(
            Effect.flatMap((res) => jsonEffect(res, prCountSchema)),
            Effect.map((d) => d.total_count),
            Effect.catchAll(() => Effect.succeed(0)),
          ),
        ]
      : []),
    ...otherRepos.map((repo) =>
      fetchEffect(
        `${GITHUB_API}/search/issues?${new URLSearchParams({
          q: `author:${username} repo:${repo} is:pr is:merged`,
          per_page: "1",
        })}`,
        { headers },
      ).pipe(
        Effect.flatMap((res) => jsonEffect(res, prCountSchema)),
        Effect.map((d) => d.total_count),
        Effect.catchAll(() => Effect.succeed(0)),
      ),
    ),
  ];

  const [prCounts, totalCommits] = await Promise.all([
    Effect.runPromise(
      Effect.all(prPrograms, { concurrency: CONTRIBUTIONS_CONCURRENCY }),
    ),
    getGitHubContributions(username, repos),
  ]);

  return {
    totalCommits,
    totalPrs: prCounts.reduce((sum, n) => sum + n, 0),
  };
}

export type StarPoint = { t: number; stars: number };

export type FeaturedRepoStats = {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  history: StarPoint[];
};

const STAR_HISTORY_MAX_PAGES = 12;
const STAR_HISTORY_POINTS = 40;

/**
 * Downsamples sorted star timestamps into a cumulative growth series of at most
 * `STAR_HISTORY_POINTS` evenly-spaced points. The final point is bumped to the
 * repo's reported total in case pagination was capped.
 */
function buildStarHistory(
  timestamps: number[],
  totalStars: number,
): StarPoint[] {
  const n = timestamps.length;
  if (n === 0) return [];
  if (n === 1) return [{ t: timestamps[0], stars: totalStars }];

  const sampleCount = Math.min(STAR_HISTORY_POINTS, n);
  const points: StarPoint[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const idx = Math.round((i / (sampleCount - 1)) * (n - 1));
    points.push({ t: timestamps[idx], stars: idx + 1 });
  }
  points[points.length - 1].stars = Math.max(
    points[points.length - 1].stars,
    totalStars,
  );
  return points;
}

/**
 * Returns a self-authored repo's current stats plus a cumulative star-growth
 * series, used for the homepage "Featured Project" spotlight.
 *
 * Star timestamps come from the stargazers endpoint with the `star+json` media
 * type, paginated 100-at-a-time up to `STAR_HISTORY_MAX_PAGES`. Cached hourly
 * via `use cache` and tagged for on-demand revalidation. Returns `null` if the
 * repo metadata can't be fetched.
 *
 * @param fullName - "owner/repo" slug (e.g. "bhimrazy/receipt-ocr")
 */
export async function getFeaturedRepoStats(
  fullName: string,
): Promise<FeaturedRepoStats | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-featured-repo");

  const program = Effect.gen(function* () {
    const repo = yield* fetchEffect(`${GITHUB_API}/repos/${fullName}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }).pipe(Effect.flatMap((res) => jsonEffect(res, featuredRepoSchema)));

    const pageCount = Math.min(
      Math.ceil(repo.stargazers_count / 100),
      STAR_HISTORY_MAX_PAGES,
    );
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    const starPages = yield* Effect.all(
      pages.map((page) =>
        fetchEffect(
          `${GITHUB_API}/repos/${fullName}/stargazers?${new URLSearchParams({
            per_page: "100",
            page: String(page),
          })}`,
          {
            headers: {
              Accept: "application/vnd.github.star+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        ).pipe(
          Effect.flatMap((res) => jsonEffect(res, stargazersSchema)),
          Effect.catchAll(() => Effect.succeed([] as { starred_at: string }[])),
        ),
      ),
      { concurrency: CONTRIBUTIONS_CONCURRENCY },
    );

    const timestamps = starPages
      .flat()
      .map((s) => new Date(s.starred_at).getTime())
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => a - b);

    return {
      name: fullName.split("/")[1] ?? fullName,
      fullName,
      description: repo.description ?? "",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      history: buildStarHistory(timestamps, repo.stargazers_count),
    } satisfies FeaturedRepoStats;
  });

  return Effect.runPromise(
    program.pipe(
      Effect.tapError((error) =>
        Effect.sync(() =>
          log.warn("featured repo request failed", { fullName }, error),
        ),
      ),
      Effect.catchAll(() => Effect.succeed(null)),
    ),
  );
}
