import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

/**
 * Optional depth (a deep dive, an exercise's solution) folded away. Native
 * `<details>`, so it opens without JavaScript and finds-in-page work.
 *
 * ```mdx
 * <Details summary="Deep dive: how rebase rewrites history">Markdown.</Details>
 * ```
 */
export function Details({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="group my-6 rounded-xl border border-site-border bg-site-card open:pb-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-3.5 font-display font-medium text-[0.975rem] text-site-text leading-snug transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 sm:px-6 [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDownIcon
          aria-hidden
          className="size-4 shrink-0 text-site-text-tertiary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="border-site-border border-t px-5 pt-1 pb-3 sm:px-6 [&>:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}
