import snapshotData from "../data/youtube.json" with { type: "json" };
import { type Playlist, snapshotSchema, type YouTubeSnapshot } from "./types";

/** The committed snapshot, validated at module load. No network at runtime. */
const snapshot: YouTubeSnapshot = snapshotSchema.parse(snapshotData);

/** A synced playlist, or null when the sync hasn't fetched it yet. */
export function getPlaylist(id: string): Playlist | null {
  return snapshot.playlists[id] ?? null;
}
