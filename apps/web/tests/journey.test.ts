import { describe, expect, it } from "vitest";
import {
  groupByYear,
  splitJourney,
  TIMELINE,
} from "@/components/oss/journey-data";

describe("journey timeline data", () => {
  it("is in chronological order", () => {
    const index = (d: string) => {
      const [mon, year] = d.split(" ");
      const m = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(mon) / 3;
      return Number(year) * 12 + m;
    };
    for (let i = 1; i < TIMELINE.length; i++) {
      expect(index(TIMELINE[i].date)).toBeGreaterThanOrEqual(
        index(TIMELINE[i - 1].date),
      );
    }
  });

  it("splits newest-first with the rest collapsed", () => {
    const { recent, earlier } = splitJourney(TIMELINE, 5);
    expect(recent).toHaveLength(5);
    expect(recent[0].title).toBe(TIMELINE.at(-1)?.title);
    expect(earlier.at(-1)?.title).toBe(TIMELINE[0].title);
    expect(recent.length + earlier.length).toBe(TIMELINE.length);
  });

  it("groups consecutive years without merging non-adjacent runs", () => {
    const groups = groupByYear(splitJourney(TIMELINE, 5).recent);
    expect(groups.map(([y]) => y)).toEqual([
      ...new Set(groups.map(([y]) => y)),
    ]);
  });
});
