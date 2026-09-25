import { allProjects } from "content-collections";
import { ImageResponse } from "next/og";
import { loadDisplayFont, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p._meta.path === slug);

  const eyebrow = "Project";
  const title = project?.title ?? "Bhimraj Yadav";
  const tags = project?.tags ?? [];
  const text = `${eyebrow}${title}${tags.join("")}bhimraj.bhimraj.com.np`;

  const fontData = await loadDisplayFont(text);

  return new ImageResponse(
    <OgCard
      eyebrow={eyebrow}
      title={title}
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
