# Self-Visit Exclusion & CV Link Carry-Forward Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the site owner browse the portfolio without polluting Umami, and make the homepage's CV link carry whatever company campaign the visitor's session already knows about.

**Architecture:** A new pure module (`src/lib/analytics-admin.ts`) holds an `?admin=1`/`?admin=0` query-param parser and a `localStorage`-backed check; `track()` and `identifyVisitor()` both consult it before touching `window.umami`. `VisitorIdentity` (already the single global mount-time component) resolves the param once per page load. Separately, the navbar's static `/cv` link becomes a plain client-side read of the same `sessionStorage` slug the rest of the site-wide attribution feature already writes — no new mechanism, no touch to `/cv` itself.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vitest (`environment: "node"`), pnpm.

## Global Constraints

- `/cv`'s own `?co=` resolution, `src/lib/cv-campaign.ts`, and `/api/cv-pdf` are **not modified** in this plan.
- The story-unlock **server** channel (`src/app/(site)/(stories)/stories/unlock/actions.ts`, `src/lib/umami-server.ts`) is **not modified** — out of scope per the spec's non-goals.
- `?admin=1`/`?admin=0` is **not a security boundary** — no token, no secret, plain literal values. Don't add auth/obfuscation beyond what's specified below.
- Every new storage read is wrapped in try/catch with a silent fallback — analytics code must never throw into a render (existing house rule, `src/components/analytics/AGENTS.md`).
- New pure logic gets unit tests; DOM/storage glue stays untested-thin with a manual verification step instead (same convention already applied throughout this analytics layer).

---

### Task 1: `analytics-admin.ts` — the admin-flag primitives

**Files:**
- Create: `src/lib/analytics-admin.ts`
- Test: `src/lib/analytics-admin.test.ts`

**Interfaces:**
- Produces: `ADMIN_STORAGE_KEY: string` (value `'as_admin'`), `resolveAdminParam(search: string): '1' | '0' | null`, `isAdminVisit(storage: Pick<Storage, 'getItem'>): boolean` — all pure, all used by later tasks.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/analytics-admin.test.ts
import { describe, test, expect } from 'vitest'
import { ADMIN_STORAGE_KEY, resolveAdminParam, isAdminVisit } from './analytics-admin'

describe('resolveAdminParam', () => {
  test('admin=1 returns "1"', () => {
    expect(resolveAdminParam('?admin=1')).toBe('1')
  })
  test('admin=0 returns "0"', () => {
    expect(resolveAdminParam('?admin=0')).toBe('0')
  })
  test('missing admin param returns null', () => {
    expect(resolveAdminParam('?co=zauber')).toBe(null)
  })
  test('empty search string returns null', () => {
    expect(resolveAdminParam('')).toBe(null)
  })
  test('any other admin value returns null', () => {
    expect(resolveAdminParam('?admin=true')).toBe(null)
    expect(resolveAdminParam('?admin=yes')).toBe(null)
    expect(resolveAdminParam('?admin=')).toBe(null)
  })
})

describe('isAdminVisit', () => {
  function fakeStorage(value: string | null): Pick<Storage, 'getItem'> {
    return { getItem: () => value }
  }
  test('true when as_admin is "1"', () => {
    expect(isAdminVisit(fakeStorage('1'))).toBe(true)
  })
  test('false when absent', () => {
    expect(isAdminVisit(fakeStorage(null))).toBe(false)
  })
  test('false for any other stored value', () => {
    expect(isAdminVisit(fakeStorage('true'))).toBe(false)
    expect(isAdminVisit(fakeStorage('0'))).toBe(false)
  })
  test('ADMIN_STORAGE_KEY is "as_admin"', () => {
    expect(ADMIN_STORAGE_KEY).toBe('as_admin')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test analytics-admin -- --run`
Expected: FAIL — `Cannot find module './analytics-admin'` (the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/analytics-admin.ts
// The site owner's own-visit exclusion switch — a plain, non-secret query param
// (?admin=1 / ?admin=0), not a security boundary. Distinct from the gated-story
// `is_admin` session prop set via VisitorIdentity's `isAdmin` — that one flags a
// content-access allowlist match on /stories/[slug]; this one is a site-wide
// "don't send my own analytics at all" switch. Same word, unrelated mechanism.
//
// Design: docs/superpowers/specs/2026-09-05-self-exclude-and-cv-link-carryforward-design.md

export const ADMIN_STORAGE_KEY = 'as_admin'

/** Parse `?admin=` from a query string. '1' to set the flag, '0' to clear it; any
 *  other value (including absent, or empty) is "no instruction" — null. Pure. */
export function resolveAdminParam(search: string): '1' | '0' | null {
  const raw = new URLSearchParams(search).get('admin')
  return raw === '1' || raw === '0' ? raw : null
}

/** Whether this browser is currently flagged as the site owner's own admin visit.
 *  Pure (storage injected), mirrors getOrCreateVisitorId's style. */
export function isAdminVisit(storage: Pick<Storage, 'getItem'>): boolean {
  return storage.getItem(ADMIN_STORAGE_KEY) === '1'
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test analytics-admin -- --run`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics-admin.ts src/lib/analytics-admin.test.ts
git commit -m "feat: add analytics-admin self-exclusion primitives"
```

---

### Task 2: Guard `track()` and `identifyVisitor()` against the admin flag

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: `src/lib/analytics-identity.ts`
- Test: `src/lib/analytics.test.ts`
- Test: `src/lib/analytics-identity.test.ts`

**Interfaces:**
- Consumes: `isAdminVisit(storage)` from Task 1 (`src/lib/analytics-admin.ts`).
- Produces: no new exports — `track()` and `identifyVisitor()` keep their existing signatures, just gain a guard.

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/analytics.test.ts`, inside the existing `describe("track", ...)` block (after the last existing test, before its closing `});`):

```ts
  test("no-ops when the admin flag is set", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => "1" } };
    track({ name: "contact_click", props: { content_type: "contact", channel: "email", category: "professional" } });
    expect(spy).not.toHaveBeenCalled();
  });
```

Add to `src/lib/analytics-identity.test.ts`, inside the existing `describe("identifyVisitor", ...)` block (after the last existing test, before its closing `});`):

```ts
  test("no-ops when the admin flag is set", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy }, localStorage: { getItem: () => "1" } };
    identifyVisitor({ id: "abc" });
    expect(spy).not.toHaveBeenCalled();
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test analytics -- --run`
Expected: FAIL on both new tests — `spy` was called, because the admin guard doesn't exist yet.

- [ ] **Step 3: Write the implementation**

In `src/lib/analytics.ts`, add the import alongside the existing ones near the top:

```ts
import { isAdminVisit } from "./analytics-admin";
```

Then change `track()` from:

```ts
export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event.name, { v: TAXONOMY_VERSION, ...event.props });
  } catch {
    /* analytics must never break the page */
  }
}
```

to:

```ts
export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  if (isAdminVisit(window.localStorage)) return;
  try {
    window.umami?.track(event.name, { v: TAXONOMY_VERSION, ...event.props });
  } catch {
    /* analytics must never break the page */
  }
}
```

In `src/lib/analytics-identity.ts`, add the same import near the top:

```ts
import { isAdminVisit } from "./analytics-admin";
```

Then change `identifyVisitor()` from:

```ts
export function identifyVisitor(input: { id: string; data?: Record<string, unknown> }, attempt = 0): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    const identify = window.umami?.identify;
```

to:

```ts
export function identifyVisitor(input: { id: string; data?: Record<string, unknown> }, attempt = 0): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  if (isAdminVisit(window.localStorage)) return;
  try {
    const identify = window.umami?.identify;
```

(the rest of the function — the retry-on-missing-`window.umami.identify` logic added in the previous session's fix — is unchanged; this new line sits above it, so an admin visit never enters the retry loop at all).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test analytics -- --run`
Expected: PASS. Also run the full suite to confirm nothing else regressed: `pnpm test -- --run`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics-identity.ts src/lib/analytics.test.ts src/lib/analytics-identity.test.ts
git commit -m "feat: skip track()/identifyVisitor() entirely on an admin-flagged visit"
```

---

### Task 3: Resolve `?admin=` in `VisitorIdentity`

**Files:**
- Modify: `src/components/analytics/visitor-identity.tsx`

**Interfaces:**
- Consumes: `ADMIN_STORAGE_KEY`, `resolveAdminParam` from `src/lib/analytics-admin.ts` (Task 1).
- Produces: no new exports — `VisitorIdentity`'s props and return type are unchanged.

This task has no unit-testable pure logic of its own (it's a two-line addition to an
existing mount effect, reading `window.location.search` and writing `window.localStorage`
directly) — per this repo's convention, DOM/storage glue stays untested-thin when the
logic it calls (Task 1) is already covered. Verify manually per Step 3 below.

- [ ] **Step 1: Add the import**

In `src/components/analytics/visitor-identity.tsx`, add to the existing import block:

```ts
import { ADMIN_STORAGE_KEY, resolveAdminParam } from "@/lib/analytics-admin";
```

- [ ] **Step 2: Resolve the param inside the existing mount effect**

Change the effect body from:

```ts
  useEffect(() => {
    try {
      if (company) {
```

to:

```ts
  useEffect(() => {
    try {
      const adminParam = resolveAdminParam(window.location.search);
      if (adminParam === "1") window.localStorage.setItem(ADMIN_STORAGE_KEY, "1");
      else if (adminParam === "0") window.localStorage.removeItem(ADMIN_STORAGE_KEY);

      if (company) {
```

(everything below — the existing campaign resolution, `identifyVisitor` call, and the
outer `catch` — is unchanged. The outer try/catch already wraps this new code, so a
`localStorage` failure in private browsing falls back to "no instruction," same as
every other storage read in this file.)

- [ ] **Step 3: Manually verify**

Run `pnpm dev`, then in a browser:

1. Visit `http://localhost:<port>/?admin=1`. Open devtools → Application → Local
   Storage, confirm `as_admin` is `1`.
2. Reload the page (no query param this time). Confirm `as_admin` is still `1`
   (persisted).
3. Visit `http://localhost:<port>/?admin=0`. Confirm `as_admin` is gone from Local
   Storage.
4. With `as_admin` set to `1`, open the Network tab, reload, and confirm no request
   fires to the Umami collect endpoint path (check `.env.local`'s
   `NEXT_PUBLIC_UMAMI_HOST_URL` + `UMAMI_COLLECT_ENDPOINT` for the exact path) —
   this exercises Task 2's guard end-to-end, not just this task's wiring in isolation.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/visitor-identity.tsx
git commit -m "feat: resolve ?admin= into the as_admin flag on mount"
```

---

### Task 4: CV link carry-forward in the navbar

**Files:**
- Modify: `src/components/navbar.tsx`

**Interfaces:**
- Consumes: `CAMPAIGN_STORAGE_KEY` from `src/lib/site-campaign.ts` (already exported,
  shipped in the site-wide attribution feature — not part of this plan).
- Produces: no new exports — `Navbar`'s default export is unchanged, only its rendered
  output for the CV link changes.

Like Task 3, this is DOM glue over an already-tested primitive (`site-campaign.ts`'s own
tests already cover the storage key's shape) — verify manually per Step 4.

- [ ] **Step 1: Add the imports**

In `src/components/navbar.tsx`, add `useEffect` and `useState` to the existing `react`
import (there's no existing React import in this file today — add a new one), and
import the storage key:

```tsx
import { useEffect, useState } from "react";
```

alongside the existing imports, and:

```tsx
import { CAMPAIGN_STORAGE_KEY } from "@/lib/site-campaign";
```

next to the existing `import { track } from "@/lib/analytics";` line.

- [ ] **Step 2: Read the campaign on mount**

Change the top of the component from:

```tsx
export default function Navbar() {
  const pathname = usePathname();
```

to:

```tsx
export default function Navbar() {
  const pathname = usePathname();
  const [campaign, setCampaign] = useState<string | null>(null);
  useEffect(() => {
    try {
      setCampaign(window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY));
    } catch {
      /* private browsing — falls back to the untagged /cv link */
    }
  }, []);
```

(`isActive`, the `return (...)` and everything else in the component stay exactly as
they are — `isActive` already strips a `?...` query suffix before comparing paths, per
its existing `href.split("?")[0]` line, so a dynamic `/cv?co=...` href doesn't change
whether the CV dock icon renders as active.)

- [ ] **Step 3: Make the CV link's href campaign-aware**

Change the CV `<a>` tag's `href` from:

```tsx
            <a
              href="/cv"
              aria-label="CV"
```

to:

```tsx
            <a
              href={campaign ? `/cv?co=${campaign}` : "/cv"}
              aria-label="CV"
```

- [ ] **Step 4: Manually verify**

Run `pnpm dev`, then in a browser:

1. Visit `http://localhost:<port>/?co=acme`. Open devtools and inspect the CV dock
   icon's `<a>` tag (the file-text icon in the bottom dock) — confirm its `href`
   resolves to `/cv?co=acme`.
2. Click it, confirm it navigates to `/cv?co=acme` and the CV page's own existing
   company-tagging behavior kicks in exactly as if that URL had been typed directly
   (own-property links on the CV page carry `utm_campaign=acme`).
3. Visit `http://localhost:<port>/` with no `?co=` — confirm the CV dock icon's `href`
   is plain `/cv`.

- [ ] **Step 5: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "feat: carry the known campaign into the navbar's CV link"
```

---

## Manual smoke check (near the end, per this repo's planning convention)

After all four tasks: visit `/?co=zztest&admin=1` in a fresh browser profile (or with
`localStorage`/`sessionStorage` cleared), confirm via devtools that `as_admin` and
`as_campaign` are both set, the CV dock icon's href carries `?co=zztest`, and the Network
tab shows zero requests to the Umami collect endpoint for the whole session — the same
kind of end-to-end check the site-wide attribution plan ran, extended to cover the new
admin flag's actual effect (silence), not just its storage write.
</content>
