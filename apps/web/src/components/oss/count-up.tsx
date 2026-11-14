"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 700;

/**
 * Counts the leading number of a formatted stat ("1,090+") up on first view.
 * The server renders the final text, so there is no layout shift and nothing
 * depends on JavaScript; with reduced motion the text simply stays put.
 */
export function CountUp({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /^([\d,]+)(.*)$/.exec(children);
    if (!el || !match) return;
    const target = Number(match[1].replaceAll(",", ""));
    const rest = match[2];
    if (target <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - (1 - t) ** 3;
        el.textContent =
          t < 1
            ? `${Math.round(target * eased).toLocaleString("en-US")}${rest}`
            : children;
        if (t < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = children;
    };
  }, [children]);

  return <span ref={ref}>{children}</span>;
}
