# bhimraj.com.np

Personal site of Bhimraj Yadav: blog, projects, OSS contributions and learning resources. Live at [bhimraj.com.np](https://bhimraj.com.np).

## Stack

Next.js 16 (App Router), React Server Components, Tailwind CSS v4, shadcn/ui, Content Collections, Resend, PostHog, Biome, Vitest. Monorepo with Bun workspaces and Turborepo.

## Repository layout

| Path               | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `apps/web`         | The Next.js site                                       |
| `packages/github`  | `@bhimrazy/github`: GitHub data layer and snapshot     |
| `packages/youtube` | `@bhimrazy/youtube`: YouTube lecture data and snapshot |
| `packages/utils`   | `@bhimrazy/utils`: shared logger                       |

## Getting started

Requires [Bun](https://bun.sh) 1.4.4 (see `packageManager` in `package.json`).

```bash
git clone https://github.com/bhimrazy/bhimraj.com.np.git
cd bhimraj.com.np
bun install
cp apps/web/.env.example apps/web/.env.local   # optional, see Environment variables
bun dev                                        # http://localhost:3000
```

Run from the repository root:

| Command                 | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `bun run build`         | Production build                             |
| `bun typecheck`         | Type-check all workspaces                    |
| `bun test`              | Run Vitest                                   |
| `bun lint`              | Biome lint                                   |
| `bun format:write`      | Biome format                                 |
| `bun run knip`          | Find unused code                             |
| `bun run lint:versions` | One version per dependency across workspaces |

## Content and data

- **Content**: blog posts, projects and resources are Markdown/MDX files in `apps/web/src/content/{blog,projects,resources}`, loaded with Content Collections.
- **GitHub data**: the site never calls GitHub at build or request time. It reads a committed snapshot, `packages/github/data/snapshot.json`. Refresh it with `bun run sync`; a daily GitHub Action does this and opens a PR when the data changes. Fetch targets are in `packages/github/src/config.ts`.
- **YouTube data**: same approach, using `packages/youtube/data/youtube.json` and `bun run sync:youtube`, run twice a week by a GitHub Action.

## Environment variables

All are optional for local development; features that need a missing variable are unavailable. Copy `apps/web/.env.example` to `apps/web/.env.local`.

| Variable                                                    | Used for                                      |
| ----------------------------------------------------------- | --------------------------------------------- |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `RESEND_FROM_EMAIL` | Newsletter subscriptions and email via Resend |
| `FEEDBACK_NOTIFY_EMAIL`                                     | Recipient of site feedback notifications      |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`       | PostHog analytics                             |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS`                              | Google Analytics measurement ID               |
| `GITHUB_TOKEN`                                              | `bun run sync`: needed for full GitHub data   |
| `YOUTUBE_API_KEY`                                           | `bun run sync:youtube`                        |

## Deployment

Deployed on [Vercel](https://vercel.com); every pull request gets a preview deployment.

## Contributing

Run `bun format:write`, `bun lint`, `bun typecheck` and `bun test` before opening a PR; CI runs these plus a build. See `.github/pull_request_template.md`.

## License

[MIT](./LICENSE)
