"use client";

import { useEffect, useRef } from "react";

/**
 * Thin accent bar pinned to the top of the viewport that tracks how far the
 * reader is through the element with `targetId`. Writes the transform
 * directly (no React state) so scrolling never re-renders.
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const bar = barRef.current;
    if (!target || !bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      bar.style.transform = `scaleX(${progress})`;
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
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-site-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
