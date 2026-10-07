# Fact sheet 03: Branching, releases, GitHub Actions (as of 2026-10-07)

Confidence tags: [V] fetched from an official GitHub page this session; [S] seen only in search snippets or third-party pages; [M] general knowledge, not re-verified.

## 1. Branching strategies
- GitHub Flow: `main` is always deployable; short-lived feature branch, PR, review, CI, merge, deploy. Best default for startups. [M] https://docs.github.com/en/get-started/using-github/github-flow
- Trunk-based: everyone merges to `main` at least daily, branches live hours, unfinished work hides behind feature flags. Needs strong CI and flags. [M] https://trunkbaseddevelopment.com
- GitFlow: long-lived `develop` plus `release/*`, `hotfix/*`. Suits versioned, multiple-supported-version software (mobile, on-prem, libraries). Heavy for a SaaS startup. [M] https://nvie.com/posts/a-successful-git-branching-model/ (author's own note says to prefer simpler flows for continuously delivered web apps)
- Release branches: cut `release/1.4` from `main` only when you must support old versions. Fix on `main`, cherry-pick (`git cherry-pick -x`) to the release branch. [M]
- Hotfix path (GitHub Flow): branch from `main`, PR, fast-track CI, deploy, tag a patch release. For release branches: fix on `main` first, then backport.
- Feature flags decouple deploy from release; keep them short-lived and delete after rollout. [M]
- Enforce the model with rulesets (require PR, status checks, linear history, merge queue). [M] https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Worked example: the author's `ci.yml` triggers on `main` and `release/*`, so it already anticipates release branches.

## 2. Releases
- SemVer MAJOR.MINOR.PATCH; tags like `v1.4.2`; a GitHub Release is a tag plus notes plus assets. https://semver.org
- Auto notes: `.github/release.yml` groups PRs by label. [M] https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes
```yaml
changelog:
  exclude: { labels: [skip-changelog] }
  categories:
    - title: Features
      labels: [feature]
    - title: Fixes
      labels: [bug]
```
- Tooling: release-please (Google; opens a "release PR" from Conventional Commits, merging it tags and releases), changesets (contributor-written changeset files; strong for monorepos/npm), semantic-release (fully automatic on every merge to main). Choose by: human control (changesets) vs commit convention (release-please) vs zero-touch (semantic-release). [M]
- Immutable releases: public preview 2025-08-26, GA 2025-10-28. Assets cannot be added, modified, or deleted after publish; tags are protected (cannot be deleted or moved). Releases get signed attestations in Sigstore bundle format. Enable per repo or org; only releases created after enabling are immutable. [V] https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/ and https://github.blog/changelog/2025-08-26-releases-now-support-immutability-in-public-preview/
- Verify with gh: [S, from gh manual snippets] https://cli.github.com/manual/gh_release_verify-asset
```bash
gh release verify v1.2.3                       # release is immutable + attestation valid
gh release verify-asset v1.2.3 my-asset.zip    # local file matches release attestation
```
- Practice: create the release as a draft, upload all assets, then publish (assets lock at publish).

## 3. Actions fundamentals
- Anatomy: workflow (YAML in `.github/workflows/`) contains `on:` triggers, jobs (each on a fresh runner, parallel unless `needs:`), steps (`run:` or `uses:`). [M] https://docs.github.com/en/actions/get-started/understand-github-actions
- Triggers (limits [V] https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows):
  - `schedule`: cron in UTC; minimum interval 5 minutes; runs only on the default branch; public-repo schedules are auto-disabled after 60 days without repo activity; docs advise avoiding top-of-hour times because load causes delays (delays can be many minutes, [M]).
  - `workflow_dispatch`: typed inputs (string, boolean, choice, number, environment); max 25 top-level inputs, payload up to 65,535 chars.
  - `workflow_run`: cannot chain more than 3 levels; has secrets and a write token, so treat the triggering run's artifacts as untrusted.
  - `pull_request_target`: runs in base repo context with secrets and write token; running untrusted PR code there is the classic "pwn request".
  - `repository_dispatch`: triggered by API with an `event_type`; default branch only. [M]
  - `workflow_call`: makes a workflow reusable.
```yaml
on:
  workflow_dispatch:
    inputs:
      env: { type: choice, options: [staging, prod], default: staging }
  schedule: [{ cron: "15 9 * * *" }]   # 09:15 UTC
```
- Concurrency: `concurrency: { group: deploy-${{ github.ref }}, cancel-in-progress: true }`. Use cancel for PR CI; never cancel production deploys. [M]
- Matrix: `strategy.matrix` fans a job across values (OS, language version); `fail-fast`, `include`/`exclude`. [M]
- Cache: `actions/cache` (10 GB per repo included, [V] billing page); artifacts: `actions/upload-artifact` / `download-artifact`, storage included 500 MB (Free) to 50 GB (Enterprise) [V] https://docs.github.com/en/billing/concepts/product-billing/github-actions
- Environments: hold secrets, variables, protection rules (required reviewers, wait timer, branch restrictions) for deploy jobs via `environment: production`. [M] https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
- 2025-12-08 change: environment branch rules for pull request events now evaluate against the execution ref, not the PR head. [V] https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes/

## 4. Reuse
- Reusable workflow (`on: workflow_call`, called with `jobs.x.uses: org/repo/.github/workflows/f.yml@ref`): whole-job reuse; up to 10 levels of nesting, 50 unique reusable workflows per file; `GITHUB_TOKEN` permissions can only be downgraded; caller-level `env` is not inherited; `strategy` (matrix), `needs`, `if`, `permissions`, `secrets: inherit` supported on the calling job. [V] https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations
- Composite action (`action.yml` with `runs.using: composite`): reuse a sequence of steps inside a job; no own runner or job-level features; secrets must be passed as inputs. [M]
- JavaScript action: fast, cross-platform, any runner. Docker action: any language/toolchain, Linux runners only, slower start. [M] https://docs.github.com/en/actions/sharing-automations/creating-actions
- Rule of thumb: composite = steps; reusable workflow = whole pipeline with its own jobs/environments; JS/Docker = real logic with testing and versioning.
- Org `.github` repo: `workflow-templates/*.yml` plus `.properties.json` give "starter workflows" in the Actions tab; `$default-branch` placeholder is replaced on use. [V] same reuse page. Also hosts default community health files. [M]

## 5. Runners
- Standard labels [V] https://docs.github.com/en/actions/reference/runners/github-hosted-runners:
  - Linux x64: `ubuntu-latest`, `ubuntu-24.04`, `ubuntu-22.04`, `ubuntu-26.04`; `ubuntu-slim` (1 CPU, 5 GB)
  - Linux ARM: `ubuntu-24.04-arm`, `ubuntu-22.04-arm`, `ubuntu-26.04-arm`
  - Windows: `windows-latest`, `windows-2025`, `windows-2025-vs2026`, `windows-2022`; ARM: `windows-11-arm`
  - macOS arm64: `macos-latest`, `macos-14`, `macos-15`, `macos-26`; Intel: `macos-15-intel`, `macos-26-intel`
  - Standard private-repo Linux: 2 CPU/8 GB per docs note; public repos get 4 CPU/16 GB.
- 2026 migrations:
  - Ubuntu 26.04 GA 2026-09-17 (preview since 2026-06-11); `ubuntu-latest` moves 24.04 to 26.04 gradually 2026-10-19 to 2026-11-19. Pin `ubuntu-24.04` to defer. [V] https://github.blog/changelog/2026-09-17-ubuntu-26-generally-available-and-latest-migration
  - macOS 14 retired 2026-11-02, brownouts from 2026-10-05; `macos-latest` is macos-26 per that notice. [S] https://github.blog/changelog/2026-10-01-github-actions-macos-14-runner-image-retirement
- Free minutes per month (private repos): Free 2,000; Pro 3,000; Team 3,000; Enterprise Cloud 50,000. Public repos on standard runners free. Included minutes cannot be used on larger runners. [V] billing page above
- Rates per minute: Linux 2-core $0.006 (1-core $0.002), Linux ARM 2-core $0.005, Windows 2-core $0.010, macOS $0.062. Rounded up to whole minute per job. Multipliers (old model) were Linux 1x, Windows 2x, macOS 10x; $ rates above roughly match. [V rates, M multipliers] https://docs.github.com/en/billing/reference/actions-minute-multipliers
- Larger runners: $0.006/min (Linux 2-core) up to $0.552/min (Windows 96-core); GPU Linux 4-core $0.052. [V]
- Self-hosted: free to run on your own infra, you own patching and isolation; never attach to public repos without ephemeral/JIT runners. [M]

## 6. Security
- `permissions:` default least privilege (`contents: read`), widen per job. Author's workflows set `contents: write, pull-requests: write` at workflow level (broader than ideal). [M]
- OIDC: `permissions: id-token: write`, then cloud trust policy on repo/ref/environment claims, no long-lived keys (AWS, GCP, Azure). [M] https://docs.github.com/en/actions/concepts/security/openid-connect
- Pin third-party actions to full commit SHA with a version comment. Policy now supports enforcing SHA pinning and blocking entries via `!` prefix (2025-08-15). [V via search] https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/
- Dependabot `package-ecosystem: github-actions` keeps pinned SHAs current. [M]
- Incidents to cite:
  - tj-actions/changed-files, CVE-2025-30066, March 14-15 2025: tags rewritten to a malicious commit that dumped runner memory secrets into logs; 23,000+ repos used it. [S] https://threats.wiz.io/all-incidents/tj-actionschanged-files-supply-chain-attack
  - aquasecurity/trivy-action, March 19-20 2026: 75 of 76 tags force-pushed, secrets exfiltrated, ~12 hour window. [S] https://wiz.io/blog/trivy-compromised-teampcp-supply-chain-attack
  - Lesson in both: mutable tags are not a security boundary; SHAs and immutable releases are.
- pull_request_target hardening: `actions/checkout` v7 (2026-06-18; backported 2026-07-20) refuses fork PR checkouts in `pull_request_target`/`workflow_run`; opt out via `allow-unsafe-pr-checkout`. [V] https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout

## 7. Notable 2025-2026 Actions changes
- 2025-08-15 allowlist block + SHA-pinning enforcement. [V via search]
- 2025-10-28 immutable releases GA. [V]
- 2025-12-08 `pull_request_target` always uses default branch; environment rules use execution ref. [V]
- 2026-03-26 Actions 2026 security roadmap: workflow `dependencies:` lockfile, policy-driven execution controls, scoped secrets, Actions Data Stream, native egress firewall; previews 3-9 months out. [V] https://github.blog/2026-03-26-whats-coming-to-our-github-actions-2026-security-roadmap/
- 2026-06 checkout v7 fork protections; 2026-09 Ubuntu 26.04 GA; macOS 14 retirement 2026-11-02.
- 2026-09-17 reported: public repos will have `pull_request_target` runs blocked by default from 2026-11-02 (evaluate mode now). [S, third-party only] https://www.digitalapplied.com/blog/github-pull-request-target-default-off-ai-review-bots

## Worked example: author's repo (.github/workflows)
- `sync-github.yml`: `schedule` (cron `15 9 * * *`, UTC with NPT conversion comment) + `workflow_dispatch` + `push`/`pull_request` with `paths:` filters (only runs on data-layer changes); `concurrency` keyed by ref with `cancel-in-progress` only for PRs; job-level `if: github.event_name == ...` splits validation runs (diff report, revert snapshot) from write runs; `peter-evans/create-pull-request@v8` opens or updates a PR only when the snapshot changed (no-op otherwise); uses built-in `GITHUB_TOKEN` as API token; `env: HUSKY: "0"` to skip hooks. Caveat: PRs created by `GITHUB_TOKEN` do not trigger other workflows (docs rule, [M]), so CI will not auto-run on the bot PR.
- `ci.yml`: push/PR on `main` and `release/*`, daily schedule that coexists with code checks; `actions/cache` keyed on `hashFiles('**/bun.lock')` with `restore-keys`; `--frozen-lockfile`; separate parallel `link-check` job (lychee). Note: a schedule also runs the `test` job daily (comment claims only link check).
- `dependabot-lockfile.yml`: `pull_request` + `paths: package.json`, job `if: github.actor == 'dependabot[bot]'`; checks out PR head branch, commits `bun.lock` back, comments with `github-script`. Demonstrates actor filtering, `outputs` via `$GITHUB_OUTPUT`, step `if`. Risk note: pushes with GITHUB_TOKEN will not retrigger CI.
- All use tag-pinned actions (`@v7`, `@v6`, `@v8`, `@v9`), not SHAs; a good "next step" teaching point. Also `codeql.yml` exists (not read).

## Decision table: which branching model
| Situation | Pick |
|---|---|
| 1-10 devs, SaaS/web, deploy on merge | GitHub Flow |
| Strong CI, daily deploys, mature team, flags available | Trunk-based |
| Ships versioned artifacts, supports several versions | Release branches (on top of GitHub Flow) |
| Scheduled app-store/on-prem release trains, QA phase | GitFlow (reluctantly) |
| Open source library | GitHub Flow + tags + release automation |

## Trigger cheat sheet
| Need | Trigger |
|---|---|
| Run CI on PRs | `pull_request` |
| Run on merge | `push: branches: [main]` |
| Manual button with inputs | `workflow_dispatch` |
| Nightly job | `schedule` (UTC, default branch, avoid :00) |
| External system pings you | `repository_dispatch` |
| After another workflow finishes | `workflow_run` (3-level max) |
| Be called by other workflows | `workflow_call` |
| Label/comment on fork PRs with secrets | `pull_request_target` (never check out PR code) |

## Suggested interactive figures
1. Trigger explorer: pick an event (push, PR from fork, schedule, dispatch) and see which workflows fire, which token and secrets they get, and a risk badge.
2. Branching model animator: toggle GitHub Flow / trunk / GitFlow and watch commits, flags, and a hotfix move through lanes.
3. Release pipeline: PR merged, release PR (release-please), tag, build, draft release, publish immutable, `gh release verify` result; click "tamper with asset" to show failure.
4. Cron-in-UTC clock: enter a cron plus your timezone (default Kathmandu, UTC+5:45) and see next runs and the 60-day-inactivity rule.

## Workshop exercises
1. Protect `main` with a ruleset (PR required, CI check required), open a PR, watch it block.
2. Write CI with matrix (Node 22/24) and cache; break a test and read the failure.
3. Add `workflow_dispatch` with a choice input and a `schedule`; trigger manually with `gh workflow run`.
4. Add `.github/release.yml`, label PRs, publish a release with generated notes.
5. Turn on immutable releases, publish `v0.1.0` with an asset, run `gh release verify` and `verify-asset`.
6. Extract the build into a reusable workflow and call it from two repos.
7. Replace a tag-pinned action with a SHA and add Dependabot for `github-actions`.
8. Deploy via OIDC to a cloud account with a `production` environment requiring a reviewer.

## Unverified/uncertain
- Exact cron delay magnitudes; docs only say delays occur at peak times.
- Minute multipliers (1x/2x/10x) not re-fetched; dollar rates were.
- Free-plan availability of the allowed-actions policy and SHA-pinning enforcement on all plans was NOT confirmed (searches returned nothing definitive); verify in Settings before claiming "all plans".
- `pull_request_target` default-block for public repos on 2026-11-02: only third-party sources found; the official 2026-09-17 changelog URL was not fetched.
- `gh release verify` syntax came from manual snippets; confirm with `gh release verify --help`.
- macOS `macos-latest` = macos-26 date (June vs August 2026) varies across sources.
- Composite action nesting limit (10 in older docs) and Docker action constraints not re-verified.
- release-please / changesets / semantic-release current status not re-checked.
- Release attestations: the "release attestation" and immutable release GA are the same GA event per the changelog.
