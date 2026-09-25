import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import type { TocItem } from "./toc";

/**
 * Collapsible table of contents for screens without the sticky side rail.
 * Native <details>, so it works without JavaScript.
 */
export default function MobileToc({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <details
      className={cn(
        "group mx-auto mb-10 max-w-measure rounded-xl border border-site-border bg-site-card open:pb-2 dark:border-white/6",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
        <span className="flex items-baseline gap-2.5">
          <span className="font-medium font-mono text-[11px] text-site-text uppercase tracking-[1.5px]">
            On this page
          </span>
          <span className="font-mono text-[11px] text-site-text-tertiary">
            {items.length} sections
          </span>
        </span>
        <ChevronDownIcon className="size-4 text-site-text-tertiary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <nav aria-label="Table of contents" className="px-4 pb-2">
        <ol className="flex flex-col border-site-border border-t pt-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block rounded-sm py-1.5 text-site-text-secondary text-sm leading-snug transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent",
                  item.level === 3 && "pl-4 text-[13px]",
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
