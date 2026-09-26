/**
 * Shared helpers for generated Open Graph / Twitter card images
 * (next/og `ImageResponse`). Kept framework-agnostic-ish so each
 * `opengraph-image.tsx` / `twitter-image.tsx` route can stay a few lines.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

type Font = NonNullable<
  ConstructorParameters<typeof ImageResponse>[1]
>["fonts"] extends (infer F)[] | undefined
  ? F
  : never;

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

// Warm-dark brand tokens (mirrors apps/web/src/app/globals.css `.dark` scope).
const OG_COLORS = {
  bg: "#0f0d0a",
  bgSecondary: "#16140f",
  card: "#17150f",
  border: "#2a2620",
  text: "#f5f0e8",
  textSecondary: "#a09882",
  textTertiary: "#706a58",
  accent: "#f59e0b",
  accentSubtle: "rgba(245, 158, 11, 0.12)",
} as const;

const FONT_FAMILY = "Space Grotesk";
const FONT_DIR = join(process.cwd(), "src/assets/fonts");

let fonts: Promise<Font[]> | undefined;

/**
 * Space Grotesk ships in the repo (OFL — see `assets/fonts/OFL.txt`), so card
 * generation never calls out to Google Fonts: no request-time network, no
 * glyph subsetting (which dropped CSS-uppercased letters), and the images can
 * prerender at build. Read once per server process.
 */
function loadFonts(): Promise<Font[]> {
  fonts ??= Promise.all(
    (
      [
        [500, "SpaceGrotesk-Medium.ttf"],
        [700, "SpaceGrotesk-Bold.ttf"],
      ] as const
    ).map(async ([weight, file]) => ({
      name: FONT_FAMILY,
      data: await readFile(join(FONT_DIR, file)),
      weight,
      style: "normal" as const,
    })),
  );
  return fonts;
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  meta?: string;
  tags?: string[];
};

/**
 * Renders the branded card; every `opengraph-image.tsx` route calls this.
 * The PNG bytes are cached (a `Response` can't cross a `"use cache"`
 * boundary), which lets Cache Components prerender the image at build.
 */
export async function renderOgImage(props: OgCardProps) {
  return new Response(await renderOgPng(props), {
    headers: { "Content-Type": OG_CONTENT_TYPE },
  });
}

async function renderOgPng(
  props: OgCardProps,
): Promise<Uint8Array<ArrayBuffer>> {
  "use cache";
  const image = new ImageResponse(<OgCard {...props} />, {
    ...OG_SIZE,
    fonts: await loadFonts(),
  });
  return new Uint8Array(await image.arrayBuffer());
}

/**
 * The shared visual template for every generated OG/Twitter card: warm-dark
 * background, amber accent, eyebrow label, title, optional meta line (e.g.
 * reading time) and tags, plus the "bhimraj." wordmark.
 */
function OgCard({ eyebrow, title, meta, tags }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        backgroundColor: OG_COLORS.bg,
        backgroundImage: `radial-gradient(circle at 82% 8%, ${OG_COLORS.accentSubtle} 0%, rgba(0,0,0,0) 55%)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: OG_COLORS.accent,
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: OG_COLORS.accent,
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Title + meta */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 1000,
        }}
      >
        <span
          style={{
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.15,
            color: OG_COLORS.text,
          }}
        >
          {title}
        </span>
        {(meta || (tags && tags.length > 0)) && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {meta && (
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: OG_COLORS.textSecondary,
                }}
              >
                {meta}
              </span>
            )}
            {meta && tags && tags.length > 0 && (
              <span style={{ fontSize: 24, color: OG_COLORS.textTertiary }}>
                ·
              </span>
            )}
            {tags && tags.length > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      padding: "6px 14px",
                      borderRadius: 8,
                      color: OG_COLORS.accent,
                      backgroundColor: OG_COLORS.accentSubtle,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${OG_COLORS.border}`,
          paddingTop: 28,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, color: OG_COLORS.text }}>
          bhimraj<span style={{ color: OG_COLORS.accent }}>.</span>
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: OG_COLORS.textTertiary,
          }}
        >
          bhimraj.com.np
        </span>
      </div>
    </div>
  );
}
