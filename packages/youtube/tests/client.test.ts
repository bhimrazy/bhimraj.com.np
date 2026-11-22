import { describe, expect, it } from "vitest";
import { createClient, fetchPlaylist } from "../src/client";
import { parseIsoDuration } from "../src/duration";
import { frontmatterBlock, toSource } from "../src/sources";

type Routes = Record<string, (params: URLSearchParams) => unknown>;

/** A fake fetch that answers by resource name and records each URL. */
function fakeFetch(routes: Routes, status = 200) {
  const urls: URL[] = [];
  const impl = (async (input: URL) => {
    urls.push(input);
    const resource = input.pathname.split("/").at(-1) ?? "";
    const body = routes[resource]?.(input.searchParams) ?? {};
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  return { impl, urls };
}

const video = (
  id: string,
  title: string,
  publishedAt: string,
  duration = "PT1H",
) => ({
  id,
  snippet: { title, publishedAt, liveBroadcastContent: "none" },
  contentDetails: { duration },
  status: { embeddable: id !== "c" },
});

describe("fetchPlaylist", () => {
  const routes: Routes = {
    playlists: () => ({
      items: [
        { snippet: { title: "Course", channelTitle: "Stanford Online" } },
      ],
    }),
    playlistItems: (p) =>
      p.get("pageToken")
        ? { items: [{ contentDetails: { videoId: "a" } }] }
        : {
            nextPageToken: "next",
            items: [
              { contentDetails: { videoId: "c" } },
              {
                contentDetails: { videoId: "p" },
                status: { privacyStatus: "private" },
              },
              { contentDetails: { videoId: "gone" } },
            ],
          },
    videos: () => ({
      items: [
        video("c", "Lecture 3 - Late", "2026-03-01T00:00:00Z"),
        video("a", "Lecture 1 - Early", "2026-01-01T00:00:00Z"),
        {
          ...video("u", "Soon", "2026-04-01T00:00:00Z"),
          snippet: {
            title: "Soon",
            publishedAt: "",
            liveBroadcastContent: "upcoming",
          },
        },
      ],
    }),
  };

  it("pages through items, drops unavailable videos and sorts by publish date", async () => {
    const { impl } = fakeFetch(routes);
    const playlist = await fetchPlaylist(
      createClient("k", impl),
      "PL1",
      "published",
    );
    expect(playlist.channel).toBe("Stanford Online");
    expect(
      playlist.lectures.map((l) => [l.id, l.title, l.number, l.embeddable]),
    ).toEqual([
      ["a", "Early", 1, true],
      ["c", "Late", 3, false],
    ]);
  });

  it("keeps the playlist's own order when asked", async () => {
    const { impl } = fakeFetch(routes);
    const playlist = await fetchPlaylist(
      createClient("k", impl),
      "PL1",
      "playlist",
    );
    expect(playlist.lectures.map((l) => l.id)).toEqual(["c", "a"]);
  });

  it("reports errors without the key", async () => {
    const { impl } = fakeFetch(
      {
        playlists: () => ({ error: { errors: [{ reason: "quotaExceeded" }] } }),
      },
      403,
    );
    const error = await fetchPlaylist(
      createClient("secret-key", impl),
      "PL1",
      "published",
    ).catch((e: Error) => e);
    expect(String(error)).toContain("HTTP 403 (quotaExceeded)");
    expect(String(error)).not.toContain("secret-key");
  });
});

describe("parseIsoDuration", () => {
  it.each([
    ["PT1H44M28S", 6268],
    ["PT49M", 2940],
    ["PT45S", 45],
    ["P1DT2H", 93_600],
    ["P0D", 0],
  ])("%s → %i", (value, seconds) => {
    expect(parseIsoDuration(value)).toBe(seconds);
  });

  it("rejects anything else", () => {
    expect(() => parseIsoDuration("1:02:03")).toThrow();
  });
});

describe("course sources", () => {
  it("reads the frontmatter block", () => {
    expect(frontmatterBlock("---\ntitle: X\nplaylist: PL1\n---\nBody")).toBe(
      "title: X\nplaylist: PL1",
    );
    expect(frontmatterBlock("No frontmatter")).toBeNull();
  });

  it("maps a course with a playlist, and skips one without", () => {
    expect(toSource("cme", { playlist: "PL1" })).toEqual({
      course: "cme",
      playlist: "PL1",
      order: "published",
    });
    expect(
      toSource("cme", { playlist: "PL1", playlistOrder: "playlist" })?.order,
    ).toBe("playlist");
    expect(toSource("book", { title: "SRE" })).toBeNull();
  });
});
