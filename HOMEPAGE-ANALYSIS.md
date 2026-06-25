# bhimraj.com.np — Site Analysis & Improvement Plan

> Generated 2026-06-26. Full pipeline: **strategy (CEO lens) → design review → content → prioritized plan.**
> Scope: homepage first, with knock-on notes for the rest of the site.
> Status of the codebase: already polished and professional — this is about going from *good* to *memorable*, not fixing what's broken.

---

## 0. TL;DR

The site is **well-built and visually clean**, but it **undersells the most valuable thing about you**. You are not a generic "Software Engineer" — you are a **Nepal-based engineer who is a Tier 2 contributor to the Lightning AI / PyTorch ecosystem** (tools thousands of ML teams run in production) and **IEEE-published in deep learning**. The homepage leads with the most generic possible framing and buries that edge.

Three highest-leverage moves:
1. **Rewrite the hero** to lead with your specific, ownable position — not a job title.
2. **Fix the content staleness** — the blog's newest post is from 2023, which quietly undercuts "Available for collaboration."
3. **Break the section monotony** — 7 sections, identical rhythm; add density variation and a visual climax.

---

## 1. Strategy review (CEO / founder lens)

### The core problem: you're positioned as a commodity

The hero says **"Software Engineer & OSS Contributor."** That's a *job title*, not a *position*. Every portfolio on the internet says some version of this. It's accurate but forgettable — it gives a visitor nothing to remember you by 10 seconds after they leave.

Your actual position is rare and hard to fake:
- **Tier 2 OSS contributor at Lightning AI** — you ship code into PyTorch Lightning, LitServe, LitData, LitGPT. These are tools used by real ML teams. That is *credibility by association with software people already trust.*
- **IEEE-published** researcher in semantic segmentation / computer vision.
- **Production engineer** at a US-serving consultancy, from **Kathmandu** — the "great engineer from an underrepresented hub" story is genuinely compelling and you're underplaying it.

### The 10-star reframe

Stop describing *what you are* (a role). Describe *what you do for the world* (a specific, ownable claim):

> **"I help build the open-source tools ML teams run in production."**

That single sentence does what the current hero can't: it's specific, true, differentiated, and instantly tells a visitor why you're worth their attention. Everything else (stats, experience, projects) becomes *evidence* for that claim instead of a flat list.

### What a visitor should leave thinking

Right now: *"…a software engineer. Okay."*
Target: *"This person actually ships code into the ML tools I use, publishes research, and is based in Nepal building for the world. I should follow / hire / collaborate."*

### Strategic gaps

| Gap | Why it matters | Fix |
|-----|----------------|-----|
| Generic headline | No memorable hook; you blend in | Lead with the Lightning/PyTorch-ecosystem claim |
| Stale blog (newest 2023) | Silently contradicts "Available for collaboration"; hurts SEO & "is this person active?" | Publish, or reframe the section so emptiness isn't the impression |
| "1 IEEE Publication" stat | Reads as weak next to "703+ stars" — a 1 feels small even though a publication is a big deal | Reframe as "IEEE-Published" badge, not a counted stat |
| Projects = demos | 9 "chat-with-X" repos read as tutorials, not flagship work | Surface `receipt-ocr` (your self-authored, star-growing repo) harder; curate |
| No single CTA spine | Two equal CTAs ("OSS Journey" / "Blog") with no priority | Pick the one action you most want and make it primary |
| Audience unclear | Is this for recruiters? Collaborators? ML peers? | Decide the #1 visitor and write to them |

### Decision you need to make

**Who is the #1 visitor?** The whole page should be tuned to one of:
- **A. Recruiters / clients** → lead with impact + "available," push contact.
- **B. ML/OSS peers & maintainers** → lead with contributions + research, push GitHub/follow.
- **C. Your future audience** → lead with writing + building-in-public, push newsletter.

Recommendation: **B with a strong A undertone.** Your edge is the OSS/research credibility; that *also* impresses recruiters. Build for peers, and recruiters will be more impressed than by a recruiter-tuned page.

---

## 2. Design review (designer's eye)

Visual craft is genuinely strong: consistent `--site-*` tokens, tasteful hover states, the featured-project star sparkline, the warm-amber accent. Ratings below are *0–10, where 10 is "nothing left to improve."*

### Scores

| Dimension | Score | What would make it a 10 |
|-----------|:----:|-------------------------|
| Visual consistency | 8 | Already strong. Minor: section eyebrow/h2/subtitle is *identical* 7× |
| Hierarchy & focal point | 5 | No climax. Every section weighs the same; the eye never lands |
| Rhythm & pacing | 4 | All 7 sections are `py-20` with the same internal pattern → monotony |
| Density | 5 | Very airy at 1440px; feels under-filled, lots of dead horizontal space |
| Hero impact | 6 | Beautiful, but headline says nothing; photo + stats carry it |
| Color & accent use | 8 | Amber is used well; could use one bolder accent moment |
| Motion | 7 | Tasteful (pulse dot, glow, sweep); nothing janky |
| Mobile | — | Verify single-column stack + tap targets (not deeply audited here) |

### Specific issues

1. **Monotonous section rhythm (biggest design issue).**
   Every section is `<section className="py-20">` → eyebrow (mono uppercase amber) → `text-3xl` h2 → `max-w-lg` subtitle → content → `SectionSeparator`. Seven times. The scroll has no acceleration, no breath, no climax. **Fix:** vary vertical padding (`py-16` / `py-24` / `py-32`), let one section go full-bleed or wider, and drop a separator or two so sections occasionally *flow* instead of always being walled off.

2. **No focal point / visual climax.**
   The page is a flat list of equal-weight cards. Pick **one** hero moment after the fold — e.g. the OSS contribution graph or the Lightning ecosystem stats rendered large — and make it the thing people screenshot.

3. **Generous-to-empty whitespace on desktop.**
   `Container` + `max-w-lg` subtitles leave large dead zones at ≥1440px. Either tighten the content column or use the width for a 2-column section (e.g. experience timeline beside a live stats panel).

4. **Hero headline is typographically loud but semantically empty.**
   The two-tone `Software Engineer / & OSS Contributor` treatment is gorgeous but spends your biggest type on the least distinctive words. Put the *specific claim* in that slot.

5. **Stats row: "1 IEEE Publication"** visually undercuts itself — a lone "1" next to "703+" and "422+" looks like a rounding error. Reframe as a badge/pill, not a counter.

6. **Blog preview exposes staleness.** Showing two posts dated 2023 and 2022 front-and-center advertises inactivity. Either publish, or restyle so dates are de-emphasized / show "Latest writing" without leading with old timestamps.

### What's already great (keep)
- The warm-dark + amber design system and token discipline.
- Featured-project sparkline (`featured-project.tsx`) — genuinely nice, lean into more data-viz like this.
- Experience timeline with the live Lightning ecosystem stats row.
- Hover glows and the `-translate-y-0.5` lift on cards.

---

## 3. Content review

| Surface | Current | Issue / Opportunity |
|---------|---------|---------------------|
| Blog | 2 posts (2022, 2023) | **Stale.** Biggest content liability. Need cadence or reframing. |
| Projects | 9 (`chat-with-*`, `receipt-ocr`, segmentation, OCR, TTS) | Mostly demos. `receipt-ocr` is the real flagship — promote it. |
| Research | 1 IEEE paper | Strong & credible; underused as a trust signal. Surface earlier. |
| OSS | Live Lightning ecosystem stats | **Your best asset** — already wired to real data. Make it the star. |
| Newsletter | "delivered occasionally" | Honest but weak promise; tie to a concrete value ("ML/OSS notes monthly"). |

**Content principle:** you have *more credibility than content surfaces show.* The OSS data is live and impressive; the research is real; the writing is thin. Lean hard on the live OSS/research signals and treat the blog as a slow-burn you reframe honestly rather than fake-inflate.

---

## 4. Prioritized implementation plan

### P0 — High impact, low effort (do first)
- [ ] **Rewrite hero headline + subhead** around the Lightning/PyTorch-ecosystem position. (`hero-section.tsx:38-52`)
- [ ] **Reframe "1 IEEE Publication"** stat as a badge, or swap for a stronger counted metric (e.g. repos contributed to). (`hero-section.tsx:17-22`)
- [ ] **Make one CTA primary.** Decide the #1 action; demote the other to text link. (`hero-section.tsx:54-68`)
- [ ] **De-emphasize blog dates** / relabel section so staleness doesn't lead. (`blog-preview.tsx`)
- [ ] **Vary section padding** — replace uniform `py-20` with a `py-16/24/32` rhythm. (all `homepage/*.tsx`)

### P1 — High impact, medium effort
- [ ] **Promote the OSS section to the visual climax** — render the contribution graph / Lightning ecosystem stats large, full-width, as the page's centerpiece.
- [ ] **Curate projects** — feature `receipt-ocr` prominently; group the `chat-with-*` demos under one "AI demos" cluster instead of 9 equal cards.
- [ ] **Tighten the content column / add a 2-col section** to kill desktop dead space.
- [ ] **Write the positioning copy** across the site to match the new hero claim (about/footer/meta description in `config/site.ts`).

### P2 — Strategic, ongoing
- [ ] **Publish 1–2 new posts** to break the 2023 staleness (e.g. a Lightning contribution write-up — you have the material for free).
- [ ] **Add a flagship case study** for `receipt-ocr` or a Lightning contribution.
- [ ] **Define newsletter value prop** concretely and tie subscribe to it.
- [ ] **Full mobile audit** (tap targets, stat grid, timeline on small screens).

---

## 5. Suggested hero rewrite (draft for review — not yet applied)

**Eyebrow:** `● Available for collaboration` *(keep)*

**Headline option A (claim-led):**
> Building the open-source tools
> *ML teams run in production.*

**Headline option B (identity-led):**
> Software Engineer shipping into
> *the PyTorch & Lightning AI ecosystem.*

**Subhead:**
> I'm **Bhimraj Yadav** — a Tier 2 contributor at Lightning AI (PyTorch Lightning, LitServe, LitData), IEEE-published in deep learning, and a production engineer at Fetchly Labs. Building for the world from Kathmandu, Nepal 🇳🇵.

**Primary CTA:** `Explore my OSS work →` (single, primary)
**Secondary:** `Read the blog` (text link)

> These are drafts to react to, not final copy. The headline choice depends on the #1-visitor decision in §1.

---

## 6. Open decisions (need your call)

1. **#1 visitor**: peers/maintainers (recommended), recruiters/clients, or audience?
2. **Hero direction**: claim-led (A) or identity-led (B)?
3. **Blog**: commit to publishing, or reframe to hide staleness for now?
4. **Scope of this pass**: just the P0 quick wins, or P0+P1 together?

---

*Process note: gstack upgraded to v1.58.5.0 during this session. This doc is the strategy + design output; implementation happens in a follow-up once the §6 decisions are made.*
