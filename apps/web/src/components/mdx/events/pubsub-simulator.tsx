"use client";

import { useId, useReducer, useRef } from "react";
import {
  ControlBar,
  ControlButton,
  PlayButton,
  Segmented,
} from "@/components/mdx/controls";
import {
  useInterval,
  useMediaQuery,
  usePlayback,
} from "@/components/mdx/hooks";
import { cn } from "@/lib/utils";
import {
  advance,
  type BrokerState,
  brokerReducer,
  initialBrokerState,
  lag,
  type Mode,
} from "./broker-sim";

/*
 * Geometry (SVG user units). The log reads oldest → newest, left to right;
 * the producer appends on the right, consumers sit under the offset they
 * will read next.
 */
const RETENTION = 12;
const PITCH = 30;
const CELL = 24;
const X0 = 92;
const LOG_Y = 72;
const PRODUCER_Y = 22;
const ROW_Y = [150, 190] as const;
const MOBILE_SLOTS = 7;
const H = 214;
const TICK_MS = 750;

/** A deterministic first frame: C2 was paused for a while and is catching up. */
function firstFrame(): BrokerState {
  let s = advance(initialBrokerState("pubsub", ["C1", "C2"], RETENTION), 6);
  s = brokerReducer(s, { type: "togglePause", id: "C2" });
  s = advance(s, 7);
  s = brokerReducer(s, { type: "togglePause", id: "C2" });
  return { ...s, published: null, delivered: [] };
}

/** x of the left edge of the slot holding `offset`. */
function slotX(state: BrokerState, offset: number, slots: number) {
  const first = state.nextOffset - slots;
  return X0 + (offset - first) * PITCH;
}

export function PubSubSimulator() {
  const [state, dispatch] = useReducer(brokerReducer, undefined, firstFrame);
  const ref = useRef<HTMLDivElement>(null);
  const { playing, toggle, running } = usePlayback(ref);
  useInterval(() => dispatch({ type: "tick" }), TICK_MS, running);

  // Narrow screens show fewer slots so labels stay legible.
  const narrow = useMediaQuery("(max-width: 639px)");
  const slots = narrow ? MOBILE_SLOTS : RETENTION;
  const W = X0 + slots * PITCH + 40;
  const producerX = X0 + (slots - 1) * PITCH + CELL / 2;
  const titleId = useId();
  const clipId = `pubsub-clip${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const firstVisible = state.nextOffset - slots;
  const offsets: number[] = [];
  for (let o = Math.max(firstVisible, state.head); o < state.nextOffset; o++) {
    offsets.push(o);
  }
  const minOffset = Math.min(...state.consumers.map((c) => c.offset));
  const c2 = state.consumers[1];

  const summary = `${
    state.mode === "pubsub" ? "Publish/subscribe" : "Event streaming"
  }: the broker holds ${state.nextOffset - state.head} event(s). ${state.consumers
    .map(
      (c) =>
        `${c.id} ${c.paused ? "is paused" : "is reading"}, ${lag(state, c)} behind`,
    )
    .join("; ")}.`;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full max-sm:aspect-342/214"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{summary}</title>

        {/* Producer */}
        <g>
          <rect
            x={producerX - 44}
            y={PRODUCER_Y - 16}
            width={88}
            height={30}
            rx={6}
            strokeWidth={1.25}
            className="fill-site-bg-secondary stroke-site-border-hover"
          />
          <text
            x={producerX}
            y={PRODUCER_Y + 3}
            textAnchor="middle"
            className="fill-site-text-secondary font-mono text-[11px]"
          >
            producer
          </text>
          <line
            x1={producerX}
            y1={PRODUCER_Y + 14}
            x2={producerX}
            y2={LOG_Y - 6}
            strokeWidth={1.25}
            className="stroke-site-border-hover"
          />
        </g>

        {/* Broker label */}
        <text
          x={X0 - 12}
          y={LOG_Y + CELL / 2 - 2}
          textAnchor="end"
          className="fill-site-text-secondary font-mono text-[11px]"
        >
          broker
        </text>
        <text
          x={X0 - 12}
          y={LOG_Y + CELL / 2 + 11}
          textAnchor="end"
          className="fill-site-text-tertiary font-mono text-[9px]"
        >
          {state.mode === "pubsub" ? "queue" : "log"}
        </text>

        {/* Empty slots */}
        {Array.from({ length: slots }, (_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed slot positions
            key={i}
            x={X0 + i * PITCH}
            y={LOG_Y}
            width={CELL}
            height={CELL}
            rx={4}
            strokeDasharray="2 3"
            className="fill-none stroke-site-border"
          />
        ))}

        {/* Events, keyed by offset so they slide left as the log grows. */}
        <defs>
          <clipPath id={clipId}>
            <rect x={X0 - 2} y={LOG_Y - 20} width={slots * PITCH} height={60} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {offsets.map((o) => {
            const consumedByAll = o < minOffset;
            return (
              <g
                key={o}
                className="transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${slotX(state, o, slots)}px)` }}
              >
                <rect
                  x={0}
                  y={LOG_Y}
                  width={CELL}
                  height={CELL}
                  rx={4}
                  strokeWidth={1.25}
                  className={cn(
                    "transition-colors duration-300",
                    consumedByAll
                      ? "fill-site-bg-tertiary stroke-site-border-hover"
                      : "fill-site-accent-subtle stroke-site-accent",
                  )}
                />
                <text
                  x={CELL / 2}
                  y={LOG_Y + CELL / 2 + 3.5}
                  textAnchor="middle"
                  className={cn(
                    "font-mono text-[9px]",
                    consumedByAll
                      ? "fill-site-text-tertiary"
                      : "fill-site-accent",
                  )}
                >
                  {o}
                </text>
              </g>
            );
          })}
        </g>

        {/* Publish flight */}
        {state.published !== null && (
          <circle
            key={`pub-${state.published}`}
            r={3.5}
            cx={0}
            cy={0}
            className="animate-fly fill-site-accent motion-reduce:hidden"
            style={
              {
                "--fx": `${producerX}px`,
                "--fy": `${PRODUCER_Y + 14}px`,
                "--tx": `${producerX}px`,
                "--ty": `${LOG_Y + CELL / 2}px`,
              } as React.CSSProperties
            }
          />
        )}

        {/* Consumers */}
        {state.consumers.map((c, i) => {
          const rowY = ROW_Y[i] ?? ROW_Y[0];
          const behind = c.offset < firstVisible;
          const x =
            Math.max(slotX(state, c.offset, slots), X0) - (PITCH - CELL) / 2;
          return (
            <g
              key={c.id}
              className="transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(${x}px)` }}
            >
              <line
                x1={0}
                y1={LOG_Y + CELL + 4}
                x2={0}
                y2={rowY - 12}
                strokeWidth={1.25}
                className={
                  c.paused
                    ? "stroke-site-border-hover"
                    : "stroke-site-text-tertiary"
                }
                strokeDasharray={c.paused ? "2 3" : undefined}
              />
              <path
                d={`M-4 ${LOG_Y + CELL + 9}L0 ${LOG_Y + CELL + 3}L4 ${LOG_Y + CELL + 9}`}
                fill="none"
                strokeWidth={1.25}
                className={
                  c.paused
                    ? "stroke-site-border-hover"
                    : "stroke-site-text-tertiary"
                }
              />
              <rect
                x={-38}
                y={rowY - 12}
                width={76}
                height={24}
                rx={6}
                strokeWidth={1.25}
                strokeDasharray={c.paused ? "3 3" : undefined}
                className={cn(
                  "fill-site-card",
                  c.paused
                    ? "stroke-site-border-hover"
                    : "stroke-site-text-tertiary",
                )}
              />
              <text
                x={0}
                y={rowY + 4}
                textAnchor="middle"
                className="font-mono text-[10.5px]"
              >
                <tspan
                  className={
                    c.paused ? "fill-site-text-tertiary" : "fill-site-text"
                  }
                >
                  {c.id}
                </tspan>
                <tspan className="fill-site-text-tertiary">
                  {c.paused ? " paused" : ` lag ${lag(state, c)}`}
                </tspan>
              </text>
              {behind && (
                <text
                  x={-44}
                  y={rowY + 4}
                  textAnchor="end"
                  className="fill-site-text-tertiary font-mono text-[9px]"
                >
                  ← {firstVisible - c.offset} more
                </text>
              )}
            </g>
          );
        })}

        {/* Delivery flights: from the event's slot down to its consumer. */}
        {state.delivered.map((d) => {
          const i = state.consumers.findIndex((c) => c.id === d.consumerId);
          const rowY = ROW_Y[i] ?? ROW_Y[0];
          const x = slotX(state, d.offset, slots) + CELL / 2;
          return (
            <circle
              key={`${d.consumerId}-${d.offset}-${state.tick}`}
              r={3.5}
              cx={0}
              cy={0}
              className="animate-fly fill-site-accent motion-reduce:hidden"
              style={
                {
                  "--fx": `${x}px`,
                  "--fy": `${LOG_Y + CELL / 2}px`,
                  "--tx": `${x + PITCH / 2}px`,
                  "--ty": `${rowY - 12}px`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>

      <ControlBar className="mt-4">
        <PlayButton playing={playing} onToggle={toggle} label="simulation" />
        <Segmented<Mode>
          label="Messaging model"
          value={state.mode}
          onChange={(mode) => dispatch({ type: "setMode", mode })}
          options={[
            { value: "pubsub", label: "pub/sub" },
            { value: "stream", label: "event streaming" },
          ]}
        />
        {c2 && (
          <ControlButton
            onClick={() => dispatch({ type: "togglePause", id: c2.id })}
            aria-pressed={c2.paused}
            active={c2.paused}
          >
            {c2.paused ? `resume ${c2.id}` : `pause ${c2.id}`}
          </ControlButton>
        )}
        {c2 && state.mode === "stream" && (
          <ControlButton
            onClick={() => dispatch({ type: "replay", id: c2.id })}
            disabled={c2.offset === state.head}
          >
            replay {c2.id} from {state.head}
          </ControlButton>
        )}
      </ControlBar>
    </div>
  );
}
