import { Effect } from "effect";
import { z } from "zod";
import {
  type OSSActivity,
  type OSSActivityMetric,
  ossActivityQueries,
  ossSearchScope,
} from "../activity-queries";
import {
  githubGraphql,
  log,
  REQUEST_CONCURRENCY,
  searchIssueCount,
} from "../client";

export type { OSSActivity, OSSActivityMetric } from "../activity-queries";

const closingIssuesPageSchema = z.object({
  data: z.object({
    search: z.object({
      pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.string().nullable(),
      }),
      nodes: z.array(
        z.object({
          closingIssuesReferences: z
            .object({ nodes: z.array(z.object({ id: z.string() })) })
            .optional(),
        }),
      ),
    }),
  }),
});

const CLOSING_ISSUES_QUERY = `
  query ($q: String!, $after: String) {
    search(query: $q, type: ISSUE, first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on PullRequest {
          closingIssuesReferences(first: 25) { nodes { id } }
        }
      }
    }
  }
`;

/**
 * Distinct issues closed by the user's merged PRs. Pages through every merged
 * PR in scope (search caps at 1,000 results — far above today's count) and
 * dedupes issue ids, since two PRs can close the same issue.
 */
function countIssuesResolved(
  username: string,
  scope: string,
): Effect.Effect<number, unknown> {
  const q = `author:${username} is:pr is:merged ${scope}`;

  return Effect.gen(function* () {
    const ids = new Set<string>();
    let after: string | null = null;
    do {
      const page: z.infer<typeof closingIssuesPageSchema> =
        yield* githubGraphql(
          CLOSING_ISSUES_QUERY,
          { q, after },
          closingIssuesPageSchema,
        );
      for (const pr of page.data.search.nodes) {
        for (const issue of pr.closingIssuesReferences?.nodes ?? []) {
          ids.add(issue.id);
        }
      }
      after = page.data.search.pageInfo.hasNextPage
        ? page.data.search.pageInfo.endCursor
        : null;
    } while (after);
    return ids.size;
  });
}

/**
 * Fetches every `OSSActivity` metric. A metric whose request fails comes back
 * as 0 — the snapshot merge then holds the last good value.
 */
export async function getOSSActivity(
  username: string,
  repos: readonly string[],
): Promise<OSSActivity> {
  const scope = ossSearchScope(username, repos);
  const queries = ossActivityQueries(username, scope);

  const orZero = <E>(
    metric: OSSActivityMetric,
    effect: Effect.Effect<number, E>,
  ) =>
    effect.pipe(
      Effect.tapError((error) =>
        Effect.sync(() =>
          log.warn("activity metric failed", { metric }, error),
        ),
      ),
      Effect.catchAll(() => Effect.succeed(0)),
    );

  const [prsReviewed, prsOpen, issuesHelped, issuesOpened, issuesResolved] =
    await Effect.runPromise(
      Effect.all(
        [
          orZero("prsReviewed", searchIssueCount(queries.prsReviewed)),
          orZero("prsOpen", searchIssueCount(queries.prsOpen)),
          orZero("issuesHelped", searchIssueCount(queries.issuesHelped)),
          orZero("issuesOpened", searchIssueCount(queries.issuesOpened)),
          orZero("issuesResolved", countIssuesResolved(username, scope)),
        ] as const,
        { concurrency: REQUEST_CONCURRENCY },
      ),
    );

  return { prsReviewed, issuesResolved, prsOpen, issuesHelped, issuesOpened };
}
