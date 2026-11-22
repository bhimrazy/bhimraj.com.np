# Development

## Setup

Needs [Bun](https://bun.sh); the version is pinned in [`package.json`](../package.json).

```bash
bun install
bun dev   # http://localhost:3000
```

No environment variables are required; features without their keys are switched off. To enable them, copy [`apps/web/.env.example`](../apps/web/.env.example) to `apps/web/.env.local`.

Scripts are in the root `package.json`. Before a PR: `bun lint`, `bun typecheck`, `bun run test`.

## Layout

- [`apps/web`](../apps/web): the Next.js site. Pages in `src/app/(web)`, content in `src/content`, schemas in `content-collections.ts`.
- [`packages/github`](../packages/github), [`packages/youtube`](../packages/youtube): committed data snapshots in `data/`, rebuilt by `bun run sync` and `bun run sync:youtube`.
- [`packages/utils`](../packages/utils): shared logger.
- [`.github`](../.github): CI and the scheduled sync workflows.

## Content

Posts, projects and resources are Markdown/MDX files in `apps/web/src/content`. A file that breaks its schema fails the build. After changing a schema, delete `apps/web/.content-collections`.

## Newsletter

`/api/subscribe` adds the address to the Resend audience (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`) and sends a welcome email. Cloudflare Turnstile is checked server-side whenever `TURNSTILE_SECRET_KEY` is set, with tokens pinned to `bhimraj.com.np` unless `TURNSTILE_ALLOWED_HOSTNAMES` says otherwise; `NEXT_PUBLIC_TURNSTILE_SITE_KEY` shows the widget. Rate limits are in memory, per serverless instance.

## Data

The site reads GitHub and YouTube data from the snapshots, never from the APIs. The [sync workflows](../.github/workflows) refresh them on a schedule and open a PR when something changed. To run a sync locally, export `GITHUB_TOKEN` in your shell, or put `YOUTUBE_API_KEY` in `apps/web/.env.local`.
