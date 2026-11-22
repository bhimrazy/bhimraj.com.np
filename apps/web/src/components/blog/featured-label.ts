/** How recent the newest post must be to be called "Latest". */
const LATEST_WINDOW_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Badge for the featured card: "Featured" when a post is flagged, "Latest"
 * only while the newest post is under a year old, otherwise none (the date
 * beside it already says how old it is). Pure, so it is testable without
 * the generated content.
 */
export function featuredLabel(
  post: { featured?: boolean; publishedAt: string },
  now: number,
): "Featured" | "Latest" | null {
  if (post.featured) return "Featured";
  const age = now - new Date(post.publishedAt).getTime();
  return age >= 0 && age < LATEST_WINDOW_MS ? "Latest" : null;
}
