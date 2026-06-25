#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mergeSnapshot } from "../src/merge";
import { buildSnapshot } from "../src/snapshot";
import { type GitHubSnapshot, snapshotSchema } from "../src/types";

const SNAPSHOT_PATH = fileURLToPath(
  new URL("../data/snapshot.json", import.meta.url),
);

function readPrevious(): GitHubSnapshot | null {
  try {
    const parsed = snapshotSchema.safeParse(
      JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")),
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "[sync] GITHUB_TOKEN not set — running unauthenticated (60 req/hr); data may be incomplete.",
    );
  }

  const prev = readPrevious();
  const fresh = await buildSnapshot();
  const merged = mergeSnapshot(fresh, prev);

  // Validate before writing so a malformed snapshot never reaches the app.
  const snapshot = snapshotSchema.parse(merged);

  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.info("[sync] snapshot written", {
    generatedAt: snapshot.generatedAt,
    stars: `${prev?.stars ?? 0} → ${snapshot.stars}`,
    contributions: `${prev?.contributions ?? 0} → ${snapshot.contributions}`,
    ossPrs: `${prev?.ossStats.totalPrs ?? 0} → ${snapshot.ossStats.totalPrs}`,
    contributedRepos: snapshot.contributedRepos.length,
  });
}

main().catch((error) => {
  console.error("[sync] failed", error);
  process.exit(1);
});
