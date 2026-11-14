import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata for a top-level page. A page's `openGraph`/`twitter` replace the
 * root ones wholesale (image included), so each is spelled out here, pointing
 * at the root generated card unless the page's segment has its own.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}`;
}): Metadata {
  const image = { url: "/opengraph-image", width: 1200, height: 630 };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      title,
      description,
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.author.handle,
      images: [image],
    },
  };
}
