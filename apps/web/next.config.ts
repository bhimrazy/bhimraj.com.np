import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  transpilePackages: ["@bhimrazy/github", "@bhimrazy/utils"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "i3.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
  headers: async () => [
    {
      // giscus loads these cross-origin from its iframe.
      source: "/giscus/:file*",
      headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
    },
  ],
  redirects: async () => {
    return [
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true,
      },
      // Old static brand assets: browsers still probe some of these paths.
      ...[
        ["/apple-touch-icon.png", "/apple-icon.png"],
        ["/apple-touch-icon-precomposed.png", "/apple-icon.png"],
        ["/site.webmanifest", "/manifest.webmanifest"],
        ["/opengraph-image.jpg", "/opengraph-image"],
        ["/blog-opengraph.jpg", "/opengraph-image"],
      ].map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default withContentCollections(nextConfig);
