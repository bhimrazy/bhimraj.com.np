"use client";

import { useState } from "react";
import { ControlBar, Segmented } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { cn } from "@/lib/utils";
import {
  COOLDOWNS,
  type CooldownValue,
  INCIDENTS,
  isBlocked,
} from "./field-guide-data";

const H_MIN = 0.5;
/** 30 days; longer windows are drawn at the edge. */
const H_MAX = 30 * 24;
const TICKS = [
  { h: 1, label: "1h" },
  { h: 6, label: "6h" },
  { h: 24, label: "1d" },
  { h: 72, label: "3d" },
  { h: 168, label: "7d" },
  { h: 336, label: "14d" },
  { h: H_MAX, label: "30d+" },
];
const ROWS = [...INCIDENTS].sort((a, b) => a.hours - b.hours);
const MOVE =
  "transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none";

const list = (names: string[]) =>
  names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

function narrate(days: number) {
  const n = ROWS.length;
  if (days === 0) {
    return `With no cooldown, all ${n} of these malicious releases could be installed while they were live.`;
  }
  const through = ROWS.filter((r) => !isBlocked(r, days)).reverse();
  const blocked = n - through.length;
  const head = `A ${days}-day cooldown would have skipped ${blocked === n ? "all" : blocked} of these ${n} malicious releases.`;
  if (!through.length) return head;
  const tie = through.some((r) => r.hours === days * 24);
  return `${head} ${list(through.map((r) => r.name))} stayed live ${tie ? "at least that long" : "longer"}.`;
}

function Chart({
  days,
  narrow,
  className,
}: {
  days: number;
  narrow?: boolean;
  className?: string;
}) {
  const W = narrow ? 300 : 600;
  const rowH = narrow ? 30 : 27;
  const L = narrow ? 6 : 128;
  const R = W - (narrow ? 44 : 64);
  const top = 26;
  const H = top + ROWS.length * rowH + 22;
  const plotW = R - L;
  const x = (h: number) =>
    L +
    (Math.log(Math.min(h, H_MAX) / H_MIN) / Math.log(H_MAX / H_MIN)) * plotW;
  // Line baseline sits low in the row on phones to leave room for the name.
  const rowY = (i: number) => top + i * rowH + (narrow ? 21 : rowH / 2);
  const edge = days ? x(days * 24) - L : 0;
  const blockedCount = ROWS.filter((r) => isBlocked(r, days)).length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
    >
      <title>{`Malicious release windows on a log time axis from 1 hour to 30 days. ${days ? `A ${days}-day cooldown blocks ${blockedCount} of ${ROWS.length}.` : "No cooldown."}`}</title>

      {/* Cooldown: one full-width rect scaled from the left edge. */}
      <rect
        x={L}
        y={top - 6}
        width={plotW}
        height={H - top - 16}
        className={cn("fill-site-bg-tertiary/70", MOVE)}
        style={{
          transform: `scaleX(${edge / plotW})`,
          transformOrigin: `${L}px 0`,
        }}
      />
      <g
        className={cn(MOVE, !days && "opacity-0")}
        style={{ transform: `translateX(${edge}px)` }}
      >
        <line
          x1={L}
          x2={L}
          y1={top - 6}
          y2={H - 22}
          strokeWidth={1}
          className="stroke-site-text-tertiary"
        />
        <text
          x={L - 6}
          y={14}
          textAnchor="end"
          className="fill-site-text font-mono text-3xs"
        >
          {days ? `${days}-day cooldown` : ""}
        </text>
      </g>

      {TICKS.map((t) => (
        <g key={t.h}>
          <line
            x1={x(t.h)}
            x2={x(t.h)}
            y1={top - 6}
            y2={H - 22}
            strokeWidth={1}
            strokeDasharray="1 3"
            className="stroke-site-border-hover"
          />
          <text
            x={x(t.h)}
            y={H - 8}
            textAnchor="middle"
            className="fill-site-text-tertiary font-mono text-3xs"
          >
            {t.label}
          </text>
        </g>
      ))}

      {ROWS.map((r, i) => {
        const blocked = isBlocked(r, days);
        const cy = rowY(i);
        const end = x(r.hours);
        return (
          <g key={r.name}>
            <text
              x={narrow ? L : L - 12}
              y={narrow ? cy - 8 : cy + 3.5}
              textAnchor={narrow ? "start" : "end"}
              className={cn(
                "font-mono transition-colors duration-500",
                narrow ? "text-3xs" : "text-2xs",
                blocked ? "fill-site-text-tertiary" : "fill-site-text",
              )}
            >
              {r.name}
            </text>
            <line
              x1={L}
              x2={end}
              y1={cy}
              y2={cy}
              strokeWidth={1.5}
              className="stroke-site-border-hover"
            />
            <circle
              cx={end}
              cy={cy}
              r={3}
              className="fill-site-text-tertiary"
            />
            <g className={cn(MOVE, blocked && "opacity-0")}>
              <line
                x1={L}
                x2={end}
                y1={cy}
                y2={cy}
                strokeWidth={1.5}
                className="stroke-site-accent"
              />
              <circle cx={end} cy={cy} r={3.5} className="fill-site-accent" />
            </g>
            <text
              x={end + 8}
              y={cy + 3.5}
              className={cn(
                "font-mono text-3xs transition-colors duration-500",
                blocked ? "fill-site-text-tertiary" : "fill-site-accent-text",
              )}
            >
              {r.window}
              {blocked && <tspan dx={6}>✓ blocked</tspan>}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Malicious release windows against a dependency cooldown. SSR: 7 days. */
export function CooldownWindow() {
  const [value, setValue] = useState<CooldownValue>("7");
  const days = COOLDOWNS.find((c) => c.value === value)?.days ?? 0;
  const blocked = ROWS.filter((r) => isBlocked(r, days)).length;

  return (
    <div>
      <ControlBar className="mb-4">
        <Segmented
          label="Cooldown"
          value={value}
          options={COOLDOWNS}
          onChange={setValue}
        />
        <span className="ml-auto text-site-text tabular-nums">
          Blocked {blocked} of {ROWS.length}
        </span>
      </ControlBar>
      <Chart days={days} className="max-sm:hidden" />
      <Chart days={days} narrow className="sm:hidden" />
      <Narration>{narrate(days)}</Narration>
    </div>
  );
}
