import { createLogger } from "@bhimrazy/utils";
import { Effect, Schedule } from "effect";
import type { z } from "zod";
import {
  fetchEffect,
  type HttpError,
  isRetryableHttpError,
  jsonEffect,
} from "./lib/http";
import { prCountSchema } from "./schemas";

export const GITHUB_API = "https://api.github.com";

/**
 * Standard headers for the GitHub REST API.
 *
 * When `GITHUB_TOKEN` is present (CI runs the sync command with one), requests
 * authenticate and get the 5,000 req/hr limit instead of the 60 req/hr anonymous
 * cap — which is what lets the snapshot fetch complete, accurate data.
 */
const GITHUB_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/** Concurrency cap for fan-out requests, keeping us well under rate limits. */
export const REQUEST_CONCURRENCY = 3;

// Define the prefix once here; every fetcher imports this shared `log` handle.
export const log = createLogger("[github]");

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

/**
 * The search API allows 30 requests a minute and answers a tripped limit with
 * 403. Backing off 2s → 4s → 8s → 16s spans ~30s, long enough to reach the
 * next window instead of recording the metric as 0.
 */
const SEARCH_RETRY = {
  schedule: Schedule.exponential("2 seconds"),
  times: 4,
  while: isRetryableHttpError,
};

/** Count issues/PRs matching a GitHub search query via `/search/issues`. */
export function searchIssueCount(
  query: string,
): Effect.Effect<number, HttpError> {
  const url = `${GITHUB_API}/search/issues?${new URLSearchParams({
    q: query,
    per_page: "1",
  })}`;
  return githubJson(url, prCountSchema).pipe(
    Effect.map((d) => d.total_count),
    Effect.retry(SEARCH_RETRY),
  );
}

/** Count merged PRs matching a GitHub search query. */
export const searchMergedPrCount = searchIssueCount;

/**
 * POST a GraphQL query and validate the JSON body against `schema`. GraphQL
 * always requires auth, so this fails with 401 when `GITHUB_TOKEN` is unset.
 */
export function githubGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
  schema: z.ZodType<T>,
): Effect.Effect<T, HttpError> {
  return fetchEffect(`${GITHUB_API}/graphql`, {
    method: "POST",
    headers: { ...GITHUB_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  }).pipe(
    Effect.flatMap((res) => jsonEffect(res, schema)),
    Effect.retry(SEARCH_RETRY),
  );
}
