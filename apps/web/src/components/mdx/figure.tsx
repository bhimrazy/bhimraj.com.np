import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Frame for every post figure: optional label, the visual, a caption. */
export function Figure({
  label,
  caption,
  children,
  flush = false,
}: {
  /** Short header title. */
  label?: string;
  caption?: ReactNode;
  children: ReactNode;
  /** No padding, for content that runs edge to edge. */
  flush?: boolean;
}) {
  return (
    <figure className="not-prose my-10">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-site-border bg-site-card",
          !flush && "p-4 sm:p-6",
        )}
      >
        {label ? (
          <p className="mb-4 font-mono text-3xs text-site-text-secondary uppercase tracking-[0.14em]">
            {label}
          </p>
        ) : null}
        {children}
      </div>
      {caption ? (
        <figcaption className="px-1 leading-relaxed">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** One-sentence narration; `live={false}` while autoplaying so it isn't read out every step. */
export function Narration({
  children,
  live = true,
}: {
  children: ReactNode;
  live?: boolean;
}) {
  return (
    <p
      aria-live={live ? "polite" : "off"}
      // Room for three lines on phones, so the figure doesn't jump as it changes.
      className="mt-4 min-h-16 text-[13px] text-site-text-secondary leading-relaxed sm:min-h-10"
    >
      {children}
    </p>
  );
}
