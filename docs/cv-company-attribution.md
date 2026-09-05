# CV Company Attribution — Operations

How the CV tags outbound links per company, how to hand a tagged CV to someone,
and how the abuse guard is configured. Design + rationale: `docs/superpowers/specs/2026-07-09-cv-company-attribution-design.md`.

This is the CV-specific mechanism. For tagging any other page on the site, see
*Site-wide attribution* below, design + rationale:
`docs/superpowers/specs/2026-09-04-site-wide-company-attribution-design.md`.

## What it does

When you send your CV to a company, its **own-property** links (portfolio +
EncoreShot) carry `utm_campaign=<company-slug>`, so your analytics can attribute
later visits to that company. Third-party links (LinkedIn, GitHub, haktiv.com, …)
are never tagged — you don't own their analytics.

UTM dimensions used (standard):

- `utm_source=cv` — origin surface.
- `utm_medium=web|pdf` — live page vs. the downloaded file.
- `utm_campaign=<slug>` — the specific company (e.g. `trade-republic`).

## How to hand out a tagged CV

One page, one flow — works on desktop and phone, no login:

1. Visit `/cv?co=<company>` (e.g. `antwansherif.com/cv?co=acme`). The company is
   slugified (`Trade Republic` → `trade-republic`).
2. The live links are already tagged — you can **share that URL** as-is, or
3. Click **Download PDF**. With `?co=` present the button hits `/api/cv-pdf?co=<slug>`,
   which returns a company-tagged PDF; share it via the OS share sheet.

No `?co=` → the page and the Download button behave exactly as before (generic,
untagged-campaign `public/cv.pdf`).

## Seeing the attribution (no destination code)

Umami auto-captures UTM params on every pageview, so **nothing is instrumented on
the destinations** (portfolio or EncoreShot). To see who came from a CV you sent:

- Umami dashboard → filter / segment pageviews by `utm_campaign=<slug>`.
- The `/cv?co=<slug>` visit itself is also a pageview carrying `?co=`, so you can
  see "company opened the CV" before they click anything.

## Rate limit (abuse guard) — LIVE

`/api/cv-pdf` is intentionally **open** (no token): it only ever emits your
already-public CV with an invisible tag. The only real risk is compute abuse
(a loop hammering the edge route), guarded by a Vercel WAF rule:

| Field | Value |
| --- | --- |
| Name | `Rate limit cv-pdf` |
| ID | `rule_rate_limit_cv_pdf_0Vl7vS` |
| Condition | path **starts with** `/api/cv-pdf` |
| Limit | 30 requests / 60s per IP (fixed window) |
| Action | **deny** |
| Scope | production |

It blocks at the edge before the function runs. Manage it:

```bash
vercel firewall rules ls                       # list live rules
vercel firewall rules rm rule_rate_limit_cv_pdf_0Vl7vS   # remove
# change limits: rm + re-add (see the design spec for the add command), then:
vercel firewall publish --yes
```

30/min/IP is generous for legitimately generating several tagged PDFs in one
sitting (e.g. multiple companies at an event) while still strangling a script.

## Regenerating the static PDF

`/api/cv-pdf` patches the committed `public/cv.pdf`'s link annotations — it does
**not** re-render. So the static file must carry the baseline own-property tags
(`utm_source=cv` + `utm_medium=pdf`) for the patcher to find. Any time you change
the CV, regenerate it (this also keeps the generic download current):

```bash
pnpm dev      # PDF renders from the running /cv (reads .dev/port)
pnpm cv:pdf   # → public/cv.pdf
```

## Where the code lives

- `src/lib/cv-campaign.ts` — pure primitives: `slugifyCompany`, `isOwnPropertyUrl`,
  `withCampaign`.
- `src/lib/encoreshot.ts` — link builders (`encoreshotUrl`, `portfolioUrl`) +
  `resolveCvHref` (the one place a CV href is resolved for surface + campaign,
  shared by the document and its tests).
- `src/components/cv/cv-document.tsx` — `campaign` prop → tagged own-property hrefs.
- `src/app/cv/page.tsx` — reads `?co=`, slugifies, passes `campaign`.
- `src/components/cv/cv-download.tsx` — company-aware Download button.
- `src/app/api/cv-pdf/{route.ts,patch.ts}` — open edge route + pdf-lib annotation patch.

## Site-wide attribution (any page, not just `/cv`)

`?co=<company>` also works from any page, e.g. `antwansherif.com/?co=acme`, not
just `/cv`. Unlike the CV mechanism above (server-rendered per request), this one
persists for the whole browser tab and tags the visitor's Umami session, not just
the landing pageview:

1. On mount, `VisitorIdentity` reads `?co=` (or an already-set value from a prior
   page in the same tab), slugifies it, and stores it in
   `sessionStorage['as_campaign']`. First touch wins — a later `?co=` in the same
   tab is ignored once one is set.
2. That slug feeds the existing `identify()` call, so the whole Umami session
   (not just the landing pageview) carries `company=<slug>` — segmentable the
   same way a first/last-click Attribution report would be, but live for every
   report, not one dedicated view.
3. `OutboundTracker` stamps `utm_source=portfolio&utm_campaign=<slug>` onto
   own-property links (portfolio + EncoreShot) as the visitor clicks around,
   the same way the CV's own links are tagged, just triggered client-side. It
   skips same-host links (no re-tagging your own internal navigation) and
   third-party links (LinkedIn, GitHub, etc.), same rule as the CV mechanism.

**What it doesn't do:** it does not touch `/cv` or `/api/cv-pdf` — a visitor who
lands on `/?co=acme` and then navigates to `/cv` gets an attributed session, but
an untagged CV/PDF, since those still resolve `?co=` from the URL directly. Use
`/cv?co=<company>` (above) when you specifically want a tagged CV or PDF handed
out.

Code: `src/lib/site-campaign.ts` (`readCampaignFromLocation`,
`stampSiteCampaign`), `src/components/analytics/visitor-identity.tsx`,
`src/components/analytics/outbound-tracker.tsx`.
