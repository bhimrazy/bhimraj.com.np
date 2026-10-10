import { allBlogPosts } from "content-collections";
import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getReadingTime } from "@/lib/utils";

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

  return renderOgImage({
    eyebrow: "Blog",
    title: post.title,
    meta: getReadingTime(post.html),
    tags: post.tags,
  });
}
