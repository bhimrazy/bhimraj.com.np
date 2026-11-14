import { blog } from "@/config/blog";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = blog.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    kicker: "Blog",
    title: "Insights, stories and tutorials",
    footLeft: "bhimraj.com.np/blog",
    theme: "light",
  });
}
