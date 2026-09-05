---
status: active
created: 2026-06-13
updated: 2026-06-13
area: analytics
tags: [analytics, roadmap, umami, funnels, journeys, segments, cohorts, blog, core-web-vitals]
---

# Analytics roadmap — understanding how visitors use the portfolio

Living backlog for the analytics work that grew out of the Umami buildout (see the
[ADR](adr/2026-06-13-analytics-stack-umami-self-hosted.md) and
[operations runbook](analytics-operations.md)). The goal: design **funnels, journeys,
segments, and cohorts** so we understand how visitors — **recruiters AND fellow
engineers** — actually use the site, with **blog content** folded in later and a future
**rendering A/B experiment** for Core Web Vitals.

Umami v3.1 (Mar 2026) ships Funnels, Journeys, Retention, Segments, and Goals as built-in
**dashboard reports** defined against existing events — so most of "build the funnels" is
*configuration*, not code. The code work is making the **event taxonomy** strong enough to
support all of it. That ordering drives the sequencing below.

## Workstreams

| # | Workstream | Type | Status | Depends on |
|---|------------|------|--------|------------|
| ① | **Event taxonomy redesign** — shared content spine (`content_type`/`content_id`), controlled vocabularies for today's free-form strings, audience/UTM tagging convention (recruiter vs engineer), reserved seats for blog (③) and render-variant (④) | code | **in design** | — |
| ② | **Dashboard buildout** — Funnels, Journeys, Segments, Cohorts (Retention), Goals configured in the Umami UI against the ① events | config (no code) | not started | ① |
| ③ | **Blog instrumentation** — wire content events when the blog ships; should fall out nearly free if ① reserves the content-type seat | code | not started | ①, blog launch |
| ④ | **Rendering A/B experiment** — RSC vs Astro (or alternatives), sliced by a `render_variant` session property to compare Core Web Vitals | code + infra | not started | ① (variant seat) |

## Sequencing rationale

- **① first, now.** Data is fresh and sparse, so restructuring events is *cheap today and
  expensive later*. Everything else sits on top of the events ① emits.
- **② after ①.** No point configuring dashboards against event shapes that ① will change.
- **③ / ④ when they arrive.** Each becomes its own spec → plan → implementation cycle.
  ① only has to leave them room, not build them.

## Forward-compatibility constraints ① must satisfy

So ②–④ never force another migration:

- A **shared content dimension** (`content_type` + `content_id`) that a blog post slots into
  without inventing a new event shape (serves ③).
- A **render-variant seat** — a session-level property the A/B test can populate later,
  even though we don't emit it yet (serves ④).
- **Stable, enumerated** property values (not free-form strings) so ②'s funnels/segments
  don't silently break on a rename.

## Pointers

- ① design spec: `docs/superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md`
- Identity & consent decision: `docs/adr/2026-06-13-analytics-visitor-identity.md`
- UTM & link-tagging conventions (operational, no code): `docs/analytics-utm-conventions.md`
- Event surface + standing rules: `src/components/analytics/AGENTS.md`
- As-built values + runbook: `docs/analytics-operations.md`
- Dashboard field guide (which Umami screen answers which question, workstream ② as actually
  used): https://claude.ai/code/artifact/4120d381-0eb0-4965-89e9-cc52366e8af0
</content>
</invoke>
