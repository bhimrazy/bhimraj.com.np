import { describe, expect, it } from "vitest";
import {
  computeUNetShapes,
  formatShape,
  POST_CONFIG,
  type UNetConfig,
} from "@/components/mdx/unet/unet-shapes";

function shapes(config: UNetConfig = POST_CONFIG) {
  const result = computeUNetShapes(config);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe("computeUNetShapes", () => {
  it("reproduces the post's printed output shape for a 572×572 input", () => {
    const { output } = shapes();
    expect(formatShape(output)).toBe("[1, 1, 388, 388]");
  });

  it("matches the paper's feature-map sizes with unpadded convolutions", () => {
    const { stages } = shapes();
    const bySize = Object.fromEntries(stages.map((s) => [s.id, s.size]));
    expect(bySize).toEqual({
      input: 572,
      "enc-0": 568,
      "enc-1": 280,
      "enc-2": 136,
      "enc-3": 64,
      bottleneck: 28,
      "dec-3": 52,
      "dec-2": 100,
      "dec-1": 196,
      "dec-0": 388,
      output: 388,
    });
  });

  it("doubles channels on the way down and halves them on the way up", () => {
    const { stages } = shapes();
    const ch = Object.fromEntries(stages.map((s) => [s.id, s.channels]));
    expect([ch["enc-0"], ch["enc-1"], ch["enc-2"], ch["enc-3"]]).toEqual([
      64, 128, 256, 512,
    ]);
    expect(ch.bottleneck).toBe(1024);
    expect([ch["dec-3"], ch["dec-2"], ch["dec-1"], ch["dec-0"]]).toEqual([
      512, 256, 128, 64,
    ]);
  });

  it("center-crops each skip connection to the upsampled size", () => {
    const { skips } = shapes();
    expect(skips.map((s) => [s.fromSize, s.cropTo, s.concatChannels])).toEqual([
      [64, 56, 1024],
      [136, 104, 512],
      [280, 200, 256],
      [568, 392, 128],
    ]);
  });

  it("keeps the spatial size with padding=1 when the input divides evenly", () => {
    const { output, skips } = shapes({
      ...POST_CONFIG,
      padding: 1,
      inputSize: 256,
    });
    expect(output.size).toBe(256);
    expect(skips.every((s) => s.fromSize === s.cropTo)).toBe(true);
  });

  it("floors odd sizes in MaxPool2d and crops the leftover pixels", () => {
    const { output, skips } = shapes({
      ...POST_CONFIG,
      padding: 1,
      inputSize: 250,
    });
    // 250 → 125 → 62 → 31 → 15, then back up 30 → 60 → 120 → 240.
    expect(output.size).toBe(240);
    expect(skips.map((s) => s.fromSize - s.cropTo)).toEqual([1, 2, 5, 10]);
  });

  it("follows a shorter channels list", () => {
    const { output, depth } = shapes({
      ...POST_CONFIG,
      channels: [3, 64, 128, 256, 512],
    });
    expect(depth).toBe(4);
    expect(output.size).toBe(484);
  });

  it("reports inputs that are too small instead of returning bad shapes", () => {
    const result = computeUNetShapes({ ...POST_CONFIG, inputSize: 64 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/Too small/);
  });
});
