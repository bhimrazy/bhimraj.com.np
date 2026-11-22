/**
 * Pure helpers for learning paths. They take plain data, so tests can run
 * them without the content build.
 */

import type { LearningPath } from "content-collections";

type ResolvedStep<R> = { resource: R; why: string };

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
