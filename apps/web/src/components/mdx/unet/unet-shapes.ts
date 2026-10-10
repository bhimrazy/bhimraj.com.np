/**
 * Shape arithmetic mirroring the UNet post's PyTorch code (not the paper):
 * two 3×3 convs per level, MaxPool2d(2) down, ConvTranspose2d(2, 2) up,
 * center-crop + concat on skips, 1×1 conv out.
 * Too-small inputs set `failedAt`; that stage and later ones get `size: null`.
 */

export type Padding = 0 | 1;

export interface UNetConfig {
  /** `channels` argument of `UNet`, input channels first. */
  channels: readonly number[];
  outChannels: number;
  /** Height and width of the (square) input tensor. */
  inputSize: number;
  padding: Padding;
}

/** What the post runs: 572×572 input, channels [3…1024], 1 output channel. */
export const POST_CONFIG = {
  channels: [3, 64, 128, 256, 512, 1024],
  outChannels: 1,
  inputSize: 572,
  padding: 0,
} as const satisfies UNetConfig;

type StageKind = "input" | "encoder" | "bottleneck" | "decoder" | "output";

export interface Stage {
  id: string;
  kind: StageKind;
  /** 0 = full resolution, increasing with depth. */
  level: number;
  channels: number;
  /** Height/width, or `null` when it can't be computed. */
  size: number | null;
  /** The PyTorch module that produces this tensor. */
  op: string;
}

interface SkipConnection {
  level: number;
  from: string;
  to: string;
  /** Spatial size of the encoder feature before `_center_crop`. */
  fromSize: number | null;
  /** Size after cropping to the upsampled decoder tensor (`null` if unknown). */
  cropTo: number | null;
  /** Channels after `torch.cat([x, encoder_feature], dim=1)`. */
  concatChannels: number;
}

export interface UNetShapes {
  ok: boolean;
  /** Why the shapes can't be computed, when `ok` is false. */
  error: string | null;
  /** Id of the first stage that can't be computed. */
  failedAt: string | null;
  depth: number;
  stages: Stage[];
  skips: SkipConnection[];
  input: Stage;
  output: Stage;
}

const KERNEL = 3;

function convOut(size: number, padding: number) {
  return size + 2 * padding - KERNEL + 1;
}

function doubleConvOut(size: number, padding: number) {
  return convOut(convOut(size, padding), padding);
}

export function computeUNetShapes(config: UNetConfig): UNetShapes {
  const { channels, outChannels, inputSize, padding } = config;
  const depth = channels.length - 1;
  if (depth < 2) throw new Error("UNet needs at least two levels of channels.");

  let error: string | null = null;
  let failedAt: string | null = null;
  const fail = (id: string, message: string) => {
    if (failedAt) return;
    failedAt = id;
    error = message;
  };
  const known = () => failedAt === null;

  const inputValid = Number.isInteger(inputSize) && inputSize >= 1;
  const input: Stage = {
    id: "input",
    kind: "input",
    level: 0,
    channels: channels[0],
    size: inputValid ? inputSize : null,
    op: "input",
  };
  if (!inputValid) fail("input", "Input size must be a positive integer.");
  const stages: Stage[] = [input];

  // Encoder: DoubleConvBlock(channels[i], channels[i+1]), MaxPool2d between.
  const encoder: Stage[] = [];
  let size = inputSize;
  for (let i = 0; i < depth; i++) {
    const bottleneck = i === depth - 1;
    const id = bottleneck ? "bottleneck" : `enc-${i}`;
    let out: number | null = null;
    if (known()) {
      const pooled = i > 0 ? Math.floor(size / 2) : size;
      const next = doubleConvOut(pooled, padding);
      if (next < 1) {
        fail(
          id,
          `Too small: ${bottleneck ? "the bottleneck" : `encoder level ${i + 1}`} gets a ${pooled}×${pooled} map, and two 3×3 convolutions${padding ? "" : " without padding"} shrink it to nothing.`,
        );
      } else {
        out = next;
        size = next;
      }
    }
    const stage: Stage = {
      id,
      kind: bottleneck ? "bottleneck" : "encoder",
      level: i,
      channels: channels[i + 1],
      size: out,
      op: `DoubleConvBlock(${channels[i]}, ${channels[i + 1]})`,
    };
    encoder.push(stage);
    stages.push(stage);
  }

  // Decoder: Decoder(channels[::-1][:-1]).
  const dec = [...channels].reverse().slice(0, -1);
  const skips: SkipConnection[] = [];
  let x: number | null = encoder[encoder.length - 1].size;
  for (let j = 0; j < dec.length - 1; j++) {
    const level = depth - 2 - j;
    const id = `dec-${level}`;
    const upChannels = dec[j + 1];
    const skip = encoder[level];
    const upSize = x === null ? null : x * 2;
    let out: number | null = null;
    // A skip is never smaller than the upsampled map; only the convs can fail.
    if (known() && upSize !== null && skip.size !== null) {
      const next = doubleConvOut(upSize, padding);
      if (next < 1) {
        fail(
          id,
          `Too small: decoder level ${level + 1} upsamples to ${upSize}×${upSize}, and two 3×3 convolutions${padding ? "" : " without padding"} shrink it to nothing.`,
        );
      } else {
        out = next;
      }
    }
    skips.push({
      level,
      from: skip.id,
      to: id,
      fromSize: skip.size,
      cropTo:
        upSize !== null && skip.size !== null && skip.size >= upSize
          ? upSize
          : null,
      concatChannels: upChannels + skip.channels,
    });
    stages.push({
      id,
      kind: "decoder",
      level,
      channels: upChannels,
      size: out,
      op: `ConvTranspose2d(${dec[j]}, ${upChannels}) → cat → DoubleConvBlock(${dec[j]}, ${upChannels})`,
    });
    x = out;
  }

  const output: Stage = {
    id: "output",
    kind: "output",
    level: 0,
    channels: outChannels,
    size: x,
    op: `Conv2d(${channels[1]}, ${outChannels}, kernel_size=1)`,
  };
  stages.push(output);

  return {
    ok: failedAt === null,
    error,
    failedAt,
    depth,
    stages,
    skips,
    input,
    output,
  };
}

/** `[N, C, H, W]` as PyTorch prints it; unknown sizes print as "—". */
export function formatShape(
  stage: Pick<Stage, "channels" | "size">,
  batch = 1,
) {
  const s = stage.size ?? "—";
  return `[${batch}, ${stage.channels}, ${s}, ${s}]`;
}
