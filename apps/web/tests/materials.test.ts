import { describe, expect, it } from "vitest";
import {
  groupMaterials,
  materialLabel,
} from "@/components/resources/materials";

describe("materialLabel", () => {
  it("uses the kind's label by default", () => {
    expect(materialLabel({ kind: "slides", url: "https://a.edu/s.pdf" })).toBe(
      "Slides",
    );
  });
  it("names arXiv readings by id", () => {
    expect(
      materialLabel({
        kind: "reading",
        url: "https://arxiv.org/abs/1706.03762",
      }),
    ).toBe("arXiv:1706.03762");
  });
  it("names other readings by site", () => {
    expect(
      materialLabel({ kind: "reading", url: "https://www.anthropic.com/x" }),
    ).toBe("anthropic.com");
  });
  it("prefers an explicit label", () => {
    expect(
      materialLabel({ kind: "lab", url: "https://a.edu", label: "Lab 3" }),
    ).toBe("Lab 3");
  });
});

describe("groupMaterials", () => {
  it("splits per-lecture links from course-wide ones", () => {
    const { byLecture, general } = groupMaterials([
      { kind: "slides", url: "https://a.edu/1.pdf", lecture: 1 },
      { kind: "lab", url: "https://a.edu/l", lecture: 1, label: "Lab 0" },
      { kind: "exam", url: "https://a.edu/e.pdf", label: "Midterm" },
    ]);
    expect(byLecture.get(1)?.map((l) => l.label)).toEqual(["Slides", "Lab 0"]);
    expect(general.map((l) => l.label)).toEqual(["Midterm"]);
  });
});
