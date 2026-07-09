# Handoff — ADHD × coding-agents series

**Branch:** `blog/adhd-coding-agents`  ·  **Last updated:** 2026-07-09
**Goal:** 3-part blog series + a conference/meetup talk, by an engineer with self-identified ADHD who works daily with coding agents.

## Resume here (next action)
**Post 1 ✅ complete** (writing-beats, tone-calibrated). **Post 2 ✅ draft complete.** **Post 3 ⚠️ autonomous draft** (never shaped with the user). Full checklist in `TODO.md`; near-term queue:
- **Post 2 tone pass + disclosure dedup** — soften two confessional edges ("too tired to read the replies", "built that graveyard more than once") per the hireability guardrail; trim the opening disclosure to a one-line callback to Part 1. Article: `drafts/post-2-break-the-same-way.article.md` (opening = compressed reframe/title teaser, angle ① below, swappable).
- **Post 3 — shape it properly** (ideally interactive, like Post 1) + tone pass. It's the fragile-evidence one (body-doubling n=12). Draft: `drafts/post-3-the-playbook.article.md`.
- Then finalize cross-links + move approved drafts into `content/`.
- **REBASE NOTE:** main moved during this work — rebase `blog/adhd-coding-agents` onto updated main once the writing's done (user's call).
- Hook candidates kept for reference (in case of a swap):
  1. **Reframe-first** — *Claude's lean; earns the title.* "When an AI agent falls apart, we have neat, clinical words for it: ran out of context, hallucinated, drifted. I have those exact failures — I just don't get to call mine 'a known limitation of the architecture.' I'm self-identified with ADHD…"
  2. **Crash scene-first** — *most human, lowest barrier.* "A few days into running five agents at once, I was too tired to read their replies. Which is an absurd thing to be tired of — they're the ones doing the work…"
  3. **Aphorism-first** — *best talk cold-open.* "AI coding agents gave me a superpower and took my attention hostage — using the same feature. I can't tell you which it is. That's not indecision; it's the shape of the thing."
  - Hybrid **①+②** (idea + scene) is explicitly on the table.
- Beat spine status: 1 hook ✅ · 2 disclosure (rides in the hook) ✅ · 3 superpower ✅ · 4 crash ✅ · 5 science (Mark; "23:15" killed as folklore) ✅ · 6 reframe (brain≈model; "external executive function") ✅ · 7+8 merged → "loaded tool" (@swombat) ✅ · 9 Post 3 tease ✅.

## State of the work (all committed unless noted)
- **Research:** `research-brief.md` (6 lenses, evidence-tagged), `talks-and-community.md` (talks + Reddit/X/HN/DEV verbatim quotes w/ permalinks).
- **Decisions:** `DECISIONS.md` → `2026-07-01-01-voice-and-disclosure.md`, `2026-07-01-02-series-structure-and-production.md`.
- **Glossary + component:** `src/data/glossary.ts` + `src/components/mdx/term.tsx` (`<Term id=…>`, dashed underline + hover/click popover) — **verified in-browser**. Registered in `src/mdx-components.tsx`.
- **Blog discoverable:** `_blog`→`blog` route un-parked, nav entry + sitemap restored.
- **Teach workspace:** `learn/` — MISSION, RESOURCES, `glossary.json` (source of truth), 3 lessons + 3 learning-records.
- **Drafts:** `drafts/post-2-the-moat.md` (freehand — now RAW MATERIAL), `drafts/post-1-the-on-ramp.md` (freehand), `drafts/post-2-break-the-same-way.article.md` (writing-shape, in progress).

## Non-negotiables (from decision records)
- **Voice:** first-person, **self-identified NOT clinically diagnosed**, stated transparently. No clinical authority, no medical advice.
- **Production:** prepare all 3 together, publish spaced. Write via **Pocock writing-shape** (body-first, hook last) — NOT freehand.
- **Cross-reference rule:** every post links the author's other posts/work (blog-wide standing rule).

## Open loops → see `TODO.md`
Highlights: finish Post 2 then shape Posts 1 & 3; **remove John Doe seed posts in `content/` before production**; dedup disclosure across Post 1/2 openings; Lesson 04 blocked on adult time-blindness source; `<Term>` hover-gap papercut; keep `learn/glossary.json` ↔ `src/data/glossary.ts` in sync.

## Environment notes
- `browse` CLI daemon is flaky here. Drive the logged-in Chrome on **CDP 9333** directly via `scratchpad/cdp.mjs` (eval) and `cdp-shot.mjs` (screenshot). Already logged into Reddit + X.
- Dev server on **:3130** (read `.dev/port`, never assume).
- Workflow/subagents: force **Sonnet** (Opus fan-out burns tokens + trips rate limits).

## Suggested skills
- **writing-shape** — resume Post 2 (primary).
- **writing-beats** — alt for the more narrative Post 1.
- **edit-article** — final tightening pass once drafts exist.
- **/teach** — run the interactive lesson loop (user-invoked; builds storage strength for Q&A).
