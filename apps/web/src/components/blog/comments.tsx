"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * Comments and reactions live in GitHub Discussions (one thread per page,
 * matched by pathname). Readers need a GitHub account. Rendered after mount
 * so the theme is known, and the iframe loads lazily near the viewport.
 */
/**
 * giscus fetches the theme CSS itself, so it must be a public HTTPS URL:
 * production uses our own files (public/giscus), local dev the built-ins.
 */
function themeUrl(dark: boolean) {
  if (process.env.NODE_ENV !== "production") return dark ? "dark" : "light";
  return `${siteConfig.url}/giscus/${dark ? "dark" : "light"}.css`;
}

export default function Comments() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { repo, repoId, category, categoryId } = siteConfig.comments;

  return (
    <section
      aria-labelledby="comments-heading"
      className="mx-auto mt-16 max-w-measure"
    >
      <h2
        id="comments-heading"
        className="mb-6 font-display font-semibold text-site-text text-xl"
      >
        Comments
      </h2>
      {mounted ? (
        <Giscus
          repo={repo}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="pathname"
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={themeUrl(resolvedTheme === "dark")}
          lang="en"
          loading="lazy"
        />
      ) : (
        <div className="min-h-40" />
      )}
    </section>
  );
}
