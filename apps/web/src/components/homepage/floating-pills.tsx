"use client";

import {
  CodeIcon,
  GitHubLogoIcon,
  GlobeIcon,
  LightningBoltIcon,
  MagicWandIcon,
  PaperPlaneIcon,
  SpeakerLoudIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import { type ComponentType, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Travelling: PaperPlaneIcon,
  "Exploring new things": GlobeIcon,
  "Working out": LightningBoltIcon,
  Music: SpeakerLoudIcon,
  LLMs: TokensIcon,
  Agents: MagicWandIcon,
  "Open source": GitHubLogoIcon,
  Rust: CodeIcon,
};

/**
 * Resting spots (percent of the area) and a slight lean. This is the frame
 * the server renders and what reduced-motion visitors see; once hydrated on a
 * wide screen, each pill drifts from here.
 */
const SLOTS = [
  "sm:top-[3%] sm:left-[4%] sm:-rotate-3",
  "sm:top-[6%] sm:right-[5%] sm:rotate-2",
  "sm:top-[28%] sm:left-[16%] sm:rotate-2",
  "sm:top-[26%] sm:right-[26%] sm:-rotate-2",
  "sm:top-[52%] sm:left-[4%] sm:rotate-1",
  "sm:top-[48%] sm:left-[42%] sm:-rotate-1",
  "sm:top-[70%] sm:right-[8%] sm:rotate-3",
  "sm:top-[76%] sm:left-[26%] sm:-rotate-2",
] as const;

type Particle = {
  el: HTMLElement;
  x: number;
  y: number;
  heading: number;
  speed: number;
  /** Per-pill wobble so headings drift differently. */
  freq: number;
  phase: number;
  paused: boolean;
  /** Pill size, cached so the frame loop never reads layout. */
  w: number;
  h: number;
};

/**
 * Pills that drift like slow particles: each keeps a heading that wanders a
 * little every frame, bounces off the edges, and passes freely over the
 * others. Runs only on wide screens, on screen, in a visible tab, and when
 * motion is allowed.
 */
export function FloatingPills({ items }: { items: readonly string[] }) {
  const areaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const wide = window.matchMedia("(min-width: 640px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || reduce.matches) return;

    const els = Array.from(area.querySelectorAll<HTMLElement>("[data-pill]"));
    const particles: Particle[] = els.map((el, i) => {
      // Start from where the server-rendered layout put it.
      const x = el.offsetLeft;
      const y = el.offsetTop;
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.right = "auto";
      el.style.translate = `${x}px ${y}px`;
      return {
        el,
        x,
        y,
        heading: ((i * 137) % 360) * (Math.PI / 180),
        speed: 9 + ((i * 7) % 9),
        freq: 0.15 + ((i * 0.11) % 0.25),
        phase: i * 1.7,
        paused: false,
        w: el.offsetWidth,
        h: el.offsetHeight,
      };
    });

    const listeners = particles.map((p) => {
      const enter = () => {
        p.paused = true;
      };
      const leave = () => {
        p.paused = false;
      };
      p.el.addEventListener("pointerenter", enter);
      p.el.addEventListener("pointerleave", leave);
      return () => {
        p.el.removeEventListener("pointerenter", enter);
        p.el.removeEventListener("pointerleave", leave);
      };
    });

    let width = area.clientWidth;
    let height = area.clientHeight;
    // Measure here, never inside the frame loop: reading sizes there would
    // force a layout on every frame.
    const resize = new ResizeObserver(() => {
      width = area.clientWidth;
      height = area.clientHeight;
      for (const p of particles) {
        p.w = p.el.offsetWidth;
        p.h = p.el.offsetHeight;
      }
    });
    resize.observe(area);

    let raf: number | null = null;
    let last: number | null = null;
    let time = 0;
    let onScreen = true;

    const step = (now: number) => {
      const dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      for (const p of particles) {
        if (p.paused) continue;
        // Smoothly wandering heading: reads as random, never jittery.
        p.heading += Math.sin(time * p.freq + p.phase) * 0.6 * dt;
        p.x += Math.cos(p.heading) * p.speed * dt;
        p.y += Math.sin(p.heading) * p.speed * dt;
        const maxX = width - p.w;
        const maxY = height - p.h;
        if (p.x < 0 || p.x > maxX) {
          p.heading = Math.PI - p.heading;
          p.x = Math.min(Math.max(p.x, 0), Math.max(0, maxX));
        }
        if (p.y < 0 || p.y > maxY) {
          p.heading = -p.heading;
          p.y = Math.min(Math.max(p.y, 0), Math.max(0, maxY));
        }
        p.el.style.translate = `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`;
      }
      raf = requestAnimationFrame(step);
    };

    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && raf === null) {
        last = null;
        raf = requestAnimationFrame(step);
      } else if (!run && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const io = new IntersectionObserver((entries) => {
      onScreen = entries.at(-1)?.isIntersecting ?? true;
      sync();
    });
    io.observe(area);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      for (const off of listeners) off();
    };
  }, []);

  return (
    <ul
      ref={areaRef}
      className="relative flex flex-wrap gap-2 sm:block sm:flex-1"
    >
      {items.map((label, i) => {
        const Icon = ICONS[label];
        return (
          <li
            key={label}
            data-pill
            className={cn(
              "sm:absolute sm:will-change-[translate]",
              SLOTS[i % SLOTS.length],
            )}
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-site-border bg-site-card/90 py-1.5 pr-3.5 pl-3 text-site-text text-sm shadow-lg/5 dark:border-white/8 dark:bg-site-card/80">
              {Icon && <Icon className="size-3.5 text-site-accent" />}
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
