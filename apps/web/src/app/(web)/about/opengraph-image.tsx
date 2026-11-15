import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = "About Bhimraj Yadav";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    kicker: "About",
    title: "Bhimraj Yadav",
    footLeft: "bhimraj.com.np/about",
    footRight: "Software engineer · open source",
  });
}
