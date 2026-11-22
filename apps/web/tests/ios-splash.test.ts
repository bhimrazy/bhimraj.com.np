import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  splashDevices,
  splashFile,
  splashPixels,
  startupImages,
} from "@/lib/ios-splash";

describe("iOS startup images", () => {
  it("sizes landscape images wider than tall", () => {
    const ipad = { w: 820, h: 1180, dpr: 2, orientation: "landscape" } as const;
    expect(splashPixels(ipad)).toEqual({ width: 2360, height: 1640 });
    expect(splashFile("dark", ipad)).toBe("dark-2360x1640.png");
  });

  it("gives each device and scheme its own file", () => {
    const urls = startupImages.map((image) => image.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toHaveLength(splashDevices.length * 2);
  });

  it("targets one device, orientation and scheme per media query", () => {
    expect(startupImages).toContainEqual({
      url: "/splash/light-1170x2532.png",
      media:
        "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait) and (prefers-color-scheme: light)",
    });
  });

  it("has a generated PNG for every link", () => {
    for (const { url } of startupImages) {
      expect(existsSync(new URL(`../public${url}`, import.meta.url))).toBe(
        true,
      );
    }
  });
});
