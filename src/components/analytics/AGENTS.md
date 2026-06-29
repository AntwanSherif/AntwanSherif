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
**Wired now:** `pageview`, `web-vitals` (auto via `data-performance`), `outbound` (with `category` + `content_type`/`content_id`), `contact_click{channel,category}`, `section_view` (homepage section reach), `scroll_depth` (stories, with reading-velocity `value`), `impression` (project/story cards, contact section), `story_unlock`, `story_view` (both with `company` + `content_id`), `gate_fail` (failed unlock attempts), `cv_view{source}` (CV nav-link click). Visitor identity via `localStorage` UUID → `identify()`. All events carry the `v` taxonomy version + the `content_type` spine. Full catalog: `docs/superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md`.

**Defined in the `AnalyticsEvent` union but reserved (wire when the UI surface is built):**
- `cv_download` — wire on a résumé/CV download link when one is added (`track({name:'cv_download'})` + `data-analytics-skip-outbound`).
- `contact_click{channel:'email'}` — wire if/when a `mailto:` CTA is rendered (the email entry is currently `navbar:false`).
- `project_expand{project}` — wire in the expand handler if project cards gain an expand/dialog UI (fire on open only).
- `talk_photos{talk,action}` — wire if talk photos gain a lightbox/carousel (`open` + `advance`).

## Test obligation
New/changed events get the same TDD treatment as the catalog: name/props correctness (pure helpers in `src/lib/analytics.ts`), no-op safety, and (for story events) prefetch/adblock immunity. Update the **Events Catalog** in the spec when events change — it's the source of truth.

## Never
- Never log or send the story **password** — only the **company** slug (`companyFromPassword`).
- Never let an analytics send throw into a render (all paths no-op on error / outside production).
- Never log a *valid* story password. `gate_fail` captures only *rejected* attempts (truncated ≤64 chars) plus a `format_valid` shape flag — never a derived `company`. A one-character mistype of a real password is an accepted residual (see the identity ADR).
