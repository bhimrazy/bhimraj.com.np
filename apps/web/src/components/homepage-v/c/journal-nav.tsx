"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/**
 * The page's one interaction: a table of contents that follows you down the
 * right column. The active entry's rule grows and its label brightens;
 * with reduced motion the change is instant.
 */
export function JournalNav({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // A thin band a third of the way down the viewport: whichever section
    // crosses it is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-33% 0px -62% 0px" },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page">
      <ul className="flex flex-col gap-0.5">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className="group flex items-center gap-4 rounded-sm py-1.5 text-site-text-tertiary transition-colors duration-200 hover:text-site-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-4 aria-[current=location]:text-site-text motion-reduce:transition-none"
            >
              <span
                aria-hidden
                className="h-px w-6 bg-current transition-[width,background-color] duration-300 ease-out group-hover:w-12 group-aria-[current=location]:w-12 group-aria-[current=location]:bg-site-accent motion-reduce:transition-none"
              />
              <span className="font-medium font-mono text-[11px] uppercase tracking-[1.5px]">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
