import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The frame every interactive (or static) figure in a post sits in: a quiet
 * card with the visual inside and a short caption underneath.
 */
export function Figure({
  caption,
  children,
  className,
}: {
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
