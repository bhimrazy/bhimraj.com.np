import { describe, expect, it } from "vitest";
import { atLeast, yearsAtLeast } from "@/lib/format";

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
