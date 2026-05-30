import { pixelBasedPreset } from "@react-email/components";

// Light palette mirrored from globals.css (:root), exposed as Tailwind colors
// for the email templates. Light reads reliably across mail clients (dark
// emails get inconsistently auto-inverted). Email clients can't read CSS vars,
// so the <Tailwind> component inlines these hexes at render time, and
// pixelBasedPreset converts rem units to px (many clients don't support rem).
export const emailTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      // Brand fonts as a hint (only Apple/iOS Mail honor them), then a robust
      // system stack — most email clients strip web fonts, so the fallback is
      // what the majority of recipients actually see.
      fontFamily: {
        sans: [
          '"DM Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          '"Space Grotesk"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        warm: {
          page: "#efece8", // outer email background — makes the white card pop
          bg: "#f7f6f4", // subtle inner fill (e.g. quoted message box)
          card: "#ffffff",
          border: "#e7e5e4",
          text: "#1c1917",
          muted: "#57534e",
          accent: "#d97706",
        },
      },
    },
  },
};
