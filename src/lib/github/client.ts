import { Effect } from "effect";
import type { z } from "zod";
import { fetchEffect, type HttpError, jsonEffect } from "@/lib/http";
import { logger } from "@/lib/logger";
import { prCountSchema } from "./schemas";

export const GITHUB_API = "https://api.github.com";

/** Standard headers for the GitHub REST API (no auth required for public data). */
const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
} as const;

/** Concurrency cap for fan-out requests, keeping us well under rate limits. */
export const REQUEST_CONCURRENCY = 3;

export const log = logger.withPrefix("[github]");

/**
 * GET a GitHub REST resource and validate the JSON body against `schema`.
 * Caller-supplied `init.headers` override the defaults (e.g. a custom Accept).
 */
export function githubJson<T>(
  url: URL | string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Effect.Effect<T, HttpError> {
  return fetchEffect(url, {
    ...init,
    headers: { ...GITHUB_HEADERS, ...init.headers },
  }).pipe(Effect.flatMap((res) => jsonEffect(res, schema)));
}

/** Count merged PRs matching a GitHub search query via `/search/issues`. */
export function searchMergedPrCount(
  query: string,
): Effect.Effect<number, HttpError> {
  const url = `${GITHUB_API}/search/issues?${new URLSearchParams({
    q: query,
    per_page: "1",
  })}`;
  return githubJson(url, prCountSchema).pipe(Effect.map((d) => d.total_count));
}
