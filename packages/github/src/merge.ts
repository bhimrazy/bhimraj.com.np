import type { GitHubSnapshot } from "./types";

/** Keep the previous value when the fresh one regressed to a non-positive fallback. */
function keepNumber(next: number, prev: number | undefined): number {
  return next <= 0 && prev !== undefined && prev > 0 ? prev : next;
}

/** Keep the previous array when the fresh fetch came back empty. */
function keepArray<T>(next: T[], prev: T[] | undefined): T[] {
  return next.length === 0 && prev && prev.length > 0 ? prev : next;
}

const sumCommits = (months: GitHubSnapshot["monthlyContributions"]): number =>
  months.reduce((total, m) => total + m.commits, 0);

/**
 * Merges a freshly built snapshot with the last committed one so a degraded
 * fetch (rate limit, transient 5xx, GitHub stats still warming) can never
 * overwrite good data with zeros/nulls. `generatedAt` always advances; every
 * other field falls back to `prev` only when `next` looks like a regression.
 */
export function mergeSnapshot(
  next: GitHubSnapshot,
  prev: GitHubSnapshot | null,
): GitHubSnapshot {
  if (!prev) return next;

  return {
    generatedAt: next.generatedAt,
    stars: keepNumber(next.stars, prev.stars),
    contributions: keepNumber(next.contributions, prev.contributions),
    lightningCommits: keepNumber(next.lightningCommits, prev.lightningCommits),
    featuredRepo: next.featuredRepo ?? prev.featuredRepo,
    ossStats: {
      totalCommits: keepNumber(
        next.ossStats.totalCommits,
        prev.ossStats.totalCommits,
      ),
      totalPrs: keepNumber(next.ossStats.totalPrs, prev.ossStats.totalPrs),
    },
    lightningEcosystem: {
      totalPrs: keepNumber(
        next.lightningEcosystem.totalPrs,
        prev.lightningEcosystem.totalPrs,
      ),
      repos: keepArray(
        next.lightningEcosystem.repos,
        prev.lightningEcosystem.repos,
      ),
    },
    contributedRepos: keepArray(next.contributedRepos, prev.contributedRepos),
    monthlyContributions:
      sumCommits(next.monthlyContributions) === 0 &&
      sumCommits(prev.monthlyContributions) > 0
        ? prev.monthlyContributions
        : next.monthlyContributions,
  };
}
