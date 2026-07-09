# TODO — ADHD × coding-agents series

Branch: `blog/adhd-coding-agents`. Full context in `HANDOFF.md`.

## Writing (next up)
- [x] **Post 1** — COMPLETE (writing-beats, tone-calibrated for a first post). → `drafts/post-1-the-on-ramp.article.md`
- [x] **Post 2** — draft COMPLETE (opening + beats 3–9). → `drafts/post-2-break-the-same-way.article.md`
  - [ ] **Tone pass** — soften the two confessional edges the hireability guardrail flags: "too tired to read the replies" (crash beat) + "built that graveyard more than once". Keep the honesty, cut the unreliable-employee read.
  - [ ] **Disclosure dedup** — Post 1 now carries the canonical disclosure; trim Post 2's opening disclosure to a one-line callback + link to Part 1.
- [ ] **Post 3** — full draft exists but AUTONOMOUS (background writing-shape agent), never shaped interactively. → `drafts/post-3-the-playbook.article.md`
  - [ ] Read it through and shape it properly (ideally interactive, like Post 1) — it's the fragile-evidence one (body-doubling n=12).
  - [ ] Tone pass against the hireability guardrail (see `2026-07-01-01-voice-and-disclosure.md`).
- [ ] Wire final cross-links (Part 1↔2↔3 + author's other posts/work) once slugs exist.

## Publish prep
- [ ] **Blog route is HELD off main** — the un-park commit (route rename + nav entry + sitemap `/blog`) lives only on the `blog/adhd-coding-agents` branch (`18bd84b`). Merging that branch is what flips the blog live. Until then main stays parked.
- [ ] **Sitemap at publish time:** confirm `src/app/sitemap.ts` gains `/blog` + the real post URLs (it's in the held route commit) — and does **not** list the John Doe seeds.
- [ ] **Remove the "John Doe" seed posts in `content/` before the route goes live.**
- [ ] Move approved drafts into `content/*.mdx` with valid frontmatter + `<Term>` tags (publish spaced, per decision-02).
- [ ] Visual QA the blog + `<Term>` once real posts are in (dev :3130).

## Loose ends
- [ ] `<Term>` hover-gap papercut (`mb-2` between term and popover can dismiss on hover-travel) — tune in a real visual pass.
- [ ] Keep `learn/glossary.json` (source of truth) ↔ `src/data/glossary.ts` in sync (add a sync script later).
- [ ] Lesson 04 blocked: needs a solid **adult** time-blindness source before it's lesson-ready.
- [ ] Optional: deeper logged-in Reddit sweep (r/ADHD, r/cursor) for more slide-ready proof-of-pain.
- [ ] `/teach` — run the interactive lesson loop (quizzes/spaced retrieval) for real Q&A storage strength.
