import { siteConfig } from "@/config/site";

export type FeedPost = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  html: string;
  tags: string[];
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid post date in feed: ${dateString}`);
  }
  return date.toUTCString();
}

/**
 * Feed readers resolve relative URLs against their own origin, so make every
 * root-relative `src`/`href` absolute. The empty heading permalink anchors
 * (`#…`) are meaningless outside the page, so they are dropped.
 */
function absolutizeHtml(html: string, baseUrl: string): string {
  return (
    html
      .replace(/<a class="heading-anchor"[^>]*><\/a>/g, "")
      // Interactive figures are MDX-only; the markdown pass leaves their
      // opening tags behind as escaped text (`&#x3C;Step …>`), which reads
      // as garbage in a feed. The prose around them is kept.
      .replace(/&#x3C;\/?[A-Z][A-Za-z]*(?:\s[^<>]*)?>\s*/g, "")
      .replace(/<p>\s*<\/p>/g, "")
      .replace(/\b(src|href)="\/(?!\/)/g, `$1="${baseUrl}/`)
  );
}

/**
 * Builds an RSS 2.0 feed (full content via `content:encoded`) from blog
 * posts, sorted newest-first, with absolute URLs — pure and testable.
 */
export function buildRssFeed(posts: FeedPost[]): string {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const feedUrl = `${baseUrl}/feed.xml`;

  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const newest = Math.max(
    0,
    ...sorted.flatMap((p) =>
      [p.publishedAt, p.updatedAt]
        .filter((d): d is string => Boolean(d))
        .map((d) => new Date(d).getTime()),
    ),
  );
  const lastBuildDate =
    newest > 0 ? new Date(newest).toUTCString() : new Date().toUTCString();

  const items = sorted
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
      <description>${escapeXml(post.description)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      <content:encoded><![CDATA[${absolutizeHtml(post.html, baseUrl)}]]></content:encoded>
      <dc:creator>${escapeXml(siteConfig.author.name)}</dc:creator>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>bhimraj.com.np</generator>
${items}
  </channel>
</rss>
`;
}
