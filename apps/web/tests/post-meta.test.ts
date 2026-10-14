import { describe, expect, it } from "vitest";
import { postMeta } from "@/components/blog/post-meta";

describe("postMeta", () => {
  it("takes a leading ## as the dek and leaves it out of the TOC", () => {
    const meta = postMeta("## A short subtitle\n\nIntro.\n\n## Setup\n", "");
    expect(meta.dek).toBe("A short subtitle");
    expect(meta.toc).toEqual([{ id: "setup", text: "Setup", level: 2 }]);
  });

  it("has no dek when the post opens with prose", () => {
    expect(postMeta("Intro.\n\n## Setup\n", "").dek).toBeNull();
  });

  it("slugs headings like rehype-slug: plain text, duplicates suffixed", () => {
    const meta = postMeta(
      "Intro.\n\n## **Introduction**\n\n### What is `x`?\n\n#### Deep\n\n## Introduction\n\n## References:\n",
      "",
    );
    expect(meta.toc).toEqual([
      { id: "introduction", text: "Introduction", level: 2 },
      { id: "what-is-x", text: "What is x?", level: 3 },
      { id: "introduction-1", text: "Introduction", level: 2 },
      { id: "references", text: "References", level: 2 },
    ]);
  });

  it("finds headings inside JSX and ignores JS expressions", () => {
    const meta = postMeta(
      'Intro.\n\n<Figure label="x">\n\n## Inside\n\n</Figure>\n\n{1 + 1}\n',
      "",
    );
    expect(meta.toc.map((t) => t.id)).toEqual(["inside"]);
  });

  it("counts prose and code toward reading time, at 300 words a minute", () => {
    expect(postMeta("word ".repeat(300), "").readingTime).toBe("1 min read");
    const long = `${"word ".repeat(301)}\n\n\`\`\`py\n${"x ".repeat(300)}\n\`\`\`\n`;
    expect(postMeta(long, "").readingTime).toBe("3 min read");
  });

  it("detects the cover image in the body", () => {
    const md = "Intro.\n\n![Cover](/blog/cover.png)\n";
    expect(postMeta(md, "/blog/cover.png").coverInBody).toBe(true);
    expect(postMeta(md, "/blog/other.png").coverInBody).toBe(false);
  });
});
