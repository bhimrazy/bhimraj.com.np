/**
 * Pure query builders for the OSS activity metrics — no network imports, so the
 * web app can build "verify on GitHub" links from them without pulling in the
 * fetch client.
 */

/**
 * The maintainer work a merged-PR count misses: reviewing other people's PRs,
 * closing issues, answering users. All counts cover the external repos the
 * site tracks (see `ossSearchScope`), never the user's own repos.
 */
export type OSSActivity = {
  /** Other people's PRs the user left a review on. */
  prsReviewed: number;
  /** Distinct issues closed by the user's merged PRs. */
  issuesResolved: number;
  /** The user's open, non-draft PRs awaiting review. */
  prsOpen: number;
  /** Issues filed by someone else that the user commented on. */
  issuesHelped: number;
  /** Issues the user filed. */
  issuesOpened: number;
};

/** A metric the site can link to as a GitHub search, so every number is checkable. */
export type OSSActivityMetric = keyof OSSActivity;

/**
 * GitHub search qualifiers covering the external repos in `repos`. An owner
 * with several tracked repos becomes `org:` (matching how the merged-PR totals
 * already count Lightning-AI); a lone repo stays `repo:`. GitHub ORs these.
 */
export function ossSearchScope(
  username: string,
  repos: readonly string[],
): string {
  const byOwner = new Map<string, string[]>();
  for (const fullName of repos) {
    const [owner] = fullName.split("/");
    if (owner.toLowerCase() === username.toLowerCase()) continue;
    byOwner.set(owner, [...(byOwner.get(owner) ?? []), fullName]);
  }

  return [...byOwner]
    .map(([owner, owned]) =>
      owned.length > 1 ? `org:${owner}` : `repo:${owned[0]}`,
    )
    .join(" ");
}

/**
 * The GitHub search behind each metric. `issuesResolved` is counted exactly via
 * GraphQL; its search lists the merged PRs that closed them.
 */
export function ossActivityQueries(
  username: string,
  scope: string,
): Record<OSSActivityMetric, string> {
  return {
    prsReviewed: `reviewed-by:${username} -author:${username} is:pr ${scope}`,
    issuesResolved: `author:${username} is:pr is:merged linked:issue ${scope}`,
    prsOpen: `author:${username} is:pr is:open draft:false ${scope}`,
    issuesHelped: `commenter:${username} -author:${username} is:issue ${scope}`,
    issuesOpened: `author:${username} is:issue ${scope}`,
  };
}

/** A github.com search URL for `query`. */
export function githubSearchUrl(query: string): string {
  return `https://github.com/search?${new URLSearchParams({ q: query, type: "issues" })}`;
}
