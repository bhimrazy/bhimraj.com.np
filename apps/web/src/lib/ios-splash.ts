// iOS shows a startup image only when one matches the exact screen size and
// orientation, so each current device needs its own file.
// scripts/generate-splash.tsx renders them to public/splash; layout.tsx links
// them. `w` x `h` are portrait CSS points (iOS's device-width/-height).

type SplashOrientation = "portrait" | "landscape";
export type SplashDevice = {
  w: number;
  h: number;
  dpr: 2 | 3;
  orientation: SplashOrientation;
};
export type SplashTheme = "dark" | "light";

// iOS picks by the OS scheme, not the site's stored choice.
export const splashThemes: readonly SplashTheme[] = ["dark", "light"];

// Portrait only: a home-screen launch on a phone is almost always upright.
const iphones: [number, number, 2 | 3][] = [
  [440, 956, 3], // 16 and 17 Pro Max
  [420, 912, 3], // Air
  [402, 874, 3], // 16 Pro, 17 and 17 Pro
  [430, 932, 3], // 14 and 15 Pro Max, 15 and 16 Plus
  [393, 852, 3], // 15, 16, 14 and 15 Pro
  [428, 926, 3], // 12 and 13 Pro Max, 14 Plus
  [390, 844, 3], // 12 to 14, 16e
  [375, 812, 3], // X, XS, 11 Pro, 12 and 13 mini
  [414, 896, 3], // XS Max, 11 Pro Max
  [414, 896, 2], // XR, 11
  [375, 667, 2], // SE 2 and 3, 8
];

// All 2x, in both orientations since iPads are often held sideways.
const ipads: [number, number][] = [
  [1032, 1376], // Pro 13-inch (M4 and later)
  [1024, 1366], // Pro 12.9-inch, Air 13-inch
  [834, 1210], // Pro 11-inch (M4 and later)
  [834, 1194], // Pro 11-inch, Air 11-inch
  [820, 1180], // Air 10.9-inch, iPad 10th generation and later
  [810, 1080], // iPad 10.2-inch
  [744, 1133], // mini 6th generation and later
];

export const splashDevices: readonly SplashDevice[] = [
  ...iphones.map(
    ([w, h, dpr]): SplashDevice => ({ w, h, dpr, orientation: "portrait" }),
  ),
  ...ipads.flatMap(([w, h]) =>
    (["portrait", "landscape"] as const).map(
      (orientation): SplashDevice => ({ w, h, dpr: 2, orientation }),
    ),
  ),
];

/** The PNG's pixel size as displayed (wider than tall in landscape). */
export function splashPixels(d: SplashDevice) {
  const short = d.w * d.dpr;
  const long = d.h * d.dpr;
  return d.orientation === "portrait"
    ? { width: short, height: long }
    : { width: long, height: short };
}

export function splashFile(theme: SplashTheme, d: SplashDevice) {
  const { width, height } = splashPixels(d);
  return `${theme}-${width}x${height}.png`;
}

/** Entries for Next's `appleWebApp.startupImage`. */
export const startupImages = splashThemes.flatMap((theme) =>
  splashDevices.map((d) => ({
    url: `/splash/${splashFile(theme, d)}`,
    media: [
      `(device-width: ${d.w}px)`,
      `(device-height: ${d.h}px)`,
      `(-webkit-device-pixel-ratio: ${d.dpr})`,
      `(orientation: ${d.orientation})`,
      `(prefers-color-scheme: ${theme})`,
    ].join(" and "),
  })),
);
