# Analytics — Intent

Cookieless Umami analytics. Two channels: **client** (`src/lib/analytics.ts` → `track()`, loaded by `analytics-scripts.tsx`) for ordinary events, and **server** (`src/lib/umami-server.ts` via Server Actions) for story events (company-attributed, ad-block/prefetch-immune). Design: `docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md`. Decision: `docs/adr/2026-06-13-analytics-stack-umami-self-hosted.md`. As-built values + runbook: `docs/analytics-operations.md`.

## Standing rule — when you change a feature, keep events in sync
Do at least one of:
1. **Verify** existing events on the touched surface still fire (links, cards, story flow).
2. **Enrich** event props that became more informative.
3. **Create** a new event for any new measurable user interaction that has none.

- New **external links** are auto-tracked by `OutboundTracker` — nothing to do.
- Deliberate interactions (expansions, meaningful toggles, downloads, gated opens) are **not** auto-tracked — add a `track({...})` call (client) or a Server Action (server, when the data is server-authoritative or must dodge ad blockers).
- Named conversions mark their element `data-analytics-skip-outbound` to avoid double-counting against the generic `outbound` listener.

## Wired vs. reserved events
**Wired now:** `pageview`, `web-vitals` (auto via `data-performance`), `outbound`, `contact-click{linkedin}`, `scroll-depth` (home + story), `impression` (project/story cards, contact section), `story-unlock{company}`, `story-view{company,story}`.

**Defined in the `AnalyticsEvent` union but reserved (wire when the UI surface is built):**
- `cv-download` — wire on a résumé/CV download link when one is added (`track({name:'cv-download'})` + `data-analytics-skip-outbound`).
- `contact-click{channel:'email'}` — wire if/when a `mailto:` CTA is rendered (the email entry is currently `navbar:false`).
- `project-expand{project}` — wire in the expand handler if project cards gain an expand/dialog UI (fire on open only).
- `talk-photos{talk,action}` — wire if talk photos gain a lightbox/carousel (`open` + `advance`).

## Test obligation
New/changed events get the same TDD treatment as the catalog: name/props correctness (pure helpers in `src/lib/analytics.ts`), no-op safety, and (for story events) prefetch/adblock immunity. Update the **Events Catalog** in the spec when events change — it's the source of truth.

## Never
- Never log or send the story **password** — only the **company** slug (`companyFromPassword`).
- Never let an analytics send throw into a render (all paths no-op on error / outside production).
