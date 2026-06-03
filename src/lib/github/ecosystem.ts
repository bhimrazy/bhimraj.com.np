import { Effect } from "effect";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_REVALIDATE, CACHE_TAGS } from "./cache";
import {
  GITHUB_API,
  githubJson,
  REQUEST_CONCURRENCY,
  searchMergedPrCount,
} from "./client";
import { getGitHubContributions, getRepoCommitCount } from "./contributions";
import { ecosystemRepoSchema } from "./schemas";

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
  cacheLife({ revalidate: CACHE_REVALIDATE.lightningEcosystem });
  cacheTag(CACHE_TAGS.lightningEcosystem);

  const revalidate = CACHE_REVALIDATE.lightningEcosystem;

  const fetchTotalPrs = searchMergedPrCount(
    `author:${username} org:Lightning-AI is:pr is:merged`,
  ).pipe(Effect.catchAll(() => Effect.succeed(208)));

  const fetchRepoStats = Effect.all(
    LIGHTNING_AI_REPOS.map(({ name, fullName }) =>
      Effect.all([
        githubJson(`${GITHUB_API}/repos/${fullName}`, ecosystemRepoSchema, {
          next: { revalidate, tags: [CACHE_TAGS.lightningEcosystem] },
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed({
              stargazers_count: 0,
              forks_count: 0,
              description: null,
            }),
          ),
        ),
        searchMergedPrCount(
          `author:${username} repo:${fullName} is:pr is:merged`,
        ).pipe(Effect.catchAll(() => Effect.succeed(0))),
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
    { concurrency: REQUEST_CONCURRENCY },
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

/** A repo the user has contributed to, with live commit/PR/star counts. */
export type ContributedRepo = {
  name: string;
  fullName: string;
  org: string;
  description: string;
  commits: number;
  prs: number;
  stars: number;
  forks: number;
};

/**
 * Builds contribution cards for every repo in `repos` where the user has more
 * than one commit, sorted by commit count. Each card carries the repo's own
 * description plus live commit, merged-PR, star, and fork counts.
 *
 * Cached for an hour via `use cache` and tagged `github-contributed-repos`.
 */
export async function getContributedRepos(
  username: string,
  repos: string[],
): Promise<ContributedRepo[]> {
  "use cache";
  cacheLife({ revalidate: CACHE_REVALIDATE.contributedRepos });
  cacheTag(CACHE_TAGS.contributedRepos);

  const revalidate = CACHE_REVALIDATE.contributedRepos;

  const cards = await Effect.runPromise(
    Effect.all(
      repos.map((fullName) =>
        Effect.promise(async () => {
          const [meta, prs, commits] = await Promise.all([
            Effect.runPromise(
              githubJson(
                `${GITHUB_API}/repos/${fullName}`,
                ecosystemRepoSchema,
                {
                  next: { revalidate, tags: [CACHE_TAGS.contributedRepos] },
                },
              ).pipe(
                Effect.catchAll(() =>
                  Effect.succeed({
                    stargazers_count: 0,
                    forks_count: 0,
                    description: null,
                  }),
                ),
              ),
            ),
            Effect.runPromise(
              searchMergedPrCount(
                `author:${username} repo:${fullName} is:pr is:merged`,
              ).pipe(Effect.catchAll(() => Effect.succeed(0))),
            ),
            getRepoCommitCount(fullName, username),
          ]);
          const [org, name] = fullName.split("/");
          return {
            name,
            fullName,
            org,
            description: meta.description ?? "",
            commits,
            prs,
            stars: meta.stargazers_count,
            forks: meta.forks_count,
          } satisfies ContributedRepo;
        }),
      ),
      { concurrency: REQUEST_CONCURRENCY },
    ),
  );

  return cards
    .filter((c) => c.commits > 1)
    .sort((a, b) => b.commits - a.commits || b.prs - a.prs);
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
  cacheLife({ revalidate: CACHE_REVALIDATE.ossStats });
  cacheTag(CACHE_TAGS.ossStats);

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

  const prQueries = [
    ...(lightningRepos.length > 0
      ? [`author:${username} org:Lightning-AI is:pr is:merged`]
      : []),
    ...otherRepos.map(
      (repo) => `author:${username} repo:${repo} is:pr is:merged`,
    ),
  ];

  const prPrograms = prQueries.map((query) =>
    searchMergedPrCount(query).pipe(Effect.catchAll(() => Effect.succeed(0))),
  );

  const [prCounts, totalCommits] = await Promise.all([
    Effect.runPromise(
      Effect.all(prPrograms, { concurrency: REQUEST_CONCURRENCY }),
    ),
    getGitHubContributions(username, repos),
  ]);

  return {
    totalCommits,
    totalPrs: prCounts.reduce((sum, n) => sum + n, 0),
  };
}
