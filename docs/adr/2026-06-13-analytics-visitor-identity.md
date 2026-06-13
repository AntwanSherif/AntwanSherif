---
status: accepted
decided: 2026-06-13
updated: 2026-06-13
area: analytics
tags: [analytics, privacy, identity, gdpr, eprivacy, umami, localstorage]
---

# Visitor identity & consent posture for portfolio analytics

## Context

The shipped analytics stack ([Umami self-hosted](2026-06-13-analytics-stack-umami-self-hosted.md))
is cookieless: Umami identifies a visitor as `hash(hostname + user-agent + a salt that rotates
**daily**)`. Within a day the id is stable; **across days the same person gets a different id**, so
individual-level returning-visitor and multi-day cohort/retention analysis is inherently approximate.

The taxonomy redesign ([spec](../superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md))
wants to understand the audience — recruiters **and** engineers, plus future blog readers — *over
time*. The `company` session key (set on story unlock) only covers ~5% of visits (passwords go out
only at a late interview stage), so it can't carry general returning-visitor insight. That requires a
**durable, self-managed identity**.

## Options considered

| Option | Cross-day identity | Consent banner? | Notes |
| --- | --- | --- | --- |
| **Stay fully cookieless** (status quo) | approximate (daily salt) | no | Honest privacy; weak returning-visitor data for the 95%. |
| **`localStorage` UUID + `identify()`** *(chosen)* | reliable (until storage cleared) | no (see decision) | Persistent client identifier; durable cross-day thread. |
| **Geo-gated UUID** (identify non-EEA only) | reliable for non-EEA | no | Elegant given an EEA-light audience, but adds edge-branching complexity. |
| **UUID + consent banner** | reliable | yes | Full fidelity + compliance, but reintroduces the banner the stack was chosen to avoid. |
| **Non-identifying boolean** (`visited_before`) | aggregate only | no | No unique id; answers "% returning" but can't stitch a person's sessions. |

### Legal framing (not legal advice; EU/UK ePrivacy + GDPR; perishable, jurisdiction-dependent)

A persistent `localStorage` identifier is treated like a tracking cookie under ePrivacy ("storage of /
access to information on a device" is technology-neutral); for analytics it generally requires consent
for **EU/EEA/UK** visitors. GDPR's territorial scope is extraterritorial (monitoring behavior of people
in the EU), and there is **no "personal/hobby site" exemption** for visitor monitoring. So this is
*applicable in principle*. In *practice*, enforcement against a single-person portfolio at ~10
visits/month running one first-party identifier is negligible.

## Decision

**Adopt a `localStorage` UUID for all visitors, passed to `umami.identify()`. No geo-gating, no consent
banner — for now.**

Rationale: at this traffic (~10 visits/mo) the practical risk is noise, and the durable cross-day
identity is what makes returning-visitor and retention analysis meaningful for the 95% of traffic the
`company` key can't reach. Simplicity (no edge-branching) is preferred at this stage.

- UUID minted on first visit (`localStorage['as_vid']`), stable across the daily salt.
- Set as the Umami session id via `identify()` (prod-only, client-only, never throws).
- `company` remains the rare high-value cohort key, set as both a story-event prop and a session prop
  after unlock — orthogonal to this id.

## Consequences

- **Returning visitors over weeks become measurable** — leaky (cleared storage / incognito / second
  device / second browser each mint a "new" visitor), so treat as **directional**.
- **The "no banner" property now rests on an accepted risk**, not on technical impossibility — revisit
  when the **blog ships** (workstream ③), when richer measurement may justify a banner.
- **Fallback paths remain open** without re-architecting: geo-gate the `identify()` call (the app
  already runs edge middleware with country headers available), or downgrade to the non-identifying
  `visited_before` boolean.

## Revisit when

- The blog launches (③) — reassess banner vs geo-gating.
- Traffic grows materially, or EU traffic becomes a meaningful share.
- A formal compliance need arises (e.g. tying the portfolio to a registered business).
</content>
