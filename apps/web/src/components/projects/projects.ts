import { getContributedRepos, getFeaturedRepoStats } from "@bhimrazy/github";
import { allProjects } from "content-collections";
import type { Project } from "@/lib/types";

/** Featured first, then newest: the order of the list and of prev/next. */
export function getSortedProjects(): Project[] {
  return [...allProjects].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  );
}

export type RepoStats = { stars: number; forks: number };

/**
 * Stars and forks from the GitHub snapshot, only when the link is a repo root:
 * a subfolder like `litserve-examples/tree/main/x` would borrow the whole repo's count.
 */
export function getRepoStats(githubLink?: string): RepoStats | null {
  if (!githubLink) return null;
  const fullName = new URL(githubLink).pathname.replace(/^\/|\/$/g, "");
  if (fullName.split("/").length !== 2) return null;

  const repo =
    [getFeaturedRepoStats(), ...getContributedRepos()].find(
      (r) => r?.fullName.toLowerCase() === fullName.toLowerCase(),
    ) ?? null;
  return repo && { stars: repo.stars, forks: repo.forks };
}

export const liveLabel = (project: Pick<Project, "liveLabel" | "liveLink">) =>
  project.liveLabel ??
  (project.liveLink?.includes("lightning.ai/")
    ? "Open in Lightning Studio"
    : "Try the app");
