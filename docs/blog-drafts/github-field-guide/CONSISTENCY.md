# Consistency notes across the GitHub Field Guide drafts

Observations only. Nothing was edited. Line numbers are from the drafts as of 2026-10-07 14:39. Part 7 (`ai-coding-agents-on-github.mdx`) wasn't drafted yet, so it isn't covered.

Files: P1 `git-and-github-foundations.mdx`, P2 `git-setup-across-devices.mdx`, P3 `github-organizations-and-teams.mdx`, P4 `github-cli-issues-prs-projects.mdx`, P5 `git-branching-and-releases.mdx`, P6 `github-actions-automation.mdx`, hub `github-field-guide.mdx`.

## Contradictions and likely factual clashes

1. **Draft PRs on private repos on Free.** P3 L362 (plan table) says draft PRs are "Public repos only" on Free. Several parts open draft PRs on private repos with no plan caveat. P1 L401 + L406 (exercise creates `git-practice --private`, then `gh pr create --draft`), P2 L472 + L526 (hand-off habit and exercise), P2 L505, P4 L270. If P3 is right, the beginner exercises fail on a Free personal account. Someone needs to verify this against github.com/pricing or the plans docs (the about-pull-requests page doesn't state availability).
2. **Bypass advice.** P3 L260 recommends a bypass list of `@acme-labs/founders` in "pull requests only" mode, with nobody on "always". P5 L152 ("If your ruleset allows bypass for admins…") and P5 L342 ("Admins on the bypass list can push straight through") assume admins bypass with direct push. That doesn't match P3's recommended setup, where a direct push would still be blocked.
3. **Rebase vs merge to update a branch.** P2 L263/L313 sets `pull.rebase true` globally. P5 L132 says that once review starts you should merge `main` into your branch rather than rebase. With P2's config, `git pull origin main` rebases, so a reader who follows both parts gets the opposite of P5's advice. P5 could mention `git merge origin/main` explicitly, or note the P2 setting.
4. **Updating main uses three different commands.** P1 L137–138 and the cheat sheet at L457 use `git switch main && git pull`. P5 L111–112 and the cheat sheet at L361 use `git pull --ff-only`. P2 configures `pull.rebase true`. None of these is wrong, but the parts never reconcile them.
5. **Workflows started by `GITHUB_TOKEN`.** P5 L291 says PRs and tags created with `GITHUB_TOKEN` "don't trigger most other workflows". P6 L407 is more precise: `pull_request` runs are created in an approval-required state. P5 defers to P6 ("Part 6 covers why"), but the two summaries read differently.
6. **Push protection on private repos.** P1 L300 says it's "turned on per repo or org" with the paid Secret Protection product, and doesn't mention that it requires Team or Enterprise. P3 L408 says it does. Not a contradiction, but P1 understates the requirement.
7. **Plan caveat missing from the P5 exercise.** P5 L333 ("Protect main and ship a squash-merged PR") says to create a ruleset in "a sandbox repo (for example `acme-labs/web`)". It doesn't mention that on a Free org this only works if the repo is public. P3 L341 and L231 do warn about this. The P5 exercise also relies on auto-merge (L334), which needs enforceable requirements.

## Wrong or unsupported cross-references

(Every `/blog/<slug>` link and in-page anchor resolves to the right part or heading. The problems below are about content: the linked part doesn't cover what the link promises.)

8. **P4 L167:** "[Part 5] compares squash, merge and rebase." P5 only recommends squash (L89). The three-way comparison is in **P1 L195–215**.
9. **P3 L254:** "Require linear history … see [Part 5]". P5 never mentions linear history.
10. **P6 L291:** "release tags that a tag ruleset lets only maintainers create ([Part 5])". P5 covers tags and immutable releases but not tag rulesets. P3 covers only branch rulesets.
11. **P3 L401:** "Version updates need a `.github/dependabot.yml`, which [Part 6] covers." P6 L617–624 shows only the `github-actions` ecosystem, not app dependencies (npm and so on).
12. **P3 L336:** "[Part 5] covers when you need one" (merge queue) is fine, but P3 hedges availability ("check the docs for your plan"), while P5 L175 states it outright (public org repos, or private on Enterprise Cloud). P3's plan table (L355–366) has no merge-queue row.

## Duplicated explanations (same material, two or more places)

13. **Personal account vs organization, the rule of thumb, and repo transfer.** P1 L306–322 and P3 L30–64 are close to identical: the same "My rule of thumb" sentence, the same list of what moves on transfer, the same note that Pages isn't redirected, and the same `git remote set-url` tip. P1 could shrink to two sentences and a link.
14. **Closing keywords.** P1 L228 and P4 L392–397.
15. **Auto-merge** (what it is, plus "Allow auto-merge" in settings). P4 L165 and P5 L128.
16. **Draft PRs explained.** P1 L170–179, P4 L132 and P5 L125, each recommending "open a draft early".
17. **Squash-only repo setting.** P1 L207 and P5 L89, with slightly different instructions. P5 adds "default to PR title" and "auto-delete head branches".
18. **Installing gh.** P2 L47–83 and P4 L30–71. Both state "gh 2.102.0". The Linux links differ: P2 L64 links to `docs/install_linux.md`, P4 L55 to `cli/cli#installation`.
19. **`gh run list / watch / view --log-failed`** are explained in both P4 L187–196 and P6 L65–71.
20. **Push protection.** P1 L300 and P3 L403–414.
21. **Worktrees.** P2 L429–458 has the full explanation. P4 L109 and L154 repeat `--worktree`, which is fine because they link back.

## Figure ids reused with conflicting specs

22. **`pr-lifecycle`** has three different descriptions. P1 L168 is the basic draft→review→merge flow. P4 L119 starts from an issue, uses `gh` commands and moves a Project card. P5 L106 includes CODEOWNERS and a merge queue toggle. The figure builder needs one spec, or three ids (for example `pr-lifecycle`, `pr-lifecycle-gh`, `pr-lifecycle-queue`).
23. **`ecosystem-map`** appears in P1 L42 and in the hub. The hub asks for the same figure with part labels. Decide whether that's one component with a prop or two figures.

## Terminology and formatting mismatches

24. **UI path separator.** P1 and P2 use bold segments with `>` (P1 L207 "**Settings** > **General** > **Pull Requests**", P2 L231, L377). P3–P6 use plain `→` (P3 L48, P4 L401, P5 L89, P6 L284). The hub follows `→`.
25. **Exercise section heading.** P1 L394 and P2 L492 use `## Workshop exercises`. P5 L330 and P6 L651 use `## Exercises`. P3 and P4 put exercises inline under topic sections with no heading.
26. **Callout titles.** The founder callout has no title in P1 L16 and P2 L16, and `title="The short version"` in P3–P6. The skip callout has `title="Skip this if you already…"` in P3 L24 and P4 L24, and no title in P1, P2, P5 and P6.
27. **Merge flag order and short forms.** P4's cheat sheet at L487 uses `gh pr merge --auto --squash -d`. P1 L461, P4 L162 and P5 L119/L364 use `--squash --auto --delete-branch` in varying order. Pick one form.
28. **`git remote set-url` protocol.** P1 L319 uses an HTTPS URL. P3 L64 uses SSH, even though P2 L131 makes HTTPS the default recommendation.
29. **"gh" vs "`gh`".** P1 always uses code formatting. P2 and P4 mostly write bare "gh" in prose (for example P2 L117, P4 L73).
30. **"Org Settings" naming.** P3 uses "Org Settings → Advanced Security (labelled Code security in some orgs)" at L401. P3's cheat sheet at L482 says "Repo → Settings → Advanced Security". Consistent within P3, but P1 L300 doesn't name the path at all.
31. **Frontmatter `level`.** P2 and P4 are `beginner`, although the spec lists them as beginner→intermediate. That's fine because the enum has no range value. But the P2 sections on signing, dotfiles, Codespaces and worktrees are all `intermediate`, so most of P2 sits above its page-level badge.

## Sequencing

32. **P1 uses `gh` before it's installed.** P1 L57 and the exercise at L401 use `gh repo create`, `gh pr create` and `gh pr merge`. Install and sign-in only come in P2. P1 L66 points readers to P2, but a workshop run in part order breaks at Session 1. The hub tells facilitators to send P2's setup as pre-work.
