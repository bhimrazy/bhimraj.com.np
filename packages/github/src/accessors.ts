import snapshotData from "../data/snapshot.json" with { type: "json" };
import {
  githubSearchUrl,
  type OSSActivityMetric,
  ossActivityQueries,
  ossSearchScope,
} from "./activity-queries";
import { ossRepos, username } from "./config";
import { type GitHubSnapshot, snapshotSchema } from "./types";

/**
 * The committed snapshot, validated at module load. Reads are pure and
 * synchronous — no network, no rate limits, no runtime fallbacks. Existing
 * callers that `await` these still work (awaiting a non-promise is a no-op).
 */
const snapshot: GitHubSnapshot = snapshotSchema.parse(snapshotData);

export function getGitHubStars(): number {
  return snapshot.stars;
}

export function getGitHubContributions(): number {
  return snapshot.contributions;
}

export function getLightningCommits(): number {
  return snapshot.lightningCommits;
}

export function getFeaturedRepoStats(): GitHubSnapshot["featuredRepo"] {
  return snapshot.featuredRepo;
}

export function getOSSStats(): GitHubSnapshot["ossStats"] {
  return snapshot.ossStats;
}

export function getLightningAIEcosystemStats(): GitHubSnapshot["lightningEcosystem"] {
  return snapshot.lightningEcosystem;
}

export function getContributedRepos(): GitHubSnapshot["contributedRepos"] {
  return snapshot.contributedRepos;
}

export function getMonthlyContributions(): GitHubSnapshot["monthlyContributions"] {
  return snapshot.monthlyContributions;
}

export function getOSSActivity(): GitHubSnapshot["ossActivity"] {
  return snapshot.ossActivity;
}

/** A github.com search per activity metric, so visitors can verify each count. */
export function getOSSActivitySearchUrls(): Record<OSSActivityMetric, string> {
  const queries = ossActivityQueries(
    username,
    ossSearchScope(username, ossRepos),
  );
  return Object.fromEntries(
    Object.entries(queries).map(([metric, q]) => [metric, githubSearchUrl(q)]),
  ) as Record<OSSActivityMetric, string>;
}

/** When the snapshot was generated (ISO string) — for an "updated X ago" label. */
export function getSnapshotMeta(): { generatedAt: string } {
  return { generatedAt: snapshot.generatedAt };
}
