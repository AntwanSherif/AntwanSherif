---
status: active
created: 2026-06-13
updated: 2026-06-13
area: analytics
tags: [analytics, utm, attribution, audience, umami]
---

# UTM & link-tagging conventions

**Purpose.** Tag the portfolio links *you* publish so Umami's native referrer/UTM capture
tells us **where a visitor came from** — which is the cleanest signal for the
**engineer-vs-recruiter** split (cookieless can't label a person, but the entry source
strongly hints at intent). **No code** — this is pure operational hygiene. It complements the
event taxonomy ([spec](superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md),
[roadmap](analytics-roadmap.md) workstream ②).

> Base URL in the examples is `https://antwansherif.com` (primary domain; `antwan.me` is the
> alias). Swap the base if you're sharing the other domain.

## The scheme (controlled vocabulary — keep to these values)

Fragmenting the values (e.g. `LinkedIn` vs `linkedin` vs `li`) splits the data and ruins
segments. **Always lowercase, always from these lists.**

| Param | Allowed values | Meaning |
|---|---|---|
| `utm_source` | `github` · `linkedin` · `cv` · `devto` · `x` · `email_sig` · `portfolio` (own-property hop, stamped client-side by the site-wide `?co=` mechanism) | *Where the link lives* |
| `utm_medium` | `profile` · `post` · `pdf` · `bio` | *What form the link takes* |
| `utm_campaign` | optional, e.g. `job_search_2026` | *A push you want to measure as a unit* |

## Ready-to-use links (copy/paste)

| Where you're posting | Tagged link |
|---|---|
| GitHub profile/README | `https://antwansherif.com/?utm_source=github&utm_medium=profile` |
| LinkedIn "Website" field | `https://antwansherif.com/?utm_source=linkedin&utm_medium=profile` |
| LinkedIn post / article | `https://antwansherif.com/?utm_source=linkedin&utm_medium=post` |
| CV / résumé (PDF link) | `https://antwansherif.com/?utm_source=cv&utm_medium=pdf` |
| dev.to bio / article | `https://antwansherif.com/?utm_source=devto&utm_medium=bio` |
| X/Twitter bio | `https://antwansherif.com/?utm_source=x&utm_medium=bio` |
| Email signature | `https://antwansherif.com/?utm_source=email_sig&utm_medium=bio` |

Add a campaign when relevant by appending `&utm_campaign=job_search_2026`.

## Audience mapping (how these feed the segments)

| Source | Leans | Why |
|---|---|---|
| `github`, `devto` | **engineer** | dev-native surfaces; came for the code/writing |
| `linkedin`, `cv`, `email_sig` | **recruiter / hiring** | professional outreach context |
| `x` | mixed | could be either — read alongside on-site behavior |

These pair with the on-site `outbound.category` (`code` → engineer-leaning, `professional` →
recruiter-leaning) and reading-velocity (`scroll_depth.value`) to firm up the inference. None
of it *labels* a person — it's a **directional segment**, honest under cookieless.

## Reading it in Umami

UTM params are captured automatically (no setup). In the dashboard they surface under
referrers/parameters; build **saved Segments** like:
- *Engineer-leaning*: `utm_source in (github, devto)` OR `outbound.category = code`.
- *Recruiter-leaning*: `utm_source in (linkedin, cv, email_sig)` OR a `cv_download` / `story_unlock`.
Then apply either segment to any funnel/journey/retention report.

## Hygiene rules

- **Only tag external entry points** (links you post elsewhere) or genuinely own-property hops
  across a different domain (e.g. antwansherif.com → encoreshot.com). Never add UTM to
  *same-host* internal navigation — it would restart attribution mid-session; `portfolio` above
  is scoped by `stampSiteCampaign` to skip same-host links for this reason.
- **Stick to the controlled values** above; resist inventing one-off sources — `portfolio` is
  the one exception already vetted and added to the table, not a precedent for freehand values.
- UTM params are visible in the URL (public) — that's fine; they carry no secrets.
- The CV is a PDF, so the query-string link above is the pragmatic choice. If a dedicated
  `/cv` route is ever added, prefer `https://antwansherif.com/cv?utm_source=cv&utm_medium=pdf`.
</content>
