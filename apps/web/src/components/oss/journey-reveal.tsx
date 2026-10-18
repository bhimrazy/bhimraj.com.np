"use client";

import { type ReactNode, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Must match the `duration-500` on the grid below. */
const DURATION_MS = 500;

/**
 * The older part of the journey, collapsed behind one button. Everything is
 * server-rendered; this only animates `grid-template-rows` 0fr → 1fr (works in
 * every browser, unlike `height: auto`) and keeps the collapsed content out of
 * the tab order with `inert`.
 */
export function JourneyReveal({
  label,
  children,
}: {
  /** Button text while collapsed, e.g. "Show full journey · 12 earlier moments, back to Mar 2024". */
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) return;

    // Collapsing from the bottom of a long list: the content above the
    // button folds away, so without help the button (and the reader's place)
    // would fly up by the list's height and the shrinking page would clamp
    // the scroll position. Keep the button where it is on screen instead.
    const el = button.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const started = performance.now();
    const pin = () => {
      // Instant: the page sets scroll-behavior: smooth, which would turn
      // each correction into its own animation.
      window.scrollBy({
        top: el.getBoundingClientRect().top - top,
        behavior: "instant",
      });
      if (!reduced && performance.now() - started < DURATION_MS + 50) {
        requestAnimationFrame(pin);
      }
    };
    requestAnimationFrame(pin);
  };

  return (
    <div>
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        {/* No opacity fade here: the text must be visible while the region
            grows, or it reads as a blank block filling in. */}
        <div inert={!open} className="min-h-0 overflow-hidden">
          {children}
        </div>
      </div>

      <div className="relative mt-2">
        {/* Fade into the collapsed tail; an overlay, since mask-image can't animate. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-full h-16 bg-linear-to-t from-site-bg to-transparent transition-opacity duration-300 motion-reduce:transition-none",
            open && "opacity-0",
          )}
        />
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-md border border-site-border bg-site-card px-3.5 py-2 text-left font-mono text-[12px] text-site-text transition-colors hover:border-site-accent/60 hover:text-site-accent focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
        >
          {open ? "Show fewer" : label}
          <span
            aria-hidden
            className={cn(
              "transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          >
            ↓
          </span>
        </button>
      </div>
    </div>
  );
}
