# Screenshots (public pages, logged out)

Captured 2026-10-07 with headless Playwright 1.58: Chromium, `colorScheme: "dark"`, 1440×900, JPEG q80. Nothing here needed a login.

| File | URL | What it shows | Use in |
|---|---|---|---|
| `actions-sync-github-workflow.jpg` | `/actions/workflows/sync-github.yml` | Run list for "Sync GitHub snapshot" (218 runs). Scheduled runs on `main` are green. Runs triggered by bot PRs on `chore/github-snapshot` (#108) show a yellow warning and "Action required". | Part 6 (schedule trigger, run history). The "Action required" rows mean those runs are waiting for a maintainer to approve them. Confirm why in the repo's Actions settings before the post explains it, or crop to the green rows. |
| `pr-87-checks.jpg` | `/pull/87/checks` | Merged PR #87, Checks tab: Vercel, CI Testing, CodeQL, Sync GitHub snapshot, Code scanning. Opens on "Vercel Preview Comments" by default. | Part 1 / 5 (checks on a PR) |
| `pr-87-ci-run-summary.jpg` | `/actions/runs/32593030917` | CI Testing run for PR #87: `ci.yml on: pull_request`, jobs `test` (1m 9s) and `link-check` (9s) green, plus 3 annotations. **Strongest shot**: the job graph reads well. Logs need sign-in ("Sign in to view logs"). | Part 6 (jobs, on: pull_request) |
| `pr-87-merge-timeline.jpg` | `/pull/87` (crop) | Timeline tail: Vercel preview deploy, "bhimrazy merged commit 40b49bd into main", "8 checks passed", then branch deleted. | Part 1 (merge) |
| `pr-87-conversation-full.jpg` | `/pull/87` (full page) | Whole PR: "What does this PR do?" body, commit, Vercel bot comment, CodeRabbit "Review limit reached" warning, merge. | Reference only; too long and too busy to embed |
| `releases.jpg` | `/releases` | Release "v1.0.0: Major Redesign and Improvements", tag `1.0.0`, Latest badge, auto-generated "by @bhimrazy in #36" style notes. | Part 5 (releases, generated notes) |
| `tags.jpg` | `/tags` | The single tag `1.0.0`. | Part 5 (optional) |

## Issues to fix before publishing

- **PR #87's title has a shell-escaping bug**: it reads `GitHub'\''s 403 rate limit`, a leftover from `gh pr create --title '...'` quoting. It shows in the checks and run screenshots. Either retitle the PR (`gh pr edit 87 --title "…GitHub's 403…"`) and re-capture, or pick another PR. It also makes a nice "quote your titles" aside for Part 4.
- The tag is `1.0.0` but the release title says `v1.0.0`. Part 5 should pick one convention (semver usually means `v1.0.0` tags).
- All shots include GitHub's global header with the logo. Crop to below the repo nav (y ≈ 175) before embedding. That's tidier, and it keeps the GitHub mark from becoming the subject of the image.
- Logged-out pages show the Sign in / Sign up chrome. For signed-in views (merge box with checks list, Settings, rulesets), use the sandbox org.
