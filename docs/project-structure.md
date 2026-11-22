# Project structure

[Back to README](../README.md)

A Bun workspaces monorepo orchestrated by Turborepo.

```text
apps/
  web/                 Next.js site
packages/
  github/              @bhimrazy/github: GitHub data layer and snapshot
  youtube/             @bhimrazy/youtube: YouTube lecture data and snapshot
  utils/               @bhimrazy/utils: shared logger
.github/               CI, CodeQL, scheduled sync workflows, PR template
```

## apps/web

| Path                     | Contents                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `src/app`                | Routes, metadata, Open Graph images, feed, sitemap, manifest |
| `src/app/(web)`          | Pages: home, blog, projects, oss, research, resources        |
| `src/app/api`            | `subscribe` and `feedback` route handlers                    |
| `src/components`         | UI by feature, plus shadcn/ui primitives in `ui/`            |
| `src/content`            | Markdown and MDX: `blog`, `projects`, `resources`            |
| `src/config`             | Site, blog and ads configuration                             |
| `src/lib`                | Helpers: metadata, feeds, Resend, rate limiting, analytics   |
| `src/emails`             | React Email templates                                        |
| `content-collections.ts` | Content schemas                                              |
| `tests`                  | Vitest tests                                                 |
| `public`, `scripts`      | Static assets; icon and splash generators                    |

## packages

Each data package exposes pure accessors over a committed JSON snapshot in its `data/` folder. `bin/sync.ts` regenerates the snapshot. See [content and data](content-and-data.md).
