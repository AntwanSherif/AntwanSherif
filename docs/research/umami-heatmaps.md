---
status: active
created: 2026-09-05
area: analytics
tags: [analytics, umami, heatmaps, session-replay, privacy, research]
---

# Does Umami support heatmaps, and what would adding them cost the site's privacy stance?

## Context: why this question exists now

`docs/adr/2026-06-13-analytics-stack-umami-self-hosted.md` chose self-hosted Umami specifically
to avoid a cookie banner and PII capture. This site's fork tracks `umami-software/umami` and was
last pinned around v3.1 per the roadmap doc. As of training-cutoff knowledge (Jan 2026), Umami had
no heatmap feature — it was pageview/event analytics by design, not session replay. This note
verifies the live state (Sept 2026) against primary sources: the official docs
(`docs.umami.is`), the GitHub repo/releases, and the repo's own Prisma schema.

## 1. Does Umami have a heatmap feature now? — Yes, confirmed

**This is a reversal of the 2021 "out of scope" stance**, and it shipped between the training
cutoff and today.

- Feature request [`umami-software/umami#3336`](https://github.com/umami-software/umami/issues/3336)
  ("Feature: Heatmaps," opened March 2025) explicitly cites that heatmaps were deemed **out of
  scope in 2021**, and argues for reconsideration now that Funnels (2023) exist. The issue is
  closed with no linked PR visible in it directly — the feature landed as part of a later release
  rather than through that issue.
- [Release v3.1.0](https://github.com/umami-software/umami/releases/tag/v3.1.0) (16 Apr 2026)
  shipped **Session Replay** ("built on rrweb and works alongside your existing tracker"), Boards,
  and Web Vitals — the replay infrastructure heatmaps are later built on.
- [Release v3.2.0](https://github.com/umami-software/umami/releases/tag/v3.2.0) (24 Jun 2026)
  shipped **Heatmaps** as a dedicated feature: "Heatmaps are now available as a first-class
  website report. Use click and scroll heatmaps to understand where visitors interact with each
  page, with overlays rendered from captured replay snapshots."
- The official docs page [`docs.umami.is/docs/heatmaps`](https://docs.umami.is/docs/heatmaps)
  (fetched 2026-09-05) confirms and is tagged **"Available since v3.2.0"**:
  > "Heatmaps visualize where visitors click and scroll on your pages — giving you an at-a-glance
  > view of engagement patterns without watching individual replays. Use heatmaps to identify
  > which elements attract the most attention, discover dead clicks, and understand how far down
  > the page visitors actually scroll."

**Verdict: confirmed from primary source.** Heatmaps exist, both click and scroll variants, as a
first-class dashboard report since v3.2.0 (24 Jun 2026).

## 2. Closest approximations (moot — a real feature now exists)

This site's current fork (pinned ~v3.1) already has the building blocks that would have been the
"closest approximation" pre-heatmaps:

- Manual `data-umami-event` click tagging per element ([`docs.umami.is/docs/track-events`](https://docs.umami.is)
  — Tracking → Track events in the docs nav, confirmed present).
- Funnels, shipped as part of the v3.1 roadmap this repo already tracks.
- Scroll depth as a custom event (would need to be hand-instrumented; not a built-in metric
  outside the new Heatmaps report).

Since a genuine built-in heatmap now exists (§1), these are no longer the ceiling — they're just
cheaper, lower-fidelity alternatives if the new feature's cost (see §5) is judged not worth it.

## 3. How to enable it, and version requirements

From [`docs.umami.is/docs/heatmaps`](https://docs.umami.is/docs/heatmaps) (fetched 2026-09-05),
verbatim:

- **Dashboard**: Websites → Edit → **Replays & Heatmaps** section → enable the **Heatmaps**
  toggle.
- **Script**: add the recorder script alongside the existing tracker script:
  ```html
  <script defer src="http://localhost:3000/recorder.js" data-website-id="my-website-id"></script>
  ```
  (this is a second, separate script from the main `u.js`/`r.js` tracker — an additional network
  request and payload on every page).
- **Heatmap Sample Rate**: fraction of sessions included, `0`–`1`, default `0.15` (15%).
- **Not retroactive**: "Heatmap data is only collected from sessions recorded after enabling the
  feature."
- **Page preview requires a CSP change on the site being measured**: the dashboard renders the
  heatmap overlay on a live iframe embed of the actual page, which most sites block by default.
  You must add the Umami dashboard's origin to `frame-ancestors` in your **own site's**
  Content-Security-Policy:
  ```
  Content-Security-Policy: frame-ancestors 'self' https://your-umami-instance.com;
  ```
  and remove any `X-Frame-Options: DENY`/`SAMEORIGIN`, since it can override `frame-ancestors` in
  some browsers. This is a real, non-trivial infra change to this site's own CSP (`src/proxy.ts`
  or wherever CSP headers are currently set), not just an Umami-side toggle.

**Version requirement: Umami v3.2.0 or later.** This site's fork is pinned around v3.1 (per the
roadmap doc referenced in the task), which has Session Replay but not Heatmaps — a version bump is
required (see §7).

**Cloud vs. self-hosted gating**: could not fully verify from a primary source. `umami.is/pricing`
renders client-side and did not yield its tier-by-feature grid to fetch tooling; the page's
schema.org FAQ block (fetched raw 2026-09-05) states plainly that **"Umami Cloud... includes
additional features like email reports and the streaming API that are not available in the
self-hosted version"** — Heatmaps and Replay are not named in that Cloud-exclusive list. The
docs page itself gives the self-hosted example URL (`http://localhost:3000/recorder.js`) with no
"Cloud only" notice, and the feature ships in the same open-source `prisma/schema.prisma` that
self-hosted deployments run (§5, confirmed directly from the `v3.2.0` tag). This is strong
circumstantial evidence Heatmaps/Replay are **not** gated out of self-hosted OSS. One secondhand
source (a third-party pricing-comparison listicle, not cited further per the sourcing rule for
this document) claimed Cloud's **Business** tier is required for heatmaps/replay on Cloud
specifically — that would only affect the managed-cloud SKU, not self-hosting, but it is not
independently confirmed against a primary Umami source, so treat it as unverified.

## 4. Self-hosted vs. Cloud

- **Confirmed (primary, `umami.is/pricing` FAQ schema)**: self-hosting is free and full-featured
  except for two named Cloud-only extras — email reports and the streaming API. Heatmaps/Replay
  are not on that exclusion list.
- **Confirmed (primary, GitHub source)**: the `HeatmapEvent` and `SessionReplay` Prisma models
  ship in the same open-source schema self-hosted instances run — there is no separate
  cloud-only schema fork visible in the public repo.
- **Not verified**: any Cloud-tier gate that limits heatmaps/replay to a specific paid Cloud
  plan (see §3). Since this site self-hosts, that gate — if real — would not apply here anyway.

## 5. Privacy / data-capture implications — this is the important part

**Confirmed from primary source: the underlying capture is far more granular than the docs page's
own framing suggests, and it changes Umami's privacy posture materially if enabled.**

From `prisma/schema.prisma` at the `v3.2.0` tag (`umami-software/umami`, fetched 2026-09-05):

```prisma
model HeatmapEvent {
  id          String   @id() @map("heatmap_event_id") @db.Uuid
  websiteId   String   @map("website_id") @db.Uuid
  sessionId   String   @map("session_id") @db.Uuid
  visitId     String   @map("visit_id") @db.Uuid
  urlPath     String   @map("url_path") @db.VarChar(500)
  eventType   Int      @map("event_type") @db.Integer
  x           Int?
  y           Int?
  pageX       Int?     @map("page_x")
  pageY       Int?     @map("page_y")
  pageW       Int?     @map("page_w")
  viewportW   Int?     @map("viewport_w")
  viewportH   Int?     @map("viewport_h")
  pageH       Int?     @map("page_h")
  scrollPct   Int?     @map("scroll_pct")
  createdAt   DateTime @default(now())
  @@map("heatmap_event")
}

model SessionReplay {
  id         String   @id() @map("replay_id") @db.Uuid
  websiteId  String   @map("website_id") @db.Uuid
  sessionId  String   @map("session_id") @db.Uuid
  visitId    String   @map("visit_id") @db.Uuid
  chunkIndex Int      @map("chunk_index")
  events     Bytes    @map("events")
  eventCount Int      @map("event_count")
  startedAt  DateTime @map("started_at")
  endedAt    DateTime @map("ended_at")
  @@map("session_replay")
}
```

This directly **contradicts** the marketing framing on the docs page itself, which says:

> "Heatmaps are generated from aggregated session data — no individual session is identifiable."
> — [`docs.umami.is/docs/heatmaps`](https://docs.umami.is/docs/heatmaps)

The schema shows the opposite at the storage layer: every click/scroll event is stored as an
**individual row keyed by `sessionId` and `visitId`**, with raw pixel-level `x`/`y` and
`pageX`/`pageY` coordinates, `viewportW`/`viewportH`, and `scrollPct` — not pre-aggregated bucket
counts. The "aggregated" framing describes only the dashboard's *rendering* (overlaying many rows
into one heatmap image); the underlying data is per-session, per-event, and coordinate-precise.
"No individual session is identifiable" is not accurate at the data layer — `sessionId`/`visitId`
are present on every row, which is exactly how the platform also drives the individual-session
**Replay** feature from the same recorder script.

`SessionReplay.events` is a raw `Bytes` blob — an rrweb event stream (DOM mutations, mouse
positions, inputs) captured per session, retained per
[`docs.umami.is/docs/replays`](https://docs.umami.is/docs/replays):

> "Session replays are stored for **30 days**."

**What Replay actually captures**, per the same docs page (fetched 2026-09-05):

> "The player shows a real-time recreation of the visitor's session, including: Mouse movement
> and clicks · Scroll behavior · Page navigations · Form interactions (inputs are masked by
> default)."

**Masking is opt-in and, by default, only covers form fields — not page text:**

| Setting | Default | Behavior |
|---|---|---|
| Sample Rate | `0.15` (15% of sessions) | Fraction of sessions recorded |
| Mask Level | `moderate` | `moderate` masks **only form input fields**; `strict` masks inputs **and all page text** |
| Max Duration | `300000` ms (5 min) | Recording auto-stops at this length |
| Block Selector | none | CSS selector to fully exclude an element from recording |

Source: [`docs.umami.is/docs/replays`](https://docs.umami.is/docs/replays), "Enabling Replays"
table (fetched 2026-09-05).

**Consequence for the privacy stance in the ADR**: at the default `moderate` mask level, any name,
order ID, email address, or other text your page renders in plain HTML (not a form input) is
captured verbatim into the `events` blob and viewable by anyone with dashboard access, for up to
30 days. This is a fundamentally different data-capture model from Umami's pageview/event
tracking (which the ADR chose specifically for being cookieless and PII-free) — it is DOM-level
session recording, the same category of tool (rrweb) underlying commercial products like
FullStory/Hotjar. Enabling Replay or Heatmaps does **not** inherit the "no PII, no cookie banner"
guarantee that justified choosing Umami in the first place; it has to be re-evaluated on its own
terms (mask level set to `strict`, a tight `Block Selector` list, and confirmation that GDPR/CCPA
consent requirements for session-recording tools — which are stricter than for aggregate
analytics — are met independently). This site's own privacy posture (per the ADR, for context)
would need this feature's data-capture behavior name-checked in the ADR or a follow-up decision
record if adopted.

Umami's own cookie/PII marketing claim (`umami.is/pricing` FAQ, fetched 2026-09-05) —
"Umami does not use cookies, does not collect personal data, and does not track users across
websites. All data is anonymized" — is stated site-wide and does not carve out an exception for
Replay/Heatmaps; it appears to describe the base pageview/event product, not this newer,
optional, opt-in capture mode.

## 6. Known limitations / gotchas

- **Not retroactive.** Both Replay and Heatmaps only capture sessions that start *after* the
  feature is toggled on — no backfill. ([`docs.umami.is/docs/replays`](https://docs.umami.is/docs/replays),
  [`docs.umami.is/docs/heatmaps`](https://docs.umami.is/docs/heatmaps))
- **Extra script + extra request.** Enabling either feature requires adding a second script tag
  (`recorder.js`) alongside the existing tracker — additional network weight and a second
  collection pipeline to reason about, on top of this site's typed tracker
  (`src/components/analytics/AGENTS.md`).
- **CSP change required on this site**, not just in Umami, for the heatmap page-preview to render
  (§3) — `frame-ancestors` must allow the Umami dashboard origin, and any `X-Frame-Options` header
  must be removed since it can override `frame-ancestors`. (`docs.umami.is/docs/heatmaps`)
- **Screen-width segmentation, not device/browser segmentation.** Heatmap data is grouped only by
  visitor screen width ("Widths with no data are disabled, and the view defaults to the width with
  the most sessions") — no separate mobile-vs-desktop toggle beyond width buckets.
  (`docs.umami.is/docs/heatmaps`)
- **Iframe alignment bug reported and fixed in 2026** — a WebSearch hit surfaced a GitHub
  workflow/commit description referencing a fix for "100vh heatmap iframe alignment," implying the
  page-preview iframe had at least one alignment bug shortly after release; could not pull the
  original issue/PR text directly to quote it, so this is noted as **secondhand-sourced, not
  independently confirmed** against the actual GitHub issue.
- **No rage-click-specific detection documented.** Neither the Heatmaps nor Replay docs page
  mentions a dedicated "rage click" metric or detector — click heatmaps show density/location only
  (`docs.umami.is/docs/heatmaps`); rage-click framing found during research came only from
  secondhand/marketing sources, not Umami's own docs, and is noted here as **unconfirmed**.
- **SPA/hydration interaction**: no primary-source statement found either way on how Heatmaps or
  Replay behave with client-side route changes in a React/Next.js SPA (this site's own stack).
  **Could not verify** — worth testing directly against this site's actual routing before relying
  on it.
- **Performance overhead**: no primary-source benchmark or stated overhead figure was found for
  the recorder script's runtime cost. **Could not verify** — the docs describe configuration
  knobs (Sample Rate, Max Duration, Block Selector) that exist specifically to bound overhead
  and data volume, which implies the maintainers consider it non-trivial, but no numbers are
  published.

## 7. Version-bump consideration for this site's fork

This repo tracks the genuinely open-source `umami-software/umami` codebase (per
`docs/analytics-operations.md`, referenced in the task) rather than a divergent hard fork — the
`HeatmapEvent`/`SessionReplay` models and the docs examples above come straight from the public
`umami-software/umami` tag, with no fork-specific schema seen in this research. Getting Heatmaps
therefore means:

- Upgrading from the current ~v3.1 pin to **v3.2.0 or later** — a real version bump, not a
  config-only change, since Heatmaps' Prisma models (`heatmap_event`) don't exist before v3.2.0
  and require a schema migration.
- [Release v3.2.0](https://github.com/umami-software/umami/releases/tag/v3.2.0) notes dependency
  bumps to **Next.js 16.2.6** and **Prisma 7.8.0**; [v3.1.0](https://github.com/umami-software/umami/releases/tag/v3.1.0)
  already raised the **minimum Node.js requirement to v22**. If this site's fork carries any local
  patches on top of upstream Umami, those need to be reconciled against the v3.1→v3.2 diff before
  the bump — this note does not inspect the fork's actual diff (out of scope per the task), it
  only flags that the bump is non-trivial rather than a toggle.

## Summary

**Confirmed from primary sources**: Umami shipped a real, built-in Heatmaps feature (click +
scroll) in **v3.2.0** (24 Jun 2026), one release after Session Replay landed in **v3.1.0**
(16 Apr 2026) — reversing the project's 2021 "out of scope" position. Both are self-hosted-capable
(no Cloud-only exclusion named in Umami's own pricing FAQ), both require a second recorder script
and a dashboard toggle, and both are **not** covered by Umami's cookieless/no-PII marketing claim —
the actual Prisma schema stores per-session, coordinate-level click/scroll rows and a raw rrweb
event blob per session, and the default replay mask level only redacts form inputs, not the rest
of the page's rendered text. Getting this on the current site means a real version bump
(v3.1 → v3.2.0+, Node 22 / Next.js 16.2.6 / Prisma 7.8.0) and a CSP change on the site itself, not
just an Umami dashboard toggle.

**Could not verify from a primary source** (noted explicitly rather than padded with
speculation): exact Cloud pricing-tier gating for these two features (the pricing page's
tier-by-feature grid did not render for fetch tooling); any documented rage-click detector;
SPA/hydration behavior; and published performance-overhead numbers for the recorder script.
