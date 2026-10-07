# Fact sheet 02: CLI, issues, daily workflow, multiple devices (checked 2026-10-07)

## Versions (verified)
- gh CLI latest: 2.102.0 (2026-09-30), patched 4 vulnerabilities (downloads, attestation, skills): tell readers to upgrade. https://github.com/cli/cli/releases
- Git latest: 2.56.0 (2026-09-28). https://git-scm.com/
- gh 2026 features: `--attach` for images/videos on issues/PRs/comments (2.99.0); issue types, sub-issues, blocked-by/blocking (2.94.0); `gh discussion` (2.94.0); preview `gh repo read-file` / `read-dir` (2.95.0); worktree support in `gh pr checkout` and `gh issue develop --worktree`. https://github.com/cli/cli/releases

## 1. Commit hygiene
- Conventional Commits: `type(scope): summary`, e.g. `feat(auth): add magic link`, `fix: ...`, `docs:`, `chore:`; `!` or `BREAKING CHANGE:` footer marks breaking. https://www.conventionalcommits.org/en/v1.0.0/
- Good message: imperative, ~50-char subject, blank line, body explains why. Small commits = one logical change, easy to revert.
- Merge options (repo Settings > General > Pull Requests): merge commit (keeps all history), squash (one commit per PR, tidy main; best default for startups), rebase (linear, keeps each commit). https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github

## 2. GitHub CLI
```bash
brew install gh            # or winget install GitHub.cli ; upgrade: brew upgrade gh
gh auth login              # interactive: GitHub.com, HTTPS or SSH, browser
gh auth setup-git          # makes git use gh as credential helper (HTTPS)
gh auth status
gh repo create my-startup --private --clone
gh repo clone owner/repo
gh repo fork owner/repo --clone
gh issue create --title "Bug: login fails" --body "Steps..." --label bug
gh issue list --assignee @me --state open
gh issue develop 42 --checkout          # linked branch; also --name, --base, --list, --worktree
gh pr create --fill                     # title/body from commits
gh pr create --draft --fill
gh pr checkout 123
gh pr merge 123 --auto --squash --delete-branch   # --auto waits for required checks/reviews
gh pr review 123 --approve              # or --request-changes -b "why" / --comment -b "..."
gh run list --limit 5
gh run watch                            # pick a run; add --exit-status in scripts
gh run rerun <run-id> --failed
gh workflow run deploy.yml -f environment=staging -f version=1.2.0   # needs workflow_dispatch inputs
gh release create v1.0.0 --generate-notes
gh project list --owner @me ; gh project item-add <num> --owner @me --url <issue-url>
gh api repos/{owner}/{repo}/issues --jq '.[].title'
gh api graphql -f query='{ viewer { login } }'
gh alias set co 'pr checkout'
```
- Verified flags: `gh pr merge --auto`, `-s/--squash`, `-d/--delete-branch`, `--admin` (bypass requirements; warn readers). https://cli.github.com/manual/gh_pr_merge ; `gh issue develop` flags https://cli.github.com/manual/gh_issue_develop
- Other commands/flags above (auth, run, workflow, release, project, api, alias) are from memory of the manual, not individually re-fetched: see https://cli.github.com/manual/
- Project commands need token scope: `gh auth refresh -s project`.
- Extensions: `gh extension install dlvhdr/gh-dash` (PR/issue dashboard TUI); `gh extension browse`; also gh-copilot-style extensions. https://github.com/dlvhdr/gh-dash

## 3. Issues and planning
- Issue forms: YAML in `.github/ISSUE_TEMPLATE/*.yml` (fields: input, textarea, dropdown, checkboxes); `config.yml` can disable blank issues. https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms
- PR template: `.github/pull_request_template.md`. https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
- Closing keywords in PR body: `Closes #12`, `Fixes #12`, `Resolves #12` (close on merge into default branch). https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
- Sub-issues: up to 100 per parent, up to 8 nesting levels; progress shows in Projects and can be grouped/filtered. https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues
- Issue types (org-level: Bug, Feature, Task by default), labels, milestones (group issues/PRs toward a date, shows % done).
- Projects: views (table, board, roadmap), custom fields (status, priority, iteration, date), filters/grouping. Built-in workflows: closed issue/PR -> Done and merged PR -> Done (both on by default); auto-archive; auto-add from repos by filter. https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations

## 4. VS Code
- Source Control panel: stage (+), commit message box, Ctrl/Cmd+Enter to commit, Sync/Publish Branch button, diff gutter, branch picker in status bar.
- "GitHub Pull Requests" extension (`GitHub.vscode-pull-request-github`): list/review/check out PRs, create issues, comment inline. Sign in via built-in GitHub auth (Accounts menu, bottom-left); no token pasting. https://code.visualstudio.com/docs/sourcecontrol/github
- Git in VS Code uses the same credential helper as terminal on HTTPS.

## 5. Multiple devices
- SSH vs HTTPS: HTTPS + gh/Git Credential Manager is simplest for beginners; SSH keys: `ssh-keygen -t ed25519 -C "you@example.com"`, add via `gh ssh-key add ~/.ssh/id_ed25519.pub` (needs admin:public_key scope) or Settings > SSH keys. One key per device. https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- SSH commit signing (Git >= 2.34), verified:
```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgSign true
```
  Add the same public key on GitHub as a "Signing key" type. https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key
- Global defaults:
```bash
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true
git config --global rerere.enabled true
git config --global user.name "Your Name"; git config --global user.email "you@example.com"
```
  https://git-scm.com/docs/git-config
- Dotfiles repo: public/private repo with `.gitconfig`, shell rc; Codespaces can auto-apply it (Settings > Codespaces > Dotfiles). https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account
- VS Code Settings Sync: Accounts menu > Turn on Settings Sync (settings, keybindings, extensions, snippets) via GitHub login. https://code.visualstudio.com/docs/configure/settings-sync
- Codespaces + dev containers (`.devcontainer/devcontainer.json`): reproducible cloud environment; free monthly quota for personal accounts (check current numbers). https://docs.github.com/en/codespaces
- `git worktree add ../repo-hotfix -b hotfix/x` : second checkout of same repo, no stashing; `git worktree list`, `git worktree remove ../repo-hotfix`. https://git-scm.com/docs/git-worktree
- Switching machines: end of day `git switch -c wip/topic; git add -A; git commit -m "wip"; git push` (or `gh pr create --draft --fill`); on other machine `git fetch && git switch wip/topic`; squash later. `git stash` is local to one machine (never pushed), so it is not a sync mechanism; stashes are easy to forget.

## Top 15 commands cheat sheet
1. `gh auth login` 2. `gh repo create NAME --private --clone` 3. `git switch -c feat/x` 4. `git add -p` 5. `git commit -m "feat: ..."` 6. `git push` (autoSetupRemote) 7. `gh pr create --fill --draft` 8. `gh pr checkout N` 9. `gh pr merge --auto --squash -d` 10. `gh issue create` 11. `gh issue develop N --checkout` 12. `gh run watch` 13. `gh workflow run FILE -f k=v` 14. `gh release create vX --generate-notes` 15. `git worktree add ../x branch`

## Suggested diagrams/screenshots
- Flow: issue -> `gh issue develop` branch -> commits -> draft PR -> checks -> auto-merge -> Project item Done.
- Screenshot: VS Code Source Control + PR extension sidebar.
- Diagram: three merge strategies on a commit graph (merge, squash, rebase).
- Screenshot: Project board with Status field and sub-issue progress bars; or terminal screenshot of gh-dash.

## Workshop exercises (about 10 min each)
1. Set up: `gh auth login`, set global config defaults, create repo with `gh repo create`.
2. Issue form + PR template: add YAML form, open an issue, `gh issue develop`, PR with `Closes #N`.
3. Draft PR and auto-merge: `gh pr create --draft`, mark ready, `gh pr merge --auto --squash`, watch with `gh run watch`.
4. Device switch: push WIP branch, clone in a second folder (simulating device two) or open in a Codespace, continue, then try `git worktree`.

## Unverified/uncertain
- Exact flags for gh run/workflow/release/project/alias/auth and `gh ssh-key add` scopes are from memory, not fetched; run `--help` before publishing.
- Codespaces free quota amounts, gh-dash install name, and default issue types not re-checked.
- Merge-method doc and Conventional Commits URLs not fetched this session.
- gh 2.94/2.95/2.99 feature attribution is from the releases page summary (truncated; last ~11k chars unread).
