# Analytics Event Taxonomy Redesign — Design Spec

**Date:** 2026-06-13
**Scope:** Restructure the live Umami event surface into a typed, forward-compatible **event taxonomy** that can power funnels, journeys, segments, and cohorts for *all* visitor types (recruiters **and** engineers), folds in a future blog with no new event shapes, and reserves a seat for a future rendering A/B experiment. Builds on the shipped analytics stack (see `2026-06-11-portfolio-analytics-design.md`, `docs/adr/2026-06-13-analytics-stack-umami-self-hosted.md`).

> This is **workstream ①** of `docs/analytics-roadmap.md`. ② (dashboard buildout), ③ (blog instrumentation), ④ (rendering A/B) ride on the foundation defined here. This spec includes a **dashboard-enablement section** that maps each ② report to the events it consumes — proving the taxonomy is sufficient — but the step-by-step Umami UI runbook is ②'s own deliverable.

---

## Why restructure now

The shipped events were designed surface-by-surface (`project-expand{project}`, `talk-photos{talk}`, `story-view{company,story}`). Clean for today's portfolio, but the goals above want a **shared spine** the per-surface design lacks. Data is currently **sparse test traffic**, so restructuring is *cheap now and expensive later* — this is the moment. Five gaps drove the redesign:

1. **No shared content dimension.** `project` / `talk` / `story` / `impression.id` all mean "which thing," expressed four ways → cross-content funnels and journeys can't be drawn, and a blog would need a fifth bespoke shape.
2. **Free-form strings where funnels need stable enums.** `scroll-depth.page`, `impression.element/id`, `outbound.label/context` silently break a funnel on any rename.
3. **No audience signal.** Recruiter-vs-engineer is inferable from referrer + destination, but nothing classifies outbound destinations.
4. **Inconsistent property keys** weaken Umami v3 segment/filter building.
5. **No seat** for cross-day returning-visitor identity, blog content, or a future experiment variant.

**This is a restructure, not a rewrite:** introduce a shared property spine + controlled vocabularies + a session-identity channel, then re-express the existing events on top.

---

## Naming convention

**snake_case for event names *and* property keys.** Rationale (portability if we ever switch vendors):

- **kebab-case is the least portable** — GA4 forbids hyphens in event/param names outright; many query layers read `-` as minus.
- **camelCase is the wrong idiom for *data*** — analytics values land in warehouse/SQL contexts where unquoted identifiers fold case (Postgres, Snowflake), colliding `renderVariant`/`rendervariant`. snake_case survives untouched and is the de-facto standard (GA4 *requires* it for params; PostHog/Segment props use it).
- snake_case is the lowest-common-denominator that ports unchanged to GA4 / PostHog / Segment.

Consequence: existing kebab event names are renamed (`story-view → story_view`, etc.) — free on sparse data.

---

## The spine

Every value that feeds a funnel/segment is a **typed union** — no free-form strings reach the tracker.

### Event properties

| Key | Required? | Values / type | Purpose |
|---|---|---|---|
| `content_type` | always | `home · project · story · talk · blog · contact · nav` | the cross-content spine |
| `content_id` | item events | slug string | which project / story / talk / blog post |
| `category` | outbound + contact | `code · professional · social · content · other` | destination class → audience split |
| `value` | optional | number | scroll timing now; dwell / measures later |
| `v` | always | number (`1`) | taxonomy version — migration insurance |
| `content_group` | *reserved* | string | blog topic / project domain (③) |
| `position` | *reserved* | number | list ordinality for impressions |

`category` **describes the destination, not the person.** "Engineer" vs "recruiter" is an *inferred segment* (e.g. `category=code` + GitHub referrer → engineer-leaning), never a stored label — honest and cookieless-safe.

### Session properties (via `identify()`, not per-event)

| Key | Set when | Purpose |
|---|---|---|
| visitor `id` | every load | the `localStorage` UUID — durable cross-day thread |
| `company` | after story unlock | rare (~5% of visits), high-value cohort key |
| `render_variant` / `experiment` | *reserved* | the rendering A/B (④) |
| `visited_before` | *reserved* | conservative fallback boolean |

---

## Events Catalog (source of truth)

Every event carries `content_type` + `v` implicitly; the table lists *additional* props. **Bold = new this redesign.** Keep this catalog and `src/components/analytics/AGENTS.md` in sync whenever events change.

| Event (`snake_case`) | Channel | Extra props | Notes |
|---|---|---|---|
| `outbound` | client | `category`, `host`, `href`, `label?`, `company?` | `context` retired → `content_type`/`content_id`; `company` = site-wide `?co=` slug when campaign-tagged |
| `contact_click` | client | `channel: email\|linkedin`, `category: professional` | named conversion |
| `cv_download` | client | `category: professional` | real `public/cv.pdf` download from /cv (`content_type: cv`) — **true** download signal |
| `cv_print` | client | `category: professional` | browser print *initiated* on /cv (`content_type: cv`); intent, not a confirmed export |
| `cv_view` | client | `category: professional`, `source: navbar` | CV nav-link click (`content_type: nav`) |
| **`section_view`** | client | `content_id: <section>`, `position?` | **homepage section reach → churn funnel** (`hero·about·work·education·skills·talks·projects·contact`, in DOM order) |
| `scroll_depth` | client | `depth: 25\|50\|75\|100`, **`value: <ms>`** | **stories only now**; `value` = ms-to-milestone → reading velocity |
| `impression` | client | `content_id`, `position?` | `element`/`id` → `content_type`/`content_id` |
| `project_expand` | client | — | reserved until expand UI is built |
| `talk_photos` | client | `action: open\|advance` | reserved until lightbox is built |
| `story_unlock` | server | — | also sets `company` session prop (see Identity) |
| `story_view` | server | `company` | keeps `company` prop (server channel is its own attribution) |
| **`gate_fail`** | server | **`attempt: <raw, ≤64 chars>`, `format_valid: bool`** | **never a derived `company`; only ever fires on invalid (non-)passwords** |

### Homepage vs stories — why two reach signals

- **Homepage → `section_view` only.** Discrete, *named* sections → semantically meaningful reach, stable under layout changes, maps 1:1 onto the churn funnel. Replaces homepage `scroll_depth`.
- **Stories → `scroll_depth` only.** Long-form prose has no discrete sections → continuous % depth + the timing `value` (reading velocity) is the right lens.

Each page uses the lens that fits its structure; no redundancy.

---

## Identity & session mechanism

Two new pieces, both mirroring `track()`'s discipline (**prod-only, client-only, never throw**):

- **`getOrCreateVisitorId(storage)`** — *pure, testable.* Reads `localStorage['as_vid']`; if absent, mints `crypto.randomUUID()`, persists, returns it. Storage injected for unit tests.
- **`identifyVisitor(data)`** — thin wrapper over `window.umami?.identify(...)`, same guards. A small `'use client'` `VisitorIdentity` component calls it on mount, after the tracker script loads.

> **Implementation note:** confirm Umami v3's exact `identify()` signature — `(id)` vs `(id, data)` vs `(data)` — against the live docs at build time (perishable API shape).

**Identity posture (see ADR `2026-06-13-analytics-visitor-identity.md`):** a `localStorage` UUID for **all** visitors, no geo-gating, no consent banner — appropriate at this scale (~10 visits/mo) and revisited when the blog raises the stakes (③).

**The `company` dual-channel.** Server story events are sent server→server (ad-block-immune) and live in their *own* attribution, separate from the client session. So `company` is set in **both** places:

1. As an **event prop** on `story_view` (and known to `story_unlock`) — reliable, server-known, ad-block-immune → per-company **story** cohorts work exactly as today.
2. As a **session prop**: after a successful unlock, the server action returns the (non-secret) `company` slug to the client, which calls `identifyVisitor({ company })` → the *rest of the browser session* (outbound, section views) is company-tagged → "what else did the Acme visitor do," not just their story events.

---

## Dashboard enablement (② — what this taxonomy unlocks)

For each ② report: the Umami report type and the events/props it consumes. Report *logic and inputs* are stable; exact UI click-paths are confirmed when ② is built (Umami UI is perishable).

### Funnels (Umami **Funnels** report — ordered event/page steps, shows step-to-step drop-off)

1. **Recruiter-conversion (whole-site):** `pageview` (land) → `section_view{contact}` (reached contact) → `contact_click` **or** `cv_download` **or** `outbound{category: professional}`. Where high-intent visitors drop before converting.
2. **Homepage churn:** `section_view` steps in DOM order `hero → about → work → education → skills → talks → projects → contact`. Each step's drop = churn-by-section; last section seen ≈ where attention died.
3. **Story engagement:** `pageview{/stories}` → `story_unlock` → `story_view` → repeat `story_view`. Apply a **company** segment for per-recruiter views.

### Journeys (Umami **Journeys** report — path sequences across pages)

Home → `/stories` → `/stories/[slug]` → outbound, automatically from pageviews; the `content_type` spine lets event-level journeys span portfolio ↔ story ↔ (future) blog uniformly.

### Segments (Umami **Segments** — saved, reusable filter combinations)

- **Engineer-leaning:** `outbound.category = code` **or** referrer/UTM source in {`github`, `devto`}. 
- **Recruiter-leaning:** `category = professional` / `cv_download` / `story_unlock`, or UTM source in {`linkedin`, `cv`}.
- **Per-company:** `company` (session prop or story-event prop).
- Native dimensions (country, device, browser) compose freely.

### Cohorts / Retention (Umami **Retention** report)

- **Returning visitors over weeks** — now meaningful because the UUID `identify()` gives a stable cross-day ID (vs the daily-salt hash, which can't). *Limitation:* defeated by cleared storage / incognito / second device — treat as directional.
- **Per-company retention** — "does Acme keep coming back" via the `company` cohort key.

### Goals (Umami **Goals** report)

Define the canonical conversions: `contact_click`, `cv_download`, `story_unlock` (and `outbound{category: professional}`). Trivial once the events are stable.

---

## UTM / link-tagging convention (operational, no code)

Where *you* publish links, tag them so Umami's native referrer/UTM capture feeds the audience split — **zero code**, pure hygiene:

| Param | Values |
|---|---|
| `utm_source` | `github` · `linkedin` · `cv` · `devto` · `email_sig` · `x` |
| `utm_medium` | `profile` · `post` · `pdf` · `bio` |
| `utm_campaign` | optional, e.g. `job_search_2026` |

`github`/`devto` lean engineer; `linkedin`/`cv` lean recruiter. For the CV (PDFs are awkward to tag), prefer a clean `/cv?ref=cv`-style path. *(Tracked as a deliverable so it isn't forgotten; the act of tagging is yours, not code.)*

---

## Reserved seats (forward-compatibility — defined, not emitted)

So ②–④ never force another migration:

- **Blog (③):** a blog post is `content_type: blog` + `content_id: <slug>`, reusing `scroll_depth` / `section_view` / `outbound` with no new event shape. `content_group` carries topic (e.g. `ai`, `frontend`) for topic-level segments.
- **Rendering A/B (④):** `render_variant` / `experiment` session props — populated later to slice Core Web Vitals by variant. Reserved as a *pattern* (experiment + variant), not a single key, so concurrent experiments don't force a redesign.
- **`value`** numeric convention covers future dwell / read-time / weighted-goal measures.
- **`position`** covers click-by-position (ordering bias) on impressions.

---

## Migration plan

Clean cutover — **no backward-compat** (sparse test data):

1. Rename all event names kebab→snake (the `AnalyticsEvent` union + every emit site + server event names + tests).
2. Restructure props per the catalog: retire `outbound.context`; remap `impression.element/id` → `content_type`/`content_id`; add `value` to `scroll_depth` and restrict it to stories; add `section_view`, `gate_fail`; add `v` to every event; keep `company` on `story_view`.
3. Add the identity layer (`getOrCreateVisitorId`, `identifyVisitor`, `VisitorIdentity` component) and the unlock-returns-company wiring.
4. **Reset the Umami website data** to start on a clean schema (also clears `setup-check`/`domain-check` test noise). `v:1` is insurance for *future* changes; for *this* one a reset is cheapest. *(User decision.)*
5. No dashboard migration — ② isn't built yet, so nothing downstream breaks.

---

## Testing (TDD)

House style: pure logic in vitest (node env); React/DOM glue kept thin and manually verified.

**Pure units (test-first):**
- `getOrCreateVisitorId(storage)` — mints on first call, persists, returns the same id thereafter.
- `categorizeOutbound(host)` — `github→code`, `linkedin→professional`, etc.; unknown → `other`.
- `buildGateFail(attempt, slug)` — truncates `attempt` to ≤64 chars, computes `format_valid` via the `Company-<base62>` shape, and **asserts it never derives `company` and never emits a valid password**.
- `buildIdentify(input)` and the `section_view` payload builder.
- Updated `buildOutboundEvent` (now carrying `content_type`/`category`) and `newMilestones`.

**Thin glue (manual verify):** the `IntersectionObserver` for `section_view`, the identify-on-mount component, scroll-timing capture.

**Story channel:** keep the prefetch / ad-block-immunity tests; add a `gate_fail` server test.

**Integration / user-flow test (near the end, per planning conventions):** the homepage section-funnel sequence + the unlock→view flow firing the correct events, paired with a short manual-verification checklist (no e2e harness exists).

**Docs:** update this Events Catalog + `src/components/analytics/AGENTS.md` (including the `gate_fail` near-miss note on the "Never" list) as the source of truth.

---

## Open decisions for review

1. **Umami data reset** on cutover — recommended (clean schema), but it discards the existing sparse test data. Confirm.
2. **`identify()` signature** — confirmed at implementation against live Umami v3 docs.
3. Anything in the catalog or segment definitions to adjust before we move to the plan.
</content>
