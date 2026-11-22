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
          theme={resolvedTheme === "dark" ? "transparent_dark" : "light"}
          lang="en"
          loading="lazy"
        />
      ) : (
        <div className="min-h-40" />
      )}
    </section>
  );
}
