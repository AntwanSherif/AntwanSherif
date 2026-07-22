# Domain Glossary

## Toolkit Page (`/toolkit`)

A dedicated portfolio route showcasing the tools Antwan uses daily — grouped by category, with a short rationale per tool. Purpose: signal careful thinking + active research to engineers and community visitors; inspire discovery of new tools. Not a CV skills section (that's `resume.tsx`) — this is opinionated curation, not credential-listing.

**Route:** `/toolkit` (renamed from `/uses`; the old name survives only in git history)
**Nav label:** Toolkit (shown in primary nav dock)
**Primary audiences:** (1) fellow engineers/builders, (2) curious community visitors arriving via social shares

**The page must be true.** A tool earns a card only if it's actually installed and used — aspirational
entries get removed, not softened. This is what makes the curation worth reading.

## Tool Categories

The taxonomy for the `/toolkit` page. Source of truth is `TOOLKIT_DATA` in `src/data/toolkit.ts` —
categories are derived from the data, so adding one is a data edit, not a component change:

- **AI & Agents** — coding agents, agent tooling, token/feedback plumbing
- **Local LLMs** — on-device inference and model comparison
- **Design & Diagrams** — design generation, whiteboarding, architecture sketching
- **Code Review** — PR review and issue tracking
- **Infra & Data** — hosting, database, analytics
- **Productivity** — capture, dictation, notes, macOS utilities
- **Editor & Terminal** — editor, shell, dotfiles, runtimes

## Tool of the Day

A gamified feature on the `/toolkit` page that surfaces one highlighted tool per day. Acts as a discovery hook for community visitors and a reason to return. Implemented as a day+year seed over the tool list, with a "next" button to cycle manually.

Tools flagged `hideFromToD` are excluded — the widget is for genuine discoveries, so anything the reader already knows (Claude Code, VS Code, GitHub, Vercel) never surfaces.

## Tool Entry

A single item in a category list. Fields: `name`, `url`, `description` (1–2 sentence rationale), optional `tags`, optional `icon`, plus two flags: `isNew` (recently adopted) and `hideFromToD` (too obvious for Tool of the Day).

**Icons:** default to the Google favicon service. When a tool's favicon is generic or missing, commit a file to `public/logos/` pulled from a first-party source. Keep `public/logos/` tracked — Vercel builds from git, so an untracked logo renders locally and 404s in production.

## Excluded Tool

A tool that was considered for `/toolkit` and left off, recorded with a one-line reason in `docs/toolkit-excluded.md`. Exists so the same candidate isn't re-litigated every few months. Deliberately separates true rejections from tools that are merely unfamiliar — the latter are open questions, not closed ones.
