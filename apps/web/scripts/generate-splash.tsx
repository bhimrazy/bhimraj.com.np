/**
 * Renders the iOS startup images in public/splash: the header lockup a little
 * above centre and a byline near the bottom, per device and OS scheme.
 * Run from apps/web after changing the mark or the device list in
 * src/lib/ios-splash.ts: `bun scripts/generate-splash.tsx`
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { BRAND_COLORS as C, MARK_CUT, RIDGE_PATH, SUN } from "../src/lib/brand";
import {
  type SplashTheme,
  splashDevices,
  splashFile,
  splashPixels,
  splashThemes,
} from "../src/lib/ios-splash";

const PALETTE: Record<
  SplashTheme,
  { bg: string; text: string; muted: string; sun: string }
> = {
  dark: { bg: C.night, text: C.cream, muted: C.creamMuted, sun: C.amber },
  light: { bg: C.paper, text: C.ink, muted: C.inkMuted, sun: C.amberOnLight },
};

const outDir = new URL("../public/splash/", import.meta.url);
const font = (file: string) =>
  readFile(new URL(`../src/assets/fonts/${file}`, import.meta.url));
// The OG cards' fonts: the header's Space Grotesk (bold standing in for its
// semibold) and JetBrains Mono, the site's face for meta lines.
const [display, mono] = await Promise.all([
  font("SpaceGrotesk-Bold.ttf"),
  font("JetBrainsMono-Regular.ttf"),
]);

/**
 * Lengths are points for a 390pt-wide phone; `s` scales them up on larger
 * screens and `dpr` turns points into the PNG's pixels.
 */
function Splash({
  theme,
  width,
  height,
  s,
}: {
  theme: SplashTheme;
  width: number;
  height: number;
  s: number;
}) {
  const p = PALETTE[theme];
  const text = 34 * s;
  const mark = 48 * s;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        position: "relative",
        backgroundColor: p.bg,
        color: p.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          // Centre of the lockup at 44% of the height.
          top: height * 0.44 - mark / 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12 * s,
        }}
      >
        <svg width={mark} height={mark} viewBox="0 0 32 32" aria-hidden>
          <path
            d={RIDGE_PATH}
            fill="none"
            stroke={p.text}
            strokeWidth={MARK_CUT.regular.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={SUN.cx}
            cy={SUN.cy}
            r={MARK_CUT.regular.sunR}
            fill={p.sun}
          />
        </svg>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontFamily: "Space Grotesk",
            fontSize: text,
            letterSpacing: "-0.025em",
          }}
        >
          bhimraj
          <div
            style={{
              width: text * 0.26,
              height: text * 0.26,
              borderRadius: 999,
              backgroundColor: p.sun,
              marginLeft: text * 0.07,
              marginBottom: text * 0.29,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 58 * s,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8 * s,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 12 * s,
            color: p.muted,
          }}
        >
          Designed and built by
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 12 * s,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.78,
          }}
        >
          Bhimraj Yadav
        </div>
      </div>
    </div>
  );
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

let bytes = 0;
for (const theme of splashThemes) {
  for (const d of splashDevices) {
    const { width, height } = splashPixels(d);
    const [w, h] = [width / d.dpr, height / d.dpr];
    const s = Math.min(1.5, Math.max(1, Math.min(w, h) / 390));
    // Laid out in pixels, so every length is scaled by the pixel ratio.
    const image = new ImageResponse(
      <Splash theme={theme} width={width} height={height} s={s * d.dpr} />,
      {
        width,
        height,
        fonts: [
          {
            name: "Space Grotesk",
            data: display,
            weight: 700,
            style: "normal",
          },
          { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
        ],
      },
    );
    const png = Buffer.from(await image.arrayBuffer());
    bytes += png.length;
    await writeFile(new URL(splashFile(theme, d), outDir), png);
  }
}
const count = splashThemes.length * splashDevices.length;
console.log(
  `wrote ${count} images to public/splash (${Math.round(bytes / 1024)} KB)`,
);
