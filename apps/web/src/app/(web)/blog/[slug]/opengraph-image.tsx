import { allBlogPosts } from "content-collections";
import { ImageResponse } from "next/og";
import { loadDisplayFont, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";
import { getReadingTime } from "@/lib/utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p._meta.path === slug);

  const eyebrow = "Blog";
  const title = post?.title ?? "Bhimraj Yadav";
  const meta = post ? getReadingTime(post.html) : undefined;
  const tags = post?.tags ?? [];
  const text = `${eyebrow}${title}${meta ?? ""}${tags.join("")}bhimraj.bhimraj.com.np`;

  const fontData = await loadDisplayFont(text);

  return new ImageResponse(
    <OgCard
      eyebrow={eyebrow}
      title={title}
      meta={meta}
      tags={tags}
      fontFamily={fontData ? "Space Grotesk" : "sans-serif"}
    />,
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Space Grotesk",
              data: fontData,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    },
  );
}
