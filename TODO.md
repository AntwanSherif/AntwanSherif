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
