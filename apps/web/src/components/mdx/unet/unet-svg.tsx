import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Stage, UNetShapes } from "./unet-shapes";

/*
 * Pure SVG renderer for the UNet figure (no hooks, so the server can render
 * it too). Each feature map is drawn as a square whose side is proportional
 * to its spatial size, laid out along the "U": encoder down the left,
 * bottleneck at the bottom, decoder up the right, skips across.
 */

type OkShapes = Extract<UNetShapes, { ok: true }>;

const DX = 58;
const DY = 50;
const MARGIN_X = 40;
const TOP = 48;
/** Input size that maps to the largest square; keeps squares comparable as the input changes. */
const REF_SIZE = 640;
const MAX_SIDE = 40;
const MIN_SIDE = 5;

function side(size: number) {
  return Math.max(MIN_SIDE, (MAX_SIDE * size) / REF_SIZE);
}

type Point = { x: number; y: number };

function layout(shapes: OkShapes) {
  const depth = shapes.depth;
  const pos = new Map<string, Point>();
  const y = (level: number) => TOP + level * DY;
  for (const s of shapes.stages) {
    let col: number;
    if (s.kind === "input") col = 0;
    else if (s.kind === "encoder" || s.kind === "bottleneck") col = 1 + s.level;
    else if (s.kind === "decoder") col = 1 + 2 * (depth - 1) - s.level;
    else col = 2 + 2 * (depth - 1);
    pos.set(s.id, { x: MARGIN_X + col * DX, y: y(s.level) });
  }
  const width = 2 * MARGIN_X + (2 + 2 * (depth - 1)) * DX;
  const height = y(depth - 1) + 40;
  return { pos, width, height };
}

export function UNetSvg({
  shapes,
  highlight,
  selected,
  compact = false,
  onSelect,
  describe,
  title,
  className,
}: {
  shapes: OkShapes;
  /** Stages drawn in the accent colour (a skip lights up when both ends do). */
  highlight?: ReadonlySet<string>;
  selected?: string | null;
  /** Hide all labels (small inline traces label things in HTML). */
  compact?: boolean;
  /** Makes each feature map a focusable button. */
  onSelect?: (id: string) => void;
  describe?: (stage: Stage) => string;
  title: string;
  className?: string;
}) {
  const { pos, width, height } = layout(shapes);
  const lit = (id: string) => highlight?.has(id) || selected === id;
  const at = (id: string) => pos.get(id) ?? { x: 0, y: 0 };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block h-auto w-full", className)}
    >
      <title>{title}</title>

      {/* Forward-pass connectors (drawn first, squares sit on top). */}
      {shapes.stages.slice(1).map((b, i) => {
        const a = shapes.stages[i];
        const p = at(a.id);
        const q = at(b.id);
        return (
          <line
            key={b.id}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            className={cn(
              "transition-colors duration-300",
              lit(a.id) && lit(b.id)
                ? "stroke-site-accent"
                : "stroke-site-border-hover",
            )}
          />
        );
      })}

      {/* Skip connections: encoder feature → center crop → concat. */}
      {shapes.skips.map((skip) => {
        const p = at(skip.from);
        const q = at(skip.to);
        const x1 = p.x + side(skip.fromSize) / 2 + 3;
        const x2 = q.x - side(skip.cropTo) / 2 - 3;
        const on = lit(skip.to) && lit(skip.from);
        const stroke = on ? "stroke-site-accent" : "stroke-site-border-hover";
        return (
          <g key={skip.to}>
            <line
              x1={x1}
              y1={p.y}
              x2={x2}
              y2={q.y}
              strokeDasharray="3 4"
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              className={cn("transition-colors duration-300", stroke)}
            />
            <path
              d={`M${x2 - 5} ${q.y - 3.5}L${x2} ${q.y}L${x2 - 5} ${q.y + 3.5}`}
              fill="none"
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              className={cn("transition-colors duration-300", stroke)}
            />
            {!compact && (
              <text
                x={(x1 + x2) / 2}
                y={p.y - 5}
                textAnchor="middle"
                className={cn(
                  "font-mono",
                  "text-[10px] max-sm:hidden",
                  on ? "fill-site-accent" : "fill-site-text-tertiary",
                )}
              >
                {skip.fromSize === skip.cropTo
                  ? "copy"
                  : `crop ${skip.fromSize}→${skip.cropTo}`}
              </text>
            )}
          </g>
        );
      })}

      {shapes.stages.map((stage) => {
        const p = at(stage.id);
        const s = side(stage.size);
        const on = lit(stage.id);
        const body: ReactNode = (
          <>
            <rect
              x={p.x - s / 2}
              y={p.y - s / 2}
              width={s}
              height={s}
              rx={2}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={
                stage.kind === "input" || stage.kind === "output"
                  ? "2 2"
                  : undefined
              }
              className={cn(
                "transition-[x,y,width,height,fill,stroke] duration-300 ease-out motion-reduce:transition-none",
                on
                  ? "fill-site-accent-subtle stroke-site-accent"
                  : "fill-site-bg-tertiary stroke-site-text-tertiary",
                onSelect &&
                  "group-hover:stroke-site-text-secondary group-focus-visible:stroke-2 group-focus-visible:stroke-site-accent",
              )}
            />
            {!compact && (
              <>
                <text
                  x={p.x}
                  y={p.y - s / 2 - 6}
                  textAnchor="middle"
                  className={cn(
                    "font-mono",
                    "text-[11px] max-sm:text-[22px]",
                    on ? "fill-site-accent" : "fill-site-text-secondary",
                  )}
                >
                  {stage.channels}
                </text>
                <text
                  x={p.x}
                  y={p.y + s / 2 + 13}
                  textAnchor="middle"
                  className={cn(
                    "fill-site-text-tertiary font-mono",
                    "text-[10px] max-sm:text-[20px]",
                  )}
                >
                  {stage.size}
                  <tspan className="max-sm:hidden">²</tspan>
                </text>
              </>
            )}
          </>
        );

        if (!onSelect) return <g key={stage.id}>{body}</g>;

        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(stage.id);
          }
        };
        return (
          // biome-ignore lint/a11y/useSemanticElements: SVG can't contain <button>; this group is focusable and keyboard operable
          <g
            key={stage.id}
            role="button"
            tabIndex={0}
            aria-label={describe?.(stage)}
            aria-pressed={selected === stage.id}
            onClick={() => onSelect(stage.id)}
            onKeyDown={onKeyDown}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") onSelect(stage.id);
            }}
            className="group cursor-pointer outline-none"
          >
            {/* Generous invisible hit area for touch. */}
            <rect
              x={p.x - DX / 2}
              y={p.y - DY / 2}
              width={DX}
              height={DY}
              className="fill-transparent"
            />
            {body}
          </g>
        );
      })}
    </svg>
  );
}
