import { cacheLife, cacheTag } from "next/cache";

const GITHUB_API = "https://api.github.com";

interface RepoResponse {
  stargazers_count: number;
}

interface SearchResponse {
  items: RepoResponse[];
}

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
    : `${GITHUB_API}/search/repositories?q=user:${username}+stars:>0&sort=updated&order=desc&per_page=100`;

  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;

    if (repo) {
      const data: RepoResponse = await res.json();
      return data.stargazers_count;
    }

    const data: SearchResponse = await res.json();
    return data.items.reduce((sum, r) => sum + r.stargazers_count, 0);
  } catch {
    return fallback;
  }
}

interface ContributorEntry {
  author: { login: string } | null;
  total: number;
  weeks: { c: number }[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns a single repo's commit count for `username`, matching the number
 * shown in the repo's Insights → Contributors tab.
 *
 * This hits the same endpoint the Insights UI renders from, which needs no
 * auth and isn't bound by the REST API's 60/hour limit. GitHub responds with
 * HTTP 202 (and an empty body) while it warms its stats cache, so we poll
 * until the data is ready. Counts are for the default branch only, and the
 * contributor list is capped at the top contributors — a user outside that
 * set reads as 0.
 */
async function fetchRepoCommits(
  repo: string,
  username: string,
  maxRetries: number,
  delayMs: number,
): Promise<number> {
  const url = `https://github.com/${repo}/graphs/contributors-data`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });

    if (res.status === 202) {
      await sleep(delayMs);
      continue;
    }
    if (!res.ok) return 0;

    const body = (await res.text()).trim();
    if (!body) {
      await sleep(delayMs);
      continue;
    }

    const data: ContributorEntry[] = JSON.parse(body);
    const entry = data.find(
      (c) => c.author?.login.toLowerCase() === username.toLowerCase(),
    );
    if (!entry) return 0;
    return entry.total ?? entry.weeks.reduce((sum, w) => sum + w.c, 0);
  }

  return 0;
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
    const entries = await Promise.all(
      repos.map(
        async (repo) =>
          [repo, await fetchRepoCommits(repo, username, 5, 1500)] as const,
      ),
    );
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    return total || fallback;
  } catch {
    return fallback;
  }
}
