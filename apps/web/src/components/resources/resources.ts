import { getPlaylist, type Lecture } from "@bhimrazy/youtube";
import {
  allLearningPaths,
  allResources,
  type LearningPath,
  type Resource,
} from "content-collections";
import { pathVideo, resolveSteps } from "./paths";

/** Featured first, then newest added. */
export function getSortedResources(): Resource[] {
  return [...allResources].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || b.added.localeCompare(a.added),
  );
}

export function getResource(slug: string): Resource | undefined {
  return allResources.find((r) => r._meta.path === slug);
}

/** A course's synced lectures; empty until the sync has fetched its playlist. */
export function getLectures(resource: Resource): Lecture[] {
  return resource.playlist
    ? (getPlaylist(resource.playlist)?.lectures ?? [])
    : [];
}

export function totalSeconds(lectures: Lecture[]): number {
  return lectures.reduce((sum, l) => sum + l.durationSec, 0);
}

/** The fields a card needs; the body and notes stay on the server. */
export type ResourceCardData = Omit<
  Resource,
  "_meta" | "content" | "notes" | "otherTerms" | "prereqs" | "materials"
> & {
  slug: string;
  lectureCount: number;
  totalSec: number;
};

export function toCardData(resource: Resource): ResourceCardData {
  const {
    _meta,
    content: _,
    notes: _notes,
    otherTerms: _terms,
    prereqs: _prereqs,
    materials: _materials,
    ...rest
  } = resource;
  const lectures = getLectures(resource);
  return {
    ...rest,
    slug: _meta.path,
    lectureCount: lectures.length,
    totalSec: totalSeconds(lectures),
  };
}

export type PathStep = {
  resource: ResourceCardData;
  why: string;
  /** Synced lecture IDs, for reading the visitor's saved progress. */
  lectureIds: string[];
};

export type ResolvedPath = {
  slug: string;
  title: string;
  promise: string;
  forWho: string;
  intro: string | null;
  steps: PathStep[];
  /** Synced lecture time across all steps. */
  totalSec: number;
  /** Steps with no synced lectures, left out of `totalSec`. */
  untimed: number;
};

function resolvePath(path: LearningPath): ResolvedPath {
  const slug = path._meta.path;
  const bySlug = new Map(allResources.map((r) => [r._meta.path, r]));
  const steps = resolveSteps({ slug, steps: path.steps }, bySlug).map(
    ({ resource, why }) => ({
      resource: toCardData(resource),
      why,
      lectureIds: getLectures(resource).map((l) => l.id),
    }),
  );
  return {
    slug,
    title: path.title,
    promise: path.promise,
    forWho: path.forWho,
    intro: path.intro,
    steps,
    ...pathVideo(steps.map((s) => s.resource)),
  };
}

/** Every path, resolved; throws (failing the build) on a bad step. */
export function getPaths(): ResolvedPath[] {
  return [...allLearningPaths]
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map(resolvePath);
}

export function getPath(slug: string): ResolvedPath | undefined {
  return getPaths().find((p) => p.slug === slug);
}

/** Paths that include a resource, with its 1-based position in each. */
export function getPathsWith(
  resourceSlug: string,
): { path: ResolvedPath; position: number }[] {
  return getPaths().flatMap((path) => {
    const index = path.steps.findIndex((s) => s.resource.slug === resourceSlug);
    return index >= 0 ? [{ path, position: index + 1 }] : [];
  });
}
