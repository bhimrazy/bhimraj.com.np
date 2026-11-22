import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { postMeta } from "@/components/blog/post-meta";
import { CODE_SECTIONS } from "@/components/mdx/unet/unet-explorer";

const post = readFileSync(
  new URL(
    "../src/content/blog/pytorch-unet-image-segmentation-implementation.mdx",
    import.meta.url,
  ),
  "utf8",
);

describe("UNetExplorer code links", () => {
  it("point at headings that exist in the post", () => {
    // Strip frontmatter; content-collections passes the body only.
    const body = post.replace(/^---[\s\S]*?---\n/, "");
    const ids = postMeta(body, "").toc.map((t) => `#${t.id}`);
    for (const section of Object.values(CODE_SECTIONS)) {
      expect(ids).toContain(section.href);
    }
  });
});
