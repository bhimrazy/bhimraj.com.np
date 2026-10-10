import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Frame for every post figure: optional label, the visual, a caption. */
export function Figure({
  label,
  caption,
  children,
  className,
}: {
  /** Short header title. */
  label?: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className="not-prose my-10">
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-site-border bg-site-card p-4 sm:p-6",
          className,
        )}
      >
        {label ? (
          <p className="mb-4 font-mono text-[10px] text-site-text-tertiary uppercase tracking-[0.14em]">
            {label}
          </p>
        ) : null}
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-3 px-1 text-[13px] text-site-text-tertiary leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** One-sentence narration of what a figure is showing right now. */
export function Narration({ children }: { children: ReactNode }) {
  return (
    <p
      aria-live="polite"
      className="mt-4 min-h-10 text-[13px] text-site-text-secondary leading-relaxed"
    >
      {children}
    </p>
  );
}
