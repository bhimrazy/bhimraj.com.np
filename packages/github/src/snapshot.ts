import { featuredRepo, ossRepos, username } from "./config";
import {
  getGitHubContributions,
  getMonthlyContributions,
} from "./fetchers/contributions";
import {
  getContributedRepos,
  getLightningAIEcosystemStats,
  getOSSStats,
} from "./fetchers/ecosystem";
import { getFeaturedRepoStats, getGitHubStars } from "./fetchers/stars";
import type { GitHubSnapshot } from "./types";

/**
 * Fetches everything the site needs from GitHub and assembles a single snapshot
 * object. Runs in a plain Node/Bun process (the sync command), authenticated via
 * `GITHUB_TOKEN`, so it gets the full data without the request-time rate limits.
 */
export async function buildSnapshot(): Promise<GitHubSnapshot> {
  const lightningRepos = ossRepos.filter((r) => r.startsWith("Lightning-AI/"));

  const [
    stars,
    contributions,
    lightningCommits,
    featured,
    ossStats,
    lightningEcosystem,
    contributedRepos,
    monthlyContributions,
  ] = await Promise.all([
    getGitHubStars(username),
    getGitHubContributions(username, ossRepos),
    getGitHubContributions(username, lightningRepos),
    getFeaturedRepoStats(featuredRepo),
    getOSSStats(username, ossRepos),
    getLightningAIEcosystemStats(username),
    getContributedRepos(username, ossRepos),
    getMonthlyContributions(username, ossRepos),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    stars,
    contributions,
    lightningCommits,
    featuredRepo: featured,
    ossStats,
    lightningEcosystem,
    contributedRepos,
    monthlyContributions,
  };
}
