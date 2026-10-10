import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { SkipConnection, Stage, UNetShapes } from "./unet-shapes";

/* Hook-free SVG of the UNet as a "U": squares sized by spatial size, skips as horizontal arrows. */

const W = 660;
/** Narrow layout: taller levels, bigger marks (viewBox 660×398, matched by UNetExplorer). */
const NARROW = { dy: 74, top: 60, minSide: 9, unknownSide: 18 };
const WIDE = { dy: 50, top: 48, minSide: 5, unknownSide: 12 };
type Geometry = typeof WIDE;

/** Per-level inward step of the encoder/decoder columns (the U's sides). */
const STEP_X = 18;
const ENC_X = 118;
const DEC_X = W - ENC_X;
const IO_GAP = 76;
/** Invisible hit target per map. */
const HIT_W = 58;
/** Input size drawn as the largest square, so sizes stay comparable. */
const REF_SIZE = 640;
const MAX_SIDE = 40;

function side(size: number | null, g: Geometry) {
  if (size === null) return g.unknownSide;
  return Math.max(g.minSide, (MAX_SIDE * size) / REF_SIZE);
}

type Point = { x: number; y: number };

function layout(shapes: UNetShapes, g: Geometry) {
  const pos = new Map<string, Point>();
  const y = (level: number) => g.top + level * g.dy;
  for (const s of shapes.stages) {
    let x: number;
    if (s.kind === "input") x = ENC_X - IO_GAP;
    else if (s.kind === "output") x = DEC_X + IO_GAP;
    else if (s.kind === "bottleneck") x = W / 2;
    else if (s.kind === "encoder") x = ENC_X + s.level * STEP_X;
    else x = DEC_X - s.level * STEP_X;
    pos.set(s.id, { x, y: y(s.level) });
  }
  return { pos, height: y(shapes.depth - 1) + 42 };
}

type Label = { x: number; y: number; anchor: "start" | "middle" | "end" };

/** Channel and size label spots, outside the U and clear of its lines. */
function labelSpots(
  stage: Stage,
  p: Point,
  s: number,
): { channel: Label; size: Label } {
  const above = p.y - s / 2 - 6;
  const below = p.y + s / 2 + 13;
  if (stage.kind !== "encoder" && stage.kind !== "decoder") {
    const channel: Label = { x: p.x, y: above, anchor: "middle" };
    return { channel, size: { ...channel, y: below } };
  }
  // Encoders label outward to the left, decoders to the right.
  const dir = stage.kind === "encoder" ? -1 : 1;
  const anchor = dir < 0 ? "end" : "start";
  if (stage.level === 0) {
    // The top row's sides hold the in/out connectors, so go above and below.
    const channel: Label = { x: p.x, y: above, anchor: "middle" };
    return { channel, size: { x: p.x - dir * 4, y: below, anchor } };
  }
  const channel: Label = { x: p.x + dir * (s / 2 + 7), y: p.y + 4, anchor };
  return { channel, size: { ...channel, y: p.y + 17 } };
}

/** Line colour: accent when lit, fainter when its size is unknown. */
function lineStroke(on: boolean, unknown: boolean) {
  if (on) return "stroke-site-accent";
  return unknown ? "stroke-site-border" : "stroke-site-border-hover";
}

/** Label colour: accent when lit, fainter when its size is unknown. */
function textFill(on: boolean, unknown: boolean) {
  if (on) return "fill-site-accent";
  return unknown ? "fill-site-text-tertiary" : "fill-site-text-secondary";
}

function squareColors(failed: boolean, unknown: boolean, on: boolean) {
  if (failed) return "fill-site-accent-subtle stroke-site-accent";
  if (unknown) return "fill-none stroke-site-border-hover";
  if (on) return "fill-site-accent-subtle stroke-site-accent";
  return "fill-site-bg-tertiary stroke-site-text-tertiary";
}

function skipText(skip: SkipConnection) {
  if (skip.cropTo === null) return "crop —";
  if (skip.fromSize === skip.cropTo) return "copy";
  return `crop ${skip.fromSize}→${skip.cropTo}`;
}

function sizeText(stage: Stage, failed: boolean) {
  if (failed) return "✕";
  return stage.size === null ? "—" : `${stage.size}²`;
}

export function UNetSvg({
  shapes,
  highlight,
  selected,
  compact = false,
  narrow = false,
  onSelect,
  describe,
  title,
  className,
}: {
  shapes: UNetShapes;
  /** Stages drawn in the accent colour (a skip lights up when both ends do). */
  highlight?: ReadonlySet<string>;
  selected?: string | null;
  /** Hide all labels (small inline traces label things in HTML). */
  compact?: boolean;
  /** Taller layout for narrow screens. */
  narrow?: boolean;
  /** Makes each feature map a focusable button. */
  onSelect?: (id: string | null) => void;
  describe?: (stage: Stage) => string;
  title: string;
  className?: string;
}) {
  const g = narrow ? NARROW : WIDE;
  const { pos, height } = layout(shapes, g);
  const lit = (id: string) => highlight?.has(id) || selected === id;
  const at = (id: string) => pos.get(id) ?? { x: 0, y: 0 };
  const known = (id: string) =>
    shapes.stages.find((s) => s.id === id)?.size != null;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className={cn("block h-auto w-full", className)}
    >
      <title>{title}</title>

      {/* Forward-pass connectors (drawn first, squares sit on top). The
          bottleneck joins with elbows, forming the flat bottom of the U. */}
      {shapes.stages.slice(1).map((b, i) => {
        const a = shapes.stages[i];
        const p = at(a.id);
        const q = at(b.id);
        let d = `M${p.x} ${p.y}L${q.x} ${q.y}`;
        if (b.kind === "bottleneck") d = `M${p.x} ${p.y}V${q.y}H${q.x}`;
        if (a.kind === "bottleneck") d = `M${p.x} ${p.y}H${q.x}V${q.y}`;
        const dim = b.size === null;
        return (
          <path
            key={b.id}
            d={d}
            fill="none"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            strokeDasharray={dim ? "2 4" : undefined}
            className={cn(
              "transition-colors duration-300",
              lineStroke(lit(a.id) && lit(b.id), dim),
            )}
          />
        );
      })}

      {/* Skip connections: encoder feature → center crop → concat. */}
      {shapes.skips.map((skip) => {
        const p = at(skip.from);
        const q = at(skip.to);
        const x1 = p.x + side(skip.fromSize, g) / 2 + 3;
        const x2 = q.x - side(known(skip.to) ? skip.cropTo : null, g) / 2 - 3;
        const on = lit(skip.to) && lit(skip.from);
        const unknown = skip.cropTo === null;
        const stroke = lineStroke(on, unknown);
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
                  "font-mono text-[10px] max-sm:hidden",
                  textFill(on, unknown),
                )}
              >
                {skipText(skip)}
              </text>
            )}
          </g>
        );
      })}

      {shapes.stages.map((stage) => {
        const p = at(stage.id);
        const s = side(stage.size, g);
        const on = lit(stage.id);
        const failed = shapes.failedAt === stage.id;
        const unknown = stage.size === null;
        const label = labelSpots(stage, p, s);
        const body = (
          <>
            <rect
              x={p.x - s / 2}
              y={p.y - s / 2}
              width={s}
              height={s}
              rx={2}
              strokeWidth={failed ? 1.5 : 1.25}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={
                unknown || stage.kind === "input" || stage.kind === "output"
                  ? "2 2"
                  : undefined
              }
              className={cn(
                "transition-[x,y,width,height,fill,stroke] duration-300 ease-out motion-reduce:transition-none",
                squareColors(failed, unknown, on),
                onSelect &&
                  "group-hover:stroke-site-text-secondary group-focus-visible:fill-site-accent/15 group-focus-visible:stroke-2 group-focus-visible:stroke-site-accent",
              )}
            />
            {failed && (
              <path
                d={`M${p.x - s * 0.3} ${p.y - s * 0.3}L${p.x + s * 0.3} ${p.y + s * 0.3}M${p.x + s * 0.3} ${p.y - s * 0.3}L${p.x - s * 0.3} ${p.y + s * 0.3}`}
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                className="stroke-site-accent"
              />
            )}
            {!compact && (
              <>
                <text
                  x={label.channel.x}
                  y={label.channel.y}
                  textAnchor={label.channel.anchor}
                  className={cn(
                    "font-mono text-[11px] max-sm:text-[24px]",
                    textFill(on || failed, unknown),
                  )}
                >
                  {stage.channels}
                </text>
                <text
                  x={label.size.x}
                  y={label.size.y}
                  textAnchor={label.size.anchor}
                  className={cn(
                    "font-mono text-[10px] max-sm:hidden",
                    textFill(failed, unknown),
                  )}
                >
                  {sizeText(stage, failed)}
                </text>
              </>
            )}
          </>
        );

        if (!onSelect) return <g key={stage.id}>{body}</g>;

        // Click or Enter toggles; hovering with a mouse only selects.
        const toggle = () => onSelect(selected === stage.id ? null : stage.id);
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
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
            onClick={toggle}
            onKeyDown={onKeyDown}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") onSelect(stage.id);
            }}
            className="group cursor-pointer outline-none"
          >
            {/* Generous invisible hit area for touch. */}
            <rect
              x={p.x - HIT_W / 2}
              y={p.y - g.dy / 2}
              width={HIT_W}
              height={g.dy}
              className="fill-transparent"
            />
            {body}
          </g>
        );
      })}
    </svg>
  );
}
