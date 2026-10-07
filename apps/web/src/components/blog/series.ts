import { allBlogPosts } from "content-collections";
import type { BlogPost } from "./posts";

/*
 * Blog series, derived from the posts' `series` and `part` frontmatter.
 * A series has an optional hub (part 0) and numbered parts (1, 2, …).
 * Nothing here is hand-maintained: add a post with the same `series` id
 * and it shows up in the navigation, the hub's part list and the index.
 */

export type Level = NonNullable<BlogPost["level"]>;

export interface Series {
  id: string;
  /** From the hub's title before its colon, else the id in title case. */
  title: string;
  hub: BlogPost | null;
  /** Parts 1+ in order (the hub is not one of them). */
  parts: BlogPost[];
  /** The hub followed by the parts: the reading order for prev/next. */
  posts: BlogPost[];
}

const titleCase = (id: string) =>
  id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Posts without a `part` go last. */
const order = (post: BlogPost) => post.part ?? Number.MAX_SAFE_INTEGER;

function buildSeries(): Map<string, Series> {
  const groups = new Map<string, BlogPost[]>();
  for (const post of allBlogPosts) {
    if (!post.series) continue;
    groups.set(post.series, [...(groups.get(post.series) ?? []), post]);
  }

  const series = new Map<string, Series>();
  for (const [id, members] of groups) {
    const ordered = [...members].sort((a, b) => order(a) - order(b));
    const hub = ordered.find((p) => p.part === 0) ?? null;
    const parts = ordered.filter((p) => p !== hub);
    const title = hub?.title.split(":")[0]?.trim() || titleCase(id);
    series.set(id, {
      id,
      title,
      hub,
      parts,
      posts: hub ? [hub, ...parts] : parts,
    });
  }
  return series;
}

const SERIES = buildSeries();

export function getSeries(id: string | undefined): Series | null {
  return id ? (SERIES.get(id) ?? null) : null;
}

export interface SeriesPosition {
  series: Series;
  /** Part number (0 for the hub). */
  part: number;
  isHub: boolean;
  prev: BlogPost | null;
  next: BlogPost | null;
}

/** Where a post sits in its series, or null for standalone posts. */
export function getSeriesPosition(post: BlogPost): SeriesPosition | null {
  const series = getSeries(post.series);
  if (!series) return null;
  const index = series.posts.indexOf(post);
  return {
    series,
    part: post.part ?? index,
    isHub: post === series.hub,
    prev: series.posts[index - 1] ?? null,
    next: series.posts[index + 1] ?? null,
  };
}

/** "7 parts": the hub is not counted. */
export const partCountLabel = (series: Series) =>
  `${series.parts.length} ${series.parts.length === 1 ? "part" : "parts"}`;

/**
 * Parts 1+ are listed through their hub, so the index hides them, but only
 * when a hub exists; a series without one keeps every part visible.
 */
export function isHiddenFromIndex(post: BlogPost): boolean {
  if (!post.part) return false;
  return Boolean(getSeries(post.series)?.hub);
}

/** The series a hub introduces, for the "Series · 7 parts" label. */
export function seriesOfHub(post: BlogPost): Series | null {
  const series = getSeries(post.series);
  return series && series.hub === post ? series : null;
}

/** Part number → post, for links such as `<Path parts="1,3,7">`. */
export function getPart(seriesId: string, part: number): BlogPost | null {
  return getSeries(seriesId)?.posts.find((p) => p.part === part) ?? null;
}

export const levelLabel: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All levels",
};
