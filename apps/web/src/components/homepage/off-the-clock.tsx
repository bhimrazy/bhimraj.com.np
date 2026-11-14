import { cn } from "@/lib/utils";
import { PERSON, PERSONAL } from "./data";
import { FloatingPills } from "./floating-pills";
import { surface } from "./surface";

/** Layered ridgelines with a low sun: the hills around the Kathmandu valley. */
function Ridges() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 w-full"
    >
      <circle cx="525" cy="50" r="20" className="fill-site-accent/25" />
      <circle cx="525" cy="50" r="40" className="fill-site-accent/6" />
      <path
        d="M0 128 L55 104 L100 116 L165 66 L210 94 L262 50 L304 82 L352 38 L398 78 L446 58 L500 92 L552 72 L600 96 V200 H0 Z"
        className="fill-site-border-hover/45 dark:fill-white/5"
      />
      <path
        d="M262 50 L276 60 L268 61 L262 56 L255 62 L249 58 Z M352 38 L366 50 L358 50 L352 45 L345 51 L339 47 Z"
        className="fill-site-text-tertiary/40"
      />
      <path
        d="M0 156 L70 128 L136 148 L208 112 L276 142 L338 118 L414 148 L486 122 L600 142 V200 H0 Z"
        className="fill-site-border/80 dark:fill-white/4"
      />
    </svg>
  );
}

/**
 * Foreground waves, drawn twice as wide as the card and slid left by half,
 * at two speeds for a little parallax. Each is its own element, so the slide
 * runs on the compositor instead of repainting the ridges every frame. Still
 * under reduced motion; the pills' Pause button holds them via `data-paused`.
 */
function Waves() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 42"
        preserveAspectRatio="none"
        className="block w-[200%] motion-safe:animate-flow-slow group-data-[paused]/clock:[animation-play-state:paused]"
      >
        <path
          d="M0 14 Q75 0 150 14 T300 14 T450 14 T600 14 T750 14 T900 14 T1050 14 T1200 14 V42 H0 Z"
          className="fill-site-border/50 dark:fill-white/3"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 28"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 block w-[200%] motion-safe:animate-flow group-data-[paused]/clock:[animation-play-state:paused]"
      >
        <path
          d="M0 10 Q75 0 150 10 T300 10 T450 10 T600 10 T750 10 T900 10 T1050 10 T1200 10 V28 H0 Z"
          className="fill-site-bg-secondary dark:fill-site-bg"
        />
      </svg>
    </div>
  );
}

export function OffTheClock() {
  return (
    <div
      data-motion-root
      className={cn(
        surface,
        "group/clock flex min-h-72 flex-1 flex-col p-6 sm:min-h-80 sm:p-7",
      )}
    >
      <Ridges />
      <Waves />

      <FloatingPills items={[...PERSONAL.interests, ...PERSONAL.curiosities]} />

      <p className="relative mt-auto flex items-baseline gap-2 pt-24 text-site-text-secondary text-sm sm:pt-0">
        <span className="font-mono text-[12px] text-site-text-tertiary">
          Based in
        </span>
        {PERSON.city}
      </p>
    </div>
  );
}
