"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Offset below the fixed header at which a heading counts as "current". */
const ACTIVE_OFFSET = 140;

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (ids.length === 0) return;
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "";
      for (const el of headings) {
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET > 0) break;
        current = el.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return activeId;
}

export default function Toc({ items }: { items: TocItem[] }) {
  const [ids] = useState(() => items.map((item) => item.id));
  const activeId = useActiveHeading(ids);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 font-medium font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.5px]">
        On this page
      </p>
      <ul className="flex flex-col border-site-border border-l">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pr-2 text-[13px] leading-snug transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:-outline-offset-2 motion-reduce:transition-none",
                  item.level === 3 ? "pl-7" : "pl-4",
                  isActive
                    ? "border-site-accent font-medium text-site-text"
                    : "border-transparent text-site-text-secondary hover:border-site-border-hover hover:text-site-text",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="#top"
        className="mt-6 inline-flex items-center gap-1.5 rounded-sm font-mono text-[11px] text-site-text-secondary uppercase tracking-[1.5px] transition-colors hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
      >
        <ArrowUpIcon className="size-3" />
        Back to top
      </a>
    </nav>
  );
}
