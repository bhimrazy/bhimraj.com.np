/**
 * Returns the total stargazers count for a GitHub user.
 * @param username - GitHub username
 * @param repo     - Optional repo name; if provided, returns stars for that repo only
 * @param fallback - Value to return on fetch failure (default: 0)
 */
export async function getGitHubStars(
  username: string,
  fallback = 0,
  repo?: string,
): Promise<number> {
  try {
    if (repo) {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repo}`,
        { next: { revalidate: 3600 } },
      );
      if (!res.ok) return fallback;
      const data: { stargazers_count: number } = await res.json();
      return data.stargazers_count;
    }

    const res = await fetch(
      `https://api.github.com/search/repositories?q=user:${username}+stars:>0&sort=updated&order=desc&per_page=500`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return fallback;
    const data: { items: { stargazers_count: number }[] } = await res.json();
    return data.items.reduce((sum, r) => sum + r.stargazers_count, 0);
  } catch {
    return fallback;
  }
}
