import { describe, expect, it } from "vitest";
import {
  pathVideo,
  resolveSteps,
  shortTitle,
} from "@/components/resources/paths";

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
