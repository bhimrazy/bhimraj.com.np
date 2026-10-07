# GitHub field guide: visual inventory

Types: **SVG** = static diagram, inline in a `<Figure>`; **INT** = interactive React figure (`components/mdx/`, follows the Figure guidelines); **SHOT** = screenshot; **TERM** = styled terminal block (Shiki `bash`/`console` with `title=`; real output pasted, never a picture of text).

Flags: **[SANDBOX]** needs the future sandbox org (signed-in or admin screens). **[VSCODE]** needs the author's own VS Code. [PROTO] = prototype exists in `diagrams/`.

All diagrams are generated from code (`_tools/diagrams.mjs`). Covers are in `covers/`. Public screenshots are in `screenshots/` (see `screenshots/NOTES.md`).

---

## Hub: what this is, map, reading paths, cheat sheet
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| H1 | SVG [PROTO] | **Ecosystem map** (`ecosystem-map.svg`) | Local Git, VS Code, gh → GitHub hub (repos, issues, PRs, releases) → Actions and AI agents. The one picture every part refers back to. | Generated |
| H2 | INT | **Reading-path picker** | Segmented control (Founder / Beginner / Team lead / Advanced) that highlights the parts to read on a 7-stop route (same motif as the covers). The SSR frame shows the "Beginner" path. | Generated (reuses the cover route) |
| H3 | TERM | **Cheat sheet** | 20 commands in 4 groups (daily git, gh PRs, gh issues/runs, release). It doubles as the printable workshop handout; add a print stylesheet. | Written |

## 1 Foundations
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 1.1 | SVG | **Git vs GitHub**: three boxes (working tree → staging → local repo) then push → remote | The core mental model: Git works offline; GitHub is a remote copy plus collaboration. A zoom-in of H1's left half. | Generated |
| 1.2 | SVG [PROTO] | **PR lifecycle** (`pr-lifecycle.svg`) | branch → commits → PR → checks → review → merge → tag, each step with its command. Shared with Part 5. | Generated |
| 1.3 | SHOT | **A real merged PR** | `pr-87-merge-timeline.jpg` ("merged… 8 checks passed"). | Captured (public) |
| 1.4 | SVG | **Personal vs org repo** | Two "owners" side by side: `you/repo` (you are the only admin) vs `acme/repo` (org owns it, people come and go). Tees up Part 3. | Generated |

## 2 Your setup across devices
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 2.1 | SVG [PROTO] | **Two devices synced** (`two-devices.svg`) | dotfiles repo, Settings Sync, `wip/*` branch; each machine keeps its own SSH key. | Generated |
| 2.2 | TERM | **`gh auth login` + `gh auth status`** | The real interactive prompts and status output, with the token redacted. | [AUTHOR] author's machine (terminal) |
| 2.3 | SHOT | **VS Code Settings Sync** | The "Turn on Settings Sync" dialog (GitHub account, what syncs) and the Accounts menu. | **[VSCODE]** |
| 2.4 | SHOT | **Verified signed commit** | The commit list showing the "Verified" badge (SSH signing). | [SANDBOX] (or any public repo once signing is on) |
| 2.5 | SVG (optional) | **git worktree** | One `.git` with two working directories (`main/`, `feat-x/`), both checked out at once. | Generated |

## 3 Running a startup org
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 3.1 | SVG [PROTO] | **Direct collaborators vs teams** (`teams-vs-direct.svg`) | Offboarding @asha costs 4 edits vs 1 edit. | Generated |
| 3.2 | INT | **Permission resolver** | Pick a person and a repo; the figure shows which grant wins (org base role, team, direct) and the effective role. Read/Triage/Write/Maintain/Admin run along a scale. | Generated |
| 3.3 | SHOT | **Ruleset editor** | Org → Settings → Rules → Rulesets: target branches, "Require a pull request", "Require status checks", bypass list. Note the plan gate: rulesets on private repos need Team. | **[SANDBOX]** (needs a Team-plan trial or a public repo) |
| 3.4 | SHOT | **People / Teams page and a CODEOWNERS review request** | The members list showing roles and outside collaborators; a PR showing "Review required by code owners". | **[SANDBOX]** |

## 4 Working from the terminal
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 4.1 | TERM | **gh round trip** | `gh issue create` → `gh issue develop` → `gh pr create --fill` → `gh pr checks --watch` → `gh pr merge --squash`, with real output. | [SANDBOX] repo (avoids polluting real repos) |
| 4.2 | SHOT | **Issue form** rendered (YAML on the left, form on the right) | Shows that `.github/ISSUE_TEMPLATE/bug.yml` becomes a structured form. | **[SANDBOX]** |
| 4.3 | SVG | **Issue hierarchy** | Issue type (Epic/Feature/Bug) → sub-issues → Project board columns. One accent on the parent. | Generated |
| 4.4 | SHOT | **Projects board** (table + board views) | A sandbox project filled from 4.1. | **[SANDBOX]** |

## 5 Branching & releases
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 5.1 | INT | **Strategy switcher**: GitHub Flow / trunk / GitFlow | The same 3 features drawn as a commit graph in each model (segmented control). The SSR frame shows GitHub Flow. | Generated |
| 5.2 | INT | **Merge strategies** | One branch merged three ways (merge commit / squash / rebase); the resulting `main` history redraws. | Generated |
| 5.3 | SVG | **Semver** | `v1.4.2` with three labelled parts: breaking / feature / fix, plus which bump each Conventional Commit type gives. | Generated |
| 5.4 | SHOT | **Release page with generated notes** | `releases.jpg` (v1.0.0). Also flag the `1.0.0` vs `v1.0.0` tag naming. For an immutable release badge, use the sandbox. | Captured (public); immutable releases [SANDBOX] |

## 6 Automation with Actions
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 6.1 | SVG [PROTO] | **Triggers map** (`actions-triggers.svg`) | The six doors into `on:`. | Generated |
| 6.2 | SVG | **Reusable workflow vs composite action** | Left: a workflow calling a workflow (jobs and runners of its own). Right: a step expanding into steps inside one job. The accent marks the boundary each one crosses. | Generated |
| 6.3 | SHOT | **Run graph** | `pr-87-ci-run-summary.jpg` (ci.yml, test + link-check) and `actions-sync-github-workflow.jpg` (scheduled runs). | Captured (public) |
| 6.4 | SVG | **OIDC, no stored secret** | Job ⇄ GitHub OIDC token → cloud trust policy → short-lived credential. One accent on the token. | Generated |
| 6.5 | TERM | **Hardened workflow** | Annotated YAML: `permissions: contents: read`, actions pinned by SHA with a `# v4` comment, `concurrency`, `runs-on: ubuntu-24.04`. Uses Shiki highlight and `[!code ++]`. | Written |

## 7 AI agents on GitHub
| # | Type | Visual | Purpose / content | Source |
|---|---|---|---|---|
| 7.1 | SVG [PROTO] | **Agent loop** (`agent-loop.svg`) | issue → agent → draft PR → CI → human review → merge, with the two feedback loops. | Generated |
| 7.2 | SHOT | **Assigning an issue to an agent** (Agent HQ assignee picker: Copilot / Claude / Codex) and the agent's draft PR with its session log. | **[SANDBOX]** (needs the agents enabled on the org) |
| 7.3 | SHOT | **`@claude` in a PR comment** (`anthropics/claude-code-action`) and its reply or commit. | **[SANDBOX]** (needs the action installed and an API key secret) |
| 7.4 | TERM | **Claude Code + gh locally** | A short session: Claude reads `gh issue view 12`, branches, runs tests, and `gh pr create --draft`. | [AUTHOR] author's machine (terminal; VS Code panel optional **[VSCODE]**) |

---

## Cover system (`covers/`, 1200×630 PNG, dark)
The OG card's layout (eyebrow, title, subtitle, `bhimraj.` wordmark) sits on the project covers' seeded dot field. The shared motif is a **commit-log route** with 8 stations (00 map … 07 agents). The current part is amber with a topic branch merging into it, earlier parts are filled and later parts hollow, so the series reads as progress. No GitHub logo or Octocat. Source: `_tools/covers.mjs`, which ports cleanly to `next/og` (the dot field is plain SVG circles).

## Implementation notes for the diagrams
- Each diagram ships as a `680`-wide layout plus a `360`-wide `-narrow` layout. On the site, render both and toggle them with `hidden sm:block` / `sm:hidden`; one viewBox can't serve both widths without text falling below ~9px.
- Colours: `var(--site-*)` when inlined, with built-in fallbacks for both themes (`prefers-color-scheme`, `.dark` / `.light`, or `[data-theme]`). Standalone SVGs work in docs, slides and the handout.
- One off-token colour: `--f-act: #b45309` for **amber text on light** (amber-600 `#d97706` on white is about 3.2:1, below AA for small text). See the open questions.
- Accessibility: `role="img"` with `<title>`/`<desc>` wired through `aria-labelledby`. `build.mjs` makes ids unique when one SVG is inlined twice.

## Licensing of external imagery
| Source | License | Recommendation |
|---|---|---|
| **GitHub Docs** diagrams and images (`github/docs` `assets/`, `content/`) | **CC BY 4.0** (code is MIT); confirmed in the repo README and `LICENSE` | Reusable with attribution ("Image: GitHub Docs, CC BY 4.0", plus a link). Still **recreate instead**: their light-only, blue-accent style clashes with the site, and the content drifts as the docs change. |
| **Primer Octicons** (`primer/octicons`) | **MIT** | Fine for small icons (issue, PR, branch, tag) inside our SVGs. The GitHub logos (mark-github) are excluded and follow the GitHub logo guidelines, so don't use them. |
| **VS Code Codicons** (`microsoft/vscode-codicons`) | **CC BY 4.0** | Fine for VS Code UI icons with attribution. The VS Code product logo is a Microsoft trademark; don't use it. |
| GitHub logo, Octocat, Invertocat | Trademark (GitHub Logos & Usage policy) | Don't use them in covers or diagrams. Crop the header out of screenshots where possible. |
| Copilot / Claude / Codex logos | Trademarks of Microsoft/GitHub, Anthropic, OpenAI | Use text labels, as the diagrams already do. |
| Our own screenshots of github.com (public pages, our repo) | GitHub UI; editorial or educational use of your own repo is common practice | OK for commentary. Keep them cropped and current, and avoid implying endorsement. |
| Third-party blog diagrams (e.g. Atlassian GitFlow) | Usually all rights reserved | Don't copy them; recreate (5.1 does). |
