# Environment variables

[Back to README](../README.md)

Copy `apps/web/.env.example` to `apps/web/.env.local`. Only names are listed here. Everything is optional for local development: a feature whose variables are missing is disabled or degraded.

| Variable                       | Purpose                                         | Used in                                  |
| ------------------------------ | ----------------------------------------------- | ---------------------------------------- |
| `RESEND_API_KEY`               | Resend API key (server only)                    | `apps/web/src/lib/resend.ts`             |
| `RESEND_AUDIENCE_ID`           | Audience that newsletter subscribers join       | `apps/web/src/lib/resend.ts`             |
| `RESEND_FROM_EMAIL`            | Verified sender address                         | `apps/web/src/lib/resend.ts`             |
| `FEEDBACK_NOTIFY_EMAIL`        | Inbox for feedback notifications                | `apps/web/src/lib/resend.ts`             |
| `NEXT_PUBLIC_POSTHOG_KEY`      | PostHog project key                             | `apps/web/src/instrumentation-client.ts` |
| `NEXT_PUBLIC_POSTHOG_HOST`     | PostHog host (defaults to the US region)        | `apps/web/src/instrumentation-client.ts` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | Google Analytics measurement ID                 | `apps/web/src/app/layout.tsx`            |
| `GITHUB_TOKEN`                 | Higher rate limits for `bun run sync`           | `packages/github`                        |
| `YOUTUBE_API_KEY`              | YouTube Data API key for `bun run sync:youtube` | `packages/youtube/bin/sync.ts`           |

`YOUTUBE_API_KEY` is read from the environment, or from `apps/web/.env.local` when run locally. Without `GITHUB_TOKEN` the GitHub sync still runs but is limited to 60 requests per hour and may be incomplete.

## GitHub Actions secrets

| Secret            | Used by                                       |
| ----------------- | --------------------------------------------- |
| `YOUTUBE_API_KEY` | `sync-youtube.yml`                            |
| `GITHUB_TOKEN`    | Built in; sync workflows and the lockfile job |
