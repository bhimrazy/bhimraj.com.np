import { allBlogPosts } from "content-collections";
import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Blog post by Bhimraj Yadav";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return allBlogPosts.map((post) => ({ slug: post._meta.path }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p._meta.path === slug);
  if (!post) notFound();
  return ogImage({
    kicker: "Blog",
    title: post.title,
    footLeft: "bhimraj.com.np/blog",
    footRight: post.readingTime,
    theme: "light",
  });
}
