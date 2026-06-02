# Handoff — Blog post: "useEffect's body is a closure" (the `ignore` race-guard)

## Purpose of next session
Turn this conversation into a **portfolio blog article**. The hook that made it click for
the user: *the body of a `useEffect` is a closure, and each effect run captures its own
copy of local variables.* That single reframe is what made the canonical React
race-condition guard (`let ignore = false`) finally make sense. The article should build
toward that insight, not bury it.

This is a **writing task**, not a code task. No code changes are pending or expected.

## Source material (the code being explained)
- File: `src/legacy/useOfferSearch.ts` (this repo: `/Users/antwan/files/side-projects/vite-iv-prep`)
- The relevant block is the `useEffect` at lines ~73–93 (the `ignore` flag + `AbortController`).
- The file's own header comment (lines 5–36) is unusually rich and already articulates the
  "two mechanisms" framing — quote/paraphrase it rather than re-deriving from scratch.
- It is deliberately labelled **LEGACY (~React 17 era)**; a sibling `src/modern/` folder holds
  the `use()` + Suspense + transitions counterpart. The contrast (manual race-handling vs.
  framework-handled) is a natural closing section / sequel hook.

## The article's core ideas (already explained in-conversation — reuse the explanation)
The user's question was "explain this `ignore` logic elaborately." The response that landed
covered, in this order:

1. **The problem** — `useEffect` is async + re-entrant. React runs *previous cleanup* then
   *new effect body* on every dep change. A slow promise can resolve after its effect was
   cleaned up and dispatch stale data over fresh results → the "I typed `react` then `redux`
   and it flickered back to `react`" last-write-wins-but-out-of-order bug.

2. **THE KEY INSIGHT (the article's spine)** — `ignore` is a closure variable scoped to a
   *single effect run*. Each invocation gets its own fresh `ignore`. Cleanup of run A flips
   *A's* `ignore` to true; run B has its own independent `ignore`. When A's promise finally
   resolves, its `.then` closes over A's (now-poisoned) flag, so `if (!ignore) dispatch()` is
   a no-op. The stale write becomes *structurally impossible*, not just unlikely. The little
   ASCII diagram of "closure A / closure B" carried the point well — keep a visual.

3. **Two mechanisms, not redundant** — `AbortController` (mechanism #1) *stops the work*;
   `ignore` (mechanism #2) *ignores a late answer*. The gap that proves they're distinct: a
   request can RESOLVE in the tiny window *before* `abort()` runs in cleanup — abort can't
   un-resolve a settled promise, so `ignore` is what guarantees correctness. Conversely
   `ignore` alone leaks wasted network work. Also: aborting makes the promise *reject* with
   `AbortError`, which the `.catch` deliberately swallows because *you* caused it on purpose
   (must not surface as an error state).

4. **StrictMode payoff** — dev double-invoke (mount → cleanup → mount) is exactly the torture
   test for this bug; the code being correct under double-invoke is the proof the guard is
   real. Trace: run1 fires → cleanup poisons run1 → run2 fires fresh → only run2 can write.

5. **`ignore` guards BOTH paths** — success dispatch *and* the non-abort error dispatch.

6. **Closing contrast / sequel** — modern `use()` + Suspense + transitions push this
   race-handling down into React; the framework tracks which render "owns" the data, so you
   stop hand-writing stale-guard booleans. The legacy file exists precisely to make the
   modern version's value legible.

## User context / preferences worth honouring while writing
- This is for the user's **portfolio** — voice should be sharp, human, conversational
  (their global tone instructions: warm, vivid analogies as cognitive compression, varied
  rhythm, no corporate-speak, no filler enthusiasm, prose over bullet-dumps).
- The user explicitly said the **closure framing is what made it click** — lead with the
  reader's likely confusion and resolve it with that reframe. Don't open with API trivia.
- "Explanatory" output style was active; the original answer used `★ Insight` callout blocks.
  Those can become pull-quotes / highlighted asides in the post, but aren't required.

## Suggested skills for the next session
- **`writing-shape`** — best fit: take this raw material and grow it into a publishable
  article paragraph-by-paragraph, arguing format (where a code block vs. a diagram vs. a
  callout earns its place) at each step. Start here.
- **`writing-beats`** — alternative if the user would rather assemble it as a narrative
  journey (confusion → reframe → "oh, it's just closures" → the two-mechanisms twist →
  modern epilogue), picking beats interactively.
- **`writing-fragments`** — only if the user wants to mine *more* nuggets/tangents before
  imposing structure (e.g. other "X is just a closure" moments, StrictMode war stories).
- **`edit-article`** — for a later polishing pass once a draft exists.

Recommend opening with `writing-shape` unless the user signals they want the beat-by-beat
narrative approach.

## Pointers / do-not-duplicate
- Don't re-summarise the code line-by-line in the handoff — read `src/legacy/useOfferSearch.ts`
  directly (esp. lines 73–93 and the header 5–36).
- The `src/modern/` folder holds the contrast implementation for the closing section — read
  it before writing the epilogue so the comparison is accurate, not assumed.
- No PRD/plan/ADR/issue exists for this; it's a fresh writing task.
