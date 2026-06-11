# Portfolio Analytics — Design Spec

**Date:** 2026-06-11
**Scope:** Privacy-first, cookieless analytics for the portfolio across both domains (`antwan.me`, `antwansherif.com`), self-hosted on free infrastructure, with custom event tracking incl. per-company story engagement.

---

## Overview

Add web analytics that answer: visits, countries, top pages, referrers/devices, **Core Web Vitals**, and a set of **custom events** — including the high-value one: *which company opened which story, and how many times*. Both domains report into **one** dashboard with an aggregate (god-eye) view and a per-domain split.

Hard requirements (all must hold):

- **100% free** — no paid tiers, ever.
- **No cookie banner** — cookieless by design, first-party.
- **Two-domain aggregate + split** — one website ID, hostname filter.
- **Custom events** + **retention beyond 30 days** (self-host ⇒ unlimited).
- **Core Web Vitals** captured.

---

## Decision & Rationale

**Chosen: self-hosted [Umami](https://umami.is) on Vercel + Neon Postgres**, dashboard at `stats.antwansherif.com`.

Why Umami over the alternatives we evaluated (full grilling history in the brainstorming session):

| Option | Why rejected |
| --- | --- |
| Vercel Web Analytics | Hobby = **30-day** retention, **no custom events** (Pro-gated). |
| Cloudflare Web Analytics | No custom events, can't aggregate two zones into one view; user already finds it noisy. |
| Counterscale (CF serverless) | No real custom events, **no Core Web Vitals**, ~3-month retention cap. |
| Plausible CE | **No Core Web Vitals**; heavier stack (Elixir/ClickHouse). |
| Matomo | Cookies by default (banner territory); heavy. |
| Swetrix / Rybbit | Excellent (esp. perf monitoring) but require a **VM + ClickHouse** — too much infra for a portfolio. **Reserved for the separate, heavier project.** |
| Umami Cloud / Swetrix Cloud | Swetrix Cloud dropped its free tier; cloud free tiers don't guarantee >30-day retention. |

Umami is the **lightest tool that clears every must-have**: it *is* a Next.js app, so it deploys to Vercel (free Hobby) backed by a free Neon Postgres — no VM. v3.1+ captures Core Web Vitals, supports custom events, multi-domain under one website ID with hostname filtering.

> **Note for the heavier second project:** if/when that lands, stand up **Swetrix self-hosted on a small VM** (Hetzner ~€5/mo or Oracle Always Free). It can host multiple projects, and could absorb this portfolio later. Out of scope here.

---

## Architecture

Two free pieces, no VM, plus a thin instrumentation layer in the portfolio repo.

```
 Visitor (antwan.me | antwansherif.com)
        │  ① renamed tracker script (first-party, data-performance)
        ▼
   Portfolio (existing Vercel project)
        │  ② client events: pageview, web-vitals, outbound, cv-download,
        │     contact-click, scroll-depth, impression, project-expand, talk-photos
        │  ③ server events (Server Action → Umami API): story-unlock, story-view
        ▼
   Umami instance  ──────────────►  Neon Postgres (free)
   (new Vercel project @ stats.antwansherif.com)
        ▲
        │  dashboard (login-gated): aggregate view + hostname filter
       You
```

- **Umami instance** — `umami-software/umami` deployed as a **separate** Vercel project (Hobby allows multiple), domain `stats.antwansherif.com`. Acts as both collector and dashboard.
- **Database** — free **Neon Postgres** (0.5 GB ≫ portfolio-scale events for years).
- **Portfolio** — existing project, unchanged except the instrumentation described below.

### Two tracking channels (the core design choice)

1. **Client channel** — the Umami tracker script + a typed `track()` wrapper. Carries pageviews, Core Web Vitals, and all *ordinary* interaction events. Ad-blockable, which is acceptable for these.
2. **Server channel** — a Next **Server Action** that POSTs to the Umami collect endpoint. Carries the **story events with company**, because (a) the company is known authoritatively server-side (it's the validated password's prefix), and (b) server→server sends are **immune to ad blockers** *and* to prefetch. This is where accuracy matters most.

---

## Privacy, Accuracy & Bots

- **Cookieless / no banner.** Umami uses no cookies; visitors are de-identified via a daily-rotating hash. Everything is **first-party** (`stats.antwansherif.com`), so no third-party consent surface. Aligns with the site's existing strict security headers (`next.config.mjs`).
- **Bots.** Umami is JS-RUM with built-in bot filtering — resolves the Cloudflare bot-inflation complaint.
- **Ad blockers (the real accuracy lever — documented, not a blocker).** All client-side analytics undercount privacy-conscious visitors, and this audience skews technical. Two mitigations baked in from day one:
  - First-party hosting (already the case).
  - **Rename the tracker script and collect endpoint** via Umami env vars `TRACKER_SCRIPT_NAME` and `COLLECT_API_ENDPOINT` (the latter's docs literally say "to help you avoid some ad blockers"). Use innocuous names — avoid `umami`, `analytics`, `track`, `script.js`, `/api/send`.
  - Residual limit, stated honestly: renaming dodges *filter-list* rules, not behavioral blockers. The **story events are unaffected** (server-side).
- **Cold starts (accepted, simple-by-design).** Neon autosuspends; the first beacon after idle adds ~1–3 s of latency to *that one request* — **not data loss**. `sendBeacon` delivers in the background across navigation. The only theoretical loss is an event fired at the exact instant of tab-close during a cold window: sub-percent, **random (non-biasing)**, and rarest exactly when traffic (and event count) is lowest. **The accurate option and the simple option are the same option** — we accept it; no keep-warm cron, no always-on container.

---

## Events Catalog

`{props}` are Umami custom-event data. `ch` = channel (C client / S server).

| Event | ch | Trigger | Props | Where |
| --- | --- | --- | --- | --- |
| `pageview` | C | auto | — | tracker script |
| `web-vitals` | C | auto (`data-performance`) | LCP/INP/CLS/FCP/TTFB | tracker script |
| `outbound` | C | any external `<a>` / `mailto:` click | `{href, host, label, context}` | global delegated listener |
| `cv-download` | C | résumé download click | — | CV link/button |
| `contact-click` | C | email / LinkedIn CTA click | `{channel: email\|linkedin}` | contact surfaces |
| `scroll-depth` | C | 25/50/75/100 % milestone | `{page, depth}` | per-page hook |
| `impression` | C | scoped element enters viewport | `{element, id}` | IntersectionObserver, project & story cards + key sections |
| `project-expand` | C | project card expand | `{project}` | project card |
| `talk-photos` | C | open / advance talk photos | `{talk, action: open\|advance}` | talk photos UI |
| `story-unlock` | **S** | password accepted | `{company}` | `unlockAction` |
| `story-view` | **S** | story page genuinely opened | `{company, story}` | mount-triggered Server Action |

**Conversions stay named** (`cv-download`, `contact-click`) for clean funnel reporting, even though they're also "outbound." The `outbound` listener is the catch-all for *everything else* that leaves the site — projects (HAKTIV, Elmawkaa), all company/work logos (Trade Republic, Flink, Shore, Vodafone, United Ofoq, ITI, Minia), talk slides, socials. New external links are tracked automatically with no extra wiring.

**No double-counting.** The CV and contact surfaces fire their own named events, so they **opt out** of the generic listener via a `data-analytics-skip-outbound` marker (the delegated handler ignores any element carrying it, or its ancestor). Everything else — including talk slides and socials — flows through `outbound` only.

---

## Integration Points (portfolio repo)

> Read `src/components/AGENTS.md` and `src/data/AGENTS.md` before touching those dirs. Server components by default; `'use client'` only where noted. `cn()` for classnames. pnpm.

**New files**
- `src/lib/analytics.ts` — typed `track(name, props?)` client wrapper. Strongly-typed event union; **safe no-op** when `window.umami` is absent (dev, blocked). Never throws.
- `src/lib/umami-server.ts` — server send helper: `POST {HOST}/{COLLECT_ENDPOINT}` with `{type:'event', payload:{website, name, data, hostname, url}}` and a `User-Agent` header (Umami requires it). Production-gated.
- `src/components/analytics/analytics-scripts.tsx` — renders the renamed Umami `<Script>` (`next/script`) with `data-website-id`, `data-domains="antwan.me,antwansherif.com"`, `data-host-url`, `data-performance="true"`. **Renders only in production.**
- `src/components/analytics/outbound-tracker.tsx` — `'use client'`, single delegated `document` click listener → `outbound`. Mounted once in root layout.
- `src/components/analytics/use-scroll-depth.ts` — `'use client'` hook, milestone fires, one event per threshold per pageview.
- `src/components/analytics/use-impression.ts` — `'use client'` IntersectionObserver hook for scoped elements.
- Story Server Action `trackStoryView()` — reads `stories-auth` cookie, derives company, sends `story-view`. Co-locate under `src/app/(stories)/`.
- `src/components/analytics/story-view-beacon.tsx` — `'use client'`, calls `trackStoryView()` in a mount `useEffect` (prefetch fetches payload but never mounts ⇒ no false fire). Rendered by the story page.

**Edited files**
- `src/app/layout.tsx` — mount `<AnalyticsScripts />` + `<OutboundTracker />`.
- `src/app/(stories)/stories/unlock/actions.ts` — after `validate(...)` passes, derive company and fire `story-unlock` (server). **Never log the password — only the company slug.**
- `src/app/(stories)/stories/[slug]/page.tsx` — render `<StoryViewBeacon story={slug} />`.
- `src/lib/stories-password.ts` — add `companyFromPassword(password): string | null` (parse + return the validated slug prefix; mirrors `validate`'s parsing). Reused by both story events.
- Project card / talk-photos / CV / contact components — attach `track()` calls or `data-*` labels for `project-expand`, `talk-photos`, `cv-download`, `contact-click`, and richer `outbound` `label`/`context`.

### Story tracking detail (prefetch- & adblock-immune)

- **Company source.** A valid password is `<Company>-<hmacCode>`; `validate()` already confirms the code is genuine, so the **slug prefix is trustworthy**. `companyFromPassword()` returns it — no `companies.txt` lookup.
- **`story-unlock`** fires inside `unlockAction` (a POST server action, never prefetched) — already perfectly accurate.
- **`story-view`** fires from `<StoryViewBeacon>`'s mount effect → `trackStoryView()` server action, which re-reads the cookie, re-derives company, and sends server-side. A prefetch fetches the RSC payload but **does not mount/commit** the client component, so the effect never runs on prefetch. Refreshes/re-opens count as genuine opens (matches "how many times").

---

## 🙋 Human Checkpoints — Setup Runbook

These steps need accounts / DNS / secrets and **must be done by the user**. The implementation plan will **STOP at the start** and walk through HC1–HC4 (nothing verifies end-to-end without them), then resume coding, then do HC5 + the joint smoke test. The agent provides exact guidance at each stop; it does **not** create accounts, edit DNS, or mint secrets autonomously.

- **HC1 — Neon database.** Create a free Neon project + Postgres DB. Copy the pooled `DATABASE_URL`. *(Agent guides; user clicks.)*
- **HC2 — Deploy Umami.** New Vercel project importing `umami-software/umami`. Set env: `DATABASE_URL`, `DATABASE_TYPE=postgresql`, `APP_SECRET` (random), `TRACKER_SCRIPT_NAME`, `COLLECT_API_ENDPOINT`. Deploy; run Umami's DB migration if not automatic.
- **HC3 — `stats.antwansherif.com`.** Add the domain to the Umami Vercel project; at Cloudflare add the DNS record Vercel specifies (CNAME). Optional: keep Cloudflare proxy (orange-cloud) for origin masking + rate-limit on the collect path.
- **HC4 — First login + website entry.** Log into `stats.antwansherif.com`; **immediately change the default `admin`/`umami` password**. Create a website → set domain(s) → copy the **website ID**. Keep "share / public" **off**.
- **HC5 — (Optional) Cloudflare Access** in front of the dashboard routes only (login UI + admin), leaving the renamed script + collect endpoint public (they must stay reachable).
- **HC6 — Wire env into the portfolio** (Vercel project + local `.env.local`): the `NEXT_PUBLIC_UMAMI_*` + server `UMAMI_*` vars below.
- **HC7 — Joint smoke test** (after code ships): load each domain → pageviews appear; hostname filter splits them; CWV section populates; click an outbound link, CV, contact → events land; unlock a story with a real password → `story-unlock` + `story-view` show the **company**.

---

## Environment Variables

**Portfolio (client, `NEXT_PUBLIC_`)**
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — from HC4
- `NEXT_PUBLIC_UMAMI_HOST_URL` — `https://stats.antwansherif.com`
- `NEXT_PUBLIC_UMAMI_SCRIPT_NAME` — matches `TRACKER_SCRIPT_NAME` (script `src` = `${HOST}/${SCRIPT_NAME}`)

**Portfolio (server)**
- `UMAMI_COLLECT_ENDPOINT` — matches `COLLECT_API_ENDPOINT` (path the server helper POSTs to)
- (reuses host + website ID above)
- `STORIES_SEED` — already present; needed by `companyFromPassword()`/`validate()`.

**Umami instance** — `DATABASE_URL`, `DATABASE_TYPE`, `APP_SECRET`, `TRACKER_SCRIPT_NAME`, `COLLECT_API_ENDPOINT`.

Document non-secret names in `.env.example`; never commit secrets (`.env.local` is gitignored).

---

## Testing (TDD)

- **`analytics.ts` (unit, Vitest):** correct event name/props passthrough; **no-op when `window.umami` is undefined** (never throws); production gating.
- **`umami-server.ts` (unit):** builds the correct payload + `User-Agent`; no-ops/handles non-production and fetch failure (swallow — analytics must never break a page render).
- **`companyFromPassword()` (unit):** extracts the slug for a valid password; `null` for malformed input; **never returns the raw code/secret**. Sits alongside existing `stories-password.test.ts`.
- **`story-unlock` wiring (unit/integration):** a valid unlock triggers a send carrying `{company}` and **no password**.
- **`<StoryViewBeacon>` (integration):** fires once on mount; does **not** fire on a prefetch-style render (no mount).
- **`<AnalyticsScripts>` (integration):** renders the script with the right attributes **only in production**.
- **Integration / user-flow test (required, near the end):** an end-to-end-style test covering the full event surface wiring (outbound + a conversion + a story event), per global planning conventions.

---

## Risks & Caveats

- **Ad-block undercount** on client events — mitigated (first-party + renamed), documented; story events immune.
- **Neon cold-start latency** — accepted; negligible, non-biasing.
- **Umami-on-Vercel-serverless** — officially supported; fine at this traffic. Escape hatch (not now): move just the Umami app to a container host to kill cold starts.
- **Umami upkeep** — occasional redeploy from upstream to update. Minor.
- **Event volume** — `impression` is the highest-volume event; scoped to cards/sections, fine at portfolio scale. First to trim if volume ever balloons.

---

## Out of Scope

- The heavier second project's analytics (→ separate Swetrix-on-VM spec).
- Funnels/dashboards beyond what Umami ships by default.
- Theme-toggle, talk-photo *lightbox-open* beyond the tracked `talk-photos` actions, and any A/B testing.

---

## Ongoing Convention — Keep Events in Sync

Analytics is **not** a one-time install; it's a standing concern for every future change. This convention is encoded into the **intent layer** so it surfaces automatically:

- **Deliverable:** add an analytics section to the relevant `AGENTS.md` (a dedicated `src/components/analytics/AGENTS.md`, cross-linked from `src/components/AGENTS.md` and `src/data/AGENTS.md`) stating the rule below. The implementation plan includes this as a task.
- **The rule (for any agent/author touching the codebase):** when you add or modify a feature, you must do one of —
  1. **Verify** existing events on the touched surface still fire correctly (links, cards, story flows), and
  2. **Enrich** events whose props became more informative (e.g., a new prop now available), and
  3. **Create** new events for any new user-facing interaction worth measuring that has no event yet —
  using the typed `track()` wrapper / server channel and the patterns in this spec. New external links are auto-covered by the `outbound` listener; deliberate new interactions (expansions, toggles-that-matter, downloads, gated opens) are not — add them.
- **Test obligation:** new/changed events get the same TDD treatment as the catalog above (name/props correctness, no-op safety, prefetch/adblock immunity where it applies).
- **Keep the catalog honest:** when events change, update the **Events Catalog** table in this spec (or its successor doc) so it stays the single source of truth.

---

## Build Order

Single spec, **full scope** (no phased shipping). The implementation plan (writing-plans) will sequence: human checkpoints HC1–HC4 first → instrumentation layer (client) → story server channel → tests → HC5 + joint smoke test (HC7). Spec + plan are committed together before any implementation begins.
