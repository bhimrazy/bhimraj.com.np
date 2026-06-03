/**
 * Centralised cache configuration for all GitHub data-fetching functions.
 *
 * TTLs are deliberately staggered so cached values don't all expire at the
 * same time, which would trigger a burst of concurrent requests to GitHub and
 * risk hitting rate limits.
 *
 * Each entry is used at two layers:
 *  - function level  → cacheLife({ revalidate }) + cacheTag(CACHE_TAGS.x)
 *  - fetch level     → next: { revalidate, tags: [CACHE_TAGS.x] }
 */

export const CACHE_TAGS = {
  featuredRepo: "github-featured-repo",
  ossStats: "github-oss-stats",
  lightningEcosystem: "github-lightning-ecosystem",
  contributedRepos: "github-contributed-repos",
  stars: "github-stars",
  contributions: "github-contributions",
  monthlyContributions: "github-monthly-contributions",
  /** Per-repo tag for the contributors-graph fetch. */
  repoContributors: (repo: string) => `github-contributors:${repo}`,
} as const;

/** Revalidate intervals in seconds. */
export const CACHE_REVALIDATE = {
  featuredRepo: 1 * 60 * 60, //  1 h — star history changes frequently
  ossStats: 3 * 60 * 60, //  3 h
  lightningEcosystem: 4 * 60 * 60, //  4 h
  contributedRepos: 5 * 60 * 60, //  5 h
  stars: 6 * 60 * 60, //  6 h
  contributions: 7 * 60 * 60, //  7 h
  monthlyContributions: 8 * 60 * 60, //  8 h
  repoContributors: 24 * 60 * 60, // 24 h — per-repo commit history is stable
} as const;
