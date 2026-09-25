"use client";

import { useId, useRef, useState } from "react";
import { ControlBar, Scrubber, Segmented } from "@/components/mdx/controls";
import { cn } from "@/lib/utils";
import {
  computeUNetShapes,
  formatShape,
  type Padding,
  POST_CONFIG,
  type Stage,
  type UNetShapes,
} from "./unet-shapes";
import { UNetSvg } from "./unet-svg";

type OkShapes = Extract<UNetShapes, { ok: true }>;

/** Heading ids (rehype-slug) of the post's code sections. */
const CODE_SECTIONS = {
  doubleConv: {
    href: "#1-defining-the-double-convolution-block",
    label: "DoubleConvBlock",
  },
  encoder: { href: "#2-implementing-the-encoder", label: "Encoder" },
  decoder: {
    href: "#3-implementing-the-decoder-with-skip-connections",
    label: "Decoder",
  },
  unet: { href: "#4-final-u-net-architecture", label: "UNet" },
} as const;

function stageTitle(stage: Stage, depth: number) {
  switch (stage.kind) {
    case "input":
      return "Input image";
    case "output":
      return "Output mask (logits)";
    case "bottleneck":
      return `Bottleneck · level ${depth}`;
    case "encoder":
      return `Encoder · level ${stage.level + 1}`;
    case "decoder":
      return `Decoder · level ${stage.level + 1}`;
  }
}

function sectionsFor(stage: Stage) {
  switch (stage.kind) {
    case "input":
    case "output":
      return [CODE_SECTIONS.unet];
    case "encoder":
    case "bottleneck":
      return [CODE_SECTIONS.encoder, CODE_SECTIONS.doubleConv];
    case "decoder":
      return [CODE_SECTIONS.decoder, CODE_SECTIONS.doubleConv];
  }
}

function stageDetail(stage: Stage, shapes: OkShapes, padding: Padding) {
  const shrink =
    padding === 0
      ? "each unpadded 3×3 conv trims 2 px"
      : "padding=1 keeps the size";
  switch (stage.kind) {
    case "input":
      return `torch.randn${formatShape(stage).replace("[", "(").replace("]", ")")}`;
    case "output":
      return `1×1 Conv2d maps ${shapes.stages.at(-2)?.channels} channels to ${stage.channels} per pixel`;
    case "encoder":
    case "bottleneck": {
      const pooled = stage.level > 0 ? "MaxPool2d halves the size, then " : "";
      return `${pooled}${stage.op}: ${shrink}`;
    }
    case "decoder": {
      const skip = shapes.skips.find((s) => s.to === stage.id);
      if (!skip) return stage.op;
      const crop =
        skip.fromSize === skip.cropTo
          ? `copy the ${skip.fromSize}² skip`
          : `crop the skip ${skip.fromSize}→${skip.cropTo}`;
      return `ConvTranspose2d doubles to ${skip.cropTo}², ${crop}, cat → ${skip.concatChannels} ch, DoubleConvBlock → ${stage.size}²`;
    }
  }
}

function ariaFor(stage: Stage, depth: number) {
  return `${stageTitle(stage, depth)}: ${formatShape(stage)}`;
}

/**
 * The post's UNet with every feature-map shape computed from its code.
 * Controls: input size and conv padding. Hover, focus or tap a map for its
 * shape and the code that produces it.
 */
export function UNetExplorer() {
  const [inputSize, setInputSize] = useState<number>(POST_CONFIG.inputSize);
  const [padding, setPadding] = useState<Padding>(POST_CONFIG.padding);
  const [selected, setSelected] = useState<string | null>(null);
  const sliderId = useId();

  const result = computeUNetShapes({ ...POST_CONFIG, inputSize, padding });
  const lastGood = useRef<OkShapes | null>(null);
  if (result.ok) lastGood.current = result;
  const shapes = result.ok ? result : lastGood.current;
  if (!shapes) return null;

  const stage = selected
    ? shapes.stages.find((s) => s.id === selected)
    : undefined;
  const highlight = new Set<string>();
  if (stage) {
    highlight.add(stage.id);
    // Light up the skip pair so the crop is visible.
    const skip = shapes.skips.find(
      (s) => s.to === stage.id || s.from === stage.id,
    );
    if (skip) {
      highlight.add(skip.from);
      highlight.add(skip.to);
    }
  }

  return (
    <div>
      <div
        className={cn(
          "transition-opacity duration-300",
          !result.ok && "opacity-35",
        )}
      >
        <UNetSvg
          shapes={shapes}
          title={`UNet feature maps for a ${inputSize}×${inputSize} input with padding=${padding}: ${formatShape(shapes.input)} in, ${formatShape(shapes.output)} out`}
          selected={selected}
          highlight={highlight}
          onSelect={setSelected}
          describe={(s) => ariaFor(s, shapes.depth)}
        />
      </div>

      <div
        className="mt-3 min-h-18 border-site-border border-t pt-3 text-[13px]"
        aria-live="polite"
      >
        {!result.ok ? (
          <p className="text-site-text-secondary">
            <span className="font-mono text-site-accent">error</span>{" "}
            {result.error}
          </p>
        ) : stage ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-site-text">
                {stageTitle(stage, shapes.depth)}
              </span>
              <code className="font-mono text-site-accent text-xs">
                {formatShape(stage)}
              </code>
            </p>
            <p className="mt-1 text-site-text-secondary">
              {stageDetail(stage, shapes, padding)}
              <span className="text-site-text-tertiary"> · code: </span>
              {sectionsFor(stage).map((s, i) => (
                <span key={s.href}>
                  {i > 0 && ", "}
                  <a
                    href={s.href}
                    className="font-mono text-site-accent text-xs underline-offset-2 hover:underline"
                  >
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          </>
        ) : (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-xs">
              <span className="text-site-text-secondary">
                {formatShape(result.input)}
              </span>
              <span className="text-site-text-tertiary">→</span>
              <span className="text-site-accent">
                {formatShape(result.output)}
              </span>
            </p>
            <p className="mt-1 text-site-text-tertiary">
              {result.output.size === inputSize
                ? "Same size out as in."
                : `${inputSize - result.output.size} px lost to the border.`}{" "}
              Hover or tap a feature map to see its shape and code.
            </p>
          </>
        )}
      </div>

      <ControlBar className="mt-3">
        <label htmlFor={sliderId} className="shrink-0">
          input{" "}
          <span className="text-site-text-secondary tabular-nums">
            {inputSize}×{inputSize}
          </span>
        </label>
        <Scrubber
          id={sliderId}
          min={128}
          max={640}
          step={4}
          value={inputSize}
          onChange={(e) => setInputSize(Number(e.target.value))}
          className="min-w-32"
        />
        <Segmented<"0" | "1">
          label="Convolution padding"
          value={padding === 0 ? "0" : "1"}
          onChange={(v) => setPadding(v === "0" ? 0 : 1)}
          options={[
            { value: "0", label: "padding=0" },
            { value: "1", label: "padding=1" },
          ]}
        />
      </ControlBar>
    </div>
  );
}
