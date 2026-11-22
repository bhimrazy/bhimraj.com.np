import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata for a top-level page. A page's `openGraph`/`twitter` replace the
 * root ones wholesale, image included, so each is spelled out here. Pass
 * `ownCard` when the segment has its own `opengraph-image`: any `images`
 * key here would override it.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  ownCard = false,
}: {
  title: string;
  description: string;
  path: `/${string}`;
  keywords?: string[];
  ownCard?: boolean;
}): Metadata {
  const images = ownCard
    ? {}
    : {
        images: [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: siteConfig.name,
            type: "image/png",
          },
        ],
      };
  const socialTitle = `${title} · ${siteConfig.author.name}`;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      site: siteConfig.author.handle,
      creator: siteConfig.author.handle,
      ...images,
    },
  };
}
