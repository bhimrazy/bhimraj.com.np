import { describe, expect, it } from "vitest";
import { buildStarHistory, STAR_HISTORY_POINTS } from "../src/star-history";

describe("buildStarHistory", () => {
  it("returns an empty series for no stars", () => {
    expect(buildStarHistory([], 0)).toEqual([]);
  });

  it("reports the repo total for a single star", () => {
    expect(buildStarHistory([1000], 42)).toEqual([{ t: 1000, stars: 42 }]);
  });

  it("keeps every point when below the sample cap", () => {
    const timestamps = [10, 20, 30];
    expect(buildStarHistory(timestamps, 3)).toEqual([
      { t: 10, stars: 1 },
      { t: 20, stars: 2 },
      { t: 30, stars: 3 },
    ]);
  });

  it("downsamples to at most STAR_HISTORY_POINTS evenly-spaced points", () => {
    const timestamps = Array.from({ length: 1000 }, (_, i) => i);
    const history = buildStarHistory(timestamps, 1000);

    expect(history).toHaveLength(STAR_HISTORY_POINTS);
    expect(history[0]).toEqual({ t: 0, stars: 1 });
    expect(history.at(-1)).toEqual({ t: 999, stars: 1000 });
    // Cumulative: timestamps and star counts are both monotonically increasing.
    for (let i = 1; i < history.length; i++) {
      expect(history[i].t).toBeGreaterThanOrEqual(history[i - 1].t);
      expect(history[i].stars).toBeGreaterThanOrEqual(history[i - 1].stars);
    }
  });

  it("bumps the final point up to the reported total when pagination is capped", () => {
    const timestamps = [1, 2, 3, 4, 5];
    const history = buildStarHistory(timestamps, 9999);
    expect(history.at(-1)?.stars).toBe(9999);
  });

  it("never lowers the final count below the sampled value", () => {
    const timestamps = [1, 2, 3, 4, 5];
    const history = buildStarHistory(timestamps, 2);
    // Sampled last point is 5; a stale lower total must not override it.
    expect(history.at(-1)?.stars).toBe(5);
  });
});
