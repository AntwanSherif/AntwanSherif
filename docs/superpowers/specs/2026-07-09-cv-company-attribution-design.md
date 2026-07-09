# CV Company Attribution — Design

**Date:** 2026-07-09
**Status:** Approved (design), pending implementation plan
**Area:** CV (`/cv`), analytics (UTM)

## Problem

When Antwan sends his CV to a specific company (email attachment or an on-the-go
share at a networking event), he wants his own analytics to attribute later
visits back to that company: "Acme opened my CV and clicked through to my
portfolio / EncoreShot." Today the CV's outbound links carry only a partial UTM
tag (`utm_source=cv` + `utm_medium=web|pdf`) on the **EncoreShot** link, and the
**portfolio self-link is entirely untagged** — so CV-driven traffic to his own
portfolio looks organic, and nothing is attributable to a specific company.

## Goals

- Tag the CV's **own-property** outbound links (portfolio + EncoreShot) with a
  per-company `utm_campaign=<slug>` so destination analytics can filter by company.
- Produce a company-tagged **PDF** on demand from **any device**, including a
  phone at a networking event — without serverless Chromium.
- Preserve a company-tagged **live link** (`/cv?co=acme`) for the paste-a-URL case.
- Keep the public, generic `/cv` page and `public/cv.pdf` unchanged for everyone else.

## Non-goals

- **No destination-side code.** Attribution is read from Umami's built-in UTM
  capture (dashboard filter on `utm_campaign`). Portfolio and EncoreShot get zero
  changes.
- **No visible per-company personalization** (e.g. "Prepared for Acme" printed on
  the page). The company tag lives only in link URLs. If visible personalization
  is ever wanted, that is a future re-render approach (out of scope here).
- **No serverless/hosted Chromium.** Ruled out in favor of static-PDF link patching.
- Third-party links (LinkedIn, GitHub, haktiv.com, etc.) are **never tagged** —
  Antwan doesn't own their analytics, so a tag there is noise.

## Decisions (resolved during brainstorming)

1. **Delivery model: Hybrid.** Tagging logic works on the live page *and* an
   on-demand PDF path exists. No serverless Chromium.
2. **Attribution depth: Dashboard filter (free).** Rely on Umami's automatic UTM
   capture on pageviews. No dedicated event on either destination.
3. **PDF generation: Static-PDF link patch (pdf-lib).** Rewrite the committed
   `public/cv.pdf`'s link annotations to append `utm_campaign`. No browser.
4. **Live-link tagging: Keep.** `/cv?co=acme` threads the company into rendered hrefs.
5. **Single flow: the Download button is company-aware.** On `/cv?co=acme`, the
   existing "Download PDF" button targets the tagged endpoint instead of the static
   file — so the whole UX is one page: visit `/cv?co=acme` → click Download → tagged
   PDF. No `?co=` → serves the static generic file exactly as today.
6. **Endpoint is open + rate-limited (no token).** `/api/cv-pdf` needs no secret, so
   the flow works instantly on any device with zero setup. It only ever emits the
   already-public CV with an invisible tag, so exposure is a non-issue; compute abuse
   is handled by Vercel rate-limiting, not a gate.

## Vocabulary

Standard UTM, three dimensions:

- `utm_source=cv` — the surface of origin (already in use).
- `utm_medium=web|pdf` — the render surface (already in use; `web` = live page,
  `pdf` = the file).
- `utm_campaign=<company-slug>` — **new** — the specific outreach.

`<company-slug>` = `slugifyCompany(raw)`: lowercase, non-alphanumeric runs → single
hyphen, trim leading/trailing hyphens. Example: `"Trade Republic"` → `trade-republic`.

## Architecture

Two independent mechanisms, one shared baseline.

### Shared baseline — own-property link tagging

Both the live page and the static PDF must carry, on **own-property links only**
(portfolio + EncoreShot), the baseline `utm_source=cv` + `utm_medium`. This is a
strict improvement even for the generic (no-company) case: the portfolio self-link
becomes attributable to the CV for the first time.

- Extend `src/lib/encoreshot.ts` (or a sibling) with a **portfolio link builder**
  mirroring `encoreshotUrl`, so `antwansherif.com` gets `utm_source=cv` + medium.
- The existing `stampSurfaceMedium(href, surface)` continues to stamp
  `utm_medium=web|pdf` per render surface.

### Mechanism 1 — Live page (`/cv?co=<slug>`)

- `/cv` reads the `co` query param, slugifies it, and passes it to `CVDocument`
  as a new `campaign?: string` prop (alongside the existing `surface`).
- When `campaign` is set, own-property hrefs gain `utm_campaign=<slug>`.
- Result: `/cv?co=acme` renders with tagged links; the pageview URL itself carries
  `?co=acme`, so it is filterable in Umami too.
- **Download button is company-aware:** `CvDownload` reads `?co=`. With a company,
  it links to `/api/cv-pdf?co=<slug>` (tagged PDF) instead of the static `/cv.pdf`;
  the `cv_download` event gains a `company` prop. Without `?co=`, unchanged — serves
  `public/cv.pdf`.
- No company → baseline tags only (no `utm_campaign`). Unchanged public experience.

### Mechanism 2 — On-demand PDF (`/api/cv-pdf?co=<slug>`)

- **Edge runtime** (pdf-lib is pure JS; no Node/Chromium needed).
- **Open endpoint, no token.** Compute abuse guarded by Vercel rate-limiting.
- Fetches the app's own static `/cv.pdf` bytes (`fetch(new URL('/cv.pdf', request.url))`).
- Loads with **pdf-lib**, iterates every page's **Link annotations**.
- For each annotation whose URI is an **own property** *and* already contains
  `utm_source=cv` *and* lacks `utm_campaign` (the exact guard `stampSurfaceMedium`
  uses), append `&utm_campaign=<slug>`.
- Streams patched bytes back as `Antwan Sherif Labib - Resume.pdf`
  (generic filename — the company is invisible; a company-named file would read
  like a mail-merge).
- **Auto-sync:** reads whatever `public/cv.pdf` currently is, so regenerating the
  static file (existing workflow) keeps the endpoint current. No new staleness surface.

## Abuse guard (no gate)

- `/api/cv-pdf` is **open** — no token. Rationale: it only ever emits the
  already-public CV with an invisible tag meaningful to no one but Antwan, so there
  is nothing to protect. A gate would only add per-device setup friction.
- The one real risk is compute abuse (a loop hammering the edge function). Handle it
  with **Vercel rate-limiting** (firewall rule on the route) — no UX cost, no token.
- **As-built (live in production):** Vercel WAF rule `Rate limit cv-pdf`
  (`rule_rate_limit_cv_pdf_0Vl7vS`) — condition `path starts with /api/cv-pdf`,
  30 req / 60s per IP (fixed window), action **deny**. It blocks at the edge before
  the function runs. Manage via `vercel firewall rules ls|rm` or the dashboard.

## Static generic PDF

Unchanged workflow: `pnpm cv:pdf` renders `/cv?surface=pdf` via local Chrome →
committed `public/cv.pdf`. It now carries the **baseline** own-property tags
(`utm_source=cv` + `utm_medium=pdf`, no campaign) so the link annotations exist for
Mechanism 2 to find and patch. The existing `.githooks/pre-push` staleness guard
still applies.

## Data flow

```
One page:   visit /cv?co=acme
                │
                ├─ live links: CVDocument(campaign=acme) ──> tagged hrefs (share the URL)
                │
                └─ click "Download PDF" (company-aware) ──> /api/cv-pdf?co=acme
                                                                  │
                                                        fetch public/cv.pdf
                                                        pdf-lib: patch own-property
                                                          Link annotations +utm_campaign
                                                                  │
                                                        tagged PDF opens ──> OS share sheet
                                                                  ▼
                              recipient opens link / PDF, clicks through, lands on
                              antwansherif.com / encoreshot.com
                              with utm_source=cv&utm_medium=…&utm_campaign=acme
                                                                  ▼
                              Umami auto-captures UTM on pageview
                                                                  ▼
                              Dashboard: filter by utm_campaign=acme
```

## Components / files (anticipated)

- `src/lib/encoreshot.ts` — add `campaign?` support + a portfolio link builder
  (or a small shared `ownPropertyUrl` helper). Pure, tested.
- `src/lib/cv-campaign.ts` (new, or fold into above) — `slugifyCompany`, the
  own-property URL matcher, and the "append utm_campaign" rewrite. Pure, tested.
- `src/components/cv/cv-document.tsx` — new `campaign?: string` prop threaded to
  own-property hrefs.
- `src/app/cv/page.tsx` — read `?co=`, slugify, pass `campaign` to `CVDocument`.
- `src/components/cv/cv-download.tsx` — company-aware: read `?co=`, point at
  `/api/cv-pdf?co=<slug>` when present, add `company` to the `cv_download` event.
- `src/app/api/cv-pdf/route.ts` (new) — open edge route; fetch static PDF, pdf-lib
  patch, stream. No token.
- `src/data/cv.ts` — portfolio self-link routed through the new builder.
- Vercel firewall — rate-limit rule on `/api/cv-pdf`.
- Env: none new.

## Error handling

- `/api/cv-pdf`: missing/blank `co` (after slugify) → 400. Static PDF fetch fails
  → 502. pdf-lib parse/patch fails → 500 with a terse message.
- Slugify of empty/garbage input → empty slug → 400, so a stray request can't mint
  an untagged-but-"tagged" file.
- `/cv` Download button: no `?co=` → serves static `public/cv.pdf` (today's behavior).
- Analytics sends: N/A on destinations (no code there).

## Testing

Per the analytics test obligation + global TDD convention:

- **Unit (pure):** `slugifyCompany` (spaces, punctuation, casing, empty); the
  own-property matcher (yes for portfolio/encoreshot, no for LinkedIn/GitHub/
  third-party); the URL rewrite (appends `utm_campaign` only when `utm_source=cv`
  present and `utm_campaign` absent; idempotent).
- **Fixture:** load a small sample PDF containing own + third-party link
  annotations; run the patcher; assert own-property URIs gained `utm_campaign=<slug>`
  and third-party URIs are untouched.
- **Route:** `/api/cv-pdf` returns 400 on empty/garbage `co`; returns a PDF
  content-type on a valid request (can stub the static-PDF fetch).
- **Download button:** with `?co=acme`, links to `/api/cv-pdf?co=acme` and fires
  `cv_download` with `company: acme`; without `?co=`, links to `/cv.pdf`.
- **Integration (per convention, near the end):** a flow test —
  `/cv?co=acme` renders own-property hrefs with `utm_campaign=acme` and leaves
  third-party hrefs untagged.

## Open items / future

- Visible per-company personalization would require a re-render path
  (serverless/CF Chromium) — explicitly deferred.
- If the open endpoint is ever abused beyond what rate-limiting handles, add the
  stories-style HMAC gate; not needed for v1.
