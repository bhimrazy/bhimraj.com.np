import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { postHref } from "@/components/blog/posts";
import { getPart, getSeries } from "@/components/blog/series";
import { cn, getReadingTime } from "@/lib/utils";
import { LevelBadge } from "./level";

/*
 * Hub-only blocks. They need the post's series id, which page.tsx binds
 * through `mdxComponentsFor(post.series)`; writers never pass it.
 */

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

/** "Foundations: Git, GitHub, …" → "Foundations". */
const shortTitle = (title: string) => title.split(":")[0]?.trim() || title;

const partNumber = (n: number) => String(n).padStart(2, "0");

/** "Pick your path": one card per kind of reader. */
export function Paths({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">{children}</div>
  );
}

/**
 * ```mdx
 * <Path who="Founder" parts="1,3,7">One line on why these parts.</Path>
 * ```
 */
export function Path({
  who,
  parts,
  children,
  series,
}: {
  who: string;
  /** Comma-separated part numbers, e.g. "1,3,7". */
  parts: string;
  children?: ReactNode;
  /** Bound by the page, not written in MDX. */
  series?: string;
}) {
  const numbers = parts
    .split(",")
    .map((p) => Number.parseInt(p.trim(), 10))
    .filter((n) => Number.isInteger(n));

  return (
    <div className="flex flex-col rounded-xl border border-site-border bg-site-card p-5">
      <p className="font-medium font-mono text-[11px] text-site-accent uppercase tracking-[0.14em]">
        {who}
      </p>
      {children ? (
        <div className="mt-2 text-site-text-secondary text-sm leading-relaxed [&_p]:m-0">
          {children}
        </div>
      ) : null}
      <ol className="mt-4 flex flex-col gap-1.5 border-site-border border-t pt-3">
        {numbers.map((n) => {
          const post = series ? getPart(series, n) : null;
          const label = (
            <>
              <span className="w-6 shrink-0 font-mono text-[11px] text-site-text-tertiary tabular-nums">
                {partNumber(n)}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {post ? shortTitle(post.title) : `Part ${n}`}
              </span>
            </>
          );
          return (
            <li key={n}>
              {post ? (
                <Link
                  href={postHref(post)}
                  title={post.title}
                  className={cn(
                    "group flex items-center gap-2 rounded-sm text-site-text text-sm transition-colors hover:text-site-accent",
                    focusRing,
                  )}
                >
                  {label}
                  <ArrowRightIcon
                    aria-hidden
                    className="size-3.5 shrink-0 text-site-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-site-accent motion-reduce:transition-none"
                  />
                </Link>
              ) : (
                <span className="flex items-center gap-2 text-site-text-tertiary text-sm">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Every part of the series in order, with its level and description. */
export function SeriesParts({ series }: { series?: string }) {
  const parts = getSeries(series)?.parts ?? [];
  if (parts.length === 0) return null;

  return (
    <ol className="not-prose my-8 divide-y divide-site-border overflow-hidden rounded-xl border border-site-border bg-site-card">
      {parts.map((post) => (
        <li key={post._meta.path}>
          <Link
            href={postHref(post)}
            className={cn(
              "group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 px-5 py-5 transition-colors hover:bg-site-bg-secondary/70 sm:grid-cols-[3rem_minmax(0,1fr)] sm:px-6",
              "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2",
            )}
          >
            <span className="pt-0.5 font-display font-semibold text-site-text-tertiary text-xl tabular-nums leading-none transition-colors group-hover:text-site-accent">
              {partNumber(post.part ?? 0)}
            </span>
            <span className="min-w-0">
              <span className="block text-pretty font-display font-semibold text-base text-site-text leading-snug transition-colors group-hover:text-site-accent">
                {post.title}
              </span>
              <span className="mt-1.5 line-clamp-2 block text-site-text-secondary text-sm leading-relaxed">
                {post.description}
              </span>
              <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                {post.level ? <LevelBadge value={post.level} /> : null}
                <span className="font-mono text-[11px] text-site-text-tertiary">
                  {getReadingTime(post.html)}
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
