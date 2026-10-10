"use client";

import { useEffect, useRef } from "react";
import { formatCompact } from "@/lib/format";

const DURATION_MS = 700;

/**
 * Counts a hero number up on first view. The server renders the final value,
 * so there is no layout shift and nothing depends on JavaScript; with reduced
 * motion the number simply stays put.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  compact = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Format with `formatCompact` ("1,093", "31.3k") instead of plain digits. */
  compact?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    `${prefix}${compact ? formatCompact(n) : n.toLocaleString("en-US")}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = format(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  });

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
    </span>
  );
}
