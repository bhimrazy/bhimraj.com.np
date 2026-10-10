import { allBlogPosts } from "content-collections";
import { cacheLife } from "next/cache";
import { buildRssFeed } from "@/lib/feed";

async function getFeedXml() {
  "use cache";
  cacheLife("hours");

  return buildRssFeed(
    allBlogPosts.map((post) => ({
      title: post.title,
      description: post.description,
      slug: post._meta.path,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      html: post.html,
      tags: post.tags,
    })),
  );
}

export async function GET() {
  const feed = await getFeedXml();

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
