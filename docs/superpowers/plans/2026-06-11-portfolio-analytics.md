# Portfolio Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cookieless, self-hosted Umami analytics across both portfolio domains — pageviews, Core Web Vitals, custom interaction events, and ad-block/prefetch-immune per-company story tracking — with an aggregate + per-domain dashboard.

**Architecture:** Self-hosted Umami (separate Vercel project + free Neon Postgres) at `stats.antwansherif.com`. Two tracking channels: a **client** channel (renamed tracker script + a typed `track()` wrapper) for ordinary events, and a **server** channel (Next Server Action → Umami collect API) for story events, where the company is known authoritatively and sends survive ad blockers and prefetch. Logic lives in pure, unit-tested functions; React/DOM glue stays thin.

**Tech Stack:** Next.js 16 (App Router, RSC-by-default), React 19, TypeScript, Vitest (node env), pnpm, Umami, Neon Postgres, Vercel.

**Working directory:** all paths are relative to the project root `AntwanSherif/` (the git repo). Run all commands from there.

**Spec:** `docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md` — read it first.

---

## Conventions for this plan

- **Read `src/components/AGENTS.md` and `src/data/AGENTS.md`** before editing those directories.
- Server components by default; add `'use client'` only where a step says so.
- Use `cn()` from `src/lib/utils.ts` for conditional classnames. Package manager is **pnpm**.
- Tests are **pure vitest** (node env), colocated as `*.test.ts` next to the unit. Run a single file with `pnpm vitest run <path>`; full suite with `pnpm test`.
- Analytics must **never throw into a render**: every send path no-ops on error and outside production.
- Commit messages use `feat:` / `chore:` / `docs:` prefixes. One logical unit per commit.

## File Structure

**New**
- `src/lib/analytics.ts` — typed client `track()` wrapper + `AnalyticsEvent` union + `buildOutboundEvent()` + scroll-depth helpers (pure).
- `src/lib/analytics.test.ts` — unit tests for the above.
- `src/lib/umami-server.ts` — server-side event sender + `buildUmamiPayload()` (pure) + `sendServerEvent()` (fetch glue).
- `src/lib/umami-server.test.ts` — unit tests for the payload builder.
- `src/components/analytics/analytics-scripts.tsx` — renders the renamed Umami `<Script>`, production-gated.
- `src/components/analytics/outbound-tracker.tsx` — `'use client'`, global delegated click listener.
- `src/components/analytics/use-scroll-depth.ts` — `'use client'` hook.
- `src/components/analytics/use-impression.ts` — `'use client'` IntersectionObserver hook.
- `src/components/analytics/story-view-beacon.tsx` — `'use client'`, fires the story-view Server Action on mount.
- `src/app/(stories)/stories/track-actions.ts` — `'use server'`, `trackStoryView()`.
- `src/components/analytics/AGENTS.md` — the standing "keep events in sync" convention.
- `.env.example` — documents the new env var names (no secrets).

**Modified**
- `src/lib/stories-password.ts` — add `companyFromPassword()`.
- `src/lib/stories-password.test.ts` — tests for it.
- `src/app/layout.tsx` — mount `<AnalyticsScripts />` and `<OutboundTracker />`.
- `src/app/(stories)/stories/unlock/actions.ts` — fire `story-unlock` after validation.
- `src/app/(stories)/stories/[slug]/page.tsx` — render `<StoryViewBeacon />`.
- The CV, contact, project-card, and talk-photos surfaces — add `track()` calls / `data-analytics-skip-outbound` markers.
- `src/components/AGENTS.md`, `src/data/AGENTS.md` — cross-link the new analytics AGENTS.md.

---

## Task 0: Branch + commit spec & plan together

Global convention: the spec and this plan are one unit and must be committed together, on a branch, **before** any implementation.

- [ ] **Step 1: Create a feature branch**

Run:
```bash
git checkout -b feat/portfolio-analytics
```

- [ ] **Step 2: Commit spec + plan together**

```bash
git add docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md docs/superpowers/plans/2026-06-11-portfolio-analytics.md
git commit -m "docs: analytics spec + implementation plan"
```

Expected: one commit containing exactly the two docs.

---

## Task 1: 🙋 HUMAN CHECKPOINT — Stand up Umami (HC1–HC4)

**STOP. This task is done by the user.** The agent presents this runbook, waits, and does not create accounts, edit DNS, or mint secrets. Nothing downstream verifies end-to-end until this is done, but the *code* tasks (2–13) can proceed in parallel against the env-var names — so the agent may continue to Task 2 while the user works through this.

- [ ] **HC1 — Neon database.** Create a free project at neon.tech → a Postgres database. Copy the **pooled** connection string → this is `DATABASE_URL`.
- [ ] **HC2 — Deploy Umami.** New Vercel project importing `https://github.com/umami-software/umami`. Set env vars:
  - `DATABASE_URL` = (HC1)
  - `DATABASE_TYPE` = `postgresql`
  - `APP_SECRET` = a random 32+ char string
  - `TRACKER_SCRIPT_NAME` = an innocuous name, e.g. `u.js` (avoid `umami`/`analytics`/`script`)
  - `COLLECT_API_ENDPOINT` = an innocuous path, e.g. `/api/e` (avoid `/api/send`)
  Deploy. If the schema isn't auto-applied, run Umami's migration per its README.
- [ ] **HC3 — `stats.antwansherif.com`.** Add the domain to this Vercel project; at Cloudflare add the CNAME Vercel specifies. (Optional: keep Cloudflare proxy on for origin masking; if so, ensure the renamed script + collect path are reachable.)
- [ ] **HC4 — Login + website.** Open `stats.antwansherif.com` → **change the default `admin`/`umami` password immediately**. Create a website, add both domains, copy the **Website ID**. Leave "share/public" **off**.
- [ ] **Record for later (Task 11/HC6):** `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_HOST_URL=https://stats.antwansherif.com`, `NEXT_PUBLIC_UMAMI_SCRIPT_NAME` (=`TRACKER_SCRIPT_NAME`), `UMAMI_COLLECT_ENDPOINT` (=`COLLECT_API_ENDPOINT`).

No commit (no code change).

---

## Task 2: `companyFromPassword()` — derive company from a story password

**Files:**
- Modify: `src/lib/stories-password.ts`
- Test: `src/lib/stories-password.test.ts`

A valid password is `<Company>-<10 base62>`; `validate()` already proves the code genuine, so the slug prefix is trustworthy. We only need to **parse** it (no `companies.txt`). Reuse the exact parsing shape from `validate()`.

- [ ] **Step 1: Write the failing test**

Add to `src/lib/stories-password.test.ts`:
```ts
import { companyFromPassword } from "./stories-password";

describe("companyFromPassword", () => {
  test("returns the company slug for a well-formed password", () => {
    expect(companyFromPassword("Acme-7f3k9x2qph")).toBe("Acme");
  });
  test("returns the sanitized slug (alphanumeric only)", () => {
    expect(companyFromPassword("Goodgame-AB12cd34EF")).toBe("Goodgame");
  });
  test("returns null when there is no separator", () => {
    expect(companyFromPassword("nodash")).toBeNull();
  });
  test("returns null when the slug is empty", () => {
    expect(companyFromPassword("-abc")).toBeNull();
  });
  test("returns null when the code is empty", () => {
    expect(companyFromPassword("Acme-")).toBeNull();
  });
  test("never returns the secret code portion", () => {
    expect(companyFromPassword("Acme-7f3k9x2qph")).not.toContain("7f3k9x2qph");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/lib/stories-password.test.ts`
Expected: FAIL — `companyFromPassword` is not exported.

- [ ] **Step 3: Implement**

Add to `src/lib/stories-password.ts` (near `validate`, reusing the existing `sanitizeSlug`):
```ts
/**
 * Parse the company slug out of a password of the form `<slug>-<code>`.
 * Mirrors validate()'s parsing. Returns null for malformed input.
 * Never returns the code portion. Does NOT itself prove validity — call
 * validate() first when authenticity matters (it always does before tracking).
 */
export function companyFromPassword(candidate: string): string | null {
  const idx = candidate.lastIndexOf("-");
  if (idx <= 0 || idx >= candidate.length - 1) return null;
  const slug = sanitizeSlug(candidate.slice(0, idx));
  return slug.length === 0 ? null : slug;
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `pnpm vitest run src/lib/stories-password.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stories-password.ts src/lib/stories-password.test.ts
git commit -m "feat: derive company slug from a story password"
```

---

## Task 3: Typed client `track()` wrapper + pure event helpers

**Files:**
- Create: `src/lib/analytics.ts`
- Test: `src/lib/analytics.test.ts`

`track()` is a safe no-op when `window.umami` is absent (dev, blocked, SSR). It also no-ops outside production. `buildOutboundEvent()` and `newMilestones()` are pure (string/number in, data out) so they're testable without a DOM.

- [ ] **Step 1: Write the failing test**

Create `src/lib/analytics.test.ts`:
```ts
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { buildOutboundEvent, newMilestones, MILESTONES, track } from "./analytics";

describe("buildOutboundEvent", () => {
  const host = "antwan.me";
  test("external link → props with normalized host", () => {
    expect(buildOutboundEvent({ href: "https://www.haktiv.ai/x", currentHost: host, context: "project", label: "HAKTIV" }))
      .toEqual({ href: "https://www.haktiv.ai/x", host: "www.haktiv.ai", context: "project", label: "HAKTIV" });
  });
  test("internal link → null", () => {
    expect(buildOutboundEvent({ href: "/stories", currentHost: host })).toBeNull();
  });
  test("same-host absolute link → null", () => {
    expect(buildOutboundEvent({ href: "https://antwan.me/about", currentHost: host })).toBeNull();
  });
  test("mailto → host 'mailto'", () => {
    expect(buildOutboundEvent({ href: "mailto:a@b.com", currentHost: host, context: "contact" }))
      .toEqual({ href: "mailto:a@b.com", host: "mailto", context: "contact", label: undefined });
  });
  test("null/garbage href → null", () => {
    expect(buildOutboundEvent({ href: null, currentHost: host })).toBeNull();
    expect(buildOutboundEvent({ href: "::::", currentHost: host })).toBeNull();
  });
});

describe("newMilestones", () => {
  test("returns milestones newly crossed, not already fired", () => {
    expect(newMilestones(60, new Set([25]))).toEqual([50]);
  });
  test("returns nothing when none newly crossed", () => {
    expect(newMilestones(10, new Set())).toEqual([]);
  });
  test("100% returns all remaining", () => {
    expect(newMilestones(100, new Set([25, 50]))).toEqual([75, 100]);
  });
  test("MILESTONES are 25/50/75/100", () => {
    expect(MILESTONES).toEqual([25, 50, 75, 100]);
  });
});

describe("track", () => {
  const realWindow = globalThis.window;
  afterEach(() => { (globalThis as any).window = realWindow; vi.unstubAllEnvs(); });
  beforeEach(() => { vi.stubEnv("NODE_ENV", "production"); });

  test("calls window.umami.track in production", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "cv-download" });
    expect(spy).toHaveBeenCalledWith("cv-download", undefined);
  });
  test("passes props through", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "contact-click", props: { channel: "email" } });
    expect(spy).toHaveBeenCalledWith("contact-click", { channel: "email" });
  });
  test("no-ops (no throw) when umami is absent", () => {
    (globalThis as any).window = {};
    expect(() => track({ name: "cv-download" })).not.toThrow();
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "cv-download" });
    expect(spy).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/lib/analytics.test.ts`
Expected: FAIL — module/exports do not exist.

- [ ] **Step 3: Implement**

Create `src/lib/analytics.ts`:
```ts
// Client-side analytics: a typed, safe wrapper over Umami's window.umami.track,
// plus pure helpers used by the DOM glue (so the glue stays untested-thin).

export type OutboundProps = { href: string; host: string; label?: string; context?: string };

export type AnalyticsEvent =
  | { name: "outbound"; props: OutboundProps }
  | { name: "cv-download"; props?: undefined }
  | { name: "contact-click"; props: { channel: "email" | "linkedin" } }
  | { name: "scroll-depth"; props: { page: string; depth: 25 | 50 | 75 | 100 } }
  | { name: "impression"; props: { element: string; id?: string } }
  | { name: "project-expand"; props: { project: string } }
  | { name: "talk-photos"; props: { talk: string; action: "open" | "advance" } };

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

/** Fire a typed event. No-op outside production, during SSR, or when the tracker is blocked/absent. Never throws. */
export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event.name, (event as { props?: Record<string, unknown> }).props);
  } catch {
    /* analytics must never break the page */
  }
}

export const MILESTONES = [25, 50, 75, 100] as const;

/** Scroll-depth milestones newly crossed at `scrollPct` that haven't fired yet. */
export function newMilestones(scrollPct: number, fired: Set<number>): number[] {
  return MILESTONES.filter((m) => scrollPct >= m && !fired.has(m));
}

/** Build an `outbound` event from a link's href + context. Returns null for internal/invalid links. Pure. */
export function buildOutboundEvent(input: {
  href: string | null;
  currentHost: string;
  label?: string;
  context?: string;
}): OutboundProps | null {
  const { href, currentHost, label, context } = input;
  if (!href) return null;
  if (href.startsWith("mailto:")) return { href, host: "mailto", label, context };
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}`);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.host === currentHost) return null;
  return { href: url.href, host: url.host, label, context };
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `pnpm vitest run src/lib/analytics.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics.test.ts
git commit -m "feat: typed client analytics wrapper + pure event helpers"
```

---

## Task 4: Server-side event sender

**Files:**
- Create: `src/lib/umami-server.ts`
- Test: `src/lib/umami-server.test.ts`

Sends events server→server (story channel). `buildUmamiPayload()` is pure and tested; `sendServerEvent()` is thin fetch glue that no-ops outside production and swallows errors.

- [ ] **Step 1: Write the failing test**

Create `src/lib/umami-server.test.ts`:
```ts
import { describe, test, expect } from "vitest";
import { buildUmamiPayload } from "./umami-server";

describe("buildUmamiPayload", () => {
  test("wraps name + data + hostname into Umami's event shape", () => {
    expect(
      buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-view", data: { company: "Acme", story: "prism" } })
    ).toEqual({
      type: "event",
      payload: {
        website: "w1",
        hostname: "antwan.me",
        name: "story-view",
        data: { company: "Acme", story: "prism" },
        url: "/",
      },
    });
  });
  test("omits data when not provided", () => {
    const p = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-unlock", data: { company: "Acme" } });
    expect(p.payload.name).toBe("story-unlock");
    expect(p.payload.data).toEqual({ company: "Acme" });
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `pnpm vitest run src/lib/umami-server.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

Create `src/lib/umami-server.ts`:
```ts
// Server-side event sender for the "story channel". Ad-block- and prefetch-immune
// because it runs server→server. Never throws into a render.

import "server-only";

export type UmamiPayload = {
  type: "event";
  payload: { website: string; hostname: string; name: string; data?: Record<string, unknown>; url: string };
};

/** Pure: build Umami's /api/send body. */
export function buildUmamiPayload(input: {
  websiteId: string;
  hostname: string;
  name: string;
  data?: Record<string, unknown>;
}): UmamiPayload {
  return {
    type: "event",
    payload: {
      website: input.websiteId,
      hostname: input.hostname,
      name: input.name,
      data: input.data,
      url: "/",
    },
  };
}

/** Fire a server-side event. No-op outside production or when config is missing. Swallows all errors. */
export async function sendServerEvent(input: { hostname: string; name: string; data?: Record<string, unknown> }): Promise<void> {
  if (process.env.NODE_ENV !== "production") return;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;
  const endpoint = process.env.UMAMI_COLLECT_ENDPOINT;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!host || !endpoint || !websiteId) return;
  try {
    await fetch(`${host}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Umami requires a User-Agent; server requests have none by default.
        "User-Agent": "portfolio-server/1.0",
      },
      body: JSON.stringify(buildUmamiPayload({ websiteId, hostname: input.hostname, name: input.name, data: input.data })),
      cache: "no-store",
    });
  } catch {
    /* analytics must never break a render */
  }
}
```

- [ ] **Step 4: Run it and confirm it passes**

Run: `pnpm vitest run src/lib/umami-server.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/umami-server.ts src/lib/umami-server.test.ts
git commit -m "feat: server-side umami event sender for the story channel"
```

---

## Task 5: `<AnalyticsScripts>` — load the renamed tracker, production-only

**Files:**
- Create: `src/components/analytics/analytics-scripts.tsx`
- Modify: `src/app/layout.tsx`

A server component that renders the renamed Umami `<Script>` with the two-domain allowlist and `data-performance`. Renders nothing unless in production with all config present.

- [ ] **Step 1: Create the component**

Create `src/components/analytics/analytics-scripts.tsx`:
```tsx
import Script from "next/script";

/** Loads the (renamed) Umami tracker. Renders nothing outside production or if config is missing. */
export function AnalyticsScripts() {
  if (process.env.NODE_ENV !== "production") return null;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptName = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_NAME;
  if (!host || !websiteId || !scriptName) return null;
  return (
    <Script
      src={`${host}/${scriptName}`}
      data-website-id={websiteId}
      data-domains="antwan.me,antwansherif.com"
      data-host-url={host}
      data-performance="true"
      strategy="afterInteractive"
    />
  );
}
```

- [ ] **Step 2: Mount it in the root layout**

In `src/app/layout.tsx`, add the import near the other component imports:
```tsx
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
```
Then render it as the first child inside `<body>` (before the `ThemeProvider`):
```tsx
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased relative overflow-x-hidden',
          geist.variable,
          geistMono.variable,
          bricolage.variable
        )}
      >
        <AnalyticsScripts />
        {/* forcedTheme pins the site to dark while the light-mode toggle is hidden (see navbar.tsx). Remove forcedTheme to re-enable light mode. */}
        <ThemeProvider attribute='class' defaultTheme='dark' forcedTheme='dark'>
```

- [ ] **Step 3: Verify the build/types are clean**

Run: `pnpm lint && pnpm vitest run`
Expected: no new lint/type errors; existing tests still pass. (Visual confirmation of the script tag happens in HC7.)

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/analytics-scripts.tsx src/app/layout.tsx
git commit -m "feat: load renamed umami tracker in production"
```

---

## Task 6: `<OutboundTracker>` — one delegated listener for all external links

**Files:**
- Create: `src/components/analytics/outbound-tracker.tsx`
- Modify: `src/app/layout.tsx`

A single document-level click listener. For each click that resolves to an external link (or `mailto:`) it fires one `outbound` event via `buildOutboundEvent()`. Elements (or ancestors) marked `data-analytics-skip-outbound` are ignored — that's how named conversions avoid double-counting. Optional `data-analytics-context` / `data-analytics-label` enrich the event.

- [ ] **Step 1: Create the component**

Create `src/components/analytics/outbound-tracker.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import { buildOutboundEvent, track } from "@/lib/analytics";

/** Site-wide delegated click listener that emits a single `outbound` event per external-link click. */
export function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.closest("[data-analytics-skip-outbound]")) return; // named conversions opt out
      const props = buildOutboundEvent({
        href: anchor.getAttribute("href"),
        currentHost: window.location.host,
        label: anchor.dataset.analyticsLabel ?? anchor.textContent?.trim() ?? undefined,
        context: anchor.dataset.analyticsContext,
      });
      if (props) track({ name: "outbound", props });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
```

- [ ] **Step 2: Mount it in the root layout**

In `src/app/layout.tsx`, add the import:
```tsx
import { OutboundTracker } from "@/components/analytics/outbound-tracker";
```
Render it right after `<AnalyticsScripts />`:
```tsx
        <AnalyticsScripts />
        <OutboundTracker />
```

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean. (`buildOutboundEvent` is already unit-tested in Task 3; this task is thin glue.)

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/outbound-tracker.tsx src/app/layout.tsx
git commit -m "feat: track all outbound link clicks via one delegated listener"
```

---

## Task 7: Named conversions — `cv-download` + `contact-click`

**Files:**
- Modify: the CV/résumé surface and the contact (email/LinkedIn) surface. These live in components consuming `DATA` from `src/data/resume.tsx`. **Before editing, grep to confirm exact files:**
  - `grep -rn "mailto:\|resume\|/cv\|Send Email\|LinkedIn" src/components src/app` and read `src/components/AGENTS.md`.

Fire named events and mark those elements `data-analytics-skip-outbound` so the Task 6 listener doesn't also emit `outbound` for them.

- [ ] **Step 1: Wire `cv-download`**

On the résumé/CV download link/button, add a click handler and the skip marker. If the surface is a server component, wrap just the interactive control in a small `'use client'` component, e.g. `src/components/analytics/cv-download-link.tsx`:
```tsx
"use client";
import { track } from "@/lib/analytics";

export function CvDownloadLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      download
      data-analytics-skip-outbound
      className={className}
      onClick={() => track({ name: "cv-download" })}
    >
      {children}
    </a>
  );
}
```
Replace the existing CV link usage with `<CvDownloadLink href={...}>`.

- [ ] **Step 2: Wire `contact-click`**

For the email and LinkedIn CTAs, similarly emit `contact-click` with the channel and add the skip marker. Create `src/components/analytics/contact-link.tsx`:
```tsx
"use client";
import { track } from "@/lib/analytics";

export function ContactLink({
  href, channel, children, className,
}: { href: string; channel: "email" | "linkedin"; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      data-analytics-skip-outbound
      className={className}
      onClick={() => track({ name: "contact-click", props: { channel } })}
    >
      {children}
    </a>
  );
}
```
Use it for the `mailto:` (channel `email`) and LinkedIn (channel `linkedin`) contact CTAs. (Social GitHub/LinkedIn links that are *not* the primary contact CTA stay on the generic `outbound` listener — don't mark those.)

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/cv-download-link.tsx src/components/analytics/contact-link.tsx src/components src/app
git commit -m "feat: named cv-download and contact-click conversion events"
```

---

## Task 8: `use-scroll-depth` hook

**Files:**
- Create: `src/components/analytics/use-scroll-depth.ts`
- Wire into the homepage and the story detail page.

Fires `scroll-depth` at 25/50/75/100% once each per pageview, using the pure `newMilestones()` from Task 3.

- [ ] **Step 1: Create the hook**

Create `src/components/analytics/use-scroll-depth.ts`:
```ts
"use client";

import { useEffect, useRef } from "react";
import { newMilestones, track } from "@/lib/analytics";

/** Fire `scroll-depth` milestones (25/50/75/100) once each for the given page key. */
export function useScrollDepth(page: string) {
  const fired = useRef<Set<number>>(new Set());
  useEffect(() => {
    fired.current = new Set();
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable <= 0 ? 100 : Math.round((doc.scrollTop / scrollable) * 100);
      for (const depth of newMilestones(pct, fired.current)) {
        fired.current.add(depth);
        track({ name: "scroll-depth", props: { page, depth: depth as 25 | 50 | 75 | 100 } });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // catch short pages already fully visible
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);
}
```

- [ ] **Step 2: Use it**

Add a tiny `'use client'` mount component `src/components/analytics/scroll-depth.tsx`:
```tsx
"use client";
import { useScrollDepth } from "./use-scroll-depth";
export function ScrollDepth({ page }: { page: string }) {
  useScrollDepth(page);
  return null;
}
```
Render `<ScrollDepth page="home" />` in `src/app/page.tsx` and `<ScrollDepth page={`story:${slug}`} />` in the story detail page (`src/app/(stories)/stories/[slug]/page.tsx`).

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean. (`newMilestones` is unit-tested in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/use-scroll-depth.ts src/components/analytics/scroll-depth.tsx src/app/page.tsx "src/app/(stories)/stories/[slug]/page.tsx"
git commit -m "feat: scroll-depth tracking on home and story pages"
```

---

## Task 9: `use-impression` hook (scoped element impressions)

**Files:**
- Create: `src/components/analytics/use-impression.ts` + `src/components/analytics/impression.tsx`
- Wire onto project cards, story cards, and key sections.

Fires `impression` once when a scoped element first enters the viewport.

- [ ] **Step 1: Create the hook + wrapper**

Create `src/components/analytics/use-impression.ts`:
```ts
"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/** Fire `impression` once when `ref`'s element first crosses into view. */
export function useImpression(element: string, id?: string) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            track({ name: "impression", props: { element, id } });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [element, id]);
  return ref;
}
```
Create `src/components/analytics/impression.tsx`:
```tsx
"use client";
import { useImpression } from "./use-impression";

/** Wrap a scoped element to emit a one-time `impression` when it enters view. */
export function Impression({ element, id, children, className }: {
  element: string; id?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useImpression(element, id);
  return <div ref={ref} className={className}>{children}</div>;
}
```

- [ ] **Step 2: Wire scoped usages**

Wrap project cards (`element="project"`, `id={project slug/name}`), story cards (`element="story"`, `id={story.slug}`), and 1–2 key homepage sections (`element="section"`, `id="contact"` etc.). Read `src/components/AGENTS.md` first; grep for the project/story card components (`grep -rn "story-card\|project" src/components`). Keep it to these scoped surfaces — do not wrap arbitrary nodes.

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/analytics/use-impression.ts src/components/analytics/impression.tsx src/components
git commit -m "feat: scoped impression tracking on cards and key sections"
```

---

## Task 10: `project-expand` + `talk-photos` events

**Files:**
- Modify: the project-card expand interaction and the talk-photos UI. Grep to locate: `grep -rn "expand\|accordion\|talks\|photos\|carousel" src/components` and read `src/components/AGENTS.md`.

- [ ] **Step 1: `project-expand`**

In the project card's expand handler (the click/toggle that reveals details), call:
```ts
import { track } from "@/lib/analytics";
// in the expand handler, when transitioning to expanded:
track({ name: "project-expand", props: { project: projectName } });
```
Fire only on expand (not collapse). If the card is a server component, lift the toggle into the existing `'use client'` interactive piece.

- [ ] **Step 2: `talk-photos`**

In the talk-photos UI, fire on open and on advance:
```ts
import { track } from "@/lib/analytics";
// on opening the photos viewer:
track({ name: "talk-photos", props: { talk: talkTitle, action: "open" } });
// on advancing to the next photo:
track({ name: "talk-photos", props: { talk: talkTitle, action: "advance" } });
```

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components
git commit -m "feat: project-expand and talk-photos engagement events"
```

---

## Task 11: Story `story-unlock` event (server channel)

**Files:**
- Modify: `src/app/(stories)/stories/unlock/actions.ts`

After `validate()` passes, derive the company from the submitted password and send `story-unlock` server-side. **Never send the password — only the company slug.**

- [ ] **Step 1: Edit the unlock action**

In `src/app/(stories)/stories/unlock/actions.ts`, add imports:
```ts
import { companyFromPassword } from "@/lib/stories-password";
import { sendServerEvent } from "@/lib/umami-server";
import { headers } from "next/headers";
```
After the `validate` check passes and before/after setting the cookie, add:
```ts
  const company = companyFromPassword(input.trim());
  if (company) {
    const hostname = (await headers()).get("host") ?? "antwansherif.com";
    await sendServerEvent({ hostname, name: "story-unlock", data: { company } });
  }
```
(Place it after the successful `validate` branch — i.e., once we know access is granted. Do not log `input`.)

- [ ] **Step 2: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean; existing unlock behavior unchanged (the send no-ops outside production).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(stories)/stories/unlock/actions.ts"
git commit -m "feat: emit story-unlock with company on successful unlock"
```

---

## Task 12: Story `story-view` event (prefetch-immune, server channel)

**Files:**
- Create: `src/app/(stories)/stories/track-actions.ts` (Server Action), `src/components/analytics/story-view-beacon.tsx`
- Modify: `src/app/(stories)/stories/[slug]/page.tsx`

The beacon fires on **mount** (a prefetch never mounts it), calling a Server Action that re-reads the cookie, re-derives the company, and sends `story-view` server-side.

- [ ] **Step 1: Create the Server Action**

Create `src/app/(stories)/stories/track-actions.ts`:
```ts
"use server";

import { cookies, headers } from "next/headers";
import { companyFromPassword } from "@/lib/stories-password";
import { sendServerEvent } from "@/lib/umami-server";

const COOKIE_NAME = "stories-auth";

/** Record a genuine story open. Company comes from the auth cookie (already validated by proxy.ts). */
export async function trackStoryView(story: string): Promise<void> {
  const password = (await cookies()).get(COOKIE_NAME)?.value;
  if (!password) return;
  const company = companyFromPassword(password);
  if (!company) return;
  const hostname = (await headers()).get("host") ?? "antwansherif.com";
  await sendServerEvent({ hostname, name: "story-view", data: { company, story } });
}
```

- [ ] **Step 2: Create the mount beacon**

Create `src/components/analytics/story-view-beacon.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { trackStoryView } from "@/app/(stories)/stories/track-actions";

/** Fires the story-view Server Action exactly once on mount. Prefetch fetches the
 *  payload but never mounts this, so prefetch does not count as a view. */
export function StoryViewBeacon({ story }: { story: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return; // guard React strict-mode double-invoke in dev
    sent.current = true;
    void trackStoryView(story);
  }, [story]);
  return null;
}
```

- [ ] **Step 3: Render it on the story page**

In `src/app/(stories)/stories/[slug]/page.tsx`, import and render the beacon with the resolved slug (the page already resolves `params.slug`):
```tsx
import { StoryViewBeacon } from "@/components/analytics/story-view-beacon";
// ...inside the returned JSX, near the top:
<StoryViewBeacon story={slug} />
```
(Use the same `slug` value the page uses to look up the story.)

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm vitest run`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(stories)/stories/track-actions.ts" src/components/analytics/story-view-beacon.tsx "src/app/(stories)/stories/[slug]/page.tsx"
git commit -m "feat: prefetch-immune story-view tracking with company"
```

---

## Task 13: Integration test — the full event pipeline (logic level)

**Files:**
- Create: `src/lib/analytics-pipeline.test.ts`

The repo has no browser/e2e harness; this exercises the event-construction pipeline end-to-end at the unit level (the real user-flow verification is the HC7 smoke test). It asserts the pieces compose correctly and that secrets never leak into payloads.

- [ ] **Step 1: Write the test**

Create `src/lib/analytics-pipeline.test.ts`:
```ts
import { describe, test, expect } from "vitest";
import { buildOutboundEvent } from "./analytics";
import { buildUmamiPayload } from "./umami-server";
import { companyFromPassword } from "./stories-password";

describe("event pipeline", () => {
  test("outbound: a project link click on antwansherif.com yields a correct event", () => {
    const props = buildOutboundEvent({ href: "https://www.haktiv.ai", currentHost: "antwansherif.com", context: "project", label: "HAKTIV" });
    expect(props).toEqual({ href: "https://www.haktiv.ai/", host: "www.haktiv.ai", context: "project", label: "HAKTIV" });
  });

  test("story-view: a valid password produces a payload carrying company+story but NOT the password", () => {
    const password = "Acme-7f3k9x2qph";
    const company = companyFromPassword(password);
    expect(company).toBe("Acme");
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-view", data: { company: company!, story: "prism" } });
    const serialized = JSON.stringify(payload);
    expect(payload.payload.data).toEqual({ company: "Acme", story: "prism" });
    expect(serialized).not.toContain("7f3k9x2qph"); // the secret code never travels
  });

  test("story-unlock: per-domain hostname is preserved for the split view", () => {
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwansherif.com", name: "story-unlock", data: { company: "Acme" } });
    expect(payload.payload.hostname).toBe("antwansherif.com");
  });
});
```

- [ ] **Step 2: Run it and confirm it passes**

Run: `pnpm vitest run src/lib/analytics-pipeline.test.ts`
Expected: PASS.

- [ ] **Step 3: Run the full suite**

Run: `pnpm test`
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add src/lib/analytics-pipeline.test.ts
git commit -m "test: integration coverage for the analytics event pipeline"
```

---

## Task 14: Intent layer — the "keep events in sync" convention

**Files:**
- Create: `src/components/analytics/AGENTS.md`
- Modify: `src/components/AGENTS.md`, `src/data/AGENTS.md` (cross-link)

- [ ] **Step 1: Write the analytics AGENTS.md**

Create `src/components/analytics/AGENTS.md`:
```markdown
# Analytics — Intent

Cookieless Umami analytics. Two channels: **client** (`src/lib/analytics.ts` → `track()`, loaded by `analytics-scripts.tsx`) for ordinary events, and **server** (`src/lib/umami-server.ts` via Server Actions) for story events (company-attributed, ad-block/prefetch-immune). Design: `docs/superpowers/specs/2026-06-11-portfolio-analytics-design.md`.

## Standing rule — when you change a feature, keep events in sync
Do at least one of:
1. **Verify** existing events on the touched surface still fire (links, cards, story flow).
2. **Enrich** event props that became more informative.
3. **Create** a new event for any new measurable user interaction that has none.

- New **external links** are auto-tracked by `OutboundTracker` — nothing to do.
- Deliberate interactions (expansions, meaningful toggles, downloads, gated opens) are **not** auto-tracked — add a `track({...})` call (client) or a Server Action (server, when the data is server-authoritative or must dodge ad blockers).
- Named conversions mark their element `data-analytics-skip-outbound` to avoid double-counting.

## Test obligation
New/changed events get the same TDD treatment as the catalog: name/props correctness, no-op safety, and (for story events) prefetch/adblock immunity. Update the **Events Catalog** in the spec when events change — it's the source of truth.

## Never
- Never log or send the story **password** — only the **company** slug (`companyFromPassword`).
- Never let an analytics send throw into a render (all paths no-op on error / outside production).
```

- [ ] **Step 2: Cross-link from the existing AGENTS.md files**

Append to `src/components/AGENTS.md`:
```markdown

## Analytics
Event tracking lives in `src/components/analytics/` — see its `AGENTS.md`. When you add or change a feature, keep events in sync (verify / enrich / create).
```
Append to `src/data/AGENTS.md`:
```markdown

## Analytics & stories
Story opens are tracked per-company server-side (company = validated password prefix; see `src/components/analytics/AGENTS.md`). Never send the password — only the company slug.
```

- [ ] **Step 3: Commit**

```bash
git add src/components/analytics/AGENTS.md src/components/AGENTS.md src/data/AGENTS.md
git commit -m "docs: intent-layer convention to keep analytics events in sync"
```

---

## Task 15: 🙋 HUMAN CHECKPOINT — env wiring + `.env.example` (HC6)

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Add `.env.example` (agent)**

Create `.env.example` (append if it exists — do not overwrite real values):
```bash
# Umami analytics (client)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_HOST_URL=https://stats.antwansherif.com
NEXT_PUBLIC_UMAMI_SCRIPT_NAME=u.js
# Umami analytics (server channel)
UMAMI_COLLECT_ENDPOINT=/api/e
```

- [ ] **Step 2: 🙋 STOP — user fills real values.** The agent presents this and waits:
  - Add the four vars (with the **real** Website ID from HC4, and the script-name/endpoint matching HC2) to: the **portfolio's Vercel project** env, and local `.env.local` (gitignored).
  - Confirm `NEXT_PUBLIC_UMAMI_SCRIPT_NAME` == `TRACKER_SCRIPT_NAME` and `UMAMI_COLLECT_ENDPOINT` == `COLLECT_API_ENDPOINT` from the Umami deploy.

- [ ] **Step 3: Commit the example**

```bash
git add .env.example
git commit -m "chore: document analytics environment variables"
```

---

## Task 16: 🙋 HUMAN CHECKPOINT — deploy + smoke test (HC5, HC7)

**STOP. User-driven, with agent guidance.** Final end-to-end verification — the real user-flow gate.

- [ ] **Deploy** the portfolio branch (Vercel preview or production) with the env vars in place.
- [ ] **HC5 (optional):** put Cloudflare Access in front of the Umami **dashboard** routes only (leave the renamed script + collect endpoint public).
- [ ] **HC7 smoke test** — confirm in the `stats.antwansherif.com` dashboard:
  - Load both `antwan.me` and `antwansherif.com` → pageviews appear; the **Hostname filter** splits them; aggregate shows both.
  - The **Core Web Vitals / performance** section populates.
  - Click an external link (e.g. HAKTIV), the CV download, and a contact CTA → `outbound`, `cv-download`, `contact-click` land (and the CV/contact clicks do **not** also produce `outbound`).
  - Scroll a long page → `scroll-depth` milestones appear.
  - Unlock a story with a **real per-company password** and open it → `story-unlock` and `story-view` appear, both carrying the correct **company**; the password is nowhere in the data.
- [ ] If anything's off, file the discrepancy and loop back to the relevant task.

No code commit (verification only). Once green, the branch is ready to merge — **stop and ask the user before merging** (worktree/merge convention).

---

## Self-Review (completed during planning)

- **Spec coverage:** tool choice & infra (Tasks 1, 5, 15, 16); cookieless/first-party (Task 5); two-domain aggregate+split (Task 5 `data-domains` + HC7 hostname filter); Core Web Vitals (Task 5 `data-performance`); every event in the catalog (Tasks 3,6,7,8,9,10,11,12); two-channel design (client Tasks 3/6; server Tasks 4/11/12); company-from-password without `companies.txt` (Task 2); no-password-leak (Tasks 11,12,13 assertion); no double-count (Tasks 6/7 skip marker); accuracy caveats & renamed script (HC2, Task 5); standing convention in intent layer (Task 14); env runbook & human checkpoints (Tasks 1, 15, 16). All spec sections map to a task.
- **Placeholder scan:** no TBD/“handle edge cases”; all code shown. The component-wiring tasks (7,9,10) name a `grep` to locate exact insertion points because those surfaces live in content components that must be read first per the intent layer — the *code to add* is fully specified.
- **Type consistency:** `AnalyticsEvent` union (Task 3) is used consistently by `track()` callers (Tasks 6–10); `buildUmamiPayload`/`sendServerEvent` signatures (Task 4) match callers (Tasks 11,12); `companyFromPassword` (Task 2) signature matches callers (Tasks 11,12,13); env var names identical across Tasks 4, 5, 15.
