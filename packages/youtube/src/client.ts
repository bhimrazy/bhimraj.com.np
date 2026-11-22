import { parseIsoDuration } from "./duration";
import { cleanLectureTitle } from "./titles";
import type { Lecture, Playlist, PlaylistOrder } from "./types";

const API = "https://www.googleapis.com/youtube/v3";

type Get = (
  resource: string,
  params: Record<string, string>,
) => Promise<unknown>;

/** A read-only Data API client. Errors never include the key. */
export function createClient(key: string, fetchImpl = fetch): Get {
  return async (resource, params) => {
    const url = new URL(`${API}/${resource}`);
    for (const [name, value] of Object.entries(params)) {
      url.searchParams.set(name, value);
    }
    url.searchParams.set("key", key);
    const res = await fetchImpl(url);
    const body = (await res.json()) as {
      error?: { message?: string; errors?: { reason?: string }[] };
    };
    if (!res.ok) {
      const reason = body.error?.errors?.[0]?.reason ?? "unknown";
      throw new Error(`${resource}: HTTP ${res.status} (${reason})`);
    }
    return body;
  };
}

type PlaylistResponse = {
  items: { snippet: { title: string; channelTitle: string } }[];
};
type PlaylistItemsResponse = {
  nextPageToken?: string;
  items: {
    contentDetails: { videoId: string };
    status?: { privacyStatus?: string };
  }[];
};
type VideosResponse = {
  items: {
    id: string;
    snippet: {
      title: string;
      publishedAt: string;
      liveBroadcastContent?: string;
    };
    contentDetails: { duration: string };
  }[];
};

/**
 * One playlist as lectures. Private, deleted and upcoming videos are left out:
 * the API doesn't return the first two from `videos`, and the last has no
 * recording yet. Costs 1 quota unit per 50 videos, twice, plus 1.
 */
export async function fetchPlaylist(
  get: Get,
  id: string,
  order: PlaylistOrder,
): Promise<Playlist> {
  const meta = (await get("playlists", {
    part: "snippet",
    id,
  })) as PlaylistResponse;
  const info = meta.items[0]?.snippet;
  if (!info) throw new Error(`playlist ${id} not found or private`);

  const videoIds: string[] = [];
  let pageToken: string | undefined;
  do {
    const page = (await get("playlistItems", {
      part: "contentDetails,status",
      maxResults: "50",
      playlistId: id,
      ...(pageToken && { pageToken }),
    })) as PlaylistItemsResponse;
    for (const item of page.items) {
      if (item.status?.privacyStatus === "private") continue;
      videoIds.push(item.contentDetails.videoId);
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  const byId = new Map<string, Lecture>();
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = (await get("videos", {
      part: "snippet,contentDetails",
      id: videoIds.slice(i, i + 50).join(","),
    })) as VideosResponse;
    for (const video of batch.items) {
      if (video.snippet.liveBroadcastContent === "upcoming") continue;
      const durationSec = parseIsoDuration(video.contentDetails.duration);
      if (durationSec === 0) continue;
      byId.set(video.id, {
        id: video.id,
        ...cleanLectureTitle(video.snippet.title),
        rawTitle: video.snippet.title,
        durationSec,
        publishedAt: video.snippet.publishedAt,
      });
    }
  }

  // Keep the playlist's order, minus anything the API didn't return.
  const lectures = [...new Set(videoIds)].flatMap((videoId) => {
    const lecture = byId.get(videoId);
    return lecture ? [lecture] : [];
  });
  if (order === "published") {
    lectures.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  }

  return {
    id,
    title: info.title,
    channel: info.channelTitle,
    lectures,
  };
}
