import { z } from "zod";

export const lectureSchema = z.object({
  /** YouTube video ID. */
  id: z.string(),
  /** Cleaned for display; see `cleanLectureTitle`. */
  title: z.string(),
  /** Lecture number when the title states one; guest talks have none. */
  number: z.number().int().nullable(),
  /** "with …" credit pulled out of the title, if any. */
  speakers: z.string().nullable(),
  rawTitle: z.string(),
  durationSec: z.number().int().nonnegative(),
  publishedAt: z.string(),
});

export const playlistSchema = z.object({
  id: z.string(),
  title: z.string(),
  channel: z.string(),
  lectures: z.array(lectureSchema),
});

export const snapshotSchema = z.object({
  /** When the lecture data last changed, not when the sync last ran. */
  generatedAt: z.string(),
  playlists: z.record(z.string(), playlistSchema),
});

export type Lecture = z.infer<typeof lectureSchema>;
export type Playlist = z.infer<typeof playlistSchema>;
export type YouTubeSnapshot = z.infer<typeof snapshotSchema>;

/** How lectures are ordered on the page. */
export type PlaylistOrder = "published" | "playlist";

/** A playlist a course file asks for. */
export type PlaylistSource = {
  /** The course file's slug, for log messages. */
  course: string;
  playlist: string;
  order: PlaylistOrder;
};
