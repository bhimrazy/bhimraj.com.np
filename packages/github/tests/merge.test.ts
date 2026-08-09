import { describe, expect, it } from "vitest";
import { mergeSnapshot } from "../src/merge";
import type { GitHubSnapshot } from "../src/types";

/** A healthy snapshot, shaped like a real one but with small numbers. */
function snapshot(overrides: Partial<GitHubSnapshot> = {}): GitHubSnapshot {
  return {
    generatedAt: "2026-08-01T00:00:00.000Z",
    stars: 726,
    contributions: 435,
    lightningCommits: 363,
    featuredRepo: {
      name: "receipt-ocr",
      fullName: "bhimrazy/receipt-ocr",
      description: "Receipt OCR",
      stars: 120,
      forks: 12,
      language: "Python",
      url: "https://github.com/bhimrazy/receipt-ocr",
      history: [
        { t: 1, stars: 1 },
        { t: 2, stars: 2 },
      ],
    },
    ossStats: { totalCommits: 435, totalPrs: 257 },
    lightningEcosystem: {
      totalPrs: 208,
      repos: [
        {
          name: "LitData",
          fullName: "Lightning-AI/litdata",
          description: "Data",
          prs: 100,
          stars: 500,
          forks: 50,
        },
        {
          name: "LitServe",
          fullName: "Lightning-AI/LitServe",
          description: "Serve",
          prs: 80,
          stars: 400,
          forks: 40,
        },
      ],
    },
    contributedRepos: [
      {
        name: "litdata",
        fullName: "Lightning-AI/litdata",
        org: "Lightning-AI",
        description: "Data",
        commits: 200,
        prs: 100,
        stars: 500,
        forks: 50,
      },
      {
        name: "litserve",
        fullName: "Lightning-AI/LitServe",
        org: "Lightning-AI",
        description: "Serve",
        commits: 163,
        prs: 80,
        stars: 400,
        forks: 40,
      },
    ],
    monthlyContributions: [
      { label: "Jul", year: 2026, month: 6, commits: 30, byRepo: [] },
      { label: "Aug", year: 2026, month: 7, commits: 12, byRepo: [] },
    ],
    ...overrides,
  };
}

describe("mergeSnapshot", () => {
  it("passes the fresh snapshot through when there is no previous one", () => {
    const fresh = snapshot();
    const { snapshot: merged, anomalies } = mergeSnapshot(fresh, null);

    expect(merged).toEqual(fresh);
    expect(anomalies).toEqual([]);
  });

  it("accepts growth on every cumulative counter", () => {
    const prev = snapshot();
    const { snapshot: merged, anomalies } = mergeSnapshot(
      snapshot({
        contributions: 440,
        lightningCommits: 368,
        ossStats: { totalCommits: 440, totalPrs: 260 },
      }),
      prev,
    );

    expect(merged.contributions).toBe(440);
    expect(merged.lightningCommits).toBe(368);
    expect(merged.ossStats.totalPrs).toBe(260);
    expect(anomalies).toEqual([]);
  });

  it("holds a partial commit total at the previous value", () => {
    // One repo's contributors graph timed out: total drops but stays positive,
    // which the old `next <= 0` guard let through.
    const { snapshot: merged, anomalies } = mergeSnapshot(
      snapshot({ contributions: 410 }),
      snapshot(),
    );

    expect(merged.contributions).toBe(435);
    expect(anomalies).toContainEqual({
      field: "contributions",
      prev: 435,
      next: 410,
    });
  });

  it("holds a merged-PR count that a failed search zeroed out", () => {
    const { snapshot: merged } = mergeSnapshot(
      snapshot({ ossStats: { totalCommits: 435, totalPrs: 0 } }),
      snapshot(),
    );

    expect(merged.ossStats.totalPrs).toBe(257);
  });

  it("still advances generatedAt on a degraded run", () => {
    const { snapshot: merged } = mergeSnapshot(
      snapshot({
        generatedAt: "2026-08-09T00:00:00.000Z",
        contributions: 1,
      }),
      snapshot(),
    );

    expect(merged.generatedAt).toBe("2026-08-09T00:00:00.000Z");
    expect(merged.contributions).toBe(435);
  });

  it("keeps a contributed repo that dropped out of the fresh fetch", () => {
    // `getContributedRepos` filters on `commits > 1`, so a repo whose commit
    // fetch failed disappears from the list entirely.
    const prev = snapshot();
    const { snapshot: merged, anomalies } = mergeSnapshot(
      snapshot({ contributedRepos: [prev.contributedRepos[0]] }),
      prev,
    );

    expect(merged.contributedRepos).toHaveLength(2);
    expect(merged.contributedRepos.map((r) => r.fullName)).toContain(
      "Lightning-AI/LitServe",
    );
    expect(anomalies).toContainEqual({
      field: "contributedRepos[Lightning-AI/LitServe]",
      prev: 163,
      next: 0,
    });
  });

  it("holds a per-repo commit count that regressed", () => {
    const prev = snapshot();
    const { snapshot: merged } = mergeSnapshot(
      snapshot({
        contributedRepos: [
          { ...prev.contributedRepos[0], commits: 0, description: "" },
          prev.contributedRepos[1],
        ],
      }),
      prev,
    );

    const litdata = merged.contributedRepos.find(
      (r) => r.fullName === "Lightning-AI/litdata",
    );
    expect(litdata?.commits).toBe(200);
    expect(litdata?.description).toBe("Data");
  });

  it("tolerates a small star drop but not a cliff", () => {
    const { snapshot: small } = mergeSnapshot(
      snapshot({ stars: 720 }),
      snapshot(),
    );
    expect(small.stars).toBe(720);

    const { snapshot: cliff } = mergeSnapshot(
      snapshot({ stars: 300 }),
      snapshot(),
    );
    expect(cliff.stars).toBe(726);
  });

  it("reverts a month whose commits shrank", () => {
    const { snapshot: merged } = mergeSnapshot(
      snapshot({
        monthlyContributions: [
          { label: "Jul", year: 2026, month: 6, commits: 4, byRepo: [] },
          { label: "Aug", year: 2026, month: 7, commits: 18, byRepo: [] },
        ],
      }),
      snapshot(),
    );

    // July is historical and can't shrink; August is the live month and grew.
    expect(merged.monthlyContributions[0].commits).toBe(30);
    expect(merged.monthlyContributions[1].commits).toBe(18);
  });

  it("keeps the longer star history for the featured repo", () => {
    const prev = snapshot();
    const featuredRepo = snapshot().featuredRepo;
    if (!featuredRepo) throw new Error("fixture is missing featuredRepo");

    const { snapshot: merged } = mergeSnapshot(
      snapshot({ featuredRepo: { ...featuredRepo, history: [], stars: 121 } }),
      prev,
    );

    expect(merged.featuredRepo?.history).toHaveLength(2);
    expect(merged.featuredRepo?.stars).toBe(121);
  });

  it("falls back to the previous featured repo when the fetch returned null", () => {
    const { snapshot: merged } = mergeSnapshot(
      snapshot({ featuredRepo: null }),
      snapshot(),
    );

    expect(merged.featuredRepo?.fullName).toBe("bhimrazy/receipt-ocr");
  });
});
