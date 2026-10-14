"use client";

import { useState } from "react";
import { ControlBar, Segmented } from "@/components/mdx/controls";
import { Slider } from "@/components/ui/slider";
import {
  computeUNetShapes,
  formatShape,
  type Padding,
  POST_CONFIG,
  type Stage,
  type UNetShapes,
} from "./unet-shapes";
import { UNetSvg } from "./unet-svg";

/** Heading ids of the post's code sections (checked against the post in tests). */
export const CODE_SECTIONS = {
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

function stageDetail(stage: Stage, shapes: UNetShapes, padding: Padding) {
  if (shapes.failedAt === stage.id) return "This is where the shapes break.";
  if (stage.size === null) {
    return "Can't be computed: an earlier level already shrank to nothing.";
  }
  const shrink =
    padding === 0
      ? "each unpadded 3×3 conv trims 2 px"
      : "padding=1 keeps the size";
  switch (stage.kind) {
    case "input":
      return `torch.randn(1, ${stage.channels}, ${stage.size}, ${stage.size})`;
    case "output":
      return `1×1 Conv2d maps ${shapes.stages.at(-2)?.channels} channels to ${stage.channels} per pixel`;
    case "encoder":
    case "bottleneck": {
      const pooled = stage.level > 0 ? "MaxPool2d halves the size, then " : "";
      return `${pooled}${stage.op}: ${shrink}`;
    }
    case "decoder": {
      const skip = shapes.skips.find((s) => s.to === stage.id);
      if (!skip || skip.cropTo === null) return stage.op;
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

function summary(shapes: UNetShapes, inputSize: number, padding: Padding) {
  const out = shapes.output.size;
  if (out === null) return null;
  if (out === inputSize) return "Same size out as in.";
  if (padding === 0) {
    return `${inputSize - out} px lost to unpadded convolutions.`;
  }
  return `${inputSize - out} px lost because MaxPool2d floors odd sizes; inputs divisible by ${2 ** (shapes.depth - 1)} keep their size.`;
}

/** The post's UNet with shapes computed from its code; pick a map to see its shape and source. */
export function UNetExplorer() {
  const [inputSize, setInputSize] = useState<number>(POST_CONFIG.inputSize);
  const [padding, setPadding] = useState<Padding>(POST_CONFIG.padding);
  const [selected, setSelected] = useState<string | null>(null);

  const shapes = computeUNetShapes({ ...POST_CONFIG, inputSize, padding });
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

  const svg = {
    shapes,
    title: `UNet feature maps for a ${inputSize}×${inputSize} input with padding=${padding}: ${formatShape(shapes.input)} in, ${formatShape(shapes.output)} out`,
    selected,
    highlight,
    onSelect: setSelected,
    describe: (s: Stage) => ariaFor(s, shapes.depth),
  };

  return (
    <div>
      {/* Both layouts render and CSS shows one, so nothing jumps on hydration. */}
      <UNetSvg {...svg} className="max-sm:hidden" />
      <UNetSvg {...svg} narrow className="sm:hidden" />

      {/* Announce only what changed, not the whole panel on every slider step. */}
      <p aria-live="polite" className="sr-only">
        {shapes.error ??
          (stage
            ? `${stageTitle(stage, shapes.depth)}: ${formatShape(stage)}`
            : "")}
      </p>
      <div className="mt-3 min-h-18 space-y-1 border-site-border border-t pt-3 text-sm">
        {shapes.error ? (
          <p className="text-site-text-secondary">
            <span className="font-mono text-site-accent">✕</span> {shapes.error}
          </p>
        ) : null}
        {stage ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-medium text-site-text">
                {stageTitle(stage, shapes.depth)}
              </span>
              <code className="font-mono text-site-accent text-xs">
                {formatShape(stage)}
              </code>
            </p>
            <p className="text-site-text-secondary">
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
        ) : shapes.ok ? (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-xs">
              <span className="text-site-text-secondary">
                {formatShape(shapes.input)}
              </span>
              <span className="text-site-text-tertiary">→</span>
              <span className="text-site-accent">
                {formatShape(shapes.output)}
              </span>
            </p>
            <p className="text-site-text-tertiary">
              {summary(shapes, inputSize, padding)} Click or tap a feature map
              to see its shape and code.
            </p>
          </>
        ) : null}
      </div>

      <ControlBar className="mt-3">
        <span className="shrink-0" aria-hidden="true">
          input{" "}
          <span className="text-site-text-secondary tabular-nums">
            {inputSize}×{inputSize}
          </span>
        </span>
        <Slider
          aria-label="Input size"
          aria-valuetext={`${inputSize}×${inputSize}`}
          min={128}
          max={640}
          step={4}
          value={[inputSize]}
          onValueChange={([v]) => setInputSize(v)}
          className="min-w-32 flex-1"
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
