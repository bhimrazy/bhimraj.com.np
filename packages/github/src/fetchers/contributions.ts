import { Effect, Schedule } from "effect";
import { z } from "zod";
import { log, REQUEST_CONCURRENCY } from "../client";
import { fetchEffect, HttpError, isRetryableHttpError } from "../lib/http";
import { contributorEntrySchema } from "../schemas";

const DEFAULT_TIMEOUT_MS = 5000;

/** A single week of commit activity: `w` is the week-start (epoch seconds), `c` the commit count. */
export type ContributionWeek = { w: number; c: number };

function parseContributors(body: string) {
  return Effect.try({
    try: () => JSON.parse(body) as unknown,
    catch: () => new HttpError("Invalid GitHub contributors JSON"),
  }).pipe(
    Effect.flatMap((json) => {
      const parsed = z.array(contributorEntrySchema).safeParse(json);
      if (!parsed.success) {
        return Effect.fail(new HttpError("Invalid GitHub contributors data"));
      }
      return Effect.succeed(parsed.data);
    }),
  );
}

function fetchRepoContributorWeeks(
  repo: string,
  username: string,
): Effect.Effect<ContributionWeek[], HttpError> {
  const url = new URL(
    "graphs/contributors-data",
    `https://github.com/${repo}/`,
  );

  return fetchEffect(
    url,
    {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    },
    DEFAULT_TIMEOUT_MS,
  ).pipe(
    Effect.flatMap((res) => {
      if (res.status === 202) {
        return Effect.fail(
          new HttpError("GitHub contributors data is warming", {
            retryable: true,
            status: res.status,
          }),
        );
      }

      return Effect.tryPromise({
        try: () => res.text(),
        catch: () => new HttpError("GitHub contributors response failed"),
      });
    }),
    Effect.flatMap((body) => {
      const trimmedBody = body.trim();
      if (!trimmedBody) {
        return Effect.fail(
          new HttpError("GitHub contributors data is empty", {
            retryable: true,
          }),
        );
      }
      return parseContributors(trimmedBody);
    }),
    Effect.map((data) => {
      const entry = data.find(
        (c) => c.author?.login.toLowerCase() === username.toLowerCase(),
      );
      return entry?.weeks ?? [];
    }),
  );
}

/**
 * Returns a single repo's commit count for `username`, matching the number
 * shown in the repo's Insights → Contributors tab.
 *
 * This hits the same endpoint the Insights UI renders from. GitHub responds with
 * HTTP 202 (and an empty body) while it warms its stats cache, so Effect polls
 * until the data is ready. Counts are for the default branch only, and the
 * contributor list is capped at the top contributors — a user outside that
 * set reads as 0.
 */
function fetchRepoWeeks(
  repo: string,
  username: string,
  maxRetries: number,
  delayMs: number,
): Promise<ContributionWeek[] | null> {
  const program = fetchRepoContributorWeeks(repo, username).pipe(
    Effect.retry({
      schedule: Schedule.spaced(`${delayMs} millis`),
      times: maxRetries,
      while: isRetryableHttpError,
    }),
    Effect.tapError((error) =>
      Effect.sync(() =>
        log.warn(
          "contributions request failed",
          { repo, username, status: error.status },
          error,
        ),
      ),
    ),
    Effect.catchAll(() => Effect.succeed(null)),
  );

  return Effect.runPromise(program);
}

const sumWeeks = (weeks: ContributionWeek[]): number =>
  weeks.reduce((sum, w) => sum + w.c, 0);

/** A single repo's commit count for `username` (0 if the repo fails to resolve). */
export async function getRepoCommitCount(
  repo: string,
  username: string,
): Promise<number> {
  const weeks = await fetchRepoWeeks(repo, username, 2, 500);
  return weeks ? sumWeeks(weeks) : 0;
}

/**
 * Sums a user's commit contributions across the given repos.
 *
 * @param username - GitHub username (e.g. "bhimrazy")
 * @param repos    - "owner/repo" slugs to sum across
 * @param fallback - Value returned if every repo fails to resolve (default: 0)
 */
export async function getGitHubContributions(
  username: string,
  repos: readonly string[],
  fallback = 0,
): Promise<number> {
  try {
    const entries = await Effect.runPromise(
      Effect.all(
        repos.map((repo) =>
          Effect.promise(
            async () =>
              [repo, await fetchRepoWeeks(repo, username, 2, 500)] as const,
          ),
        ),
        { concurrency: REQUEST_CONCURRENCY },
      ),
    );
    const total = entries.reduce(
      (sum, [, weeks]) => sum + (weeks ? sumWeeks(weeks) : 0),
      0,
    );
    const hasResolvedRepo = entries.some(([, weeks]) => weeks !== null);
    return hasResolvedRepo ? total : fallback;
  } catch (error) {
    log.warn("contributions request error", { username }, error);
    return fallback;
  }
}

/** One repo's share of a single month's commits. */
export type MonthlyRepoContribution = {
  /** "owner/repo" slug. */
  repo: string;
  /** Short repo name (the part after the slash). */
  name: string;
  commits: number;
};

/** One month's commit total, used for the OSS contribution graph. */
export type MonthlyContribution = {
  /** Short month name, e.g. "Jan". */
  label: string;
  year: number;
  /** Zero-based month index (0 = January). */
  month: number;
  commits: number;
  /** Per-repo split of `commits`, highest first; empty when nothing resolved. */
  byRepo: MonthlyRepoContribution[];
};

/**
 * Buckets a user's commits across the given repos into the trailing 12 calendar
 * months (oldest first), using the weekly activity from each repo's
 * contributors graph. Weeks are attributed to the month of their start date.
 *
 * @param username - GitHub username (e.g. "bhimrazy")
 * @param repos    - "owner/repo" slugs to sum across
 */
export async function getMonthlyContributions(
  username: string,
  repos: readonly string[],
): Promise<MonthlyContribution[]> {
  const now = new Date();
  const buckets: MonthlyContribution[] = [];
  // Per-month, per-repo tallies kept alongside `buckets` until we finalize them.
  const repoTallies: Map<string, number>[] = [];
  const indexByKey = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    indexByKey.set(`${d.getFullYear()}-${d.getMonth()}`, buckets.length);
    repoTallies.push(new Map());
    buckets.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      commits: 0,
      byRepo: [],
    });
  }

  try {
    const perRepo = await Effect.runPromise(
      Effect.all(
        repos.map((repo) =>
          Effect.promise(
            async () =>
              [repo, await fetchRepoWeeks(repo, username, 2, 500)] as const,
          ),
        ),
        { concurrency: REQUEST_CONCURRENCY },
      ),
    );

    for (const [repo, weeks] of perRepo) {
      if (!weeks) continue;
      for (const week of weeks) {
        if (week.c <= 0) continue;
        const d = new Date(week.w * 1000);
        const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
        if (idx === undefined) continue;
        buckets[idx].commits += week.c;
        const tally = repoTallies[idx];
        tally.set(repo, (tally.get(repo) ?? 0) + week.c);
      }
    }

    for (let i = 0; i < buckets.length; i++) {
      buckets[i].byRepo = [...repoTallies[i]]
        .map(([repo, commits]) => ({
          repo,
          name: repo.split("/")[1] ?? repo,
          commits,
        }))
        .sort((a, b) => b.commits - a.commits);
    }
  } catch (error) {
    log.warn("monthly contributions error", { username }, error);
  }

  return buckets;
}
