import type { PlaylistOrder, PlaylistSource } from "./types";

/** The YAML between the leading `---` fences, or null when there is none. */
export function frontmatterBlock(text: string): string | null {
  return text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? null;
}

/**
 * The playlist a course file asks for, if any. Takes parsed frontmatter, so
 * the caller picks the YAML parser (Bun's, in the sync command).
 */
export function toSource(
  course: string,
  data: Record<string, unknown>,
): PlaylistSource | null {
  const playlist = data.playlist;
  if (typeof playlist !== "string" || playlist.length === 0) return null;
  const order: PlaylistOrder =
    data.playlistOrder === "playlist" ? "playlist" : "published";
  return { course, playlist, order };
}
