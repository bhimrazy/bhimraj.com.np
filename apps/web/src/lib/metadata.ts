import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadata for a top-level page. Next replaces `openGraph` wholesale when a
 * page defines any of it, and inherits the *root* one (home title, home URL)
 * when it defines none, so every page spells out its own.
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
    },
  };
}
