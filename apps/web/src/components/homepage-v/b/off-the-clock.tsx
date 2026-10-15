import {
  GlobeIcon,
  LightningBoltIcon,
  PaperPlaneIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { surface } from "../../homepage/surface";
import { PERSON, PERSONAL, type Placeholder, ph } from "../facts";
import { Ph } from "../ph";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Travelling: PaperPlaneIcon,
  "Exploring new things": GlobeIcon,
  "Working out": LightningBoltIcon,
  Music: SpeakerLoudIcon,
};

/** Open slots for more interests; Bhimraj fills these in. */
const MORE: Placeholder[] = [
  ph("another interest"),
  ph("one more"),
  ph("a favourite thing"),
];

/**
 * Where each pill rests on wide screens (percent of the card), how it leans,
 * and which wander path it loops on. Paths, speeds and delays all differ, so
 * the drift reads as random. On phones the pills wrap in a normal row.
 */
const SLOTS = [
  {
    place: "sm:top-[3%] sm:left-[4%] sm:-rotate-3",
    motion: "motion-safe:animate-wander-a",
  },
  {
    place: "sm:top-[6%] sm:right-[5%] sm:rotate-2",
    motion: "motion-safe:animate-wander-b [animation-delay:-6s]",
  },
  {
    place: "sm:top-[30%] sm:left-[16%] sm:rotate-2",
    motion: "motion-safe:animate-wander-c [animation-delay:-3s]",
  },
  {
    place: "sm:top-[27%] sm:right-[28%] sm:-rotate-2",
    motion: "motion-safe:animate-wander-a [animation-delay:-11s]",
  },
  {
    place: "sm:top-[58%] sm:left-[5%] sm:rotate-1",
    motion: "motion-safe:animate-wander-b [animation-delay:-14s]",
  },
  {
    place: "sm:top-[50%] sm:left-[44%] sm:-rotate-1",
    motion: "motion-safe:animate-wander-c [animation-delay:-18s]",
  },
  {
    place: "sm:top-[74%] sm:right-[28%] sm:rotate-3",
    motion: "motion-safe:animate-wander-a [animation-delay:-7s]",
  },
] as const;

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
      {/* Foreground waves: drawn 1200 wide and slid left by 600, at two
          speeds for a little parallax. Still under reduced motion. */}
      <path
        d="M0 172 Q75 158 150 172 T300 172 T450 172 T600 172 T750 172 T900 172 T1050 172 T1200 172 V200 H0 Z"
        className="fill-site-border/50 motion-safe:animate-flow-slow dark:fill-white/3"
      />
      <path
        d="M0 182 Q75 172 150 182 T300 182 T450 182 T600 182 T750 182 T900 182 T1050 182 T1200 182 V200 H0 Z"
        className="fill-site-bg-secondary motion-safe:animate-flow dark:fill-site-bg"
      />
    </svg>
  );
}

export function OffTheClock() {
  const pills: (string | Placeholder)[] = [...PERSONAL.interests, ...MORE];

  return (
    <div
      className={cn(
        surface,
        "flex min-h-72 flex-1 flex-col p-6 sm:min-h-80 sm:p-7",
      )}
    >
      <Ridges />

      <ul className="relative flex flex-wrap gap-2 sm:block sm:flex-1">
        {pills.map((pill, i) => {
          const slot = SLOTS[i % SLOTS.length];
          const Icon = typeof pill === "string" ? ICONS[pill] : undefined;
          return (
            <li
              key={typeof pill === "string" ? pill : pill.hint}
              className={cn(
                "sm:absolute hover:[animation-play-state:paused]",
                slot.place,
                slot.motion,
              )}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-site-border bg-site-card/90 py-1.5 pr-3.5 pl-3 text-site-text text-sm shadow-lg/5 backdrop-blur-sm dark:border-white/8 dark:bg-site-card/80">
                {Icon && <Icon className="size-3.5 text-site-accent" />}
                <Ph value={pill} />
              </span>
            </li>
          );
        })}
      </ul>

      <p className="relative mt-auto flex items-baseline gap-2 pt-24 text-site-text-secondary text-sm sm:pt-0">
        <span className="font-mono text-[12px] text-site-text-tertiary">
          Based in
        </span>
        {PERSON.city}
      </p>
    </div>
  );
}
