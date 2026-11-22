import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { BRAND_COLORS as C, MARK_CUT, RIDGE_PATH, SUN } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Past this, a title would run to a third line at full size. */
const LONG_TITLE = 45;

const fontsDir = join(process.cwd(), "src/assets/fonts");

const THEMES = {
  dark: {
    bg: C.night,
    ink: C.cream,
    muted: C.creamMuted,
    kicker: C.amber,
    sun: C.amber,
    glow: "rgba(245, 158, 11, 0.26)",
    hillBack: C.nightCard,
    hillFront: C.nightLine,
  },
  light: {
    bg: C.paper,
    ink: C.ink,
    muted: C.inkMuted,
    kicker: C.amberTextOnLight,
    sun: C.amberOnLight,
    glow: "rgba(217, 119, 6, 0.2)",
    hillBack: "#f0eeec",
    hillFront: "#e7e5e4",
  },
} as const;

type OgCard = {
  kicker: string;
  title: string;
  footLeft: string;
  footRight?: string;
  theme?: keyof typeof THEMES;
};

/**
 * The 1200×630 card for every page: lockup top left, one bold title, the URL
 * bottom left, an amber glow for the sun and the site's ridgeline below.
 */
async function renderCard({
  kicker,
  title,
  footLeft,
  footRight,
  theme = "dark",
}: OgCard) {
  const t = THEMES[theme];
  const long = title.length > LONG_TITLE;
  const [display, mono] = await Promise.all([
    readFile(join(fontsDir, "SpaceGrotesk-Bold.ttf")),
    readFile(join(fontsDir, "JetBrainsMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: t.bg,
        backgroundImage: `radial-gradient(circle at 86% -8%, ${t.glow}, transparent 42%)`,
        color: t.ink,
        fontFamily: "Space Grotesk",
      }}
    >
      <svg
        width="1200"
        height="252"
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ position: "absolute", left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="m">
            <rect width="600" height="200" fill="url(#fade)" />
          </mask>
        </defs>
        <g mask="url(#m)">
          <path
            d="M0 128 L55 104 L100 116 L165 66 L210 94 L262 50 L304 82 L352 38 L398 78 L446 58 L500 92 L552 72 L600 96 V200 H0 Z"
            fill={t.hillBack}
          />
          <path
            d="M0 156 L70 128 L136 148 L208 112 L276 142 L338 118 L414 148 L486 122 L600 142 V200 H0 Z"
            fill={t.hillFront}
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          top: 44,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <svg width="54" height="54" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d={RIDGE_PATH}
            fill="none"
            stroke={t.ink}
            strokeWidth={MARK_CUT.regular.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={SUN.cx}
            cy={SUN.cy}
            r={MARK_CUT.regular.sunR}
            fill={t.sun}
          />
        </svg>
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 38 }}>
          bhimraj
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: t.sun,
              marginLeft: 3,
              marginBottom: 11,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 182,
          left: 72,
          right: long ? 120 : 216,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 23,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: t.kicker,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontSize: long ? 59 : 77,
            lineHeight: long ? 1.08 : 1.04,
            letterSpacing: long ? -1.8 : -2.6,
            // Satori's balance leaves double gaps in three-line titles.
            textWrap: long ? "wrap" : "balance",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 44,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "JetBrains Mono",
          fontSize: 24,
        }}
      >
        <span>{footLeft}</span>
        {footRight && <span style={{ color: t.muted }}>{footRight}</span>}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}

/** Rendered once per card and kept until the next deploy. */
async function cardPng(card: OgCard): Promise<Uint8Array> {
  "use cache";
  cacheLife("max");
  const image = await renderCard(card);
  return new Uint8Array(await image.arrayBuffer());
}

export async function ogImage(card: OgCard): Promise<Response> {
  const png = await cardPng(card);
  return new Response(new Blob([png as Uint8Array<ArrayBuffer>]), {
    headers: {
      "Content-Type": OG_CONTENT_TYPE,
      // Card URLs carry a route hash, not a content hash, so stay revalidatable.
      "Cache-Control":
        "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
