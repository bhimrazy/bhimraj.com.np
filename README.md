# bhimraj.com.np

Personal portfolio, blog, and OSS journal — source for [bhimraj.com.np](https://bhimraj.com.np).

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ec5604ed-65d5-47d5-9cd2-a04ce358258b" />

## Stack

A **Turborepo + Bun workspaces** monorepo. Next.js 16 (App Router, RSC),
Tailwind CSS v4 + shadcn/ui, Content Collections (MDX), Resend + React Email,
PostHog, Biome — deployed on Vercel.

```
apps/web                 # the Next.js site
packages/github          # @bhimrazy/github — GitHub data layer + daily snapshot
packages/utils           # @bhimrazy/utils  — shared logger
```

## Getting started

```bash
git clone https://github.com/bhimrazy/bhimraj.com.np.git
cd bhimraj.com.np
bun install
cp apps/web/.env.example apps/web/.env.local   # fill in your keys
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
bun dev                # dev server
bun run build          # production build
bun typecheck          # tsc across workspaces
bun test               # vitest
bun lint               # biome lint
bun run knip           # unused-code check
bun run lint:versions  # one version per dependency across workspaces
bun run sync           # regenerate the GitHub snapshot
```

## GitHub data

The site reads GitHub stats from a committed snapshot
(`packages/github/data/snapshot.json`) instead of fetching live — accurate,
fast, and rate-limit free. A daily GitHub Action regenerates it and opens a PR
when the numbers change.

## License

MIT — see [LICENSE](./LICENSE).
