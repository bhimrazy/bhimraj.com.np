import { Effect, Schedule } from "effect";
import { GITHUB_API, githubJson, log, REQUEST_CONCURRENCY } from "../client";
import { isRetryableHttpError } from "../lib/http";
import {
  featuredRepoSchema,
  repoSchema,
  searchSchema,
  stargazersSchema,
} from "../schemas";
import {
  buildStarHistory,
  STAR_HISTORY_MAX_PAGES,
  type StarPoint,
} from "../star-history";

const DEFAULT_RETRIES = 2;

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
  const { repo, fallback = 0 } = options;

  const stars = repo
    ? githubJson(`${GITHUB_API}/repos/${username}/${repo}`, repoSchema).pipe(
        Effect.map((data) => data.stargazers_count),
      )
    : githubJson(
        `${GITHUB_API}/search/repositories?${new URLSearchParams({
          order: "desc",
          per_page: "100",
          q: `user:${username} stars:>0`,
          sort: "updated",
        })}`,
        searchSchema,
      ).pipe(
        Effect.map((data) =>
          data.items.reduce((sum, r) => sum + r.stargazers_count, 0),
        ),
      );

  const program = stars.pipe(
    Effect.retry({
      schedule: Schedule.spaced("400 millis"),
      times: DEFAULT_RETRIES,
      while: isRetryableHttpError,
    }),
    Effect.tapError((error) =>
      Effect.sync(() =>
        log.warn(
          "stars request failed",
          { repo, username, status: error.status },
          error,
        ),
      ),
    ),
    Effect.catchAll(() => Effect.succeed(fallback)),
  );

  return Effect.runPromise(program);
}

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

/**
 * Returns a self-authored repo's current stats plus a cumulative star-growth
 * series, used for the homepage "Featured Project" spotlight.
 *
 * Star timestamps come from the stargazers endpoint with the `star+json` media
 * type, paginated 100-at-a-time up to `STAR_HISTORY_MAX_PAGES`. Returns `null`
 * if the repo metadata can't be fetched.
 *
 * @param fullName - "owner/repo" slug (e.g. "bhimrazy/receipt-ocr")
 */
export async function getFeaturedRepoStats(
  fullName: string,
): Promise<FeaturedRepoStats | null> {
  const program = Effect.gen(function* () {
    const repo = yield* githubJson(
      `${GITHUB_API}/repos/${fullName}`,
      featuredRepoSchema,
    );

    const pageCount = Math.min(
      Math.ceil(repo.stargazers_count / 100),
      STAR_HISTORY_MAX_PAGES,
    );
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    const starPages = yield* Effect.all(
      pages.map((page) =>
        githubJson(
          `${GITHUB_API}/repos/${fullName}/stargazers?${new URLSearchParams({
            per_page: "100",
            page: String(page),
          })}`,
          stargazersSchema,
          {
            headers: { Accept: "application/vnd.github.star+json" },
          },
        ).pipe(
          Effect.catchAll(() => Effect.succeed([] as { starred_at: string }[])),
        ),
      ),
      { concurrency: REQUEST_CONCURRENCY },
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
