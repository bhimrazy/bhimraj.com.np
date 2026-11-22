import { describe, expect, it } from "vitest";
import {
  activeNavHref,
  MENU_LINKS,
  MORE_LINKS,
  TAB_LINKS,
} from "@/components/header/nav-links";
import { nextTabBarScroll } from "@/components/header/tab-bar-scroll";

describe("tab bar links", () => {
  it("shows four tabs in order", () => {
    expect(TAB_LINKS.map((l) => l.href)).toEqual([
      "/",
      "/blog",
      "/projects",
      "/resources",
    ]);
  });

  it("puts every other menu link under More, none lost or doubled", () => {
    expect(MORE_LINKS.map((l) => l.href)).toEqual(["/oss", "/research"]);
    expect([...TAB_LINKS, ...MORE_LINKS].map((l) => l.href).sort()).toEqual(
      MENU_LINKS.map((l) => l.href).sort(),
    );
  });
});

describe("activeNavHref", () => {
  it.each([
    ["/", "/"],
    ["/blog", "/blog"],
    ["/blog/some-post", "/blog"],
    ["/resources/cs231n", "/resources"],
    ["/resources/paths/ml", "/resources"],
    ["/oss", "/oss"],
    ["/blogger", null],
    ["/nope", null],
  ])("%s -> %s", (pathname, href) => {
    expect(activeNavHref(pathname)).toBe(href);
  });
});

describe("nextTabBarScroll", () => {
  const max = 2000;

  it("hides on scroll down and shows on scroll up", () => {
    const down = nextTabBarScroll({ hidden: false, anchorY: 100 }, 200, max);
    expect(down).toEqual({ hidden: true, anchorY: 200 });
    const up = nextTabBarScroll(down, 150, max);
    expect(up).toEqual({ hidden: false, anchorY: 150 });
  });

  it("ignores movement under the threshold", () => {
    const state = { hidden: true, anchorY: 500 };
    expect(nextTabBarScroll(state, 495, max)).toBe(state);
    expect(nextTabBarScroll(state, 507, max)).toBe(state);
  });

  it("accumulates small steps from the anchor", () => {
    let state = { hidden: false, anchorY: 500 };
    for (const y of [503, 506, 509]) state = nextTabBarScroll(state, y, max);
    expect(state).toEqual({ hidden: true, anchorY: 509 });
  });

  it("always shows at the top and bottom, including overscroll", () => {
    const hidden = { hidden: true, anchorY: 800 };
    expect(nextTabBarScroll(hidden, 0, max).hidden).toBe(false);
    expect(nextTabBarScroll(hidden, -40, max).hidden).toBe(false);
    expect(nextTabBarScroll(hidden, max, max).hidden).toBe(false);
    expect(nextTabBarScroll(hidden, max + 30, max).hidden).toBe(false);
  });
});
