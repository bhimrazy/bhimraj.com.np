/**
 * Pure helpers for learning paths and the homepage "learning" card. They take
 * plain data, so tests can run them without the content build.
 */

import type { LearningPath } from "content-collections";
import { IN_PROGRESS_STATUSES, type ResourceStatus } from "./taxonomy";

export type ResolvedStep<R> = { resource: R; why: string };

/**
 * Pairs each step with its resource. Throws on a slug that matches no
 * resource, or one listed twice, so a typo fails the build.
 */
export function resolveSteps<R>(
  path: Pick<LearningPath, "steps"> & { slug: string },
  bySlug: ReadonlyMap<string, R>,
): ResolvedStep<R>[] {
  const seen = new Set<string>();
  return path.steps.map((step) => {
    const resource = bySlug.get(step.resource);
    if (!resource) {
      throw new Error(
        `Learning path "${path.slug}" lists "${step.resource}", which isn't a file in src/content/resources.`,
      );
    }
    if (seen.has(step.resource)) {
      throw new Error(
        `Learning path "${path.slug}" lists "${step.resource}" twice.`,
      );
    }
    seen.add(step.resource);
    return { resource, why: step.why };
  });
}

/** A course code stands in for its title: "CME 295: Transformers" → "CME 295". */
export function shortTitle(title: string): string {
  const colon = title.indexOf(":");
  return colon > 0 ? title.slice(0, colon) : title;
}

/**
 * Video time across a path, from synced lecture lengths only. Steps without
 * lectures (books, unsynced courses) are counted, never estimated.
 */
export function pathVideo(steps: { totalSec: number }[]): {
  totalSec: number;
  untimed: number;
} {
  return {
    totalSec: steps.reduce((sum, s) => sum + s.totalSec, 0),
    untimed: steps.filter((s) => s.totalSec === 0).length,
  };
}

type Progressable = {
  slug: string;
  status?: ResourceStatus;
  added: string;
};

/**
 * What I'm working through: entries whose status is in progress, "learning"
 * before "revisiting", then newest added.
 */
export function selectInProgress<R extends Progressable>(
  resources: readonly R[],
  limit = 2,
): R[] {
  const rank = (r: R) =>
    r.status ? IN_PROGRESS_STATUSES.indexOf(r.status) : -1;
  return resources
    .filter((r) => rank(r) >= 0)
    .sort((a, b) => rank(a) - rank(b) || b.added.localeCompare(a.added))
    .slice(0, limit);
}

/** The newest entry marked "queued", for a "next up" line. */
export function selectNextUp<R extends Progressable>(
  resources: readonly R[],
): R | undefined {
  return resources
    .filter((r) => r.status === "queued")
    .sort((a, b) => b.added.localeCompare(a.added))[0];
}

/**
 * Share of lectures watched, 0 to 1. Null when either count is missing, so
 * no bar is drawn from a guess.
 */
export function watchedShare(
  watched: number | undefined,
  lectureCount: number,
): number | null {
  if (watched === undefined || lectureCount === 0) return null;
  return Math.min(1, watched / lectureCount);
}
