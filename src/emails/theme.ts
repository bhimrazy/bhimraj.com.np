import { pixelBasedPreset } from "@react-email/components";

// Warm-dark palette mirrored from globals.css (.dark), exposed as Tailwind
// colors for the email templates. Email clients can't read CSS vars, so the
// <Tailwind> component inlines these hexes into element styles at render time.
// pixelBasedPreset converts rem units to px (many clients don't support rem).
export const emailTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#0f0d0a",
          card: "#17150f",
          border: "#2a2620",
          text: "#f5f0e8",
          muted: "#a09882",
          accent: "#f59e0b",
        },
      },
    },
  },
};
