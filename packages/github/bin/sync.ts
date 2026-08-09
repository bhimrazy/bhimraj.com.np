#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createLogger } from "@bhimrazy/utils";
import { mergeSnapshot } from "../src/merge";
import { buildSnapshot } from "../src/snapshot";
import { type GitHubSnapshot, snapshotSchema } from "../src/types";

const SNAPSHOT_PATH = fileURLToPath(
  new URL("../data/snapshot.json", import.meta.url),
);

const log = createLogger("[sync]");

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
    log.warn("GITHUB_TOKEN not set — data may be incomplete", {
      rateLimit: "60 req/hr (unauthenticated)",
    });
  }

  const prev = readPrevious();
  const fresh = await buildSnapshot();
  const { snapshot: merged, anomalies } = mergeSnapshot(fresh, prev);

  // Validate before writing so a malformed snapshot never reaches the app.
  const snapshot = snapshotSchema.parse(merged);

  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

  // Anomalies are values that came back lower than the committed snapshot —
  // a partial fetch, not real data. The merge already clamped them.
  for (const { field, prev: before, next } of anomalies) {
    log.warn("regressed field held at its previous value", {
      field,
      fetched: next,
      held: before,
    });
  }

  log.info("snapshot written", {
    regressedFields: anomalies.length,
    generatedAt: snapshot.generatedAt,
    stars: `${prev?.stars ?? 0} → ${snapshot.stars}`,
    contributions: `${prev?.contributions ?? 0} → ${snapshot.contributions}`,
    ossPrs: `${prev?.ossStats.totalPrs ?? 0} → ${snapshot.ossStats.totalPrs}`,
    contributedRepos: snapshot.contributedRepos.length,
  });
}

main().catch((error) => {
  log.error("failed", {}, error);
  process.exit(1);
});
