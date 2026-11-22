import { getPlaylist, type Lecture } from "@bhimrazy/youtube";
import { allResources, type Resource } from "content-collections";

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
