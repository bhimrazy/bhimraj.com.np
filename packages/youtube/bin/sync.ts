#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createLogger } from "@bhimrazy/utils";
import { createClient, fetchPlaylist } from "../src/client";
import { frontmatterBlock, toSource } from "../src/sources";
import {
  type Playlist,
  type PlaylistSource,
  snapshotSchema,
  type YouTubeSnapshot,
} from "../src/types";

const SNAPSHOT_PATH = fileURLToPath(
  new URL("../data/youtube.json", import.meta.url),
);
const CONTENT_DIR = fileURLToPath(
  new URL("../../../apps/web/src/content/resources/", import.meta.url),
);
const LOCAL_ENV = fileURLToPath(
  new URL("../../../apps/web/.env.local", import.meta.url),
);

const log = createLogger("[sync:youtube]");

/** CI passes the key in the environment; locally it lives in the web app's .env.local. */
function apiKey(): string | null {
  if (process.env.YOUTUBE_API_KEY) return process.env.YOUTUBE_API_KEY;
  try {
    const line = readFileSync(LOCAL_ENV, "utf8")
      .split("\n")
      .find((l) => l.startsWith("YOUTUBE_API_KEY="));
    const value = line
      ?.slice("YOUTUBE_API_KEY=".length)
      .trim()
      .replace(/^["']|["']$/g, "");
    return value || null;
  } catch {
    return null;
  }
}

function readSources(): PlaylistSource[] {
  return readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const block = frontmatterBlock(readFileSync(CONTENT_DIR + file, "utf8"));
      if (!block) return [];
      const data = Bun.YAML.parse(block) as Record<string, unknown>;
      const source = toSource(file.replace(/\.md$/, ""), data);
      return source ? [source] : [];
    });
}

function readPrevious(): YouTubeSnapshot | null {
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
  const key = apiKey();
  if (!key) {
    log.error("YOUTUBE_API_KEY not set; nothing fetched", {
      hint: "add it to apps/web/.env.local, or the youtube-sync environment in CI",
    });
    process.exit(1);
  }

  const sources = readSources();
  const prev = readPrevious();
  const get = createClient(key);

  const results = await Promise.allSettled(
    sources.map((s) => fetchPlaylist(get, s.playlist, s.order)),
  );

  const playlists: Record<string, Playlist> = {};
  let failed = 0;
  results.forEach((result, i) => {
    const source = sources[i];
    if (!source) return;
    if (result.status === "fulfilled") {
      const before = prev?.playlists[source.playlist]?.lectures.length ?? 0;
      playlists[source.playlist] = result.value;
      log.info("playlist synced", {
        course: source.course,
        lectures: `${before} → ${result.value.lectures.length}`,
      });
      return;
    }
    failed++;
    // Keep the last good copy so one bad fetch doesn't empty a course page.
    const kept = prev?.playlists[source.playlist];
    if (kept) playlists[source.playlist] = kept;
    log.warn("playlist fetch failed", {
      course: source.course,
      error: String(result.reason),
      keptPrevious: Boolean(kept),
    });
  });

  // Sorted keys keep the committed diff stable between runs.
  const sorted = Object.fromEntries(
    Object.entries(playlists).sort(([a], [b]) => a.localeCompare(b)),
  );
  // An unchanged run leaves the file byte-identical, so no PR is opened.
  const changed = JSON.stringify(sorted) !== JSON.stringify(prev?.playlists);
  const snapshot = snapshotSchema.parse({
    generatedAt: changed || !prev ? new Date().toISOString() : prev.generatedAt,
    playlists: sorted,
  });
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

  log.info("snapshot written", { playlists: sources.length, failed, changed });
  // Every fetch failing means a bad key or quota, not flaky data: fail the job.
  if (sources.length > 0 && failed === sources.length) process.exit(1);
}

main().catch((error) => {
  log.error("failed", {}, error);
  process.exit(1);
});
