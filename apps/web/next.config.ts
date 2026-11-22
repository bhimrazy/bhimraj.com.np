import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

// Built from what the site loads. Next's inline bootstrap scripts need
// 'unsafe-inline': nonces don't work with prerendered pages under
// cacheComponents, and hashes can't cover per-build inline payloads.
// To collect reports later, add `report-uri <endpoint>` (and a
// Reporting-Endpoints header for `report-to`).
const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://us-assets.i.posthog.com",
    "https://www.youtube.com",
    "https://s.ytimg.com",
    "https://challenges.cloudflare.com",
  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://i3.ytimg.com https://pbs.twimg.com https://opengraph.githubassets.com https://avatars.githubusercontent.com https://img.shields.io https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://us.i.posthog.com",
    "https://us-assets.i.posthog.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
  ].join(" "),
  [
    "frame-src https://giscus.app",
    "https://www.youtube-nocookie.com",
    "https://www.youtube.com",
    "https://challenges.cloudflare.com",
  ].join(" "),
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  transpilePackages: [
    "@bhimrazy/github",
    "@bhimrazy/utils",
    "@bhimrazy/youtube",
  ],
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
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        },
        // Enforced on its own: no page of this site is meant to be framed.
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        // Report-only until the Vercel preview shows no violations.
        {
          key: "Content-Security-Policy-Report-Only",
          value: contentSecurityPolicy,
        },
      ],
    },
    {
      // giscus loads these cross-origin from its iframe.
      source: "/giscus/:file*",
      headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
    },
    {
      // Browsers check for a new worker on each visit; a cached copy of the
      // script would hold updates back.
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" },
      ],
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
