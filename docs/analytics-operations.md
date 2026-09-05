# Analytics — Operations & As-Built Record

The as-deployed record for the portfolio's self-hosted Umami analytics. Decision: [`docs/adr/2026-06-13-analytics-stack-umami-self-hosted.md`](./adr/2026-06-13-analytics-stack-umami-self-hosted.md). Design: [`docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md`](./superpowers/specs/2026-06-11-portfolio-analytics-design.md). Dev convention: [`src/components/analytics/AGENTS.md`](../src/components/analytics/AGENTS.md).

> **No secrets in this file.** Connection strings, `APP_SECRET`, and tokens live only in the respective Vercel project envs and the local gitignored `.env.local` / `.env.umami.local`. The Website ID below is intentionally public (it ships in the page source).

## Live resources

| Thing | Value |
| --- | --- |
| Umami code | Fork **`AntwanSherif/umami`** (default branch `master`, synced to upstream ≥ v3.3.1 — fast-forwarded 2026-09-05, zero local commits, clean merge) |
| Umami host (Vercel) | `umami-sepia-three.vercel.app` |
| Umami dashboard (first-party) | **`https://stats.antwansherif.com`** |
| Database | Neon project **Portfolio** (Postgres 18, region AWS `us-east-1`, **direct/non-pooled** connection — fine at portfolio scale) |
| Website ID (portfolio) | `e38f8ab0-59e9-4719-a8ca-0f1fb834bf7c` |
| Tracker script path | `/u.js` (renamed via `TRACKER_SCRIPT_NAME`) |
| Collect endpoint | `/api/e` (renamed via `COLLECT_API_ENDPOINT`) |
| Heatmaps | **Enabled**, Replay off (`src/components/analytics/analytics-scripts.tsx` loads `${host}/recorder.js`, not renamed). Decision + measured cost: `docs/superpowers/specs/2026-09-05-umami-heatmaps-design.md`. |
| Site CSP | `next.config.mjs` sends `Content-Security-Policy: frame-ancestors 'self' https://stats.antwansherif.com` (replaces the prior `X-Frame-Options: DENY`) so the dashboard's Heatmaps page-preview iframe can render. |

> **This instance is multi-tenant.** It also hosts the **EncoreShot landing** as a *separate
> Umami website* (own Website ID, reached via a second custom domain `stats.encoreshot.com` on the
> same Vercel project + this Neon DB). The two properties share nothing but the instance and DB —
> the portfolio's `data-domains` allowlist stays `antwansherif.com` + `antwan.me` only. Landing
> as-built + rationale live in the **encoreshot repo** (`apps/landing/docs/analytics.md`,
> `docs/adr/2026-07-01-landing-analytics-umami.md`). A third property, `stats.olyachuk.com`
> (a personal site, own Website ID, no as-built doc, not tracked in this workspace), was added
> the same way. When updating/upgrading Umami here, remember all three tenants ride along.

### DNS (Cloudflare, zone `antwansherif.com`)
```
CNAME   stats   →   7e32e692cf126b23.vercel-dns-017.com.   (Proxy: DNS only / grey cloud, TTL Auto)
```
Grey cloud is required so Vercel can issue/renew the TLS cert. (Optional later: flip to proxied/orange for origin masking — needs Cloudflare SSL mode "Full".)

## Search engine consoles — Google + Bing

Separate from Umami and answering a different question. **Umami tells you what visitors did once they arrived; the search consoles tell you how they found you** (queries, impressions, click-through, crawl and index health). Neither replaces the other.

| Property | Google Search Console | Bing Webmaster Tools |
| --- | --- | --- |
| `antwansherif.com` | ✅ verified (**predates this record** — method not captured at the time) | ✅ **imported 2026-08-01** |
| `encoreshot.com` | ✅ verified **2026-08-01** — *Domain* property, DNS TXT | ✅ **imported 2026-08-01** |

> **Like the Umami instance, these accounts are multi-tenant.** One Google account and one Bing
> account now cover *both* the portfolio and EncoreShot. Same caveat applies: when changing anything
> at the account level, remember both properties ride along. EncoreShot's SEO/GEO strategy and the
> reasoning behind its verification live in the **encoreshot repo**
> (`docs/product/seo-geo.md`, issue #253) — not here.

### Bing was added on purpose, not for completeness

Bing's search share undersells it: **it feeds ChatGPT search and Microsoft Copilot.** So it is a
*GEO* channel (being cited by answer engines), not merely a second SEO channel. Import is one click
from Google Search Console — *Import from Google Search Console* — with no second DNS record, since
it reuses the Google verification.

### The verification records are load-bearing

`encoreshot.com` is verified by a DNS TXT record on the apex:

```
TXT   @   google-site-verification=9BNUEZQV0fuw6R3iKnrqmLt3m3_nHDOJV8o6B3fQxT4
```

Not a secret — it is published in public DNS by design, and its only power is proving ownership to
someone who already controls the zone. **But do not delete it.** Google's own wording: *"To stay
verified, don't remove the DNS record."* It is infrastructure, not setup debris — the trap is a
future DNS tidy-up (adding SPF/DMARC, pruning stale records) that quietly sweeps it away, because a
lapsed verification fails silently and you notice months later.

Verify from a terminal:
```bash
dig +short TXT encoreshot.com @1.1.1.1
```
Query a public resolver explicitly. A local resolver that saw the domain *before* the record existed
will serve a cached **negative** answer and report nothing — which looks exactly like a failure and
isn't one.

### Note on `encoreshot.com`

It is currently `noindex` on purpose (pre-launch). **Verification is not indexing** — the property
exists and reports nothing until that flips, which is deliberate: it means flip day is one line
rather than a setup session, with DNS and ownership already settled.

## Environment variables

Two separate Vercel projects. **Set the portfolio vars to the `Production` environment only** — Vercel builds Previews with `NODE_ENV=production`, so enabling Preview would let server-side story events leak into the data from `*.vercel.app` preview URLs.

### Umami Vercel project (`umami` fork)
| Var | Notes |
| --- | --- |
| `DATABASE_URL` | Neon direct connection string — **paste with no quotes** (quotes caused an `Invalid URL` build error). |
| `DATABASE_TYPE` | `postgresql` |
| `APP_SECRET` | random 32-byte hex (secret) |
| `TRACKER_SCRIPT_NAME` | `u.js` |
| `COLLECT_API_ENDPOINT` | `/api/e` |

### Portfolio Vercel project (Production only)
| Var | Value |
| --- | --- |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | `e38f8ab0-59e9-4719-a8ca-0f1fb834bf7c` |
| `NEXT_PUBLIC_UMAMI_HOST_URL` | `https://stats.antwansherif.com` |
| `NEXT_PUBLIC_UMAMI_SCRIPT_NAME` | `u.js` |
| `UMAMI_COLLECT_ENDPOINT` | `/api/e` |

> The three `NEXT_PUBLIC_*` vars are **inlined at build time** — set them in Vercel *before* the build that should ship them, or redeploy after adding them. Local values are stashed (gitignored) in the repo root `.env.local`; the template is `.env.example`.

## Tracking model (one-paragraph recap)

Client tracker (`/u.js`, `data-domains` allowlist, `data-performance` on) → pageviews, Core Web Vitals, `outbound` (all external links), `contact-click{linkedin}`, `scroll-depth`, `impression`. Server channel (Server Action → `/api/e`) → `story-unlock{company}`, `story-view{company,story}` — prefetch- and ad-block-immune; the story **password is never sent, only the company slug**. Aggregate dashboard = default view; per-domain = the **hostname filter**.

## Reading the dashboard

Which of the sixteen Umami screens actually answers which question, confirmed working vs.
confirmed broken by a live pass (Goals ignores Segment scoping; Homepage Churn funnel needed
a property filter per step; Events → Properties auto-breaks-down any custom property like
`company` with zero setup): https://claude.ai/code/artifact/4120d381-0eb0-4965-89e9-cc52366e8af0

## Workflow that produced this (reproducible)

1. **Neon** → create free project, copy the **direct** connection string.
2. **Fork + sync Umami** → `gh repo fork umami-software/umami`; `gh repo sync AntwanSherif/umami` to get ≥ v3.1.0 (needed for `data-performance` CWV + the rename env vars).
3. **Deploy Umami on Vercel** → import the fork; set the Umami env vars above; deploy (build runs the Prisma migration against Neon).
4. **First login** → `admin` / `umami`, then **change the password immediately**.
5. **Create website** → one website, both domains report into it via `data-domains`; copy the Website ID.
6. **Custom domain** → add `stats.antwansherif.com` in the Umami Vercel project → Cloudflare CNAME (above) → wait for Valid + cert.
7. **Portfolio env** → set the four portfolio vars (Production) → deploy the portfolio (the analytics branch).
8. **Verify** → `/u.js` 200, `POST /api/e` 200, dashboard shows pageviews + hostname split + CWV + a story unlock carrying the company.

## Maintenance

- **Update Umami:** `gh repo sync AntwanSherif/umami --source umami-software/umami`, then redeploy the Umami Vercel project. Check the upstream release notes for breaking DB migrations first.
- **Rotate secrets** (`APP_SECRET`, the Neon password, the stories token) if a transcript/screenshot ever exposed them — update the Umami Vercel env + local `.env.local`.
- **Reset analytics data** (e.g., to clear the two setup test events `setup-check` / `domain-check`): Umami → Settings → Websites → edit → Reset.
- **Add a reserved event** when its UI ships (`cv-download`, `contact-click{email}`, `project-expand`, `talk-photos`): one `track()` call — see `src/components/analytics/AGENTS.md`.

## Known noise

Two test events were sent during setup to verify the pipeline: `setup-check` and `domain-check` (hostname `antwansherif.com`). Harmless; reset the website data before launch if you want a pristine baseline.
