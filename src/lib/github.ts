const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

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
  /** ISR revalidation window in seconds. Defaults to 1 hour. */
  revalidate?: number;
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
 * @param options  - Optional `repo`, `fallback`, and `revalidate` overrides
 */
export async function getGitHubStars(
  username: string,
  options: GitHubStarsOptions = {},
): Promise<number> {
  const { repo, fallback = 0, revalidate = REVALIDATE_SECONDS } = options;

  const url = repo
    ? `${GITHUB_API}/repos/${username}/${repo}`
    : `${GITHUB_API}/search/repositories?q=user:${username}+stars:>0&sort=updated&order=desc&per_page=100`;

  try {
    const res = await fetch(url, { next: { revalidate } });
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
