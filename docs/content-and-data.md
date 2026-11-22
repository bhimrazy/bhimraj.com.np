# Content and data

[Back to README](../README.md)

## Content

Blog posts, projects and resources are files in `apps/web/src/content`, compiled by Content Collections. Schemas are in `apps/web/content-collections.ts`; a file that breaks its schema fails the build.

| Collection  | Folder      | Format |
| ----------- | ----------- | ------ |
| `blog`      | `blog`      | `.mdx` |
| `projects`  | `projects`  | `.md`  |
| `resources` | `resources` | `.md`  |

Content Collections caches by content hash, not by config. After editing a schema, delete `apps/web/.content-collections` so it regenerates.

### Add a resource or course

1. Create `apps/web/src/content/resources/<slug>.md`.
2. Fill in the frontmatter. Required: `title`, `url`, `kind`, `source`, `tldr`, `topics`, `added` (`YYYY-MM-DD`).
   - `kind` is one of `course`, `book`, `talk`, `paper`, `article`.
   - `topics` come from the closed list in `apps/web/src/components/resources/taxonomy.ts`.
3. For a course with lecture videos, set `video: true` and `playlist` (a YouTube playlist ID). `materials` lists slides and labs per lecture; see `mit-6-5940-efficient-ai.md` for an example.
4. Run `bun run sync:youtube` to pull the lectures, then commit the updated snapshot.

## Data snapshots

The site makes no GitHub or YouTube calls at build or request time. It reads committed JSON through pure accessors.

| Source  | Snapshot                             | Refresh                | Schedule (GitHub Action)         |
| ------- | ------------------------------------ | ---------------------- | -------------------------------- |
| GitHub  | `packages/github/data/snapshot.json` | `bun run sync`         | Daily, 09:15 UTC                 |
| YouTube | `packages/youtube/data/youtube.json` | `bun run sync:youtube` | Mondays and Thursdays, 09:30 UTC |

Each action runs the sync and opens a pull request when the data changed. GitHub fetch targets are in `packages/github/src/config.ts`. Required variables are in [environment variables](environment.md).
