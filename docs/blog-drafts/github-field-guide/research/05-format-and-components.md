# 05 - Format patterns and renderable components (2026-10-07)

## Part A. What the site can render

Sources read via `git show` / `gh pr view` only. Paths are under /Users/bhimrajyadav/Developer/Personal/bhimraj.com.np/apps/web.

### Baseline (main)
- `content-collections.ts`: BlogPost schema = title, description, publishedAt, updatedAt, tags[], image, featured. Body is Markdown-ish `.mdx` compiled by `compileMarkdown` (rehype-slug + Shiki github-light/dark). No series/part/level/verifiedAt fields. No MDX components on main.
- `src/app/(web)/blog/[slug]/page.tsx`: renders `post.html` via dangerouslySetInnerHTML in a `prose` div; 3-column layout (sticky TOC | article | share); `extractToc` (`src/lib/toc.ts`); SponsorCard; metadata/OG.
- `src/components/blog/`: toc.tsx, title-section, share-sidebar, sponsor-card, code-copy-buttons.tsx (DOM-injected copy button on every `article pre`).

### PR #102 (feat/blog-reading-experience) adds
- TOC: desktop sticky rail with scroll-spy (h2/h3, h3 indented); `mobile-toc.tsx` = native `<details>` collapsible (works without JS); reading-progress.tsx bar.
- `components/blog/rehype-article.ts`: leading h2 becomes dek; `![]()` becomes `<figure>`, a following "Figure: ..." paragraph becomes figcaption (numbered "Fig. N" by CSS); h2/h3 hover permalinks; tables wrapped in a scroll container; external links open in a new tab. Blog-only.
- globals.css: `--container-measure: 38rem` (text) and `--container-wide: 46rem` (pre, figure, .table-wrap break out). `post-end.tsx`, `posts.ts` added.

### PR #105 (feat/interactive-mdx, stacked on #102) adds
- MDX compile path: `compileMDX` alongside `compileMarkdown` (html still feeds dek/TOC/reading time); `rehype-drop-dek.ts`; components available by name, no imports, via `components/mdx/mdx-components.tsx` (only Figure, CodeWalkthrough, Step, UNetExplorer, UNetTrace, Shape, PubSubSimulator, RequestVsEvent today). Adding a component = one line there.
- Primitives: `figure.tsx` (Figure frame, label, caption, Narration), `controls.tsx` (ControlBar, PlayButton, Segmented, Scrubber), `hooks.ts` (usePlayback, useTimeline, useMediaQuery, reduced-motion), `code-walkthrough.tsx` (step through one block, line highlights per step). `components/mdx/README.md` documents the bar for figures.
- Shiki (`shiki-transformers.ts`) for all posts and projects: ```` ```py title="x.py" ```` filename bar, `{1,4-6}` meta highlights, `[!code highlight|focus|++|--|error|warning]` diffs, data-line numbering. `types/content-collections.d.ts` is hand-written and must match the schema; clear `.content-collections` after config edits.

### Inventory vs. need
| Need | Status | Effort |
|---|---|---|
| TOC (desktop and mobile), progress, permalinks | Done in #102 (h2/h3 only) | 0 |
| Code titles, line highlight, diffs | Done in #105 | 0 |
| Copy button | Exists (DOM-injected), no per-block label | 0-S |
| Figures, images, captions, tables | Done (#102/#105) | 0 |
| Terminal styling (`$` prompt vs output, non-copyable prompt) | Missing. Shiki `bash`/`console` works; no prompt/output split | S (0.5 d: `<Terminal>` or `console` transformer that marks output lines and copies only commands) |
| Callouts (Tip/Note/Warning/"Skip if you know X") | Missing; only styled blockquote | S (0.5 d: `<Callout type>` MDX component) |
| Collapsible sections (deep-dive, answers) | Not styled; mobile TOC proves `<details>` works | S (`<Details>`, 0.25 d) |
| OS tabs (macOS/Linux/Windows) | Missing | M (1 d: `<Tabs>`/`<OsTabs>`, client, persist choice in localStorage, SSR default; also surface for no-JS: render all as stacked) |
| Level badges (Beginner/Intermediate/Advanced) | Missing | S (`<Level>` pill + a `levels` frontmatter) |
| "Choose your path" block | Missing | S-M (1 d: `<Paths>` cards linking to heading anchors, can pair with a TOC filter) |
| Series/part field, prev/next, hub page | Missing: schema, `.d.ts`, page and blog index all need changes | M (1-2 d: `series`, `part`, `order`, `verifiedAt` fields; series nav component; hub page route) |
| "Last verified" stamp | Only updatedAt exists | S (`verifiedAt` and `ghVersion` fields in title-section) |
| Checklists/exercise blocks for workshops | Missing | S-M (static `<Exercise>` with `<details>` solution; interactive tick state optional via localStorage) |
| Printable cheat sheet | Missing | M (route with `@media print` CSS, or one-page MDX with `<CheatSheet>`; 1 d) |
| TOC with h4 / per-part TOC for a very long post | h2/h3 only | S |
| Walkthrough of a PR/branch flow figure | Reuse Figure + Segmented/Scrubber; bespoke figure | M each |
Rough total for the reusable kit (Callout, Details, Terminal, Tabs, Level, Paths, Exercise): 3-4 days; series plumbing and cheat sheet add 2-3 days.

Caveat: blog index/RSS handling of series not inspected in depth; main still serves `html`, so none of this works until #102 and #105 merge.

## Part B. Format patterns

(Fetched where noted; leerob.com was not fetched this session. The author's memory file `reference_blog_figure_patterns.md` already records its figure patterns.)

1. State the audience and promise up front. Josh Comeau's Flexbox guide opens with "Whether you're a CSS beginner, or you've been using Flexbox for years, I bet you'll learn quite a bit", has a full TOC for non-linear reading, interactive widgets, named asides ("Not exactly the same", "A simpler approach?"), and shows publish and updated dates (updated April 2026). https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
2. Layered depth: free core, optional depth. Julia Evans uses one-page cheat sheets, "1 comic per tool", free intro zines and paid deeper ones, plus playground experiments, and frames learning as finding what you don't know. https://wizardzines.com/ Pro Git starts with basics and builds, using one running scenario for branching and a deep-dive chapter ("Reset Demystified"); it suits readers with some experience. https://open.umn.edu/opentextbooks/textbooks/pro-git-everything-you-need-to-know-about-git
3. Reading paths as a first-class block. GitHub Docs' intro page has a "Who is this for?" section naming students, PMs, security, researchers and others, and a "Where do I start?" list of next actions (it has no OS switcher or date on that page). https://docs.github.com/en/get-started/start-your-journey/about-github-and-git Recommended for us: a top "Pick your path" box (Founder: parts 1, 2, 7; Beginner: 1-4; Engineer: skim, then 5-9), plus "Skip if you already..." callouts and a TL;DR box per part.
4. Do not mix content types. Diataxis separates tutorial, how-to, reference, explanation; mixing dilutes each. Practical consequence: keep hands-on steps, concept sidebars (collapsed) and the cheat sheet (reference) visibly separate. https://diataxis.fr/
5. Workshop-ready: The Missing Semester is nine 1-hour lectures, each with video, notes and exercises, with AI tools woven across lectures rather than a single unit. Copy this: one self-contained unit per session with a goal, time estimate, prerequisite check, commands, an exercise and a "done when" check. https://missing.csail.mit.edu/
6. Freshness: Comeau's visible update date is the baseline. Fast-moving GitHub material needs more: per-section "Verified 2026-10, gh 2.x" stamps, a "what changes fast" marker on Actions and AI-agent sections, and a changelog at the bottom. Frontmatter `verifiedAt` plus a CI reminder (the repo already has a scheduled sync Action) can flag stale stamps. Link to GitHub Docs for details that change instead of copying them.
7. Not found / unverified: roadmap.sh's node-type model and progress tracking could not be confirmed from the fetched page (https://roadmap.sh/git-github); Julia Evans' blog-organization post URL returned 404. Treat these as untested ideas (must-learn/optional node tags are what I would borrow, via Level badges).

### One long post vs. series with a hub
- SEO: a hub with linked cluster pages builds topical authority; vendor-blog claims of 30-45% more traffic and 3x AI citations are marketing-sourced, treat as directional. A long post alone is "just a long blog post". https://www.conductor.com/academy/topic-clusters, https://superblog.ai/blog/pillar-pages-for-blogs/
- Reading time: one 15k-word post is a hard sell to beginners and founders; parts of 10-15 min let each audience take its slice and give workshops a session map.
- Maintenance: parts age at different rates (Actions and agents fast, branching slow); a series lets you re-verify one part, and stamp it, without touching others. A single post is cheaper to build now but reread in full to verify.
- Recommendation: hub page (paths, TL;DR, cheat sheet, index) plus 6-9 part pages sharing a `series` field, each standalone with level badge and verified stamp; a "read all as one page" print/all-in-one route serves the self-reference and handout need. If time-boxed, ship the hub plus 3 parts first.

Sources: URLs inline above.
