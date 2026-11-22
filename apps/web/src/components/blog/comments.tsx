"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

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
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setMounted(true), []);

  // giscus posts its first message (a height) once the thread has rendered.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === "https://giscus.app" && event.data?.giscus) {
        setLoaded(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
      {/* The skeleton and the iframe share the same starting height (see
          globals.css), so swapping them doesn't move the page. */}
      <div className="relative">
        {!loaded && <CommentsSkeleton />}
        {mounted && (
          <div
            className={cn(
              "transition-opacity duration-300",
              loaded ? "opacity-100" : "absolute inset-x-0 top-0 opacity-0",
            )}
          >
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
          </div>
        )}
      </div>
    </section>
  );
}

/** The empty-thread layout: reactions, a count, and the write box. */
function CommentsSkeleton() {
  const block = "rounded-md bg-site-bg-tertiary motion-safe:animate-pulse";
  return (
    <div aria-hidden className="flex h-93 flex-col">
      <div className="flex flex-col items-center gap-3 pt-3">
        <div className={cn(block, "h-5 w-28")} />
        <div className={cn(block, "size-8 rounded-full")} />
      </div>
      <div className={cn(block, "mt-10 h-5 w-32")} />
      <div className="mt-6 flex-1 rounded-lg border border-site-border p-3 dark:border-white/8">
        <div className={cn(block, "h-8 w-40")} />
        <div className={cn(block, "mt-3 h-28 w-full")} />
        <div className={cn(block, "mt-3 ml-auto h-9 w-44")} />
      </div>
    </div>
  );
}
