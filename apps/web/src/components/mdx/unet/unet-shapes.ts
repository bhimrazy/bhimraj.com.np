/**
 * Tensor-shape arithmetic for the UNet in
 * `content/blog/pytorch-unet-image-segmentation-implementation.mdx`.
 *
 * It mirrors the post's PyTorch code rather than the paper:
 * - `DoubleConvBlock`: two `Conv2d(kernel_size=3, padding=p)` layers
 *   (BatchNorm + ReLU keep the shape).
 * - `Encoder`: a `DoubleConvBlock` per level, `MaxPool2d(2)` between levels.
 * - `Decoder`: `ConvTranspose2d(c, c/2, 2, 2)`, `_center_crop` of the matching
 *   encoder feature, `torch.cat(dim=1)`, then a `DoubleConvBlock`.
 * - `UNet.output`: a 1×1 `Conv2d` to `out_channels`.
 */

export type Padding = 0 | 1;

export interface UNetConfig {
  /** `channels` argument of `UNet`, input channels first. */
  channels: readonly number[];
  outChannels: number;
  /** Height and width of the (square) input tensor. */
  inputSize: number;
  padding: Padding;
  batch?: number;
}

/** The configuration the post's code runs (`UNet(channels=[3, 64, 128, 256, 512, 1024], out_channels=1)` on a 572×572 input). */
export const POST_CONFIG = {
  channels: [3, 64, 128, 256, 512, 1024],
  outChannels: 1,
  inputSize: 572,
  padding: 0,
  batch: 1,
} as const satisfies UNetConfig;

export type StageKind =
  | "input"
  | "encoder"
  | "bottleneck"
  | "decoder"
  | "output";

export interface Stage {
  id: string;
  kind: StageKind;
  /** 0 = full resolution, increasing with depth. */
  level: number;
  channels: number;
  size: number;
  /** The PyTorch module that produced this tensor. */
  op: string;
}

export interface SkipConnection {
  level: number;
  from: string;
  to: string;
  /** Spatial size of the encoder feature before `_center_crop`. */
  fromSize: number;
  /** Spatial size after cropping to match the upsampled decoder tensor. */
  cropTo: number;
  /** Channels after `torch.cat([x, encoder_feature], dim=1)`. */
  concatChannels: number;
}

export type UNetShapes =
  | {
      ok: true;
      stages: Stage[];
      skips: SkipConnection[];
      input: Stage;
      output: Stage;
      depth: number;
    }
  | { ok: false; error: string; stages: Stage[] };

const KERNEL = 3;

export function convOut(size: number, padding: number, kernel = KERNEL) {
  return size + 2 * padding - kernel + 1;
}

export function doubleConvOut(size: number, padding: number) {
  return convOut(convOut(size, padding), padding);
}

export function computeUNetShapes(config: UNetConfig): UNetShapes {
  const { channels, outChannels, inputSize, padding } = config;
  const levels = channels.length - 1;
  const stages: Stage[] = [];
  const fail = (error: string): UNetShapes => ({ ok: false, error, stages });

  if (levels < 2) return fail("UNet needs at least two levels of channels.");
  if (!Number.isInteger(inputSize) || inputSize < 1) {
    return fail("Input size must be a positive integer.");
  }

  const input: Stage = {
    id: "input",
    kind: "input",
    level: 0,
    channels: channels[0],
    size: inputSize,
    op: "input",
  };
  stages.push(input);

  // Encoder: DoubleConvBlock(channels[i], channels[i+1]), MaxPool2d between.
  const encoder: Stage[] = [];
  let size = inputSize;
  for (let i = 0; i < levels; i++) {
    if (i > 0) size = Math.floor(size / 2);
    const out = doubleConvOut(size, padding);
    const isBottleneck = i === levels - 1;
    if (out < 1) {
      return fail(
        `Too small: level ${i + 1} gets a ${size}×${size} map, which two 3×3 convolutions without padding shrink to nothing.`,
      );
    }
    size = out;
    const stage: Stage = {
      id: isBottleneck ? "bottleneck" : `enc-${i}`,
      kind: isBottleneck ? "bottleneck" : "encoder",
      level: i,
      channels: channels[i + 1],
      size,
      op: `DoubleConvBlock(${channels[i]}, ${channels[i + 1]})`,
    };
    encoder.push(stage);
    stages.push(stage);
  }

  // Decoder: Decoder(channels[::-1][:-1]).
  const dec = [...channels].reverse().slice(0, -1);
  const skips: SkipConnection[] = [];
  let x = encoder[encoder.length - 1];
  for (let j = 0; j < dec.length - 1; j++) {
    const level = levels - 2 - j;
    const upSize = x.size * 2;
    const upChannels = dec[j + 1];
    const skip = encoder[level];
    if (skip.size < upSize) {
      return fail(
        `Skip at level ${level + 1} is ${skip.size}×${skip.size}, smaller than the ${upSize}×${upSize} upsampled map, so _center_crop can't match it.`,
      );
    }
    const concatChannels = upChannels + skip.channels;
    const out = doubleConvOut(upSize, padding);
    if (out < 1) {
      return fail(`Too small: decoder level ${level + 1} shrinks to nothing.`);
    }
    skips.push({
      level,
      from: skip.id,
      to: `dec-${level}`,
      fromSize: skip.size,
      cropTo: upSize,
      concatChannels,
    });
    x = {
      id: `dec-${level}`,
      kind: "decoder",
      level,
      channels: upChannels,
      size: out,
      op: `ConvTranspose2d(${dec[j]}, ${upChannels}) → cat → DoubleConvBlock(${dec[j]}, ${upChannels})`,
    };
    stages.push(x);
  }

  const output: Stage = {
    id: "output",
    kind: "output",
    level: 0,
    channels: outChannels,
    size: x.size,
    op: `Conv2d(${channels[1]}, ${outChannels}, kernel_size=1)`,
  };
  stages.push(output);

  return { ok: true, stages, skips, input, output, depth: levels };
}

/** `[N, C, H, W]` as PyTorch prints it. */
export function formatShape(
  stage: Pick<Stage, "channels" | "size">,
  batch = 1,
) {
  return `[${batch}, ${stage.channels}, ${stage.size}, ${stage.size}]`;
}
