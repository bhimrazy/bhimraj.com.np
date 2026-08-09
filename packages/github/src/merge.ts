import type {
  ContributedRepo,
  GitHubSnapshot,
  LightningAIRepoStat,
} from "./types";

/** Stars and forks do churn downward, but never by a tenth overnight. */
const DROP_TOLERANCE = 0.1;

/** A field whose fresh value regressed and was clamped back to the previous one. */
export type SnapshotAnomaly = {
  field: string;
  prev: number;
  next: number;
};

export type MergeResult = {
  snapshot: GitHubSnapshot;
  /** Empty when the fresh snapshot was clean; non-empty means a degraded fetch. */
  anomalies: SnapshotAnomaly[];
};

/**
 * Merges a freshly built snapshot with the last committed one so a degraded
 * fetch can never publish worse data than we already have.
 *
 * The fetchers degrade to a *partial* result rather than failing: a repo whose
 * contributors graph times out contributes 0 commits, a failed PR search counts
 * as 0. Totals stay positive, so a regression is only visible against `prev`.
 * Cumulative counters therefore only move up; volatile ones (stars, forks) may
 * fall within `DROP_TOLERANCE`. `generatedAt` always advances.
 */
export function mergeSnapshot(
  next: GitHubSnapshot,
  prev: GitHubSnapshot | null,
): MergeResult {
  if (!prev) return { snapshot: next, anomalies: [] };

  const anomalies: SnapshotAnomaly[] = [];

  const record = (field: string, prevValue: number, nextValue: number) => {
    anomalies.push({ field, prev: prevValue, next: nextValue });
    return prevValue;
  };

  /** Monotonic: a cumulative total that only grows. */
  const keepMax = (field: string, nextValue: number, prevValue: number) =>
    nextValue < prevValue ? record(field, prevValue, nextValue) : nextValue;

  /** Volatile: may fall, but a cliff steeper than `DROP_TOLERANCE` is a bad fetch. */
  const keepCount = (field: string, nextValue: number, prevValue: number) =>
    nextValue < prevValue * (1 - DROP_TOLERANCE)
      ? record(field, prevValue, nextValue)
      : nextValue;

  return {
    anomalies,
    snapshot: {
      generatedAt: next.generatedAt,
      stars: keepCount("stars", next.stars, prev.stars),
      contributions: keepMax(
        "contributions",
        next.contributions,
        prev.contributions,
      ),
      lightningCommits: keepMax(
        "lightningCommits",
        next.lightningCommits,
        prev.lightningCommits,
      ),
      featuredRepo: mergeFeaturedRepo(next, prev, keepCount),
      ossStats: {
        totalCommits: keepMax(
          "ossStats.totalCommits",
          next.ossStats.totalCommits,
          prev.ossStats.totalCommits,
        ),
        totalPrs: keepMax(
          "ossStats.totalPrs",
          next.ossStats.totalPrs,
          prev.ossStats.totalPrs,
        ),
      },
      lightningEcosystem: {
        totalPrs: keepMax(
          "lightningEcosystem.totalPrs",
          next.lightningEcosystem.totalPrs,
          prev.lightningEcosystem.totalPrs,
        ),
        repos: mergeRepoList(
          next.lightningEcosystem.repos,
          prev.lightningEcosystem.repos,
          "lightningEcosystem.repos",
          keepMax,
          keepCount,
          record,
        ).sort((a, b) => b.prs - a.prs),
      },
      contributedRepos: mergeRepoList(
        next.contributedRepos,
        prev.contributedRepos,
        "contributedRepos",
        keepMax,
        keepCount,
        record,
      ).sort((a, b) => b.commits - a.commits || b.prs - a.prs),
      monthlyContributions: mergeMonths(next, prev, record),
    },
  };
}

type KeepFn = (field: string, next: number, prev: number) => number;

type RepoCard = ContributedRepo | LightningAIRepoStat;

/**
 * Merges repo cards by `fullName`. A repo missing from `next` is carried over,
 * not dropped: `getContributedRepos` filters on `commits > 1`, so a failed
 * commit fetch makes the card disappear entirely.
 */
function mergeRepoList<T extends RepoCard>(
  next: readonly T[],
  prev: readonly T[],
  field: string,
  keepMax: KeepFn,
  keepCount: KeepFn,
  record: (field: string, prev: number, next: number) => number,
): T[] {
  const prevByName = new Map(prev.map((repo) => [repo.fullName, repo]));

  const merged = next.map((repo) => {
    const before = prevByName.get(repo.fullName);
    prevByName.delete(repo.fullName);
    if (!before) return repo;

    const scope = `${field}[${repo.fullName}]`;
    return {
      ...repo,
      // A repo's description comes back empty when its metadata lookup failed.
      description: repo.description || before.description,
      prs: keepMax(`${scope}.prs`, repo.prs, before.prs),
      stars: keepCount(`${scope}.stars`, repo.stars, before.stars),
      forks: keepCount(`${scope}.forks`, repo.forks, before.forks),
      ...("commits" in repo && "commits" in before
        ? { commits: keepMax(`${scope}.commits`, repo.commits, before.commits) }
        : {}),
    } as T;
  });

  // Anything left in the map vanished from this run — keep the last good card.
  for (const dropped of prevByName.values()) {
    record(
      `${field}[${dropped.fullName}]`,
      "commits" in dropped ? dropped.commits : dropped.prs,
      0,
    );
    merged.push(dropped);
  }

  return merged;
}

/**
 * Past months are fixed and the current one only grows, so a month that shrank
 * lost a repo to a failed fetch — revert the whole bucket, `byRepo` included.
 */
function mergeMonths(
  next: GitHubSnapshot,
  prev: GitHubSnapshot,
  record: (field: string, prev: number, next: number) => number,
): GitHubSnapshot["monthlyContributions"] {
  const prevByKey = new Map(
    prev.monthlyContributions.map((m) => [`${m.year}-${m.month}`, m]),
  );

  return next.monthlyContributions.map((month) => {
    const before = prevByKey.get(`${month.year}-${month.month}`);
    if (!before || month.commits >= before.commits) return month;
    record(
      `monthlyContributions[${month.year}-${month.label}]`,
      before.commits,
      month.commits,
    );
    return before;
  });
}

/** Failed stargazer pages truncate the history, so keep whichever is longer. */
function mergeFeaturedRepo(
  next: GitHubSnapshot,
  prev: GitHubSnapshot,
  keepCount: KeepFn,
): GitHubSnapshot["featuredRepo"] {
  if (!next.featuredRepo) return prev.featuredRepo;
  if (!prev.featuredRepo) return next.featuredRepo;

  return {
    ...next.featuredRepo,
    stars: keepCount(
      "featuredRepo.stars",
      next.featuredRepo.stars,
      prev.featuredRepo.stars,
    ),
    forks: keepCount(
      "featuredRepo.forks",
      next.featuredRepo.forks,
      prev.featuredRepo.forks,
    ),
    history:
      next.featuredRepo.history.length < prev.featuredRepo.history.length
        ? prev.featuredRepo.history
        : next.featuredRepo.history,
  };
}
