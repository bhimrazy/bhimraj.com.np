import { describe, expect, it } from "vitest";
import {
  pathVideo,
  resolveSteps,
  selectInProgress,
  selectNextUp,
  shortTitle,
  watchedShare,
} from "@/components/resources/paths";
import type { ResourceStatus } from "@/components/resources/taxonomy";

describe("resolveSteps", () => {
  const bySlug = new Map([
    ["a", { title: "A" }],
    ["b", { title: "B" }],
  ]);

  it("keeps the order the path lists", () => {
    const steps = resolveSteps(
      {
        slug: "p",
        steps: [
          { resource: "b", why: "first" },
          { resource: "a", why: "second" },
        ],
      },
      bySlug,
    );
    expect(steps.map((s) => [s.resource.title, s.why])).toEqual([
      ["B", "first"],
      ["A", "second"],
    ]);
  });

  it("throws on a slug with no resource", () => {
    expect(() =>
      resolveSteps(
        {
          slug: "p",
          steps: [
            { resource: "a", why: "" },
            { resource: "typo", why: "" },
          ],
        },
        bySlug,
      ),
    ).toThrow(/"typo"/);
  });

  it("throws on a step listed twice", () => {
    expect(() =>
      resolveSteps(
        {
          slug: "p",
          steps: [
            { resource: "a", why: "" },
            { resource: "a", why: "" },
          ],
        },
        bySlug,
      ),
    ).toThrow(/twice/);
  });
});

describe("pathVideo", () => {
  it("adds synced lecture time and counts the steps without any", () => {
    expect(
      pathVideo([{ totalSec: 3600 }, { totalSec: 0 }, { totalSec: 1800 }]),
    ).toEqual({ totalSec: 5400, untimed: 1 });
  });
});

describe("shortTitle", () => {
  it("uses the course code before a colon", () => {
    expect(shortTitle("CME 295: Transformers & Large Language Models")).toBe(
      "CME 295",
    );
  });
  it("keeps titles without one", () => {
    expect(shortTitle("Site Reliability Engineering")).toBe(
      "Site Reliability Engineering",
    );
  });
});

const entry = (slug: string, added: string, status?: ResourceStatus) => ({
  slug,
  added,
  status,
});

describe("selectInProgress", () => {
  it("is empty when nothing is marked in progress", () => {
    expect(
      selectInProgress([
        entry("a", "2026-01-01"),
        entry("b", "2026-01-02", "recommended"),
        entry("c", "2026-01-03", "queued"),
      ]),
    ).toEqual([]);
  });

  it("puts learning before revisiting, then newest first, up to the limit", () => {
    const picked = selectInProgress([
      entry("old-learning", "2026-01-01", "learning"),
      entry("revisit", "2026-03-01", "revisiting"),
      entry("new-learning", "2026-02-01", "learning"),
    ]);
    expect(picked.map((r) => r.slug)).toEqual(["new-learning", "old-learning"]);
  });
});

describe("selectNextUp", () => {
  it("picks the newest queued entry", () => {
    expect(
      selectNextUp([
        entry("a", "2026-01-01", "queued"),
        entry("b", "2026-02-01", "queued"),
        entry("c", "2026-03-01", "learning"),
      ])?.slug,
    ).toBe("b");
  });
});

describe("watchedShare", () => {
  it("is null without both counts", () => {
    expect(watchedShare(undefined, 10)).toBeNull();
    expect(watchedShare(3, 0)).toBeNull();
  });
  it("caps at 1 when the playlist shrank", () => {
    expect(watchedShare(4, 10)).toBe(0.4);
    expect(watchedShare(12, 10)).toBe(1);
  });
});
