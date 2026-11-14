/**
 * Ridge-and-sun mark geometry (32×32 grid), shared by the header, the
 * favicon and the generated OG cards. The small cut is for ≤20px, where the
 * regular stroke and sun go thin.
 */
export const RIDGE_PATH = "M3 25L9 17L13 21L19 10L27 25";
export const SUN = { cx: 25, cy: 7.5 } as const;
export const MARK_CUT = {
  regular: { stroke: 3, sunR: 3 },
  small: { stroke: 3.6, sunR: 3.5 },
} as const;

/** Literal theme colours, for places CSS tokens can't reach (icons, OG). */
export const BRAND_COLORS = {
  night: "#0f0d0a",
  nightCard: "#1f1c16",
  nightLine: "#2a2620",
  cream: "#f5f0e8",
  creamMuted: "#a09882",
  paper: "#fafaf9",
  ink: "#1c1917",
  inkMuted: "#57534e",
  amber: "#f59e0b",
  amberOnLight: "#d97706",
  amberTextOnLight: "#b45309",
} as const;
