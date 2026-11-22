# bhimraj.com.np

Personal site of Bhimraj Yadav: Next.js 16 (App Router) in a Bun + Turborepo monorepo. Layout and setup: [docs/development.md](docs/development.md).

## Commands

Run from the root.

```bash
bun dev
bun run build
bun typecheck
bun run test             # not `bun test`, which is Bun's own runner
bun lint
bun format:write
bun run knip
bun run lint:versions
bun run sync             # GITHUB_TOKEN for full data
bun run sync:youtube     # needs YOUTUBE_API_KEY
```

## Rules

- Server components by default; `"use client"` only for interactivity.
- shadcn/ui for primitives. Style with the site tokens (`text-site-accent`, `border-site-border`, `bg-site-card`) from `apps/web/src/app/globals.css`; never hardcode colours or write `text-[var(--site-accent)]`.
- Fonts: Space Grotesk (display), DM Sans (body), JetBrains Mono (mono).
- PostHog events go through `capture()` in `apps/web/src/lib/analytics.ts`; keep the list small.
- GitHub and YouTube data are committed snapshots in `packages/*/data`. Never fetch them at build or request time; use the package accessors.
- After changing `content-collections.ts`, delete `apps/web/.content-collections` and update `apps/web/src/types/content-collections.d.ts` by hand.
- One version of each dependency across workspaces.
