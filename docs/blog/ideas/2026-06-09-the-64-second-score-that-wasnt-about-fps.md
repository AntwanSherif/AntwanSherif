# Handoff — Blog post: "The 64-second score that wasn't about fps"

## Purpose of next session
Turn this debugging session into a **portfolio blog article** about how a metric can lie when
your instrumentation conflates several costs into one number. The hook that made it click:
**latency moved *inversely* to the work done** — the slower call processed *fewer* frames and
produced *fewer* tokens — and that inversion is the tell that the thing you're measuring isn't
the thing you're changing. Build toward that reframe; it's the spine of the piece.

This is a **writing task**, not a code task.

> **Anonymization:** keep the product un-named (Act-1 Builder rule). Describe it generically as
> "an AI pipeline that scores short video clips with a vision LLM." The technical content
> (Gemini Files API, retry/backoff, non-determinism) is all generic and fine to keep.

## The story in one paragraph
While tuning a vision-LLM scoring step, a 6-second clip scored in ~11s at "2 fps" but **64s at
"1 fps"**, and the scores differed too (78 vs 55). It looked like a clean result: more frames =
faster *and* better. Every part of that was an artifact. Controlled re-runs showed: (1) the 64s
was a **cold file-upload + a silent 4× retry/backoff storm** against an overloaded model, all
wrapped inside one latency timer and blamed on fps; (2) fps had **zero** latency effect; (3) the
score gap was **pure model non-determinism** — byte-identical frames scored 78, 78, 59.

## The three insights (each is a section)
1. **The inversion tell.** 1fps sent ~6 frames / 1.2k tokens but took 64s; 2fps sent ~12 frames /
   1.7k tokens but took 11s. When latency falls as work rises, a *fixed* cost (a one-time upload)
   or an *external* one (server-side queueing) is doing the talking — not your knob. The math:
   ~19 tok/s vs ~157 tok/s on the same model is an 8× throughput swing no parameter explains.
2. **Silent retries inflate wall-clock.** A `withRetry` wrapper retried a `503 model overloaded`
   four times with exponential backoff (~113s before giving up), and the timer wrapped all of it.
   A transient server hiccup became "this config is slow." Lesson: **never let retry/upload time
   masquerade as inference time** — measure phases separately, classify errors (a `429`
   quota-exhausted should fail fast, not storm a quota that's dead until the daily reset).
3. **temperature=0 is not determinism.** The same frames scored 78/78/59. temp=0 fixes *token
   selection* (argmax) but not the *logits*: on a hosted endpoint your request is batched with
   strangers' traffic, batch size changes which GPU kernel runs, floating-point reductions land in
   a different order, and a close call flips early and cascades. (Cite Thinking Machines, "Defeating
   Nondeterminism in LLM Inference", Sep 2025.) The fix is statistical, not a setting: sample N,
   take the median; for A/B comparisons, never trust n=1 — report mean ± CI and only call a winner
   when the intervals separate.

## The closing reframe (the takeaway)
When a metric moves with a variable, ask whether the variable *causes* it or just *rode along*.
The debugging move that cracked it was boring and decisive: re-run the exact same config twice.
The first run was slow, the second fast — same input — which instantly exonerated the parameter
and pointed at state (a warm vs cold upload cache) and the environment (server load + retries).
Reproduce-twice beats theorize-once.

## Source material / evidence
- The diagnostic ran a controlled matrix: 3× identical cells on a cold asset (67s / 25s / 53s —
  identical input, wildly different latency *and* scores 78/78/59), then warm fps1-vs-fps2 repeats
  (no fps latency effect; 503 and 429 errors surfaced under load).
- Server logs showed `video.generate attempt 1/4 … 4/4 failed` — the retry storm, on tape.
- Good pull-quote candidate: *"Work went up, latency went down. That's not how compute-bound
  latency behaves; that's a fixed cost that was present once and gone the second time."*

## Format suggestions
- Lead with the misleading table (fps / time / score) and let the reader draw the wrong
  conclusion first — then dismantle it. The reader should feel the trap before the escape.
- Three short sections (inversion / retries / non-determinism), each with a one-line lesson.
- Audience: engineers shipping LLM features. Tone: the calm forensic walk-through, not a hot take.
- Natural sequel hook: "how we built evals that account for a model that scores the same input
  three different ways" → ties to the trustworthy-eval-system work.
