"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  items: TocItem[];
}

export default function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map((item) => item.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0% -70% 0%", threshold: 0 },
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 font-medium font-mono text-[11px] text-site-text-tertiary uppercase tracking-[1.5px]">
        On this page
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              style={{ paddingLeft: item.level === 3 ? "12px" : "0" }}
            >
              <a
                href={`#${item.id}`}
                className="block rounded py-1 pr-2 text-[13px] leading-snug transition-colors"
                style={{
                  color: isActive
                    ? "var(--site-accent)"
                    : "var(--site-text-tertiary)",
                  fontWeight: isActive ? 500 : 400,
                  borderLeft: `2px solid ${isActive ? "var(--site-accent)" : "transparent"}`,
                  paddingLeft: item.level === 3 ? "16px" : "8px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
