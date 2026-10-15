import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labelFor, type SectionId } from "./sections";

/**
 * One chapter of the right column. Headings are quiet and sentence-case, with
 * a short aside, so the page reads like a notebook rather than a pitch deck.
 */
export function Chapter({
  id,
  aside,
  children,
  className,
}: {
  id: SectionId;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-24 lg:scroll-mt-28", className)}
    >
      <div className="mb-6 flex items-baseline gap-3">
        <h2
          id={`${id}-title`}
          className="shrink-0 font-display font-semibold text-site-text text-xl tracking-tight"
        >
          {labelFor(id)}
        </h2>
        <span
          aria-hidden
          className="h-px flex-1 translate-y-[-0.3em] bg-site-border"
        />
        {aside && (
          <span className="shrink-0 font-mono text-[11px] text-site-text-tertiary">
            {aside}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
