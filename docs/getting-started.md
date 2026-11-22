# Getting started

[Back to README](../README.md)

## Prerequisites

[Bun](https://bun.sh) 1.4.4 (the `packageManager` in `package.json`). No environment variables are needed to run the site locally.

## First run

```bash
git clone https://github.com/bhimrazy/bhimraj.com.np.git
cd bhimraj.com.np
bun install
bun dev   # http://localhost:3000
```

Newsletter, feedback email and analytics stay disabled until you set their variables; see [environment variables](environment.md).

## Commands

Run from the repository root; Turborepo fans out to each workspace.

| Command                 | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `bun dev`               | Dev server                                   |
| `bun run build`         | Production build                             |
| `bun typecheck`         | Type-check all workspaces                    |
| `bun test`              | Run Vitest                                   |
| `bun lint`              | Biome lint                                   |
| `bun format:write`      | Biome format                                 |
| `bun run knip`          | Find unused code                             |
| `bun run lint:versions` | One version per dependency across workspaces |
| `bun run sync`          | Refresh the GitHub snapshot                  |
| `bun run sync:youtube`  | Refresh the YouTube snapshot                 |
| `bun run email:preview` | Preview the email templates                  |

## Before opening a PR

Run `bun format:write`, `bun lint`, `bun typecheck` and `bun test`. CI runs the version check, typecheck, Biome, tests and a build. The PR template is in `.github/pull_request_template.md`.
