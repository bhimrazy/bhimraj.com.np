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
  return Number.isNaN(date.getTime())
    ? new Date().toUTCString()
    : date.toUTCString();
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

  const lastBuildDate =
    sorted.length > 0
      ? toRfc822(sorted[0].publishedAt)
      : new Date().toUTCString();

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
      <content:encoded><![CDATA[${post.html}]]></content:encoded>
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
