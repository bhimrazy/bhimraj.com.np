/**
 * Renders the PWA icons in public/ from the brand mark in src/lib/brand.ts.
 * Run from apps/web after changing the mark: `bun scripts/generate-icons.tsx`
 */
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { BRAND_COLORS as C, MARK_CUT, RIDGE_PATH, SUN } from "../src/lib/brand";

type Icon = {
  file: string;
  size: number;
  /** Mark width as a share of the canvas. */
  mark: number;
  /** Corner radius as a share of the canvas; 0 for full bleed. */
  radius: number;
};

const ICONS: Icon[] = [
  { file: "icon-192.png", size: 192, mark: 0.68, radius: 0.22 },
  { file: "icon-512.png", size: 512, mark: 0.68, radius: 0.22 },
  // Full bleed; the mark stays inside the 80% safe circle launchers crop to.
  { file: "icon-maskable-512.png", size: 512, mark: 0.62, radius: 0 },
];

async function render({ file, size, mark, radius }: Icon) {
  const markPx = Math.round(size * mark);
  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.night,
        borderRadius: radius * size,
      }}
    >
      <svg width={markPx} height={markPx} viewBox="0 0 32 32" aria-hidden>
        <path
          d={RIDGE_PATH}
          fill="none"
          stroke={C.cream}
          strokeWidth={MARK_CUT.regular.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={SUN.cx}
          cy={SUN.cy}
          r={MARK_CUT.regular.sunR}
          fill={C.amber}
        />
      </svg>
    </div>,
    { width: size, height: size },
  );
  await writeFile(
    new URL(`../public/${file}`, import.meta.url),
    Buffer.from(await image.arrayBuffer()),
  );
  console.log(`wrote public/${file}`);
}

for (const icon of ICONS) await render(icon);
