# The GitHub Field Guide: series spec (contract for all agents)

Working dir: **the author's main workspace** `/Users/bhimrajyadav/Developer/Personal/bhimraj.com.np` (on branch `feat/github-field-guide`). The old scratchpad worktree `wt-guide` was removed. Don't use it.
Research fact sheets: `/private/tmp/claude-501/-Users-bhimrajyadav-Developer-Personal-bhimraj-com-np/205d6a8e-3093-487e-8c5b-b499c46dabde/scratchpad/research/01..05-*.md`.
**Do not commit, push, or touch git state.** The main session commits. Only edit the files your task owns.

## Audience and promise
One series, beginner to advanced, for:
- **Founders / non-engineers** who use VS Code and GitHub daily but never learned it properly.
- **Beginner developers** (first job, first team).
- **Team leads / startup engineers** setting up an org, CI and releases.
- **Advanced engineers** who want the 2026 picture (rulesets, reusable workflows, OIDC, AI agents).
It's also the author's own reference and a **workshop handout** (each part = one ~60–90 min workshop session).

## Parts (flat slugs under /blog/<slug>)
| part | slug | title (working) | level |
|---|---|---|---|
| 0 | `github-field-guide` | The GitHub Field Guide: how a modern team works on GitHub (hub) | all |
| 1 | `git-and-github-foundations` | Foundations: Git, GitHub, and the shape of the work | beginner |
| 2 | `git-setup-across-devices` | One setup, every machine: auth, signing, dotfiles and switching devices | beginner→intermediate |
| 3 | `github-organizations-and-teams` | Running a startup on GitHub: orgs, teams, access and guardrails | intermediate |
| 4 | `github-cli-issues-prs-projects` | Work from the terminal: gh, issues, PRs and Projects | beginner→intermediate |
| 5 | `git-branching-and-releases` | Branching and releases that don't hurt | intermediate |
| 6 | `github-actions-automation` | Automate it: GitHub Actions from first workflow to reusable pipelines | intermediate→advanced |
| 7 | `ai-coding-agents-on-github` | Agents on the team: Claude, Codex and Copilot on GitHub | advanced (founder-readable) |

Files: `apps/web/src/content/blog/<slug>.mdx`.

## Frontmatter (exact)
```yaml
---
title: "…"
description: "… one or two sentences, <160 chars ideally"
publishedAt: "2026-10-07"
updatedAt: "2026-10-07"
tags: [github, git, …]
image: "/blog/github-field-guide/part-N.png"   # hub = part-0.png
series: "github-field-guide"
part: N                 # 0 = hub
level: "beginner"       # beginner | intermediate | advanced | all
verifiedAt: "2026-10-07"
---
```
(`featured: true` only on the hub.)

## MDX components (available by name, no imports)
Built by the infra track; writers use exactly these APIs:
- `<Callout type="tip|note|warning|skip|founder" title="optional">markdown</Callout>`
  - `skip` = "Skip this if you already…"; `founder` = plain-English summary for non-engineers.
- `<Details summary="Deep dive: …">markdown</Details>`: collapsible depth and solutions.
- `<Level value="beginner|intermediate|advanced" />`: put on its own line right under an `##` heading to badge that section.
- `<Tabs>` / `<Tab label="macOS">…</Tab>`: OS- or tool-specific variants (macOS / Linux / Windows; or HTTPS / SSH). Choice is remembered across the page.
- `<Exercise title="…" time="10 min">` steps … `**Done when:** …` … optional `<Details summary="Solution">` `</Exercise>`: workshop blocks.
- `<Paths>` with `<Path who="Founder" parts="1,3,7">one line</Path>` children: hub only.
- `<SeriesParts />`: hub only; renders the list of all parts with titles, levels and descriptions.
- Series prev/next navigation and the "Part N of 7" label are rendered automatically by the layout. Don't write them.
- Terminal: use fenced ```` ```console ```` blocks with `$ ` before commands and output lines without it. The copy button copies only the commands. Use ```` ```bash ```` for pure scripts and ```` ```yaml title=".github/workflows/ci.yml" ```` for files (Shiki meta: `title=`, `{1,3-5}` highlights, `// [!code ++]` diffs).
- Figures: don't build them. Where one belongs, leave an MDX comment on its own line: `{/* FIGURE: <id> — <what it shows> */}`. Ids from the visuals inventory: `ecosystem-map`, `collaborators-vs-teams`, `pr-lifecycle`, `actions-triggers`, `agent-loop`, `two-devices`, plus any new id you need, which you should describe.
- Screenshots that need the author or the sandbox org: `{/* SCREENSHOT: <what> — needs author VS Code | needs sandbox org */}`.
- Story slots: `{/* VOICE: <prompt for a 1–3 sentence personal anecdote from Bhimraj> */}`. **Never invent anecdotes, numbers or employer details.**
- Plain markdown `![alt](/path)` followed by a paragraph starting `Figure: …` becomes a captioned figure.
- MDX gotchas: escape `{`, `}` and `<` in prose (write `\{`, or use inline code); GitHub expressions like `${{ secrets.X }}` only inside code fences/inline code.

## Sandbox org for examples
Examples use the fictional org **`acme-labs`**, teams `@acme-labs/web`, `@acme-labs/platform`, `@acme-labs/founders`, and repos `acme-labs/web`, `acme-labs/api`. (A real public sandbox will be created later for screenshots and the workshop. Keep names easy to swap.) Real public examples may reference the author's own repo `bhimrazy/bhimraj.com.np` (e.g. `.github/workflows/sync-github.yml`: daily schedule + workflow_dispatch + path filters + auto-PR).

## Structure of every part
1. Opening paragraph: what you'll be able to do after this part, and who it's for (2–4 sentences).
2. `<Callout type="founder">`: TL;DR in plain English (3–5 bullets).
3. `<Callout type="skip">` if it applies.
4. Sections (`##`, with `###` as needed), each badged with `<Level />`. Ordered from basic to advanced so readers can stop when they've had enough.
5. At least one `<Exercise>` (workshop-ready: goal, steps, "Done when").
6. `## Cheat sheet`: a compact table of commands/settings from the part.
7. `## What changes fast`: a short list of things in this part likely to change, with the docs link to check.
8. `## Further reading`: official docs links (docs.github.com, git-scm.com, cli.github.com, …).
Length target: 2,500–4,000 words. Part 7 and the hub can be shorter.

## Voice
- First person as Bhimraj Yadav (software engineer at Fetchly Labs, a remote US startup; Tier-2 OSS contributor at Lightning AI with 270+ merged PRs; based in Kathmandu). Direct, warm, practical. Second person "you" for instructions.
- Short paragraphs. Concrete before abstract: show the command, then explain it. Opinionated defaults ("Do this:"), with the alternatives in a `<Details>`.
- No filler or hype words: no "delve", "landscape", "crucial", "seamless", "robust", "In today's fast-paced world", "game-changer", "Let's dive in". Don't stack em dashes; prefer commas, colons and periods.
- Explain jargon the first time it appears (one clause). Founders must be able to follow the `founder` callouts and section intros even if they skip the code.

## Facts
- Use the research sheets. Facts marked uncertain/unverified there must be re-checked (WebFetch the official doc) or written conservatively ("at the time of writing, … check the docs"). Never state a price, plan limit, version or date you haven't verified; link the official doc next to it.
- Link official docs inline for every non-trivial claim.
- Cross-link parts by slug (`/blog/<slug>`), e.g. "see [Part 6](/blog/github-actions-automation)".
