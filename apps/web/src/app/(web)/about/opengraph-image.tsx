import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "About Bhimraj Yadav";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The page sets its own `openGraph` (type "profile"), which replaces the
// inherited root image — so /about needs a card of its own.
export default function Image() {
  return renderOgImage({
    eyebrow: "About",
    title: "Bhimraj Yadav",
    meta: "Software engineer · Kathmandu, Nepal",
  });
}
