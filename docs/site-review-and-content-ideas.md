# bhimraj.com.np — Site Review & Content Strategy

> Reviewed 2026-07-06. Covers engineering, SEO, content, design, and a researched content pipeline with two fully-cited blog drafts (see `docs/blog-drafts/`).

---

## 1. What's already strong

- **Solid architecture.** Turborepo + Bun monorepo, RSC-first Next.js 16, content-collections with Zod-validated frontmatter, and the GitHub snapshot pattern (no live API calls at build time, daily sync via Action) is genuinely well-engineered for a personal site.
- **Distinct design system.** Warm-dark + amber accent with registered `--color-site-*` tokens is consistent and avoids generic-portfolio look.
- **Real proof of work.** The OSS page with live-ish contribution stats, PR leaderboards, and star history is a differentiator most portfolios don't have.
- **Good hygiene.** Biome, syncpack, knip, vitest, lint-staged — the tooling story is stronger than most production repos.

## 2. Improvements by perspective

### 2.1 SEO & discoverability (highest impact, lowest effort)

| Gap | Fix |
|---|---|
| **No RSS/Atom feed** | Add `app/feed.xml/route.ts` generating RSS from `allBlogPosts`. Feeds drive syndication (daily.dev, hashnode import, planet aggregators) and are table stakes for a dev blog. |
| **No `robots.ts`** | Add `app/robots.ts` pointing at the sitemap. Right now crawlers get no directives at all. |
| **No JSON-LD structured data** | Add `Person` schema on the homepage and `BlogPosting` + `BreadcrumbList` on blog posts. This is what gets author cards / rich results. |
| **Sitemap is incomplete** | `app/sitemap.ts` only lists `""`, `blog`, `projects` — `/oss` and `/research` are missing. Also `lastModified: new Date()` on static pages tells Google every page changed today, every day; use real dates or omit. |
| **No OG image generation** | Blog posts reuse per-post images, but a `opengraph-image.tsx` (ImageResponse) route would give every post a branded card automatically. |

### 2.2 Engineering / correctness

- **`blog/[slug]/page.tsx` never 404s.** `generateMetadata` silently builds metadata from `post?.title` (i.e., `undefined`) and the page body uses a non-null assertion. With `dynamicParams` defaulting to `true`, an unknown slug crashes at runtime instead of returning `notFound()`. Same pattern in `projects/[slug]`. Add `if (!post) notFound();` in both.
- **Tests only exist in `packages/github`** (2 files). The web app has zero tests — `lib/toc.ts`, `lib/rate-limit.ts`, and `lib/security.ts` are pure and trivially testable.
- **API routes** (`/api/feedback`, `/api/subscribe`) would benefit from shared Zod request schemas + typed error envelopes.

### 2.3 Features worth adding

1. **Giscus comments on blog + project pages** — already your stated preference; GitHub-Discussions-backed, zero backend.
2. **`/about` page** — there's no long-form about/now page. Recruiters and collaborators look for it; the persona (Fetchly + Lightning AI Tier 2 + IEEE research + Kathmandu) is a strong story that currently only exists as a hero paragraph.
3. **Reading time + view counts** on posts (reading time is computable at build in the content-collections `transform`).
4. **Tag pages** (`/blog/tag/[tag]`) once post count grows — cheap programmatic SEO.
5. **`llms.txt`** — a plain-text index for AI crawlers; increasingly how devs get discovered by answer engines.
6. **Search** (⌘K) — defer until ~10+ posts.

### 2.4 Design polish (minor)

- Homepage section rhythm is good post-#51. The experience section now has expandable "More details" (shipped in this change) — **edit the placeholder highlight bullets in `experience-section.tsx` to match your actual work**.
- Blog index with 2 posts feels sparse — the fix is content, not CSS (see §3).
- Consider a subtle "last updated from GitHub snapshot at {date}" caption on the OSS page for trust.

---

## 3. Content strategy & researched blog ideas

**The core problem: 2 posts, newest from April 2023.** The infrastructure (MDX pipeline, TOC, share sidebar, sponsor slots, newsletter) is built for a publishing cadence that doesn't exist yet. One post a month for six months would transform the site.

**Your unfair advantage:** you contribute to LitServe/LitData/LitGPT and build VLM serving examples — model serving and inference is one of the hottest topics of 2026, and you have commit-level credibility in it.

### Research snapshot (July 2026)

- **Inference optimization is the #1 AI-infra skill.** Inference cost now exceeds training cost for deployed LLMs; prefill/decode disaggregation, FP8 quantization (default on H100/B200), and speculative decoding are the headline techniques. Frameworks: vLLM, SGLang, TensorRT-LLM, NVIDIA Dynamo, llm-d. ([Practical guide](https://jobsbyculture.com/blog/llm-inference-optimization-guide-2026), [llm-d blog](https://llm-d.ai/blog), [Spheron inference-engineering guide](https://www.spheron.network/blog/inference-engineering-guide-2026/))
- **2026 research themes:** hybrid attention/SSM architectures (Nemotron-3, Qwen3.6, Mamba-3), KV-cache optimization, long context for agents, reasoning + RL, test-time compute. ([Sebastian Raschka's 2026 paper list](https://magazine.sebastianraschka.com/p/llm-research-papers-2026-part1))
- **Agents & MCP went mainstream.** MCP (spec rev 2025-11-25) has 110M+ monthly downloads, adoption by OpenAI and Google, and thousands of community servers — with a growing literature on interop protocols (MCP/A2A/ACP/ANP) and MCP security (tool injection, weak auth, supply-chain risk). ([Protocol survey, arXiv:2505.02279](https://arxiv.org/pdf/2505.02279), [MCP security framework, arXiv:2604.05969](https://arxiv.org/pdf/2604.05969))

### Blog pipeline (ranked)

| # | Title (working) | Why you / why now |
|---|---|---|
| 1 | **Serving LLMs in 2026: a field guide to inference optimization** | Drafted → `docs/blog-drafts/`. Your LitServe credibility; top search topic. |
| 2 | **MCP explained: how agents actually talk to tools (and where it breaks)** | Drafted → `docs/blog-drafts/`. Requested topic; huge search volume, few grounded writeups. |
| 3 | Deploying a vision-language model behind LitServe: Qwen2-VL end to end | Drafted → `docs/blog-drafts/`. Built from your `chat-with-qwen2-vl` repo. |
| 4 | KV cache from first principles: why long context is a memory problem | Drafted → `docs/blog-drafts/`. Evergreen explainer; pairs with #1. |
| 5 | Speculative decoding in practice: what 2–3× TTFT actually costs you | Benchmark-driven; runnable on a single GPU. |
| 6 | Streaming large training datasets with LitData: lessons from contributing | Only a handful of people can write this; great for Lightning visibility. |
| 7 | Prefill/decode disaggregation, explained with diagrams | The llm-d/Dynamo architecture everyone cites but few explain simply. |
| 8 | Building an agent that reviews your GitHub PRs with MCP | Hands-on agents content; reuses your GitHub data-layer skills. |
| 9 | FP8 vs INT4: a quantization decision guide for small teams | Practical, benchmarkable, high search intent. |
| 10 | UNet in 2026: revisiting my most-read post with modern tooling | Refresh your existing top post (2023) — updates rank faster than new URLs. |
| 11 | How I keep my portfolio's GitHub stats fresh without hitting the API | Drafted → `docs/blog-drafts/`. Meta-post about this repo's snapshot architecture. |
| 12 | From Kathmandu to Tier 2: how to become a serious OSS contributor | Draft skeleton → `docs/blog-drafts/` (needs your voice for the personal sections). Highly shareable. |

**Cadence suggestion:** ship #1 and #2 (drafts ready), then alternate tutorial (#3, #5, #8) and explainer (#4, #7) monthly. Refresh #10 whenever traffic dips.

### Sources

- [LLM Inference Optimization: A Practical Guide for AI Engineers (2026)](https://jobsbyculture.com/blog/llm-inference-optimization-guide-2026)
- [llm-d blog — distributed inference](https://llm-d.ai/blog)
- [Sebastian Raschka — LLM Research Papers: The 2026 List](https://magazine.sebastianraschka.com/p/llm-research-papers-2026-part1)
- [What Is Inference Engineering? The 2026 GPU Cloud Guide](https://www.spheron.network/blog/inference-engineering-guide-2026/)
- [Survey of agent interoperability protocols (MCP, ACP, A2A, ANP) — arXiv:2505.02279](https://arxiv.org/pdf/2505.02279)
- [A Formal Security Framework for MCP-Based AI Agents — arXiv:2604.05969](https://arxiv.org/pdf/2604.05969)
- [LLM Inference Handbook 2026 — Towards AI](https://pub.towardsai.net/llm-inference-handbook-2026-135c266b86e7)
