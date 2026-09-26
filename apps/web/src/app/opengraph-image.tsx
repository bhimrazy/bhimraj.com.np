import { siteConfig } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = siteConfig.name;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Software Engineer & OSS Contributor",
    title: "Bhimraj Yadav",
    meta: "Kathmandu, Nepal",
  });
}
