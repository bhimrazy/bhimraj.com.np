/**
 * Shared helpers for dynamic Open Graph / Twitter card image generation
 * (next/og `ImageResponse`). Kept framework-agnostic-ish so each
 * `opengraph-image.tsx` / `twitter-image.tsx` route can stay a few lines.
 */

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

const FONT_CACHE = new Map<string, ArrayBuffer | null>();

/**
 * Loads a Google Font's raw glyph data for use in `ImageResponse`, subset to
 * only the characters that will actually be rendered. Falls back to `null`
 * (letting `ImageResponse` use its default sans-serif) if the fetch fails —
 * dynamic OG generation must never hard-fail a page render.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  const cacheKey = `${family}-${weight}-${text}`;
  if (FONT_CACHE.has(cacheKey)) {
    return FONT_CACHE.get(cacheKey) ?? null;
  }

  try {
    // NOTE: `family` uses Google Fonts' own "+"-for-space syntax (e.g.
    // "Space+Grotesk") and must NOT be percent-encoded — encoding the "+"
    // breaks the family selector and the API 400s.
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const cssResponse = await fetch(cssUrl, {
      signal: AbortSignal.timeout(4000),
    });
    const css = await cssResponse.text();
    const match = css.match(
      /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
    );
    if (!match?.[1]) throw new Error(`no font source found for ${family}`);

    const fontResponse = await fetch(match[1], {
      signal: AbortSignal.timeout(4000),
    });
    if (!fontResponse.ok) throw new Error(`font fetch failed for ${family}`);

    const buffer = await fontResponse.arrayBuffer();
    FONT_CACHE.set(cacheKey, buffer);
    return buffer;
  } catch {
    FONT_CACHE.set(cacheKey, null);
    return null;
  }
}

/** Loads Space Grotesk (the site's display font) for the given text content. */
export function loadDisplayFont(text: string, weight: 500 | 700 = 700) {
  return loadGoogleFont("Space+Grotesk", weight, text);
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  meta?: string;
  tags?: string[];
  fontFamily: string;
};

/**
 * The shared visual template for every generated OG/Twitter card: warm-dark
 * background, amber accent, eyebrow label, title, optional meta line (e.g.
 * reading time) and tags, plus the "bhimraj." wordmark.
 */
export function OgCard({
  eyebrow,
  title,
  meta,
  tags,
  fontFamily,
}: OgCardProps) {
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
        fontFamily,
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
              <span style={{ fontSize: 24, color: OG_COLORS.textSecondary }}>
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
        <span style={{ fontSize: 20, color: OG_COLORS.textTertiary }}>
          bhimraj.com.np
        </span>
      </div>
    </div>
  );
}
