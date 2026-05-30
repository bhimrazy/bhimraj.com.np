# bhimraj.com.np

Personal portfolio, blog, and OSS journal — source for [bhimraj.com.np](https://bhimraj.com.np).

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Screenshots

<!-- Add screenshots here -->

## Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, RSC) |
| **Runtime** | Bun |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Content** | Content Collections (MDX/Markdown) |
| **Email** | Resend + React Email |
| **Analytics** | PostHog + Google Analytics |
| **Linting** | Biome |
| **Deployment** | Vercel |

## Getting started

```bash
git clone https://github.com/bhimrazy/bhimraj.com.np.git
cd bhimraj.com.np
bun install
cp .env.example .env.local   # fill in your keys
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
bun dev            # dev server
bun run build      # production build
bun typecheck      # tsc --noEmit
bun lint           # biome lint
bun format:write   # biome format --write .
bun knip           # unused exports check
bun email:preview  # render email templates to .email-preview/
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend — newsletter + feedback emails |
| `RESEND_AUDIENCE_ID` | Resend audience for subscribers |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `FEEDBACK_NOTIFY_EMAIL` | Where feedback notifications go |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog region host |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | GA4 measurement ID |

## Project structure

```
src/
  app/
    (web)/          # Main site (Header + Footer layout)
    api/            # subscribe + feedback routes
    globals.css     # Design tokens + Tailwind base
    layout.tsx      # Root layout
  components/
    homepage/       # Hero, Experience, OSS preview, Blog preview, Newsletter
    blog/           # Blog components (ToC, share, code-copy)
    oss/            # Timeline, contribution graph
    ui/             # shadcn/ui primitives
  config/site.ts    # Site-wide constants
  content/          # MDX blog posts + project markdown
  emails/           # React Email templates (welcome, feedback)
  lib/              # Utilities, analytics, rate-limit, security
```

## License

MIT — see [LICENSE](./LICENSE).
