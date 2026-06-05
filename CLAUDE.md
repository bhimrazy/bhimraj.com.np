# bhimraj.com.np — Claude Code Context

## Stack
- **Monorepo**: Turborepo + Bun workspaces (`apps/*`, `packages/*`)
- **Framework**: Next.js 16 (App Router, RSC), Tailwind CSS v4 + shadcn/ui
- **Content**: `@content-collections` (MDX/Markdown) for blog + projects
- **Tooling**: Biome (lint/format), TypeScript 6, syncpack (version policy), Vitest

## Layout
```
apps/web                 # the Next.js site
packages/github          # @bhimrazy/github — GitHub data layer + snapshot
packages/utils           # @bhimrazy/utils  — shared createLogger()
```

## Commands (run from root; Turbo fans out per workspace)
```bash
bun dev            # dev server
bun run build      # production build
bun typecheck      # tsc across workspaces
bun test           # vitest
bun lint           # biome lint
bun run knip       # unused-code check
bun run lint:versions  # syncpack — one version per dependency across workspaces
bun run sync       # regenerate the GitHub snapshot (needs GITHUB_TOKEN for full data)
```

## GitHub data is a snapshot, not a live fetch
The site never calls GitHub at build/request time. `packages/github` fetches
everything once via the `sync` command and writes `data/snapshot.json`
(committed). Pages read it through pure accessors (`getOSSStats()`,
`getGitHubStars()`, …) from `@bhimrazy/github`. A daily GitHub Action
(`.github/workflows/sync-github.yml`) reruns `sync` and opens a PR when the
data changed. Fetch targets live in `packages/github/src/config.ts`.

## Design system (warm-dark default, amber accent)
Tokens in `apps/web/src/app/globals.css`, registered in `@theme` as
`--color-site-*`. Use the Tailwind token directly — `text-site-accent`,
`border-site-border`, `bg-site-card` — never `text-[var(--site-accent)]`.
Fonts (via `next/font` in `layout.tsx`): `--font-display` Space Grotesk,
`--font-body` DM Sans, `--font-mono` JetBrains Mono.

## Conventions
- Server components by default; `"use client"` only for interactivity.
- shadcn/ui for primitives; never hardcode colors — use `--site-*` tokens.
- Biome for all formatting; run `bun format:write` before committing.
- Keep one version of each dependency across workspaces (`bun run lint:versions`).

## Persona
Bhimraj Yadav — Software Engineer at Fetchly Labs, Tier 2 OSS contributor at
Lightning AI (PyTorch Lightning, LitServe, LitData, LitGPT), IEEE-published
researcher, based in Kathmandu, Nepal.
