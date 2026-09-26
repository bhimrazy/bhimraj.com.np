import { describe, expect, it } from "vitest";
import {
  computeUNetShapes,
  formatShape,
  POST_CONFIG,
  type UNetConfig,
} from "@/components/mdx/unet/unet-shapes";

function shapes(config: UNetConfig = POST_CONFIG) {
  const result = computeUNetShapes(config);
  if (!result.ok) throw new Error(result.error ?? "invalid");
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
    expect(skips.map((s) => (s.fromSize ?? 0) - (s.cropTo ?? 0))).toEqual([
      1, 2, 5, 10,
    ]);
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
    expect(result.error).toMatch(/Too small/);
  });
});

describe("computeUNetShapes with an input that's too small", () => {
  const sizes = (inputSize: number) => {
    const r = computeUNetShapes({ ...POST_CONFIG, inputSize });
    return {
      r,
      bySize: Object.fromEntries(r.stages.map((s) => [s.id, s.size])),
      crops: r.skips.map((k) => [k.fromSize, k.cropTo]),
    };
  };

  it("fails at the bottleneck for 128 and keeps the true encoder sizes", () => {
    const { r, bySize, crops } = sizes(128);
    expect(r.ok).toBe(false);
    expect(r.failedAt).toBe("bottleneck");
    expect(r.error).toMatch(/bottleneck gets a 4×4 map/);
    // 128 → 124; 62 → 58; 29 → 25; 12 → 8; then 4 → nothing.
    expect(bySize).toEqual({
      input: 128,
      "enc-0": 124,
      "enc-1": 58,
      "enc-2": 25,
      "enc-3": 8,
      bottleneck: null,
      "dec-3": null,
      "dec-2": null,
      "dec-1": null,
      "dec-0": null,
      output: null,
    });
    // Skips keep the encoder size but have nothing to crop to.
    expect(crops).toEqual([
      [8, null],
      [25, null],
      [58, null],
      [124, null],
    ]);
    expect(formatShape(r.output)).toBe("[1, 1, —, —]");
  });

  it("fails partway up the decoder for 180", () => {
    const { r, bySize, crops } = sizes(180);
    expect(r.failedAt).toBe("dec-2");
    // 176, 84, 38, 15, bottleneck 3; up 6 → 2; up 4 → nothing.
    expect(bySize.bottleneck).toBe(3);
    expect(bySize["dec-3"]).toBe(2);
    expect(bySize["dec-2"]).toBeNull();
    expect(bySize["dec-1"]).toBeNull();
    expect(bySize.output).toBeNull();
    expect(crops).toEqual([
      [15, 6],
      [38, 4],
      [84, null],
      [176, null],
    ]);
  });

  it("treats 188 as the smallest valid input without padding", () => {
    expect(sizes(187).r.ok).toBe(false);
    const { r } = sizes(188);
    expect(r.ok).toBe(true);
    expect(r.failedAt).toBeNull();
    expect(r.output.size).toBe(4);
  });

  it("rejects a non-positive input at the input stage", () => {
    const { r } = sizes(0);
    expect(r.failedAt).toBe("input");
    expect(r.stages.every((s) => s.size === null)).toBe(true);
  });
});
