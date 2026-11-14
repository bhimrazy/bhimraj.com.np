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
  const region = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      // The revealed entries sit above the button; move focus to them so the
      // next Tab doesn't skip past to the contact section.
      requestAnimationFrame(() =>
        region.current?.focus({ preventScroll: true }),
      );
      return;
    }

    // The list above folds away; pin the button on screen so the reader keeps
    // their place and the shrinking page doesn't clamp the scroll position.
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
          "grid duration-500 ease-out motion-reduce:transition-none",
          // Visible at once on open so the region can take focus; hidden only
          // after the fold on close.
          open
            ? "visible grid-rows-[1fr] transition-[grid-template-rows]"
            : "invisible grid-rows-[0fr] transition-[grid-template-rows,visibility]",
        )}
      >
        {/* No opacity fade, or the growing region reads as a blank block.
            Clip vertically only, so milestone rings at the rail aren't cut. */}
        <div
          ref={region}
          inert={!open}
          tabIndex={-1}
          className="min-h-0 overflow-y-clip outline-none"
        >
          {children}
        </div>
      </div>

      <div className="relative mt-2">
        {/* Fades only the rail's tail, never the last entry's text or link. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-full left-0 h-16 w-5 bg-linear-to-t from-site-bg to-transparent transition-opacity duration-300 motion-reduce:transition-none",
            open && "opacity-0",
          )}
        />
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-md border border-site-border bg-site-card px-3.5 py-2 text-left font-mono text-[12px] text-site-text transition-colors hover:border-site-accent/60 hover:text-site-accent-text focus-visible:outline-2 focus-visible:outline-site-accent focus-visible:outline-offset-2"
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
