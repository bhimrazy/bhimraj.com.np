import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { loadDisplayFont, OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = siteConfig.name;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const eyebrow = "Software Engineer & OSS Contributor";
  const title = "Bhimraj Yadav";
  const meta = "Kathmandu, Nepal";
  const text = `${eyebrow}${title}${meta}bhimraj.bhimraj.com.np`;

  const fontData = await loadDisplayFont(text);

  return new ImageResponse(
    <OgCard
      eyebrow={eyebrow}
      title={title}
      meta={meta}
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
