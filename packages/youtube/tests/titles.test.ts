import { describe, expect, it } from "vitest";
import { cleanLectureTitle } from "../src/titles";

// Real titles from the course playlists this package syncs.
const cases: [string, ReturnType<typeof cleanLectureTitle>][] = [
  [
    "Stanford CME295 Transformers & LLMs | Autumn 2026 | Lecture 1 - Transformers",
    { title: "Transformers", number: 1, speakers: null },
  ],
  [
    "AI Costs: Tokens, Energy, Model Choice & API Keys | Stanford CS193T Lecture 7 with Cynthia Bailey",
    {
      title: "AI Costs: Tokens, Energy, Model Choice & API Keys",
      number: 7,
      speakers: "Cynthia Bailey",
    },
  ],
  [
    "Terminal-Bench: Evaluating AI Agents | Stanford CS329Z Guest Lecture with Alex Shaw & Ryan Marten",
    {
      title: "Terminal-Bench: Evaluating AI Agents",
      number: null,
      speakers: "Alex Shaw & Ryan Marten",
    },
  ],
  [
    "Stanford CS153 Frontier Systems | Teaching AI to Touch Atoms",
    { title: "Teaching AI to Touch Atoms", number: null, speakers: null },
  ],
  [
    "EfficientML.ai Lecture 19 - Lec19-Distributed-Training (Part I) (MIT 6.5940 Fall 2026)",
    { title: "Distributed Training (Part I)", number: 19, speakers: null },
  ],
  [
    "EfficientML.ai Lecture 18 - Diffusion Model (Part II) (MIT 6.5940 Fall 2026)",
    { title: "Diffusion Model (Part II)", number: 18, speakers: null },
  ],
];

describe("cleanLectureTitle", () => {
  it.each(cases)("%s", (raw, expected) => {
    expect(cleanLectureTitle(raw)).toEqual(expected);
  });

  it("keeps the whole title when every segment looks like branding", () => {
    expect(cleanLectureTitle("Stanford Spring Lecture").title).toBe(
      "Stanford Spring Lecture",
    );
  });

  it("leaves a plain title alone", () => {
    expect(cleanLectureTitle("Let's build GPT: from scratch")).toEqual({
      title: "Let's build GPT: from scratch",
      number: null,
      speakers: null,
    });
  });
});
