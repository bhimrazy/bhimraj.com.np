import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { BRAND_COLORS } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.author.name,
    short_name: "bhimraj",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_COLORS.night,
    theme_color: BRAND_COLORS.night,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
