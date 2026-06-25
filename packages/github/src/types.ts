import { z } from "zod";
import type { MonthlyContribution } from "./fetchers/contributions";
import type {
  ContributedRepo,
  LightningAIEcosystemStats,
  OSSStats,
} from "./fetchers/ecosystem";
import type { FeaturedRepoStats } from "./fetchers/stars";

export type {
  MonthlyContribution,
  MonthlyRepoContribution,
} from "./fetchers/contributions";
export type {
  ContributedRepo,
  LightningAIEcosystemStats,
  LightningAIRepoStat,
  OSSStats,
} from "./fetchers/ecosystem";
export type { FeaturedRepoStats } from "./fetchers/stars";
export type { StarPoint } from "./star-history";

/**
 * The committed GitHub data artifact. The sync command produces it daily; the
 * web app reads it at build time. One object is the entire site's GitHub state.
 */
export type GitHubSnapshot = {
  /** ISO timestamp of when this snapshot was generated. */
  generatedAt: string;
  /** Total stars summed across the user's public repos. */
  stars: number;
  /** Total commit contributions across all tracked repos. */
  contributions: number;
  /** Commit contributions across the Lightning-AI repos only. */
  lightningCommits: number;
  featuredRepo: FeaturedRepoStats | null;
  ossStats: OSSStats;
  lightningEcosystem: LightningAIEcosystemStats;
  contributedRepos: ContributedRepo[];
  monthlyContributions: MonthlyContribution[];
};

const starPointSchema = z.object({
  t: z.number(),
  stars: z.number(),
});

const featuredRepoStatsSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  description: z.string(),
  stars: z.number(),
  forks: z.number(),
  language: z.string().nullable(),
  url: z.string(),
  history: z.array(starPointSchema),
});

const ossStatsSchema = z.object({
  totalCommits: z.number(),
  totalPrs: z.number(),
});

const lightningEcosystemSchema = z.object({
  totalPrs: z.number(),
  repos: z.array(
    z.object({
      name: z.string(),
      fullName: z.string(),
      description: z.string(),
      prs: z.number(),
      stars: z.number(),
      forks: z.number(),
    }),
  ),
});

const contributedRepoSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  org: z.string(),
  description: z.string(),
  commits: z.number(),
  prs: z.number(),
  stars: z.number(),
  forks: z.number(),
});

const monthlyRepoContributionSchema = z.object({
  repo: z.string(),
  name: z.string(),
  commits: z.number(),
});

const monthlyContributionSchema = z.object({
  label: z.string(),
  year: z.number(),
  month: z.number(),
  commits: z.number(),
  // Optional for backward compatibility with snapshots written before the
  // per-repo split existed; defaults to empty so existing data still parses.
  byRepo: z.array(monthlyRepoContributionSchema).default([]),
});

/** Runtime guard used both when writing the snapshot and when reading it. */
export const snapshotSchema = z.object({
  generatedAt: z.string(),
  stars: z.number(),
  contributions: z.number(),
  lightningCommits: z.number(),
  featuredRepo: featuredRepoStatsSchema.nullable(),
  ossStats: ossStatsSchema,
  lightningEcosystem: lightningEcosystemSchema,
  contributedRepos: z.array(contributedRepoSchema),
  monthlyContributions: z.array(monthlyContributionSchema),
}) satisfies z.ZodType<GitHubSnapshot>;
