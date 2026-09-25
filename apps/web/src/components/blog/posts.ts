import { allBlogPosts } from "content-collections";

export type BlogPost = (typeof allBlogPosts)[number];

const byNewest = (a: BlogPost, b: BlogPost) =>
  Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt));

/** All posts, newest first. */
export const sortedPosts: BlogPost[] = [...allBlogPosts].sort(byNewest);

export const postHref = (post: BlogPost) => `/blog/${post._meta.path}`;

export function getPost(slug: string): BlogPost | undefined {
  return allBlogPosts.find((p) => p._meta.path === slug);
}

/** Normalise tags so "event-driven architecture" matches "Event Driven Architecture". */
const normalizeTag = (tag: string) => tag.toLowerCase().replace(/[\s_]+/g, "-");

/** Human-friendly tag label: "computer-vision" → "computer vision". */
export const tagLabel = (tag: string) => tag.replace(/-/g, " ");

export interface RelatedPost {
  post: BlogPost;
  /** Why this post is suggested, e.g. "Also about pytorch" or "Older post". */
  reason: string;
}

/**
 * Posts to read next: ranked by tag overlap, then filled with the nearest
 * posts by date so the block is never empty while there is anything else.
 */
export function getRelatedPosts(post: BlogPost, limit = 2): RelatedPost[] {
  const tags = new Set(post.tags.map(normalizeTag));
  const index = sortedPosts.indexOf(post);
  const others = sortedPosts.filter((p) => p !== post);

  const scored = others
    .map((p) => ({
      post: p,
      shared: p.tags.filter((t) => tags.has(normalizeTag(t))),
    }))
    .filter((s) => s.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length);

  const picks: RelatedPost[] = scored.slice(0, limit).map((s) => ({
    post: s.post,
    reason: `Also about ${tagLabel(s.shared[0])}`,
  }));

  // Fill with chronological neighbours: the next newer, then the next older, …
  const byDistance = [...others].sort(
    (a, b) =>
      Math.abs(sortedPosts.indexOf(a) - index) -
      Math.abs(sortedPosts.indexOf(b) - index),
  );
  for (const p of byDistance) {
    if (picks.length >= limit) break;
    if (picks.some((r) => r.post === p)) continue;
    picks.push({
      post: p,
      reason: sortedPosts.indexOf(p) < index ? "Newer post" : "Older post",
    });
  }

  return picks;
}

/** True when a post was revised on a different day than it was published. */
export function wasUpdated(post: BlogPost): post is BlogPost & {
  updatedAt: string;
} {
  if (!post.updatedAt) return false;
  return (
    new Date(post.updatedAt).toDateString() !==
    new Date(post.publishedAt).toDateString()
  );
}

const DEK = /^\s*<p class="article-dek">([\s\S]*?)<\/p>\s*/;

/**
 * Split off the dek that `rehype-article` makes from a leading `<h2>`, so the
 * page can show it under the title instead of repeating it in the body.
 */
export function splitDek(html: string): { dek: string | null; body: string } {
  const match = html.match(DEK);
  if (!match) return { dek: null, body: html };
  return { dek: match[1], body: html.slice(match[0].length) };
}

/** Whether the cover image already appears inside the article body. */
export const coverInBody = (post: BlogPost) =>
  post.html.includes(`src="${post.image}"`);
