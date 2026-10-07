# 04 - AI coding agents in the GitHub workflow (verified 2026-10-07)

Status key: GA / Preview. Sources are official docs unless noted.

## 1. GitHub Agent HQ + third-party agents (Claude, Codex)
- Claude and Codex can be assigned from the issue Assignees dropdown, the Agents tab (web/mobile), PRs, and VS Code 1.109+. Agent starts, opens a **draft PR**. Iterate by @claude / @codex mentions in PR comments. **Public preview.** https://github.blog/changelog/2026-02-04-claude-and-codex-are-now-available-in-public-preview-on-github/ and https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents
- Plans: Feb 2026 changelog said Pro+ and Enterprise only. Current docs say Pro, Pro+, Max, Business and Enterprise. Docs are newer; treat as "all paid Copilot tiers", but re-check at publish time.
- Enablement: individuals toggle at github.com/settings/copilot/coding_agent; enterprises enable via Enterprise AI Controls, then per org (changelog above). Agent must be enabled in policies.
- Cost: changelog says 1 premium request per session during preview. Current docs say third-party agents consume Actions minutes + "AI credits", with usage billing for overages. Pricing wording has changed (see Uncertain).
- Generated code gets CodeQL, secret scanning and dependency checks before the PR, no GHAS license needed (third-party doc above).

## 2. Copilot cloud agent (formerly "coding agent") - GA
- Background agent: researches repo, plans, implements, pushes to ONE branch, one PR per task, single repo, 59-minute max session. https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent
- Built-in protections: write access required to trigger; pushes to a single branch only; cannot approve PRs; Actions workflows stay disabled until a human approves; the person who asked cannot approve the PR; firewalled internet; hidden characters stripped from input (anti prompt injection); signed commits crediting Copilot + requester; audit logs. https://docs.github.com/en/copilot/concepts/agents/coding-agent/risks-and-mitigations
- Env config: `.github/workflows/copilot-setup-steps.yml`, one job named `copilot-setup-steps`, only read from default branch, timeout max 59 min; failed setup step does not stop the agent. https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/customize-the-agent-environment
- Instructions: `.github/copilot-instructions.md`, path-specific `.github/instructions/NAME.instructions.md` (cloud agent + code review only), `AGENTS.md` (nearest wins), `CLAUDE.md`/`GEMINI.md` at root. https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
- Docs note it is incompatible with branch protection that restricts commit authors (about-coding-agent page).
- Billing: Pro $10/300 premium requests, Pro+ $39/1,500, overage $0.04/request. Cloud agent has its own SKU for budgets. Copilot code review costs **13 premium requests per PR review from June 1, 2026**. https://docs.github.com/en/copilot/concepts/billing/copilot-requests (GA)

## 3. Claude Code
- `/install-github-app` (github.com only; needs `gh` authed and repo admin): installs Claude GitHub App, stores secret `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`, opens PR adding workflows (`claude.yml`, optional `claude-code-review.yml`). https://code.claude.com/docs/en/github-actions (GA, action at `@v1`)
- anthropics/claude-code-action: interactive mode (@claude in issue/PR comments, reviews, new issues) vs automation mode (`prompt` input; any event incl. cron `schedule`). Also `assignee_trigger`, `label_trigger`. https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md
- Permissions for the app: Contents, Issues, Pull requests read/write minimum; the official app requests a larger set (Actions, Workflows, Checks, etc.); a custom app can limit it. Workflow `permissions:` typically contents/pull-requests/issues write, `id-token: write`, `actions: read`.
- Auth alternatives: API key, OAuth token (subscription; tied to one person, so use API key for org-wide), Bedrock/Vertex/Foundry via OIDC, workload identity federation (no static secret).
- Only users with write access can trigger; bots rejected unless in `allowed_bots`. Gotcha: commits made with the default `GITHUB_TOKEN` do not trigger CI.
- Cost controls: `--max-turns`, workflow timeouts, concurrency groups, concise CLAUDE.md. Costs = Actions minutes + API tokens (or subscription).
- Claude Code in the cloud / on the web (claude.ai/code, `claude --cloud "task"`, older `--remote`): runs in an Anthropic-managed VM, pushes branches, PR created from the session, `--teleport` pulls it back. Plans: Pro, Max, Team, Enterprise (premium seats). Git credentials stay outside the VM via a proxy. https://code.claude.com/docs/en/claude-code-on-the-web (docs do not label it preview; treat as GA)
- Auto-fix PRs (`/autofix-pr`): watches CI failures and review comments, pushes fixes; needs the Claude GitHub App. Warning: its replies post as your account and can trigger `issue_comment` workflows.
- Locally the CLI uses plain git and `gh`; no special setup.

## 4. OpenAI Codex
- Codex cloud: connect GitHub in ChatGPT (Work in > Cloud environments), isolated tasks, review diffs, open PRs. https://learn.chatgpt.com/docs/cloud (redirect from developers.openai.com/codex/cloud)
- Code review: `@codex review` on a PR, or automatic reviews in settings; `@codex fix the P1 issue` starts a cloud task that pushes to the branch. Customize with a `## Code Review Rules` section in AGENTS.md. Security review is research preview. https://learn.chatgpt.com/docs/third-party/github
- Codex CLI: not re-verified this session (see Uncertain). Plan requirements for Codex cloud not stated on fetched pages.

## Comparison table
| Agent | Runs | Trigger | Plan / cost | Best for |
|---|---|---|---|---|
| Copilot cloud agent | GitHub-hosted (Actions) | Assign issue to Copilot, @copilot, Agents tab | Copilot plan + premium requests (GA) | Zero-setup issue-to-PR, tightest GitHub-native guardrails |
| Claude via Agent HQ | GitHub-hosted | Assignee dropdown, @claude in PR | Copilot plan, premium req/AI credits (Preview) | Trying Claude without own workflow |
| Claude Code Action | Your Actions runners | @claude, labels, assignee, cron, PR events | API tokens or Claude sub + Actions minutes (GA) | Customizable automation, scheduled jobs, review |
| Claude Code on the web | Anthropic VM | claude.ai/code, `--cloud`, mobile | Pro/Max/Team/Ent, shared rate limits (GA) | Parallel tasks from phone/terminal |
| Codex cloud / @codex | OpenAI cloud | ChatGPT task, @codex review/fix | ChatGPT plan (details unverified) | Review plus fix loops |

## Suggested diagram: the agent loop
Issue (clear acceptance criteria) -> assign/@mention agent -> agent runs in sandbox (reads AGENTS.md/CLAUDE.md, setup steps) -> pushes to agent branch -> draft PR -> CI needs human approval/runs -> AI review (optional) -> human reviews, comments @agent to iterate (loops back to sandbox) -> required checks + CODEOWNER approval -> human merges.

## Guardrails checklist
- Branch ruleset on main: require PR, required status checks, at least 1 approval, code owner review, block force pushes. Agents cannot bypass; do not add agent apps to bypass lists.
- Requester cannot approve own agent PR (Copilot built-in); require approval from someone else anyway.
- CODEOWNERS on workflows, infra, auth, migrations, `.github/`.
- Least privilege: workflow `permissions:` per job, `contents: read` for review jobs, custom GitHub App if full app perms too broad, OIDC/federation instead of long-lived keys, org-level secrets scoped to repos.
- Never expose production secrets or deploy credentials to agent environments; use separate environments with approvals.
- Prompt injection: issue/PR/comment text is untrusted. Limit who can trigger (write access only), avoid `allowed_non_write_users` and `allowed_bots: '*'` on public repos, keep network allowlist tight, don't give review agents write tools.
- Agents push to dedicated branches only (Copilot: one branch; keep claude/ copilot/ prefixes unprotected-for-push but main protected). Branch protection restricting commit authors breaks Copilot.
- Cost: `--max-turns`, timeouts, concurrency, budgets on premium requests/AI credits, watch the 13-request code review rate.
- Audit: signed commits, session logs, review agent PRs as you would an intern's.

## Day in the life (honest)
1. Write a tight issue (what, where, acceptance test). Vague issues give vague PRs.
2. Assign to agent; it works 5-30+ minutes (Copilot cap 59).
3. Draft PR appears; Actions workflows wait for your approval to run.
4. CI fails about as often as for a junior; ask @agent to fix, or push yourself.
5. Human reads every line; agents overbuild and miss context. Best for small, well-scoped, well-tested changes.
6. Merge after required checks + approval. Time saved is real on chores, weak on ambiguous design work (author opinion, not a sourced claim).

## Unverified / uncertain
- Which plans get Claude/Codex in Agent HQ: Feb 2026 changelog (Pro+/Enterprise) vs current docs (all tiers). Whether it is still "preview" today: docs still say public preview.
- Pricing: "1 premium request/session" (Feb changelog) vs "AI credits" (current doc). Confirm on the billing page.
- Agent HQ overview page URL 404'd; "Agent HQ" naming sourced from the changelog and press (TechRadar, InfoWorld; third-party).
- Codex CLI and Codex cloud plan requirements not checked; check https://developers.openai.com/codex.
- Whether rulesets with required reviews fully apply to agent PRs: consistent with docs (cannot approve, workflows need approval) but no page explicitly says "rulesets apply"; verify before asserting.
- Code review 13-premium-request cost came from a single doc fetch summary; re-verify.
