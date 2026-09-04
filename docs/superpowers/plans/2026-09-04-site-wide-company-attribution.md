# Site-wide company attribution (`?co=`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `antwansherif.com/?co=<company>` work from any page (not just `/cv`), tag the whole Umami session via `identify()`, and keep own-property links (EncoreShot, self-links) campaign-tagged as the visitor navigates the rest of the site.

**Architecture:** Reuse three existing mechanisms rather than build new ones — the CV's `slugifyCompany`/`isOwnPropertyUrl` primitives (unmodified), `VisitorIdentity`'s existing `identify()`/`sessionCompany` wiring (extended with a URL/`sessionStorage` fallback), and `OutboundTracker`'s existing delegated click listener (extended to rewrite own-property hrefs). `/cv`'s own server-rendered campaign resolution is untouched.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vitest (`environment: "node"`, no DOM/jsdom setup in this repo).

## Global Constraints

- `src/lib/cv-campaign.ts` is not modified. `withCampaign` and its existing tests stay exactly as they are.
- Every new/changed browser-facing code path no-ops on error and never throws into a render, matching `track()`/`identifyVisitor()`'s existing guard style (`try { ... } catch { /* analytics must never break the page */ }`).
- `sessionStorage`, not `localStorage`, for the campaign slug — it describes one visit, not a returning identity.
- Pure logic goes in testable functions; DOM/storage glue stays untested-thin, matching this repo's existing convention (`analytics.ts`/`analytics-identity.ts` are tested, `outbound-tracker.tsx`/`visitor-identity.tsx` are not).
- Full spec: `docs/superpowers/specs/2026-09-04-site-wide-company-attribution-design.md`.

---

### Task 1: `site-campaign.ts` — pure campaign helpers

**Files:**
- Create: `src/lib/site-campaign.ts`
- Test: `src/lib/site-campaign.test.ts`

**Interfaces:**
- Consumes: `slugifyCompany(raw: string): string` and `isOwnPropertyUrl(url: string): boolean` from `src/lib/cv-campaign.ts` (both already exist, unmodified).
- Produces: `CAMPAIGN_STORAGE_KEY: string`, `readCampaignFromLocation(search: string): string | null`, `stampSiteCampaign(url: string, slug: string): string` — consumed by Task 2 and Task 3.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/site-campaign.test.ts`:

```ts
import { describe, test, expect } from 'vitest'
import { readCampaignFromLocation, stampSiteCampaign } from './site-campaign'

describe('readCampaignFromLocation', () => {
  test('reads and slugifies the co param', () => {
    expect(readCampaignFromLocation('?co=Zauber')).toBe('zauber')
  })
  test('slugifies multi-word company names', () => {
    expect(readCampaignFromLocation('?co=Trade%20Republic')).toBe('trade-republic')
  })
  test('missing co param returns null', () => {
    expect(readCampaignFromLocation('?utm_source=github')).toBe(null)
  })
  test('empty search string returns null', () => {
    expect(readCampaignFromLocation('')).toBe(null)
  })
  test('empty co value returns null', () => {
    expect(readCampaignFromLocation('?co=')).toBe(null)
  })
  test('all-punctuation co value returns null', () => {
    expect(readCampaignFromLocation('?co=...')).toBe(null)
  })
  test('co alongside other params', () => {
    expect(readCampaignFromLocation('?utm_source=linkedin&co=Acme&foo=bar')).toBe('acme')
  })
})

describe('stampSiteCampaign', () => {
  test('own-property URL with no utm_source stamps source=portfolio and campaign', () => {
    expect(stampSiteCampaign('https://encoreshot.com/', 'zauber')).toBe(
      'https://encoreshot.com/?utm_source=portfolio&utm_campaign=zauber'
    )
  })
  test('antwansherif.com self-link with no utm_source stamps both', () => {
    expect(stampSiteCampaign('https://antwansherif.com/projects', 'zauber')).toBe(
      'https://antwansherif.com/projects?utm_source=portfolio&utm_campaign=zauber'
    )
  })
  test('own-property URL that already has utm_source keeps it, adds campaign', () => {
    expect(stampSiteCampaign('https://encoreshot.com/?utm_source=cv', 'zauber')).toBe(
      'https://encoreshot.com/?utm_source=cv&utm_campaign=zauber'
    )
  })
  test('own-property URL that already has utm_campaign is a no-op', () => {
    const tagged = 'https://encoreshot.com/?utm_source=portfolio&utm_campaign=acme'
    expect(stampSiteCampaign(tagged, 'zauber')).toBe(tagged)
  })
  test('third-party URL is a no-op regardless of campaign', () => {
    const linkedin = 'https://linkedin.com/in/antwan'
    expect(stampSiteCampaign(linkedin, 'zauber')).toBe(linkedin)
  })
  test('empty slug is a no-op', () => {
    expect(stampSiteCampaign('https://encoreshot.com/', '')).toBe('https://encoreshot.com/')
  })
  test('unparseable URL is a no-op without throwing', () => {
    expect(stampSiteCampaign('not-a-url', 'zauber')).toBe('not-a-url')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run src/lib/site-campaign.test.ts`
Expected: FAIL — `Cannot find module './site-campaign'` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/site-campaign.ts`:

```ts
// Site-wide company campaign capture, orthogonal to the CV's own ?co= handling in
// cv-campaign.ts (unmodified). Reuses its slug + ownership primitives.
//
// Design: docs/superpowers/specs/2026-09-04-site-wide-company-attribution-design.md

import { slugifyCompany, isOwnPropertyUrl } from './cv-campaign'

export const CAMPAIGN_STORAGE_KEY = 'as_campaign'

/** Parse `?co=` out of a query string and slugify it. Returns null when absent, empty,
 *  or all-punctuation. Pure. */
export function readCampaignFromLocation(search: string): string | null {
  const raw = new URLSearchParams(search).get('co')
  if (!raw) return null
  const slug = slugifyCompany(raw)
  return slug || null
}

/** Stamp `utm_source=portfolio` (only when no utm_source is already present) and
 *  `utm_campaign=<slug>` onto an own-property URL. No-ops for third-party URLs, an
 *  empty slug, a URL that already carries utm_campaign, or an unparseable URL. Pure. */
export function stampSiteCampaign(url: string, slug: string): string {
  if (!slug || !isOwnPropertyUrl(url)) return url
  const parsed = new URL(url)
  if (parsed.searchParams.has('utm_campaign')) return url
  if (!parsed.searchParams.has('utm_source')) parsed.searchParams.set('utm_source', 'portfolio')
  parsed.searchParams.set('utm_campaign', slug)
  return parsed.toString()
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run src/lib/site-campaign.test.ts`
Expected: PASS, all 14 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site-campaign.ts src/lib/site-campaign.test.ts
git commit -m "feat(analytics): add site-wide campaign parsing + stamping helpers"
```

---

### Task 2: `OutboundTracker` — stamp own-property links, tag the event

**Files:**
- Modify: `src/lib/analytics.ts` (add `company` to `OutboundProps`)
- Modify: `src/components/analytics/outbound-tracker.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_STORAGE_KEY`, `stampSiteCampaign` from `src/lib/site-campaign.ts` (Task 1).
- Produces: `OutboundProps` now includes `company?: string`. No other task depends on this one.

- [ ] **Step 1: Add `company` to `OutboundProps`**

In `src/lib/analytics.ts`, change:

```ts
export type OutboundProps = {
  content_type: ContentType; content_id?: string; category: OutboundCategory;
  host: string; href: string; label?: string;
};
```

to:

```ts
export type OutboundProps = {
  content_type: ContentType; content_id?: string; category: OutboundCategory;
  host: string; href: string; label?: string; company?: string;
};
```

- [ ] **Step 2: Wire the campaign stamp + event prop into `OutboundTracker`**

Replace the full contents of `src/components/analytics/outbound-tracker.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { buildOutboundEvent, track } from "@/lib/analytics";
import type { ContentType } from "@/lib/analytics-taxonomy";
import { CAMPAIGN_STORAGE_KEY, stampSiteCampaign } from "@/lib/site-campaign";

/** Reads the campaign persisted by VisitorIdentity, if any. Storage access can throw
 *  (private browsing, storage disabled) — falls back to "no campaign known". */
function readStoredCampaign(): string | undefined {
  try {
    return window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Site-wide delegated click listener that emits a single `outbound` event per external-link click,
 *  and stamps a persisted campaign onto own-property destinations before navigation. */
export function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.closest("[data-analytics-skip-outbound]")) return; // named conversions opt out
      const campaign = readStoredCampaign();
      if (campaign) {
        const stamped = stampSiteCampaign(anchor.href, campaign);
        if (stamped !== anchor.href) anchor.href = stamped;
      }
      const props = buildOutboundEvent({
        href: anchor.getAttribute("href"),
        currentHost: window.location.host,
        contentType: (anchor.dataset.contentType as ContentType) ?? "nav",
        contentId: anchor.dataset.contentId,
        label: anchor.dataset.analyticsLabel ?? anchor.textContent?.trim() ?? undefined,
      });
      if (props) track({ name: "outbound", props: campaign ? { ...props, company: campaign } : props });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
```

Note: `anchor.href` (the DOM property) is the browser-resolved absolute URL, used for
the campaign stamp since `stampSiteCampaign` needs an absolute URL. `anchor.getAttribute("href")`
(the raw attribute) is used for the outbound event, unchanged from the existing code —
same-host `antwansherif.com` links still correctly produce no `outbound` event
(`buildOutboundEvent` returns null for same-host, by design), even though their `href`
may now carry a stamped campaign.

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `pnpm test`
Expected: PASS — no existing test touches `OutboundTracker` or `OutboundProps`'s shape in a way that would break.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/components/analytics/outbound-tracker.tsx
git commit -m "feat(analytics): stamp campaign onto own-property outbound links"
```

---

### Task 3: `VisitorIdentity` — capture `?co=` on any page, persist for the session

**Files:**
- Modify: `src/components/analytics/visitor-identity.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_STORAGE_KEY`, `readCampaignFromLocation` from `src/lib/site-campaign.ts` (Task 1).
- Produces: nothing consumed by another task — this is the last task in the plan.

- [ ] **Step 1: Wire the URL/`sessionStorage` fallback into `VisitorIdentity`**

Replace the full contents of `src/components/analytics/visitor-identity.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { getOrCreateVisitorId, identifyVisitor } from "@/lib/analytics-identity";
import { CAMPAIGN_STORAGE_KEY, readCampaignFromLocation } from "@/lib/site-campaign";

/** Sticky for the page session: once any mount learns the company, later mounts re-send it.
 *  This makes the global (id-only, in layout) and story-page (id+company) mounts order-independent —
 *  whichever identify() call lands last still carries the company, regardless of Umami's merge semantics. */
let sessionCompany: string | undefined;

/** Reads a previously-persisted site-wide campaign, or captures ?co= from the current URL
 *  and persists it. First-touch wins: a stored value is never overwritten by a later URL
 *  in the same tab session. Storage access can throw (private browsing) — falls back to
 *  "no campaign known" rather than breaking the page. */
function resolveSiteCampaign(): string | undefined {
  try {
    const stored = window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (stored) return stored;
    const fromUrl = readCampaignFromLocation(window.location.search);
    if (fromUrl) window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, fromUrl);
    return fromUrl ?? undefined;
  } catch {
    return undefined;
  }
}

/** Mints/loads the localStorage visitor UUID and hands it to Umami's identify().
 *  Pass `company` on gated story pages to also tag the session (company comes from the
 *  server cookie) — this always wins over a site-wide campaign. Absent that, falls back
 *  to a site-wide ?co= campaign captured on any page (see site-campaign.ts). */
export function VisitorIdentity({ company, isAdmin }: { company?: string; isAdmin?: boolean }) {
  useEffect(() => {
    try {
      if (company) sessionCompany = company;
      else sessionCompany = sessionCompany ?? resolveSiteCampaign();
      const id = getOrCreateVisitorId(window.localStorage);
      const data = sessionCompany
        ? { company: sessionCompany, ...(isAdmin && { is_admin: true }) }
        : undefined;
      identifyVisitor({ id, data });
    } catch {
      /* analytics must never break the page */
    }
  }, [company, isAdmin]);
  return null;
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 4: Manual smoke check**

Start the dev server (`pnpm dev`, read the bound port from `.dev/port`), then in a
browser:
1. Visit `http://localhost:<port>/?co=Zauber Test`. Open devtools → Application →
   Session Storage → confirm `as_campaign` = `zauber-test`.
2. Client-navigate to `/projects` (no `?co=` on that URL). Confirm `as_campaign` is
   still `zauber-test` in Session Storage (proves it survives client-side nav).
3. Find (or temporarily add) a link to `encoreshot.com` on the page, inspect its
   resolved `href` in devtools before clicking — confirm it now carries
   `?utm_source=portfolio&utm_campaign=zauber-test` (or `&utm_campaign=...` if the
   link already had a `utm_source`).
4. Open a new private/incognito window, visit `/` with no `?co=` — confirm no
   `as_campaign` key is set and EncoreShot links are unmodified, i.e. the whole
   mechanism is a no-op for a plain visit.

Report what you saw for each of the 4 checks before claiming this task done — this is
the one step in the plan that touches real browser behavior, not just types/tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/visitor-identity.tsx
git commit -m "feat(analytics): capture ?co= on any page for whole-session attribution"
```

---

## Self-review notes (already applied above)

- **Spec coverage:** Piece 1 (capture anywhere) → Task 3. Piece 2 (whole-session
  `identify()` attribution) → Task 3 (no separate work — it's what Task 3's
  `sessionCompany`/`identify()` wiring produces). Piece 3 (outbound link stamping) →
  Task 2. The spec's `withCampaign`-generalization idea was replaced with the safer
  `stampSiteCampaign` design during planning (see the spec's own updated Architecture
  section) — `cv-campaign.ts` has zero diff across this plan.
- **Placeholder scan:** none found — every step has real code or a real command.
- **Type consistency:** `stampSiteCampaign(url: string, slug: string): string` and
  `readCampaignFromLocation(search: string): string | null` (Task 1) are called with
  matching signatures in Task 2 and Task 3. `CAMPAIGN_STORAGE_KEY` is a single
  exported constant, imported (not re-declared) by both consumers.
- **Fan-out check:** the real diff surface is 4 files (`site-campaign.ts` + its test,
  `analytics.ts`, `outbound-tracker.tsx`, `visitor-identity.tsx`) — every other path
  named in this doc is a citation (the spec, an unmodified existing file, a shell
  command) rather than an edit. See the spec's own Fan-out note for why that surface
  doesn't collapse further without breaking an existing component boundary.
