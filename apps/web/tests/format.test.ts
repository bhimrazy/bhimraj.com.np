import { describe, expect, it } from "vitest";
import {
  atLeast,
  formatDuration,
  formatHours,
  formatTimestamp,
  yearsAtLeast,
} from "@/lib/format";

describe("atLeast", () => {
  it("floors to 5 under 100 and 10 from 100", () => {
    expect(atLeast(69)).toBe("65+");
    expect(atLeast(314)).toBe("310+");
    expect(atLeast(1092)).toBe("1,090+");
  });
  it("shows small counts as-is instead of 0+", () => {
    expect(atLeast(3)).toBe("3");
  });
});

describe("yearsAtLeast", () => {
  it("floors to whole or half years", () => {
    expect(yearsAtLeast(32)).toBe("2.5+ years");
    expect(yearsAtLeast(29)).toBe("2+ years");
  });
  it("uses months under a year", () => {
    expect(yearsAtLeast(8)).toBe("8 months");
  });
});

describe("lecture durations", () => {
  it("formats a lecture length", () => {
    expect(formatDuration(6268)).toBe("1h 44m");
    expect(formatDuration(2940)).toBe("49m");
    expect(formatDuration(3600)).toBe("1h");
    expect(formatDuration(20)).toBe("1m");
  });

  it("rounds course totals to the hour past 10h", () => {
    expect(formatHours(27_660)).toBe("7h 41m");
    expect(formatHours(47_520)).toBe("13h");
  });

  it("formats a player position", () => {
    expect(formatTimestamp(83)).toBe("1:23");
    expect(formatTimestamp(3723)).toBe("1:02:03");
    expect(formatTimestamp(-5)).toBe("0:00");
  });
});
