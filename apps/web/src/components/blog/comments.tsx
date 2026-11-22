"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * giscus fetches the theme CSS itself, so it must be a public HTTPS URL. Use
 * our own files (public/giscus) from whichever deployment served the page, so
 * previews test them too; plain-HTTP local dev falls back to the built-ins.
 */
function themeUrl(dark: boolean) {
  const name = dark ? "dark" : "light";
  const { origin, protocol } = window.location;
  return protocol === "https:" ? `${origin}/giscus/${name}.css` : name;
}

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
