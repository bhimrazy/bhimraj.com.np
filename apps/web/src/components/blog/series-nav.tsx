import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type BlogPost, postHref } from "./posts";
import { getSeriesPosition, partCountLabel, type Series } from "./series";

const kicker =
  "font-medium font-mono text-[11px] uppercase tracking-[1.5px] text-site-text-tertiary";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2";

const partName = (post: BlogPost) =>
  post.part ? `Part ${post.part}` : "Overview";

/**
 * After a series post: previous / next, and the whole series folded into a
 * native `<details>` with the current part marked.
 */
export default function SeriesNav({ post }: { post: BlogPost }) {
  const position = getSeriesPosition(post);
  if (!position) return null;
  const { series, prev, next, isHub, part } = position;

  return (
    <nav
      aria-label={`${series.title} series`}
      className="mx-auto mt-16 max-w-measure overflow-hidden rounded-2xl border border-site-border bg-site-card sm:mt-20 dark:border-white/6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-5 sm:px-6">
        <p className={cn(kicker, "text-site-accent")}>
          {isHub
            ? "Start the series"
            : `Part ${part} of ${series.parts.length}`}
        </p>
        {series.hub && !isHub ? (
          <Link
            href={postHref(series.hub)}
            className={cn(
              "rounded-sm font-display font-semibold text-site-text text-sm transition-colors hover:text-site-accent",
              focusRing,
            )}
          >
            {series.title}
          </Link>
        ) : (
          <p className="font-display font-semibold text-site-text text-sm">
            {series.title}
          </p>
        )}
      </div>

      {(prev || next) && (
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
          {prev ? (
            <NavCard post={prev} direction="prev" />
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? <NavCard post={next} direction="next" /> : null}
        </div>
      )}

      <PartList series={series} current={post} />
    </nav>
  );
}

function NavCard({
  post,
  direction,
}: {
  post: BlogPost;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";
  const Arrow = isNext ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Link
      href={postHref(post)}
      rel={direction}
      className={cn(
        "group flex flex-col gap-1.5 rounded-xl border border-site-border bg-site-bg px-4 py-3.5 transition-colors hover:border-site-border-hover dark:border-white/6 dark:bg-site-bg/40 dark:hover:border-white/12",
        isNext && "sm:items-end sm:text-right",
        focusRing,
      )}
    >
      <span
        className={cn(
          kicker,
          "inline-flex items-center gap-1.5 transition-colors group-hover:text-site-accent",
          isNext && "flex-row-reverse",
        )}
      >
        <Arrow
          aria-hidden
          className={cn(
            "size-3.5 transition-transform motion-reduce:transition-none",
            isNext
              ? "group-hover:translate-x-0.5"
              : "group-hover:-translate-x-0.5",
          )}
        />
        {isNext ? "Next" : "Previous"} · {partName(post)}
      </span>
      <span className="text-pretty font-display font-semibold text-site-text text-sm leading-snug transition-colors group-hover:text-site-accent">
        {post.title}
      </span>
    </Link>
  );
}

function PartList({ series, current }: { series: Series; current: BlogPost }) {
  return (
    <details className="group border-site-border border-t dark:border-white/6">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:text-site-accent sm:px-6 [&::-webkit-details-marker]:hidden",
          "focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2",
        )}
      >
        <span className="font-medium font-mono text-[11px] text-site-text-secondary uppercase tracking-[1.5px]">
          All {partCountLabel(series)}
        </span>
        <ChevronDownIcon
          aria-hidden
          className="size-4 text-site-text-tertiary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <ol className="flex flex-col px-2 pb-3 sm:px-3">
        {series.posts.map((post) => {
          const isCurrent = post === current;
          return (
            <li key={post._meta.path}>
              <Link
                href={postHref(post)}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isCurrent
                    ? "bg-site-accent-subtle text-site-text"
                    : "text-site-text-secondary hover:bg-site-bg-secondary hover:text-site-text dark:hover:bg-white/3",
                  focusRing,
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    isCurrent ? "text-site-accent" : "text-site-text-tertiary",
                  )}
                >
                  {String(post.part ?? 0).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cn("text-pretty", isCurrent && "font-medium")}
                  >
                    {post.title}
                  </span>
                  {isCurrent ? (
                    <span className="font-mono text-[10px] text-site-accent uppercase tracking-[1.5px]">
                      You're here
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </details>
  );
}
