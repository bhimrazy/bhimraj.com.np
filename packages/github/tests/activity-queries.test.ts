import { describe, expect, it } from "vitest";
import {
  githubSearchUrl,
  ossActivityQueries,
  ossSearchScope,
} from "../src/activity-queries";
import { snapshotSchema } from "../src/types";

describe("ossSearchScope", () => {
  it("collapses a multi-repo owner to org: and skips the user's own repos", () => {
    expect(
      ossSearchScope("bhimrazy", [
        "Lightning-AI/litdata",
        "Lightning-AI/LitServe",
        "ekzhu/datasketch",
        "bhimrazy/receipt-ocr",
      ]),
    ).toBe("org:Lightning-AI repo:ekzhu/datasketch");
  });

  it("matches the username case-insensitively", () => {
    expect(ossSearchScope("BhimRazy", ["bhimrazy/receipt-ocr"])).toBe("");
  });
});

describe("ossActivityQueries", () => {
  it("excludes the user's own PRs and issues from reviewed/helped counts", () => {
    const q = ossActivityQueries("u", "org:o");
    expect(q.prsReviewed).toBe("reviewed-by:u -author:u is:pr org:o");
    expect(q.issuesHelped).toBe("commenter:u -author:u is:issue org:o");
    expect(q.prsOpen).toContain("draft:false");
  });
});

describe("githubSearchUrl", () => {
  it("builds an issues-type github.com search", () => {
    const url = new URL(githubSearchUrl("author:u is:pr"));
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("q")).toBe("author:u is:pr");
    expect(url.searchParams.get("type")).toBe("issues");
  });
});

describe("snapshotSchema", () => {
  it("defaults ossActivity for snapshots written before it existed", () => {
    const parsed = snapshotSchema.parse({
      generatedAt: "2026-01-01T00:00:00.000Z",
      stars: 0,
      contributions: 0,
      lightningCommits: 0,
      featuredRepo: null,
      ossStats: { totalCommits: 0, totalPrs: 0 },
      lightningEcosystem: { totalPrs: 0, repos: [] },
      contributedRepos: [],
      monthlyContributions: [],
    });
    expect(parsed.ossActivity.prsReviewed).toBe(0);
  });
});
