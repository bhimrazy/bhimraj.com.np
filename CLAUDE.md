# bhimraj.com.np

Personal site: Next.js 16 (App Router) in a Bun + Turborepo monorepo. Setup and layout are in [README.md](README.md) and [docs/development.md](docs/development.md).

## Commands

Run from the root; Turbo fans out to each workspace.

```bash
bun dev
bun run build
bun typecheck
bun test
bun lint
bun format:write         # Biome formats everything; run before committing
bun run knip             # unused code
bun run lint:versions    # one version of each dependency across workspaces
bun run sync             # GitHub snapshot (GITHUB_TOKEN for full data)
bun run sync:youtube     # YouTube lectures snapshot (YOUTUBE_API_KEY)
```

## Rules

- Server components by default; `"use client"` only for interactivity.
- Style with the site tokens (`text-site-accent`, `border-site-border`, `bg-site-card`), defined in `apps/web/src/app/globals.css`. Never hardcode colours or write `text-[var(--site-accent)]`.
- Fonts: Space Grotesk (display), DM Sans (body), JetBrains Mono (mono).
- shadcn/ui for primitives.
- Named PostHog events go through `capture()` in `apps/web/src/lib/analytics.ts`; keep that list small.

## Data and content

- GitHub and YouTube data are committed snapshots in `packages/*/data`, refreshed by the sync commands and scheduled Actions. Never fetch them at build or request time; read them through the package accessors.
- Content Collections caches by content hash. After changing `content-collections.ts`, delete `apps/web/.content-collections`, and update `apps/web/src/types/content-collections.d.ts` by hand to match.

## About

Bhimraj Yadav, software engineer at Fetchly Labs and open source contributor to the Lightning AI projects, based in Kathmandu, Nepal.
