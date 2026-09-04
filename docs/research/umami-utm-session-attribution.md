---
status: active
created: 2026-09-04
area: analytics
tags: [analytics, umami, utm, attribution, research]
---

# Does Umami carry UTM attribution across a whole session, or only the landing pageview?

No prior file at this location — `docs/research/` did not exist before this note (checked
`docs/superpowers/`, `docs/agents/`, and the rest of `docs/`; the only other "research" hit was
an unrelated blog idea brief). Created fresh per the instruction that raised this question.

## Context: what the local docs currently assume

`docs/analytics-utm-conventions.md` documents the controlled UTM vocabulary and says:

> UTM params are captured automatically (no setup). In the dashboard they surface under
> referrers/parameters; build **saved Segments** like: *Engineer-leaning*:
> `utm_source in (github, devto)` OR `outbound.category = code` … *Recruiter-leaning*:
> `utm_source in (linkedin, cv, email_sig)` OR a `cv_download` / `story_unlock`.

and, in Hygiene rules:

> **Only tag external entry points** (links you post elsewhere). Never add UTM to *internal*
> navigation — it would restart attribution mid-session.

That last line implicitly assumes attribution has session-wide scope that *could* be "restarted"
— i.e. it treats UTM as something that persists across a visit and could be overwritten by a
later internal link. The doc never states outright whether a Segment like `utm_source in
(github, devto)` matches only the landing pageview or every pageview in that visit. This note
settles that with primary sources.

## Primary-source investigation

### 1. Doc pages (umami.is / docs.umami.is) — inconclusive on the mechanics

- `https://umami.is/docs/query-parameters` redirects (307) to `https://docs.umami.is/docs/query-parameters`.
- `https://docs.umami.is/docs/utm` (fetched 2026-09-04) states UTM parameters are "tags added to
  the end of a URL that help you track where your traffic comes from" and that the UTM insight
  "display[s] the number of views broken down by each UTM parameter." The page carries a feature
  note **"Available since v2.11.0"** but does not state storage granularity (session vs.
  pageview) or whether attribution persists across internal navigation.
- `https://docs.umami.is/docs/guides/analyze-traffic-sources` and
  `https://docs.umami.is/docs/guides/measure-campaigns` returned empty content on fetch
  (2026-09-04) — could not be used as evidence either way.

None of the doc pages answer the question definitively, so the verdict below rests on the
self-hosted source code itself (the same code this repo's Umami fork, `AntwanSherif/umami`,
tracks per `docs/analytics-operations.md`), read at `umami-software/umami@master` on 2026-09-04.

### 2. Database schema — UTM columns live on the event row, not the session row

`prisma/schema.prisma` (`umami-software/umami@master`):

- The `Session` model's own fields are `id`, `websiteId`, `browser`, `os`, `device`, `screen`,
  `language`, `country`, `region`, `city`, `distinctId`, `createdAt` (plus relations) — **no
  `utm_*` fields.**
- The `WebsiteEvent` model carries, under its own `// UTM` field group:
  ```
  utmSource   String?  @map("utm_source")   @db.VarChar(255)
  utmMedium   String?  @map("utm_medium")   @db.VarChar(255)
  utmCampaign String?  @map("utm_campaign") @db.VarChar(255)
  utmContent  String?  @map("utm_content")  @db.VarChar(255)
  utmTerm     String?  @map("utm_term")     @db.VarChar(255)
  ```
  alongside per-pageview fields (`urlPath`, `urlQuery`, `referrerDomain`, etc.). The schema
  physically separates a `// Session` field group (browser/os/device/language/country/city) from
  this `// UTM` group on the *event* table — UTM is modeled as a property of the pageview, not
  the visitor/session.

`src/lib/constants.ts`'s `SESSION_COLUMNS` constant (used everywhere a filter decides which table
to query against) is:
```
export const SESSION_COLUMNS = [
  'browser', 'os', 'device', 'screen', 'language', 'country', 'city', 'region', 'distinctId',
];
```
No `utm_*` entry.

### 3. Ingest — each collect request parses UTM only from its own URL

`src/app/api/send/route.ts` (the collect endpoint handler, ~lines 196–297), for every incoming
pageview/event payload:
```
const currentUrl = new URL(url, base);
...
// UTM Params
const utmSource = currentUrl.searchParams.get('utm_source');
const utmMedium = currentUrl.searchParams.get('utm_medium');
const utmCampaign = currentUrl.searchParams.get('utm_campaign');
const utmContent = currentUrl.searchParams.get('utm_content');
```
`currentUrl` is built fresh from the `url` field of *that single request's* payload — there is no
read of a prior event, session record, or in-memory carry-forward. A pageview to `/projects` with
no query string simply yields `null` for every `utm_*` field on **that row**; `saveEvent`
(`src/queries/sql/events/saveEvent.ts`) then persists whatever it was given, one row per event.

### 4. Read path — the UTM report and filters query the event row directly

`src/queries/sql/reports/getUTM.ts` (backs `src/app/api/reports/utm/route.ts`, the dashboard's
UTM insight):
```sql
select website_event.utm_campaign utm, count(*) as views
from website_event
...
where website_event.website_id = {{websiteId::uuid}}
  and website_event.created_at between {{startDate}} and {{endDate}}
  and coalesce(website_event.utm_campaign, '') != ''
  ...
group by 1
order by 2 desc
```
It counts **pageviews** (`count(*)`) grouped by the literal, non-empty `utm_campaign` value on
each `website_event` row. A pageview whose row has `utm_campaign = NULL` (e.g. `/projects` after
internal navigation) is excluded from this report entirely — it does not inherit the landing
page's value.

`src/lib/prisma.ts`'s `mapFilter` — the function every Segment/report filter goes through —
picks its table with:
```js
const table = SESSION_COLUMNS.includes(name) ? 'session' : 'website_event';
```
Since `utm_campaign`/`utm_source` are not in `SESSION_COLUMNS`, a filter or saved Segment built
on `utm_source in (github, devto)` (as `docs/analytics-utm-conventions.md` proposes) resolves to
`website_event.utm_source = ANY(...)` — a condition on the **individual row**, not a join that
pulls in every other pageview belonging to the same `session_id`. So applying that Segment to,
say, the Pages report restricts results to the specific pageview rows that carried the parameter
— `/projects` and `/blog` visited afterward without the query string are not included.

### 5. The one place Umami *does* do session-level, first/last-touch modeling — and why it doesn't change the verdict

`src/queries/sql/reports/getAttribution.ts` backs a distinct, dedicated **Attribution** report
(multi-touch modeling: `first-click` / `last-click`, for measuring which channel preceded a
chosen conversion "step"). Its `model` CTE picks **one single `website_event` row per session**
(`min(created_at)` for first-click, or the last event before the step for last-click) and its
`getUTMQuery` helper joins on that one row's `utm_*` values:
```sql
select coalesce(we.utm_campaign, '') as "name", count(distinct we.session_id) as "value"
from model m
join website_event we
  on we.created_at = m.created_at and we.session_id = m.session_id
...
```
This is a real session-scoped attribution *model*, but it is scoped to that one purpose-built
report — it reads one representative event per session (typically the landing pageview for
first-click), it does not write `utm_campaign` back onto the session or onto every other pageview
row, and it has no bearing on the ordinary UTM report, Segments, Funnels, or Pageviews breakdown,
which all filter/query `website_event.utm_*` directly per §3–4.

## Verdict

**PAGEVIEW-SCOPED.** `utm_source`/`utm_campaign`/etc. are columns on `website_event` (the
per-pageview/event table), populated only when that specific request's URL carries the query
string, per `prisma/schema.prisma`, `src/app/api/send/route.ts`, `src/queries/sql/reports/getUTM.ts`,
and `src/lib/prisma.ts`'s `SESSION_COLUMNS`/`mapFilter`. The `Session` model has no UTM columns at
all. The one session-scoped mechanism Umami ships — first-click/last-click modeling in
`getAttribution.ts` — is confined to the dedicated Attribution report and works by reading a
single chosen event's row, not by propagating UTM values onto other pageviews.

## Plain-English answer

No — landing on `antwansherif.com/?utm_source=cv&utm_campaign=zauber` and then clicking through to
`/projects` and `/blog` with no query params on those URLs does **not** carry `campaign=zauber`
onto those later pageviews in Umami's dashboard, UTM report, or an ordinary Segment/filter built
on `utm_campaign`. Umami stores UTM parameters as columns on the individual pageview/event row
(`website_event`), populated fresh from each request's own URL, and the `Session` row that
represents the visitor across the whole visit carries no UTM data at all — so only the single
landing pageview shows up when you filter or segment by `utm_campaign=zauber`; `/projects` and
`/blog` show up as plain, unattributed pageviews of the same session. The only place Umami
computes something session-wide from UTM is the separate, purpose-built **Attribution** report
(first-click/last-click modeling for a chosen conversion step), which is a distinct feature from
the UTM report, Segments, and Funnels that this repo's conventions doc currently plans to use.
