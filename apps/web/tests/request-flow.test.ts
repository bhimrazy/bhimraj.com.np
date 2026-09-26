import { describe, expect, it } from "vitest";
import {
  DURATION,
  EVENT_DRIVEN,
  progress,
  REQUEST_DRIVEN,
} from "@/components/mdx/events/request-flow";

describe("request vs event timelines", () => {
  it("counts the customer's wait as the hops on its critical path", () => {
    for (const lane of [REQUEST_DRIVEN, EVENT_DRIVEN]) {
      const critical = lane.messages.filter((m) => !m.background);
      expect(critical).toHaveLength(lane.wait.hops);
      expect(Math.max(...critical.map((m) => m.end))).toBe(lane.wait.end);
    }
  });

  it("only uses actors that the lane draws, within the timeline", () => {
    for (const lane of [REQUEST_DRIVEN, EVENT_DRIVEN]) {
      for (const m of lane.messages) {
        expect(lane.actors).toContain(m.from);
        expect(lane.actors).toContain(m.to);
        expect(m.end).toBeLessThanOrEqual(DURATION);
        expect(m.start).toBeLessThan(m.end);
      }
    }
  });

  it("interpolates message progress", () => {
    const m = { start: 1, end: 2 };
    expect(progress(m, 0.5)).toBe(0);
    expect(progress(m, 1.5)).toBe(0.5);
    expect(progress(m, 3)).toBe(1);
  });
});
