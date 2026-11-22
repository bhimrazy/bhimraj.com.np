import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

type Strategy = "page" | "immutable" | "static" | null;
type Sw = {
  strategyFor: (req: {
    url: string;
    method: string;
    mode: string;
    origin: string;
    headers: { rsc: string | null };
  }) => Strategy;
  staleCaches: (names: string[]) => string[];
  CACHES: Record<string, string>;
};

// public/sw.js is a plain script; run it with a stub `self` and read its
// top-level helpers off the context.
function loadSw(): Sw {
  const source = readFileSync(
    new URL("../public/sw.js", import.meta.url),
    "utf8",
  );
  const context: Record<string, unknown> = {
    URL,
    self: { addEventListener: () => {}, location: { origin: ORIGIN } },
  };
  runInNewContext(`${source}\nthis.CACHES = CACHES;`, context);
  return context as unknown as Sw;
}

const ORIGIN = "https://bhimraj.com.np";
const sw = loadSw();

const get = (path: string, init: { mode?: string; rsc?: string } = {}) =>
  sw.strategyFor({
    url: path.startsWith("http") ? path : `${ORIGIN}${path}`,
    method: "GET",
    mode: init.mode ?? "no-cors",
    origin: ORIGIN,
    headers: { rsc: init.rsc ?? null },
  });

describe("service worker routing", () => {
  it("sends page loads network-first", () => {
    expect(get("/blog/some-post", { mode: "navigate" })).toBe("page");
    expect(get("/resources?tag=llms", { mode: "navigate" })).toBe("page");
  });

  it("serves hashed build output cache-first", () => {
    expect(get("/_next/static/chunks/app-abc123.js")).toBe("immutable");
    expect(get("/_next/static/media/font.woff2")).toBe("immutable");
  });

  it("revalidates public images and icons", () => {
    expect(get("/blog/unet/cover.webp")).toBe("static");
    expect(get("/icon-192.png")).toBe("static");
  });

  it("never touches cross-origin requests", () => {
    for (const url of [
      "https://www.youtube-nocookie.com/embed/abc",
      "https://i.ytimg.com/vi/abc/hqdefault.jpg",
      "https://giscus.app/client.js",
      "https://us.i.posthog.com/e/",
      "https://www.googletagmanager.com/gtag/js",
    ]) {
      expect(get(url)).toBeNull();
      expect(get(url, { mode: "navigate" })).toBeNull();
    }
  });

  it("leaves APIs, RSC payloads, writes and the worker itself alone", () => {
    expect(get("/api/subscribe")).toBeNull();
    expect(get("/api/feedback", { mode: "navigate" })).toBeNull();
    expect(get("/blog", { rsc: "1" })).toBeNull();
    expect(get("/blog?_rsc=x1y2")).toBeNull();
    expect(get("/sw.js")).toBeNull();
    expect(get("/feed.xml")).toBeNull();
    expect(get("/blog/post/opengraph-image")).toBeNull();
    expect(
      sw.strategyFor({
        url: `${ORIGIN}/api/feedback`,
        method: "POST",
        mode: "cors",
        origin: ORIGIN,
        headers: { rsc: null },
      }),
    ).toBeNull();
  });
});

describe("cache cleanup", () => {
  it("drops only our caches from other versions", () => {
    const current = Object.values(sw.CACHES);
    const names = [
      ...current,
      "bhimraj-static-v0",
      "bhimraj-pages-v0",
      "some-other-cache",
    ];
    expect(sw.staleCaches(names)).toEqual([
      "bhimraj-static-v0",
      "bhimraj-pages-v0",
    ]);
  });

  it("names every cache with the current version", () => {
    for (const name of Object.values(sw.CACHES)) {
      expect(name).toMatch(/^bhimraj-[a-z]+-v\d+$/);
    }
  });
});
