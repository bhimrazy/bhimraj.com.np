# bhimraj.com.np — Claude Code Context

## Stack
- **Framework**: Next.js (App Router, RSC)
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 + shadcn/ui (`new-york` style, `cssVariables: false`)
- **Content**: `@content-collections` for blog posts and projects (MDX/Markdown)
- **Linting**: Biome (replaces ESLint + Prettier)
- **Type checking**: TypeScript 6

## Commands
```bash
bun dev          # dev server
bun build        # production build
bun typecheck    # tsc --noEmit
bun lint         # biome lint
bun format:write # biome format --write .
bun knip         # unused exports check
```

## Design System
The site uses a **warm-dark** design as the default dark theme with an **amber** accent.

CSS custom properties (defined in `src/app/globals.css`):
- `--site-bg` / `--site-bg-secondary` / `--site-bg-tertiary` — background layers
- `--site-text` / `--site-text-secondary` / `--site-text-tertiary` — text hierarchy
- `--site-accent` / `--site-accent-hover` / `--site-accent-subtle` — amber accent
- `--site-border` / `--site-border-hover` / `--site-card-bg` — surfaces

Font variables (loaded via `next/font/google` in `layout.tsx`):
- `--font-display` → Space Grotesk (headings)
- `--font-body` → DM Sans (body text)
- `--font-mono` → JetBrains Mono (code, labels)

All `--site-*` vars are registered in `@theme` as `--color-site-*`, so use the Tailwind token directly: `text-site-accent`, `border-site-border`, `bg-site-card`, etc. Never use `text-(--site-accent)` or `text-[var(--site-accent)]`.

## Architecture
```
src/
  app/
    (web)/          # Main site with Header + Footer layout
      page.tsx      # Homepage
      blog/         # Blog list + post pages
      projects/     # Projects pages
      oss/          # OSS Journey page
      research/     # Research & reading notes
    api/subscribe/  # Newsletter subscription endpoint
    globals.css     # Design tokens + Tailwind base
    layout.tsx      # Root layout with fonts + ThemeProvider
  components/
    homepage/       # Hero, Experience, OSSPreview, BlogPreview, ResearchPreview, Newsletter
    blog/           # Blog-specific components
    projects/       # Project components
    ui/             # shadcn/ui components (Button, Card, Badge, Input, etc.)
  config/
    site.ts         # Site-wide constants (name, URL, links)
  content/          # MDX blog posts and project markdown files
  lib/
    utils.ts        # cn(), formatDate(), getReadingTime()
    types.ts        # Form state enum
```

## Key Conventions
- **Server components by default** — use `"use client"` only for interactivity/animations
- **shadcn/ui for UI primitives** — Button, Card, Badge, Input, Separator, etc.
- **CSS vars for theming** — never hardcode colors, always use `--site-*` vars
- **No inline comments** unless the WHY is non-obvious
- **Biome** for all formatting (not Prettier) — run `bun format:write` before committing
- **Content Collections** — blog posts live in `src/content/blog/*.mdx`, projects in `src/content/projects/*.md`

## Persona
Bhimraj Yadav — Software Engineer at Fetchly Labs, Tier 2 OSS contributor at Lightning AI (200+ contributions across PyTorch Lightning, LitServe, LitData, LitGPT), IEEE-published researcher. Based in Kathmandu, Nepal.
