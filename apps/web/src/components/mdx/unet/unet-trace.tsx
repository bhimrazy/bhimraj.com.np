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

function shortName(stage: Stage) {
  if (stage.kind === "encoder") return `enc ${stage.level + 1}`;
  if (stage.kind === "decoder") return `dec ${stage.level + 1}`;
  return stage.kind;
}

/**
 * A small static UNet with some feature maps lit, e.g.
 * `<UNetTrace at="enc-3 bottleneck dec-3" />`, and their shapes listed
 * underneath. Shapes come from the post's configuration (572×572 input,
 * unpadded convolutions).
 */
export function UNetTrace({ at }: { at: string }) {
  if (!shapes.ok) return null;
  const ids = new Set(at.split(/\s+/).filter(Boolean));
  const lit = shapes.stages.filter((s) => ids.has(s.id));
  const skips = shapes.skips.filter((k) => ids.has(k.from) && ids.has(k.to));
  const title = `UNet with ${lit.map((s) => `${shortName(s)} ${formatShape(s)}`).join(", ")} highlighted`;

  return (
    <div>
      <UNetSvg shapes={shapes} highlight={ids} compact title={title} />
      <ul className="mt-3 space-y-0.5 font-mono text-[11px] text-site-text-tertiary">
        {lit.map((s) => (
          <li key={s.id} className="flex justify-between gap-3">
            <span>{shortName(s)}</span>
            <span className="text-site-text-secondary tabular-nums">
              {formatShape(s)}
            </span>
          </li>
        ))}
        {skips.map((k) => (
          <li key={k.to} className="flex justify-between gap-3">
            <span>skip</span>
            <span className="text-site-accent tabular-nums">
              crop {k.fromSize}→{k.cropTo}, cat → {k.concatChannels} ch
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The `[N, C, H, W]` shape of a stage in the post's UNet, e.g. `<Shape of="enc-0" />`. */
export function Shape({ of }: { of: string }) {
  const stage = find(of);
  return <code>{stage ? formatShape(stage) : "?"}</code>;
}
