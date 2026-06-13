---
status: accepted
decided: 2026-06-13
updated: 2026-06-13
area: analytics
tags: [analytics, privacy, cookieless, umami, vercel, neon, core-web-vitals]
---

# Self-hosted Umami for portfolio analytics

## Context

The portfolio deploys the same Next.js app to two domains (`antwan.me`, `antwansherif.com`) with domains registered at Cloudflare and hosting on Vercel. We wanted visits, countries, top pages, referrers, and **Core Web Vitals**, plus a few custom events — including the high-value one: *which company opened which private story, and how often*.

Hard constraints:

- **100% free** — no paid tiers.
- **No cookie banner** — cookieless / first-party.
- **One dashboard, two domains** — aggregate (god-eye) view **and** a per-domain split.
- **Custom events** and **retention beyond 30 days**.
- **Core Web Vitals** captured.

Cloudflare's built-in analytics were rejected by experience (minimal, counts bots) and can't aggregate two zones into one view.

## Decision

Self-host **Umami** (v3.1+) as a **separate Vercel project backed by a free Neon Postgres**, served at `stats.antwansherif.com`. Tracking uses **two channels**:

- **Client** — the (renamed) Umami tracker script + a typed `track()` wrapper: pageviews, Core Web Vitals (`data-performance`), and ordinary interaction events. One website ID with `data-domains="antwan.me,antwansherif.com"` → aggregate view + hostname filter for the per-domain split.
- **Server** — a Next Server Action → Umami collect API for the **story events** (`story-unlock`, `story-view`). The company is known authoritatively server-side (it's the validated password's slug prefix), and server→server sends are immune to ad blockers **and** to prefetch. The story **password is never sent — only the company slug**.

Ad-block resistance is hardened from day one: first-party subdomain + the tracker script and collect endpoint are **renamed** (`u.js`, `/api/e`) via Umami's `TRACKER_SCRIPT_NAME` / `COLLECT_API_ENDPOINT`.

Full design: [`docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md`](../superpowers/specs/2026-06-11-portfolio-analytics-design.md). As-built values + runbook: [`docs/analytics-operations.md`](../analytics-operations.md).

## Alternatives considered

| Option | Verdict |
| --- | --- |
| **Vercel Web Analytics** | Rejected — Hobby = 30-day retention, **no custom events** (Pro-gated). |
| **Cloudflare Web Analytics** | Rejected — no custom events; can't aggregate two zones; prior bad experience. |
| **Counterscale** (CF Workers serverless) | Rejected — no real custom events, **no Core Web Vitals**, ~3-month retention cap. |
| **Plausible CE** | Rejected — **no Core Web Vitals**; heavier stack. |
| **Matomo** | Rejected — cookies by default (banner territory); heavy. |
| **Swetrix / Rybbit** (self-host) | Strong, but require a **VM + ClickHouse** — too much infra for a portfolio. **Reserved for the heavier sibling project** (see below). |
| **PostHog (free cloud)** | Rejected — cookies by default; retention caps on free tier. |
| **Umami self-hosted (Vercel + Neon)** | **Chosen** — lightest tool clearing every must-have; *is* a Next.js app, so it runs on the stack we already use, no VM. |

## Consequences

**Positive**
- Every hard constraint met at $0: cookieless, no banner, custom events, unlimited retention (own the DB), CWV, two-domain aggregate + split.
- Data ownership and portability (Neon Postgres).
- Story/company tracking is both authoritative and unblockable (server channel).

**Negative / accepted**
- **Ad blockers** still undercount client-side events (mitigated by first-party + renamed script/endpoint; story events are immune). Documented, not eliminated.
- **Neon cold starts** add ~1–3 s latency to the first event after idle — negligible, non-biasing; accepted (no keep-warm).
- **Umami-on-Vercel-serverless** upkeep is an occasional redeploy from the fork.
- Several events (`cv-download`, `contact-click{email}`, `project-expand`, `talk-photos`) are **defined but unwired** because their UI surfaces don't exist yet — reserved, documented in `src/components/analytics/AGENTS.md`.

## Future direction

If/when the **heavier sibling project** (more analytics depth: funnels, error tracking, replays) lands, stand up **Swetrix self-hosted on a small VM** (Hetzner ~€5/mo or Oracle Always Free). One Swetrix instance can host multiple projects and could later absorb this portfolio. Out of scope here.
