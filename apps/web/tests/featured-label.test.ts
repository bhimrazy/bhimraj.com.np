import { describe, expect, it } from "vitest";
import { featuredLabel } from "@/components/blog/featured-label";

const now = Date.parse("2026-10-11T00:00:00Z");

describe("featuredLabel", () => {
  it("calls a recent newest post Latest", () => {
    expect(featuredLabel({ publishedAt: "2026-06-01" }, now)).toBe("Latest");
  });

  it("drops the badge once the newest post is over a year old", () => {
    expect(featuredLabel({ publishedAt: "2023-04-11" }, now)).toBeNull();
  });

  it("keeps Featured for a flagged post regardless of age", () => {
    expect(
      featuredLabel({ featured: true, publishedAt: "2022-10-16" }, now),
    ).toBe("Featured");
  });

  it("does not call a future-dated post Latest", () => {
    expect(featuredLabel({ publishedAt: "2027-01-01" }, now)).toBeNull();
  });
});
