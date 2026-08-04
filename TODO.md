# Portfolio — TODO

Lean active task list. Completed items drain to `TODO-ARCHIVE.md`. Read by the Workspace Rollup (`/standup`).

## Open

- [ ] **Toolkit: audit + expand tools and skills** — review `src/data/toolkit.ts` and `src/data/resume.tsx` skills list; add missing tools (design, infra, comms, anything recently adopted); verify descriptions are accurate and sharp; add `isNew` / `hideFromToD` flags as appropriate; consider adding more categories if the list grows.
  - Machine scan pass done 2026-07-26: dropped Warp/Fish/Starship/Notion (not installed), added Handy, Ollama, LM Studio, Obsidian, Maccy, Amphetamine, chezmoi, Bun, RTK, Vibe Annotations; new `Local LLMs` category. Rejections + reasons: `docs/toolkit-excluded.md`.
  - Curated pass done 2026-07-26: added Grammarly, Vercel, Claude Design, Umami, Neon, Biome, Excalidraw, Miro, Visual Plan; new `Design & Diagrams` + `Infra & Data` categories. Remaining suggestions are logged as an open knowledge gap (NOT rejections) in `docs/toolkit-excluded.md`.
  - Logos: tools whose favicon was generic or missing now use tracked files in `public/logos/` (github, cmux, amphetamine, vibe-annotations), pulled from first-party sources. Everything else stays on the Google favicon service. Keep `public/logos/` tracked — Vercel builds from git, so an untracked logo 404s in production while looking fine locally.
  - **Remaining:** the `src/data/resume.tsx` skills list (the STACK band) was never reviewed in either pass. Comms tooling also still uncovered — Slack was rejected as zero-signal and nothing replaced it.
  - Follow-up: the tag filter row is now ~40 tags over 9 lines. Consider collapsing to top-N + "show all".
- [ ] **Toolkit: skills, plugins & agent-config layer** — parked, needs its own session. Full context + inventory: `docs/toolkit-skills-parked.md`.
- [ ] **Promote EncoreShot to a full Story** — the project has thumbnail + CV entries
  (`src/lib/encoreshot.ts`, `src/components/project-thumbnails/encoreshot.tsx`, `src/data/cv.ts`,
  `src/data/resume.tsx`) but no `story-cards.tsx` entry and no gated narrative in
  `stories-private/details.tsx` — unlike `mdq` and `core-observability`, which both already got
  that treatment. Source material worth pulling from is already banked and interview-tested in
  the second-brain prep KB:
  `~/files/side-projects/second-brain/vault/prep/topics/encoreshot.md`. Flagged 2026-08-04 while
  prepping for Bounti's technical round (`~/files/side-projects/second-brain/vault/prep/companies/bounti/technical.md`)
  — the `encoreshot-hard-questions` section in particular reads as genuinely strong, portfolio-
  worthy material, not just interview prep:
  - `#encoreshot-hard-questions` — the senior-engineer probes, predict-then-check. Strongest
    candidate for the gated narrative's depth section.
  - `#encoreshot-walkthrough` — problem → user → the hard technical thing → where it is now;
    the shape a public teaser tagline could compress from.
  - `#encoreshot-hard-decisions` — the three defensible calls (multi-model router, non-AI
    pre-filter, hand-rolled evals over a vendor) with the reasoning and cost behind each.
  - `#encoreshot-strategy-calls` — the founder-judgment half (five decisions, use one at a time)
    — good source for `metrics`/tagline framing, not the narrative itself.
  Guard while adapting: the KB's own note applies here too — never let this close on "and
  that's why I want an AI-native role"; close on what it taught about building a company (see
  `#encoreshot-founder-hats`). And per `sync-check`'s suggestion-safety rule, anything landing on
  a `public-safe` surface (the story card / teaser) can't quote source text pitched at the gated
  narrative's depth — write the public version fresh from the shape, don't trim the private one.
