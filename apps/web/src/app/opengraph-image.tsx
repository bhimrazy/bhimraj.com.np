import { siteConfig } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = siteConfig.name;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    kicker: siteConfig.author.designation,
    title: "I build products, and the tools developers use.",
    footLeft: "bhimraj.com.np",
    footRight: "Products · Open source · AI",
  });
}
