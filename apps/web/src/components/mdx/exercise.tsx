import { ClockIcon, TargetIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * A hands-on block for workshops: a goal, numbered steps, a "Done when"
 * check and an optional `<Details summary="Solution">`.
 *
 * ```mdx
 * <Exercise title="Open your first pull request" time="15 min">
 * 1. …
 *
 * **Done when:** …
 * </Exercise>
 * ```
 */
export function Exercise({
  title,
  time,
  children,
}: {
  title: string;
  time?: string;
  children: ReactNode;
}) {
  const id = `exercise-${slug(title)}`;

  return (
    <section
      aria-labelledby={id}
      className="my-10 overflow-hidden rounded-xl border border-site-border bg-site-card"
    >
      <header className="not-prose flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-site-border border-b bg-site-bg-secondary/60 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium font-mono text-[11px] text-site-accent uppercase tracking-[0.14em]">
            <TargetIcon aria-hidden className="size-3.5" />
            Exercise
          </p>
          <h3
            id={id}
            className="mt-1.5 text-pretty font-display font-semibold text-lg text-site-text leading-snug"
          >
            {title}
          </h3>
        </div>
        {time ? (
          <p className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-site-border px-2.5 py-1 font-mono text-[11px] text-site-text-secondary leading-none">
            <ClockIcon aria-hidden className="size-3" />
            <span className="sr-only">Takes about </span>
            {time}
          </p>
        ) : null}
      </header>
      <div className="exercise-body px-5 py-1 sm:px-6 [&>:first-child]:mt-5 [&>:last-child]:mb-5">
        {children}
      </div>
    </section>
  );
}
