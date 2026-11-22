# Development

[Back to README](../README.md)

## Run it

Needs [Bun](https://bun.sh) (version in `packageManager` in `package.json`).

```bash
bun install
bun dev   # http://localhost:3000
```

No environment variables are needed to run locally; features whose variables are missing are switched off.

## Commands

Defined in the root [`package.json`](../package.json): `dev`, `build`, `typecheck`, `test`, `lint`, `format:write`, `knip`, `lint:versions`, `sync` and `sync:youtube`. Run them with `bun run <name>`.

Before a PR: `bun format:write`, `bun lint`, `bun typecheck`, `bun test`.

## Layout

- [`apps/web`](../apps/web): the Next.js site. Pages are in `src/app/(web)`, content in `src/content`, schemas in `content-collections.ts`.
- [`packages/github`](../packages/github), [`packages/youtube`](../packages/youtube): data packages. Each reads a committed snapshot in its `data/` folder; `bin/sync.ts` rebuilds it.
- [`packages/utils`](../packages/utils): shared logger.
- [`.github`](../.github): CI, scheduled sync workflows, PR template.

## Environment

Names and comments are in [`apps/web/.env.example`](../apps/web/.env.example); copy it to `apps/web/.env.local`. `GITHUB_TOKEN` and `YOUTUBE_API_KEY` are only for the two sync commands (the YouTube key is also a repository secret for its workflow).

## Content and data

Blog posts, projects and resources are Markdown files in `apps/web/src/content`. A file that breaks its schema fails the build; after changing a schema, delete `apps/web/.content-collections`.

The site never calls GitHub or YouTube at build or request time. Scheduled GitHub Actions run the sync commands and open a PR when the snapshot changes (`sync-github.yml` daily, `sync-youtube.yml` Mondays and Thursdays, and on merged course-file changes).
