# Orgs, teams and access control (verified 2026-10-07)

## 1. Personal account vs organization
- Orgs are shared accounts with owners, teams, roles, org-wide policies; a personal repo only has "collaborators" (flat access). https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations
- Repo transfer carries: issues, PRs, wiki, stars, watchers, webhooks, secrets, deploy keys, commit history, forks, LFS. Old URLs redirect (git + web). https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository
- Not carried: GitHub Pages site (links redirect, the site does not). Original owner stays as collaborator; issue assignments to non-members dropped on personal->org. Same page.
- Outside collaborator = non-member with access to specific repos only; no base permission applies to them. https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization
- Rule of thumb for the post: create an org as soon as a second person or any customer data/CI secrets are involved (opinion, not doc).

## 2. Org roles
- Owner (full admin), Member (default), Billing manager, Security manager (security alerts/settings org-wide), Moderator (block users, interaction limits, hide comments), GitHub App manager, Outside collaborator. Keep at least two owners. https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization
- Custom organization roles: Enterprise Cloud only (per that page).
- Base permission: Settings > Member privileges. Options none/read/write/admin; applies to all members, existing and new; higher grants override it; not applied to outside collaborators. Default listed in docs as read. https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization
- Best practice: base = read (or none), grant write via teams.

## 3. Teams
- Visible teams: seen/@mentioned by all members. Secret teams: only members + owners see them; cannot be nested. Child teams inherit parent's repo access; mention handle is flat. https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams
- Repo roles: Read (view/discuss), Triage (manage issues/PRs, no push), Write (push, merge), Maintain (repo settings, no destructive), Admin (full incl. delete). https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization
- Team maintainers can manage team membership/settings (the docs fetch did not detail this; see uncertain).
- Auto-assignment of PR reviews: round robin (least recent request) or load balance (considers outstanding reviews, ~30 days); "Busy" members skipped. https://docs.github.com/en/organizations/organizing-members-into-teams/managing-code-review-settings-for-your-team
- Team sync (IdP groups -> teams): Enterprise Cloud only; Entra ID and Okta; does not provision users. https://docs.github.com/en/organizations/managing-saml-single-sign-on-for-your-organization/managing-team-synchronization-for-your-organization
- Why teams: one membership change updates access to every repo the team touches; direct collaborator grants must be hunted down repo by repo at offboarding. Also CODEOWNERS and review requests can target teams.

## 4. Custom repository roles
- Enterprise Cloud only; up to 20 per org. https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/about-custom-repository-roles

## 5. Protecting main
- Pricing now: Free $0; Team $4/user/mo; Enterprise $21/user/mo. Team adds repository rules, code owners, required reviewers, 3,000 Actions min; Enterprise adds SAML SSO, SCIM, audit log API, environment protection, 50,000 min. https://github.com/pricing
- Branch protection rules: on public repos in Free orgs; all repos in Team/Enterprise Cloud. So private repos on Free org: no protection. https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Rulesets: public repos on Free; public + private on Pro/Team/Enterprise Cloud. Org-wide rulesets: Team/Enterprise per the docs (the about-rulesets page says Enterprise for org-wide; conflicting, see uncertain). Up to 75 per repo. https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Rulesets vs classic: many rulesets stack (most restrictive wins; also layer with classic rules); enforcement can be toggled to evaluate/disabled without deleting; read-access users can see them; can match commit metadata. Same page.
- Bypass list: roles (e.g. repo admin), teams, GitHub Apps. Same page.
- Rules/settings: required PR reviews, required status checks, signed commits, linear history, block force-push (examples named in docs). "Require merge queue" rule is not available in org-level rulesets. https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- Pricing page says merge queue is a Team/Enterprise capability for private repos.

## 6. Security hygiene
- Require 2FA: Org Settings > Authentication security. Members without it lose access but keep seat; outside collaborators are removed (3 months to re-enable and be reinstated); bots as collaborators need 2FA too; can require only secure methods (passkeys, keys, authenticator, mobile app). https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-two-factor-authentication-for-your-organization/requiring-two-factor-authentication-in-your-organization
- Dependabot security updates/alerts: available on private repos on all plans (pricing page). https://github.com/pricing
- Secret scanning + push protection: free on public repos; private repos need paid GitHub Secret Protection (requires Team or Enterprise plan). https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security
- Standalone products since 2025-04-01: Secret Protection $19/active committer/mo, Code Security $30/active committer/mo, metered billing, purchasable on Team. https://github.blog/changelog/2025-04-01-github-advanced-security-is-here-for-github-team-organizations
- Audit log: owners only; 3 months shown by default, up to 180 days via `created`; export JSON/CSV. API/streaming is Enterprise. https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization
- Offboarding checklist: remove from org (membership data kept 3 months for reinstatement); private forks lose access but local clones remain; revoke PATs/SSH keys/deploy keys they created; rotate secrets they could read; reassign repos/Apps/webhooks they owned; check outside-collaborator grants; review audit log for their last 90 days; remind them to delete local confidential data. https://docs.github.com/en/organizations/managing-membership-in-your-organization/removing-a-member-from-your-organization

## 7. 2025-2026 changes
- 2025-03/04: Advanced Security split into Secret Protection and Code Security, available to Team. https://github.blog/changelog/2025-03-25-introducing-github-secret-protection-and-github-code-security/
- Custom repo role cap listed as 20 on Enterprise Cloud (5 on GHES before 3.19).
- No 2026 org/access changelog entries confirmed (see below).

## Plan gotchas
- Free org + private repo: branch protection, rulesets, required reviews, CODEOWNERS enforcement silently do nothing/unavailable; "protected" UI may simply be absent. Anyone with write can push to main.
- Free: no secret scanning/push protection on private repos.
- Org-wide rulesets, custom roles, team sync, SAML, audit log streaming: Enterprise.
- 2FA enforcement removes outside collaborators outright.
- Base permission does not apply to outside collaborators.
- Bypass lists can quietly weaken rules; owners/admins in them skip checks.

## Suggested diagrams
1. Users -> Teams (nested: Engineering > Backend) -> Repos with permission-level labels.
2. Plan ladder: Free / Team $4 / Enterprise $21 with a matrix of "main protection" features, private-repo column highlighted.
3. Offboarding flow: remove from org -> access disappears through teams -> rotate secrets -> audit log check.

## Beginner explanation
A GitHub organization is a company account instead of your personal one, so the code belongs to the business and not to one founder. Instead of giving each person access to each project, you put people into teams like "Engineering" and give the team access, so someone joining or leaving is one change. Paying a few dollars per user (Team plan) is what lets you lock the main branch so nobody can break production by accident.

## Unverified/uncertain
- Whether org-wide rulesets work on Team (about-rulesets says Enterprise; search snippet says Team).
- Merge queue plan rules: docs page silent; only the pricing page summary supports Team/Enterprise for private repos.
- Team maintainer powers and default base permission for new orgs (docs fetch said read; some sources say default is "read" for new orgs) not independently confirmed.
- Audit log availability on Free vs Team not confirmed.
- No dated 2026 changelog entries found; prices ($4/$21) from a fetched summary of github.com/pricing, recheck before publishing.
