---
captured: 2026-07-10
session: 01PmD9YPgkzu3h7WdG8XK3H5
repo: AntwanSherif/dotfiles (work happened in ~/.claude, mirrored via chezmoi)
branch: main
surface: both        # blog | linkedin | both — decided later, default both
---

# Post idea: "My prompt library has a training loop now (and its first gradient was wrong)"

## The story in one paragraph

Microsoft's SkillOpt treats agent skill files as trainable parameters: run tasks with the current skill (forward pass), have an optimizer read the trajectories and diagnose (backward pass), land only small validated edits, keep a buffer of rejected ones. I couldn't use it directly — my skills are process skills with no gradable benchmark — but the loop ports beautifully: Claude Code transcripts are free trajectories, my review is the validation set, a `REJECTED.md` beside each skill is the negative-signal buffer. I wired it into the skill that governs skill authoring, then verified it by telling a fresh agent to propose one improvement to another skill. It followed the new process perfectly — mined 20 transcripts, cited evidence, proposed one bounded diff — and the finding was confidently, verifiably wrong: every trajectory it cited predated a rewrite of the skill two days earlier. It had diagnosed a version that no longer existed. Stale training data, prompt-engineering edition. The fix became the loop's first real lesson, written into the skill the same day: a trajectory testifies only about the skill version that produced it.

## The beats (each a candidate section)

1. SkillOpt in three sentences: skills as weights, frozen model, textual learning rate, validation gating. The numbers that make you sit up (58.8→82.3; skill trained in Codex transfers to Claude Code at 81.8 vs 22.1 baseline; optimized skills stay ~920 tokens).
2. Why direct adoption dies for personal skill estates: every skill needs a `rollout.py` and a gradable task set, and "the human found this session productive" doesn't grade.
3. The port: transcripts = trajectories (they were sitting in `~/.claude/projects` all along), human review = validation set, `REJECTED.md` = feedback buffer, surgical-diff discipline = learning rate.
4. The verification run: a fresh agent, one instruction, and it runs the whole forward/backward pass unprompted. Process change confirmed.
5. The twist: the evidence-rich finding that was wrong. Four cited trajectories, all pre-rewrite. The "harness instruction" it blamed was the old skill text itself. Bonus wrinkle: a long-lived session carries the old skill version even after the rewrite lands.
6. The meta-payoff: the false positive was itself caught by the loop's own gate (human review), logged in the rejected buffer, and converted into a one-sentence rule in the skill. The system debugged itself on day one.
7. Zoom out: what "training data freshness" means when your parameters are prose and your gradients are grep.

## The reframe to land

Your transcripts are a free training set for your prompts — but like any training set, they go stale the moment the thing they measure changes. Version-stamp your evidence: a trajectory testifies only about the skill version that produced it.

## Candidate titles

- My prompt library has a training loop now (and its first gradient was wrong)
- Skills as trainable parameters: porting SkillOpt to a personal Claude Code setup
- The confident finding that cited four trajectories — all of them stale
- Stale training data, prompt-engineering edition

## Raw material to mine (lossless)

---
status: pending    # pending → handled
created: 2026-07-10T16:40:00+02:00
focus: Draft a portfolio blog/LinkedIn post about skills-as-trainable-parameters and the stale-trajectory false positive
---

> A session that picks up this handoff flips `status` to `handled` once the context is absorbed.

# Handoff: SkillOpt-inspired skill training loop — blog post raw material

## Task

Draft a portfolio blog and/or LinkedIn post about: porting Microsoft SkillOpt's training-loop concept onto a personal Claude Code skill estate, and how the very first "backward pass" produced a confident, evidence-cited finding that was wrong because every cited trajectory predated the skill's last edit. The transferable line: **"a trajectory testifies only about the skill version that produced it."**

## State

The engineering work is DONE and shipped (see Artifacts). The post is NOT started — this doc is the lossless raw material.

## The facts (verified this session, 2026-07-10)

### SkillOpt (Microsoft Research)
- Blog: https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/ · Repo: github.com/microsoft/SkillOpt (MIT, `pip install skillopt`, ~12k stars, v0.2.0 July 2026) · Project page: aka.ms/skillopt · Companion: SkillLens.
- Core idea: treat the skill file as trainable parameters outside a frozen model. Forward pass = frozen model runs tasks with the current skill. Backward pass = optimizer model reads the resulting trajectories and diagnoses. Update = small text edits (add/delete/replace) under a "textual learning rate" budget. Edits land ONLY if they improve a held-out validation set; rejected edits go to a feedback buffer as negative signal.
- Results: six-benchmark avg with GPT-5.5 58.8→82.3; SpreadsheetBench 41.8→80.7; OfficeQA 33.1→72.1; cross-harness transfer (skill trained in Codex scored 81.8 in Claude Code vs 22.1 baseline); optimized skills stay compact — median ~920 tokens, typically 1–4 accepted edits.
- Direct-use catch: every skill needs a benchmark env (`dataloader.py`, `rollout.py`, gradable task set). Non-starter for process/interaction skills whose success criterion is "the human found the session productive." Verdict for a personal estate: skip direct adoption, port the loop.

### The port (all shipped to the dotfiles repo)
Four SkillOpt ideas mapped onto an existing `writing-great-skills` skill (the skill that governs skill authoring):
1. **Trajectories as signal** — Claude Code transcripts (`~/.claude/projects/*/*.jsonl`) ARE the training data, free. Find runs: `grep -rl '"skill":"<name>"' ~/.claude/projects/`. Missed firings: grep the description's trigger phrases.
2. **Bounded edits** — textual learning rate = smallest diff a cited trajectory justifies, never a rewrite.
3. **Validation gating** — no held-out benchmark for interaction skills, so the human's review IS the validation set. No edit lands without a cited trajectory showing the failure it fixes.
4. **Rejected-edits buffer** — `REJECTED.md` beside each SKILL.md, one line per declined idea + why, checked before proposing so dead ideas don't resurface.
Implemented as: new step 0 in the skill's Process ("Gather trajectories"), a Trajectories reference section, one sentence on the verify step, two glossary entries (Trajectory, Rejected Log).

### The verification run and the false positive (the story's engine)
- To test the meta-edit, a fresh subagent was told only: "follow writing-great-skills to propose one improvement to the handoff skill." Unprompted, it grepped all 20 sessions where `handoff` fired, deep-read 4, checked for REJECTED.md, and proposed one bounded diff with cited evidence. The process change verifiably took.
- Its finding was confident and evidence-rich: the handoff skill's Lifecycle section (check `.handoffs/*.md` before writing) "never fired in any sampled run — every handoff was saved to the OS temp dir, per an instruction visible in every trajectory." Proposed fix: delete the Lifecycle section as sediment.
- It was WRONG. The "harness instruction" was an OLD VERSION of the skill itself: a July 8 estate-audit had rewritten the skill from "save to temp dir" to the `.handoffs/` design. All four sampled trajectories predated the rewrite. The one post-rewrite run (July 10, encoreshot) used the new text and saved to `docs/handoffs/` exactly as designed. The finding was a stale-training-data artifact: the optimizer diagnosed a model of the skill that no longer existed.
- Detection path: `git log` on the skill file (rewrite = commit 752b963, 2026-07-08) vs trajectory file mtimes; then grepping the two post-rewrite trajectories for the old instruction string (absent in one, present in the other because that session had STARTED before the rewrite — long-lived sessions carry old skill text).
- The fix that landed (itself a trajectory-gated bounded edit, evidence = this incident): "A trajectory testifies only about the skill version that produced it — discard runs that predate the skill's last edit before diagnosing."
- The rejected diff became the inaugural `REJECTED.md` entry: dogfood, first day.

### Second application (same day): 15 project-local skills audited
Three parallel read-only agents ran the loop over encoreshot's 13 plugin skills and job-search's 2 skills. Outcome: zero edits warranted — job-search skills run all steps cleanly across ~20 valid trajectories (2 stale ones correctly discarded by the new rule); encoreshot's marketing-skill cluster has zero valid trajectories (never exercised, not broken). Notable: the gate held — agents explicitly declined to propose diffs without failure evidence, citing the skill's own wording back.

## Decisions made
- Direct SkillOpt adoption rejected (benchmark-authoring cost vs payoff for process skills). Concept port accepted.
- Human review = validation set; visual/AskUserQuestion gate for each proposed diff.
- Rejected handoff diff → REJECTED.md, user chose "fix the invocation instead," which turned out already-fixed → logged as stale-trajectory artifact.

## Open questions
- None blocking the post.

## Next steps
1. Pick the format: long-form blog vs LinkedIn post (frontmatter says `surface: both`).
2. Use `writing-shape` (argument-building) or `writing-beats` (narrative) per skill routing. NOT draft-builder — this is portfolio, not EncoreShot.

## Gotchas
- SkillOpt figures are July 2026-fresh but perishable — re-verify stars/version if drafting much later.
- The blog post should NOT name private skill contents beyond what's here; transcripts contain client/project names — anonymize per blog-drafts policy if any EncoreShot specifics get pulled in.

## Suggested skills
- `writing-shape` or `writing-beats` for drafting; `visual-plan` not needed.

## Artifacts
- Dotfiles commits (AntwanSherif/dotfiles, main): af3a760 (trajectory-gated editing + glossary), bfa24d8 (skills sweep + Stop-batch sync hook), 4670685 (hook filter fix, committed by the hook itself).
- `~/.claude/skills/writing-great-skills/SKILL.md` (step 0 + Trajectories section), `GLOSSARY.md` (Trajectory, Rejected Log entries).
- `~/.claude/skills/handoff/REJECTED.md` (inaugural entry, 2026-07-10).
- SkillOpt: blog URL above; github.com/microsoft/SkillOpt.
