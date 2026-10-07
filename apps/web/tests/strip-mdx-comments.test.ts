import { describe, expect, it } from "vitest";
import { stripMdxComments } from "@/components/blog/strip-mdx-comments";

describe("stripMdxComments", () => {
  it("drops comment-only lines", () => {
    const src = "Intro\n\n{/* FIGURE: pr-lifecycle — a PR */}\n\nNext";
    expect(stripMdxComments(src)).toBe("Intro\n\n\nNext");
  });

  it("drops comments that span several lines", () => {
    const src = "A\n  {/* VOICE: a story\n   about a thing */}\nB";
    expect(stripMdxComments(src)).toBe("A\nB");
  });

  it("keeps comments that share a line with content", () => {
    const src = "Text {/* note */}\n{/* a */} b";
    expect(stripMdxComments(src)).toBe(src);
  });

  it("leaves code fences alone", () => {
    const src = "```jsx\n{/* inside */}\n```\n{/* outside */}";
    expect(stripMdxComments(src)).toBe("```jsx\n{/* inside */}\n```");
  });
});
