import {
  computeUNetShapes,
  formatShape,
  POST_CONFIG,
  type Stage,
} from "./unet-shapes";
import { UNetSvg } from "./unet-svg";

const shapes = computeUNetShapes(POST_CONFIG);

function find(id: string): Stage | undefined {
  return shapes.stages.find((s) => s.id === id);
}

/**
 * A small static UNet with some feature maps lit, e.g.
 * `<UNetTrace at="enc-3 bottleneck dec-3" />`. Shapes come from the post's
 * configuration (572×572 input, unpadded convolutions).
 */
export function UNetTrace({ at }: { at: string }) {
  if (!shapes.ok) return null;
  const ids = at.split(/\s+/).filter(Boolean);
  const lit = ids
    .map(find)
    .filter((s): s is Stage => Boolean(s))
    .map((s) => `${s.id} ${formatShape(s)}`)
    .join(", ");
  return (
    <UNetSvg
      shapes={shapes}
      highlight={new Set(ids)}
      compact
      title={`UNet with ${lit} highlighted`}
    />
  );
}

/** The `[N, C, H, W]` shape of a stage in the post's UNet, e.g. `<Shape of="enc-0" />`. */
export function Shape({ of }: { of: string }) {
  const stage = find(of);
  return <code>{stage ? formatShape(stage) : "?"}</code>;
}
