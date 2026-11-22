"use client";

import { useId, useState } from "react";
import { ControlBar } from "@/components/mdx/controls";
import { Narration } from "@/components/mdx/figure";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Leg, TRIFECTA } from "./field-guide-data";

const W = 340;
const H = 344;
const R = 86;
/** Distance between circle centres. */
const S = 80;
const CX = W / 2;
const TOP_Y = 150;
const CENTRES = [
  { x: CX - S / 2, y: TOP_Y },
  { x: CX + S / 2, y: TOP_Y },
  { x: CX, y: TOP_Y + (S * Math.sqrt(3)) / 2 },
];
const MID_Y = CENTRES.reduce((sum, c) => sum + c.y, 0) / 3;
/** Label anchors outside each circle: above-left, above-right, below. */
const LABELS = [
  { x: 12, y: 30, anchor: "start" },
  { x: W - 12, y: 30, anchor: "end" },
  { x: CX, y: H - 24, anchor: "middle" },
] as const;
const FADE =
  "transition-opacity duration-300 ease-out motion-reduce:transition-none";

const ALL_ON =
  "With all three, a prompt hidden in an issue or README can tell the agent to read your secrets and send them out. Switch one off to break the chain.";

/** Simon Willison's lethal trifecta; turn off one leg to close the exfiltration path. SSR: all on. */
export function LethalTrifecta() {
  const [off, setOff] = useState<Leg | null>(null);
  const id = useId().replace(/[^\w-]/g, "");
  const open = off === null;
  const story = open ? ALL_ON : TRIFECTA.find((t) => t.id === off)?.off;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto block h-auto w-full max-w-md"
      >
        <title>{`Three overlapping circles: ${TRIFECTA.map((t) => t.label).join(", ")}. ${open ? "Where all three overlap is exfiltration." : "One is off, so the centre is safe."}`}</title>
        <defs>
          {CENTRES.slice(0, 2).map((c, i) => (
            <clipPath key={TRIFECTA[i].id} id={`${id}-clip-${i}`}>
              <circle cx={c.x} cy={c.y} r={R} />
            </clipPath>
          ))}
        </defs>

        {TRIFECTA.map((t, i) => {
          const c = CENTRES[i];
          const l = LABELS[i];
          const on = off !== t.id;
          return (
            <g key={t.id} className={cn(FADE, !on && "opacity-30")}>
              <circle
                cx={c.x}
                cy={c.y}
                r={R}
                strokeWidth={1.25}
                className="fill-site-text-tertiary/10 stroke-site-text-tertiary"
              />
              <text
                x={l.x}
                y={l.y}
                textAnchor={l.anchor}
                className="fill-site-text font-medium font-mono text-xs"
              >
                {t.label}
              </text>
              <text
                x={l.x}
                y={l.y + 15}
                textAnchor={l.anchor}
                className="fill-site-text-secondary font-mono text-3xs"
              >
                {t.examples}
              </text>
            </g>
          );
        })}

        {/* Third circle clipped by the first two: the triple overlap. */}
        <g clipPath={`url(#${id}-clip-0)`}>
          <g clipPath={`url(#${id}-clip-1)`}>
            <circle
              cx={CENTRES[2].x}
              cy={CENTRES[2].y}
              r={R}
              className={cn("fill-site-accent", FADE, !open && "opacity-0")}
            />
          </g>
        </g>
        <text
          x={CX}
          y={MID_Y + 3.5}
          textAnchor="middle"
          className={cn(
            "fill-site-on-accent font-medium font-mono text-3xs",
            FADE,
            !open && "opacity-0",
          )}
        >
          exfiltration
        </text>
        <text
          x={CX}
          y={MID_Y + 4}
          textAnchor="middle"
          className={cn(
            "fill-site-success font-medium font-mono text-xs",
            FADE,
            open && "opacity-0",
          )}
        >
          safe
        </text>
      </svg>

      <Narration>{story}</Narration>
      <ControlBar className="mt-3" role="group" aria-label="Agent capabilities">
        {TRIFECTA.map((t) => {
          const on = off !== t.id;
          return (
            <Button
              key={t.id}
              variant="figure"
              size="sm"
              aria-pressed={on}
              onClick={() => setOff(on ? t.id : null)}
              className={cn(
                on
                  ? "bg-site-bg-tertiary text-site-text"
                  : "text-site-text-tertiary line-through",
              )}
            >
              {t.label}
            </Button>
          );
        })}
        <span className="text-site-text-tertiary">one off at a time</span>
      </ControlBar>
    </div>
  );
}
