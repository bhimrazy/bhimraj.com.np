"use client";

import { useId, useRef } from "react";
import { ControlBar, PlayButton, Scrubber } from "@/components/mdx/controls";
import { usePlayback, useTimeline } from "@/components/mdx/hooks";
import { cn } from "@/lib/utils";
import {
  DURATION,
  EVENT_DRIVEN,
  type Lane,
  progress,
  REQUEST_DRIVEN,
} from "./request-flow";

const W = 300;
const TOP = 44;
const UNIT = 21;
const H = TOP + DURATION * UNIT + 22;
const PAD_X = 30;
/** Time units per second of playback. */
const RATE = 1.5;

const ACTOR_LABEL: Record<string, string> = {
  customer: "customer",
  C: "C · price",
  A: "A · drivers",
  B: "B · demand",
  stream: "stream",
};

const y = (t: number) => TOP + t * UNIT;

function LaneSvg({ lane, t }: { lane: Lane; t: number }) {
  const n = lane.actors.length;
  const x = (actor: string) =>
    PAD_X + (lane.actors.indexOf(actor) * (W - 2 * PAD_X)) / (n - 1);
  const waitEnd = Math.min(t, lane.wait.end);
  const done = t >= lane.wait.end;
  const cx = x("customer");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      <title>{`${lane.title}: the customer waits ${lane.wait.hops} network hops for a price.`}</title>

      {lane.actors.map((a) => (
        <g key={a}>
          <text
            x={x(a)}
            y={18}
            textAnchor="middle"
            className={cn(
              "font-mono text-[10px]",
              a === "customer" ? "fill-site-text" : "fill-site-text-secondary",
            )}
          >
            {a === "C" || a === "A" || a === "B" ? a : ACTOR_LABEL[a]}
          </text>
          {(a === "C" || a === "A" || a === "B") && (
            <text
              x={x(a)}
              y={30}
              textAnchor="middle"
              className="fill-site-text-tertiary font-mono text-[8.5px]"
            >
              {ACTOR_LABEL[a]?.split(" · ")[1]}
            </text>
          )}
          <line
            x1={x(a)}
            y1={TOP - 6}
            x2={x(a)}
            y2={H - 10}
            strokeDasharray="1 4"
            strokeLinecap="round"
            className="stroke-site-border-hover"
          />
        </g>
      ))}

      {/* The customer's wait, from request to price. */}
      {t > lane.wait.start && (
        <rect
          x={cx - 3}
          y={y(lane.wait.start)}
          width={6}
          height={y(waitEnd) - y(lane.wait.start)}
          rx={3}
          className="fill-site-accent-subtle stroke-site-accent"
          strokeWidth={1}
        />
      )}
      {done && (
        <text
          x={cx + 8}
          y={y(lane.wait.end) + 14}
          className="fill-site-accent font-mono text-[10px]"
        >
          waited {lane.wait.hops} hops
        </text>
      )}

      {lane.messages.map((m) => {
        const p = progress(m, t);
        if (p === 0) return null;
        const x1 = x(m.from);
        const x2 = x(m.to);
        const y1 = y(m.start);
        const y2 = y(m.end);
        const hx = x1 + (x2 - x1) * p;
        const hy = y1 + (y2 - y1) * p;
        const dir = Math.sign(x2 - x1);
        const stroke = m.background
          ? "stroke-site-border-hover"
          : "stroke-site-text-tertiary";
        return (
          <g key={`${m.from}-${m.to}-${m.start}`}>
            <line
              x1={x1}
              y1={y1}
              x2={hx}
              y2={hy}
              strokeWidth={1.25}
              strokeDasharray={m.background ? "3 3" : undefined}
              className={stroke}
            />
            {p < 1 ? (
              <circle cx={hx} cy={hy} r={3} className="fill-site-accent" />
            ) : (
              <path
                d={`M${x2 - dir * 6} ${y2 - 4.5}L${x2} ${y2}L${x2 - dir * 5} ${y2 + 3.5}`}
                fill="none"
                strokeWidth={1.25}
                className={stroke}
              />
            )}
            {m.label && (
              <text
                x={x1 + dir * 7}
                y={y1 - 4}
                textAnchor={dir > 0 ? "start" : "end"}
                className={cn(
                  "font-mono text-[9px]",
                  m.background
                    ? "fill-site-text-tertiary"
                    : "fill-site-text-secondary",
                )}
              >
                {m.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Side-by-side sequence diagrams for the post's ride-pricing example. The
 * server renders the finished picture; Play replays it on a shared clock.
 */
export function RequestVsEvent() {
  const ref = useRef<HTMLDivElement>(null);
  const { playing, setPlaying, toggle, running } = usePlayback(ref);
  const [t, setT] = useTimeline(DURATION, RATE, running, () =>
    setPlaying(false),
  );
  const scrubId = useId();

  return (
    <div ref={ref}>
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {[REQUEST_DRIVEN, EVENT_DRIVEN].map((lane) => (
          <div key={lane.title}>
            <p className="mb-2 font-mono text-[11px] text-site-text-secondary">
              {lane.title}
            </p>
            <LaneSvg lane={lane} t={t} />
          </div>
        ))}
      </div>
      <ControlBar className="mt-4">
        <PlayButton playing={playing} onToggle={toggle} label="sequence" />
        <label htmlFor={scrubId} className="sr-only">
          Time
        </label>
        <Scrubber
          id={scrubId}
          min={0}
          max={DURATION}
          step={0.05}
          value={t}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value));
          }}
        />
        <span className="w-14 text-right tabular-nums" aria-hidden="true">
          t = {t.toFixed(1)}
        </span>
      </ControlBar>
    </div>
  );
}
