# Analytics Event Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the live Umami event surface into a typed, forward-compatible taxonomy (shared content spine + controlled vocabularies + visitor identity) that powers funnels, journeys, segments, and cohorts.

**Architecture:** A pure shared module (`analytics-taxonomy.ts`) defines the spine types + version. The client event union (`analytics.ts`) and server channel (`umami-server.ts`) both build on it and centrally inject the `v` version stamp. New homepage `section_view` (IntersectionObserver) and a `localStorage` UUID identity layer round it out. Clean cutover — no backward compat (data is sparse test traffic).

**Tech Stack:** TypeScript, Next.js 16 (App Router, RSC), React 19, Umami v3, vitest (node env), pnpm.

**Spec:** `docs/superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md` · **Identity ADR:** `docs/adr/2026-06-13-analytics-visitor-identity.md` · **Roadmap:** `docs/analytics-roadmap.md`

**Conventions:**
- Run a single test file: `pnpm exec vitest run <path>`. Run the whole suite: `pnpm test`.
- `v` (taxonomy version) is injected centrally by `track()` / `sendServerEvent()` — callers never pass it.
- This is workstream ①; reserved props (`content_group`, `position`, `render_variant`, `experiment`) are type-valid but not emitted.

---

## Prerequisite: isolated worktree

This plan touches live analytics code. Execute it in an isolated worktree (the executing skill handles this via `superpowers:using-git-worktrees`). All commits land on the feature branch; **do not merge without asking** (per user convention).

---

### Task 1: Shared taxonomy module

**Files:**
- Create: `src/lib/analytics-taxonomy.ts`
- Test: `src/lib/analytics-taxonomy.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/analytics-taxonomy.test.ts
import { describe, test, expect } from "vitest";
import { TAXONOMY_VERSION, HOME_SECTIONS } from "./analytics-taxonomy";

describe("analytics-taxonomy", () => {
  test("version is 1", () => {
    expect(TAXONOMY_VERSION).toBe(1);
  });
  test("HOME_SECTIONS lists the 8 homepage sections in DOM order", () => {
    expect(HOME_SECTIONS).toEqual([
      "hero", "about", "work", "education", "skills", "talks", "projects", "contact",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/analytics-taxonomy.test.ts`
Expected: FAIL — cannot find module `./analytics-taxonomy`.

- [ ] **Step 3: Create the module**

```ts
// src/lib/analytics-taxonomy.ts
// Pure, isomorphic taxonomy primitives shared by the client (analytics.ts)
// and server (umami-server.ts) channels. No window/server-only references here.

/** Bump when the event schema changes incompatibly. Injected into every event by the send layer. */
export const TAXONOMY_VERSION = 1;

/** The cross-content spine dimension present on every event. */
export type ContentType = "home" | "project" | "story" | "talk" | "blog" | "contact" | "nav";

/** Destination class for outbound/contact — powers the audience (engineer vs recruiter) split. */
export type OutboundCategory = "code" | "professional" | "social" | "content" | "other";

/** The homepage's named sections, in DOM order (drives section_view + the churn funnel). */
export type HomeSection =
  | "hero" | "about" | "work" | "education" | "skills" | "talks" | "projects" | "contact";

export const HOME_SECTIONS: HomeSection[] = [
  "hero", "about", "work", "education", "skills", "talks", "projects", "contact",
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/analytics-taxonomy.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics-taxonomy.ts src/lib/analytics-taxonomy.test.ts
git commit -m "feat(analytics): add shared taxonomy module (spine types + version)"
```

---

### Task 2: `categorizeOutbound` helper

**Files:**
- Modify: `src/lib/analytics.ts` (add helper + import)
- Test: `src/lib/analytics.test.ts` (add describe block)

- [ ] **Step 1: Write the failing test** — append to `src/lib/analytics.test.ts`

```ts
import { categorizeOutbound } from "./analytics";

describe("categorizeOutbound", () => {
  test("code platforms → code", () => {
    expect(categorizeOutbound("github.com")).toBe("code");
    expect(categorizeOutbound("www.npmjs.com")).toBe("code");
    expect(categorizeOutbound("codesandbox.io")).toBe("code");
  });
  test("linkedin + mailto → professional", () => {
    expect(categorizeOutbound("www.linkedin.com")).toBe("professional");
    expect(categorizeOutbound("mailto")).toBe("professional");
  });
  test("social networks → social", () => {
    expect(categorizeOutbound("x.com")).toBe("social");
    expect(categorizeOutbound("youtube.com")).toBe("social");
  });
  test("writing platforms → content", () => {
    expect(categorizeOutbound("dev.to")).toBe("content");
    expect(categorizeOutbound("medium.com")).toBe("content");
  });
  test("unknown host → other", () => {
    expect(categorizeOutbound("example.com")).toBe("other");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/analytics.test.ts -t categorizeOutbound`
Expected: FAIL — `categorizeOutbound` is not exported.

- [ ] **Step 3: Implement** — add to `src/lib/analytics.ts` (below the imports)

```ts
import type { OutboundCategory } from "./analytics-taxonomy";

/** Classify an outbound destination host into a coarse category. Pure. */
export function categorizeOutbound(host: string): OutboundCategory {
  const h = host.toLowerCase();
  if (h === "mailto") return "professional";
  if (/(^|\.)(github\.com|gitlab\.com|npmjs\.com|codesandbox\.io|stackblitz\.com|codepen\.io)$/.test(h)) return "code";
  if (/(^|\.)linkedin\.com$/.test(h)) return "professional";
  if (/(^|\.)(x\.com|twitter\.com|instagram\.com|facebook\.com|youtube\.com|threads\.net|bsky\.app)$/.test(h)) return "social";
  if (/(^|\.)(dev\.to|medium\.com|substack\.com|hashnode\.dev|hackernoon\.com)$/.test(h)) return "content";
  return "other";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/analytics.test.ts -t categorizeOutbound`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics.test.ts
git commit -m "feat(analytics): add categorizeOutbound destination classifier"
```

---

### Task 3: Visitor identity helpers

**Files:**
- Create: `src/lib/analytics-identity.ts`
- Test: `src/lib/analytics-identity.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/analytics-identity.test.ts
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getOrCreateVisitorId, identifyVisitor, VISITOR_ID_KEY } from "./analytics-identity";

function fakeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  } as Storage;
}

describe("getOrCreateVisitorId", () => {
  test("mints and persists a uuid on first call", () => {
    const s = fakeStorage();
    const id = getOrCreateVisitorId(s);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(s.getItem(VISITOR_ID_KEY)).toBe(id);
  });
  test("returns the same id on subsequent calls", () => {
    const s = fakeStorage();
    expect(getOrCreateVisitorId(s)).toBe(getOrCreateVisitorId(s));
  });
});

describe("identifyVisitor", () => {
  const realWindow = globalThis.window;
  afterEach(() => { (globalThis as any).window = realWindow; vi.unstubAllEnvs(); });
  beforeEach(() => { vi.stubEnv("NODE_ENV", "production"); });

  test("calls umami.identify with id only when no data", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc" });
    expect(spy).toHaveBeenCalledWith("abc");
  });
  test("calls umami.identify with id + data when data present", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc", data: { company: "Acme" } });
    expect(spy).toHaveBeenCalledWith("abc", { company: "Acme" });
  });
  test("no-ops (no throw) when umami absent", () => {
    (globalThis as any).window = {};
    expect(() => identifyVisitor({ id: "abc" })).not.toThrow();
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc" });
    expect(spy).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/analytics-identity.test.ts`
Expected: FAIL — cannot find module `./analytics-identity`.

- [ ] **Step 3: Implement**

```ts
// src/lib/analytics-identity.ts
// Self-managed visitor identity: a localStorage UUID handed to Umami's identify()
// so a visitor is recognizable across the daily-salt hash rotation (cross-day cohorts).
// Mirrors track()'s discipline: prod-only, client-only, never throws.
// See docs/adr/2026-06-13-analytics-visitor-identity.md.

export const VISITOR_ID_KEY = "as_vid";

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
      identify?: (id: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** Read the persisted visitor UUID, minting + storing one on first visit. Pure (storage injected). */
export function getOrCreateVisitorId(storage: Pick<Storage, "getItem" | "setItem">): string {
  const existing = storage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(VISITOR_ID_KEY, id);
  return id;
}

/** Attach the visitor id (and optional session props) to Umami's session. No-op outside production / SSR / when blocked. */
export function identifyVisitor(input: { id: string; data?: Record<string, unknown> }): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    if (input.data && Object.keys(input.data).length > 0) {
      window.umami?.identify?.(input.id, input.data);
    } else {
      window.umami?.identify?.(input.id);
    }
  } catch {
    /* analytics must never break the page */
  }
}
```

> **Implementation note:** confirm Umami v3's `identify()` signature against the live tracker before merge (the global type above assumes `identify(id, data?)`). If the deployed build only accepts `identify(data)`, fold the id into `data` as the unique key — adjust `identifyVisitor` and its test together.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/analytics-identity.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics-identity.ts src/lib/analytics-identity.test.ts
git commit -m "feat(analytics): add localStorage visitor identity helpers"
```

---

### Task 4: Server-side `gate_fail` + slug helpers

**Files:**
- Modify: `src/lib/umami-server.ts` (add two pure helpers)
- Test: `src/lib/umami-server.test.ts` (add describe blocks)

- [ ] **Step 1: Write the failing test** — append to `src/lib/umami-server.test.ts`

```ts
import { buildGateFailData, storySlugFromPath } from "./umami-server";

describe("buildGateFailData", () => {
  test("captures the raw attempt, never derives company", () => {
    const d = buildGateFailData("totally-wrong", "prism");
    expect(d).toEqual({ content_type: "story", content_id: "prism", attempt: "totally-wrong", format_valid: false });
    expect(d).not.toHaveProperty("company");
  });
  test("flags a guess that matches the Company-<base62> shape", () => {
    expect(buildGateFailData("Acme-7f3k9x2qph", "prism").format_valid).toBe(true);
  });
  test("truncates the attempt to 64 chars", () => {
    expect(buildGateFailData("x".repeat(200), "prism").attempt).toHaveLength(64);
  });
});

describe("storySlugFromPath", () => {
  test("extracts the slug from a story path", () => {
    expect(storySlugFromPath("/stories/prism")).toBe("prism");
    expect(storySlugFromPath("/stories/prism?error=1")).toBe("prism");
  });
  test("falls back to 'stories' for the list or unknown paths", () => {
    expect(storySlugFromPath("/stories")).toBe("stories");
    expect(storySlugFromPath("/")).toBe("stories");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/umami-server.test.ts -t "buildGateFailData"`
Expected: FAIL — `buildGateFailData` is not exported.

- [ ] **Step 3: Implement** — add to `src/lib/umami-server.ts`

```ts
/** Matches the Company-<10 base62> password shape — used only to flag whether a *failed*
 *  guess even looked like a real password. Never used to derive a company. */
const COMPANY_HASH_SHAPE = /^.+-[0-9A-Za-z]{10}$/;

/** Build the `gate_fail` event data for a rejected unlock attempt.
 *  Captures the raw (truncated) guess — NOT a derived company — plus whether it matched the password shape.
 *  Only ever called on attempts that already FAILED validation, so it can't carry a working password. */
export function buildGateFailData(attempt: string, contentId: string): {
  content_type: "story"; content_id: string; attempt: string; format_valid: boolean;
} {
  return {
    content_type: "story",
    content_id: contentId,
    attempt: attempt.slice(0, 64),
    format_valid: COMPANY_HASH_SHAPE.test(attempt),
  };
}

/** Extract a story slug from a path like `/stories/<slug>`; falls back to `stories`. Pure. */
export function storySlugFromPath(path: string): string {
  const m = path.match(/^\/stories\/([^/?#]+)/);
  return m ? m[1] : "stories";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/umami-server.test.ts`
Expected: PASS (existing buildUmamiPayload tests + 5 new).

- [ ] **Step 5: Commit**

```bash
git add src/lib/umami-server.ts src/lib/umami-server.test.ts
git commit -m "feat(analytics): add gate_fail + story-slug server helpers"
```

---

### Task 5: Client event cutover (the union redesign)

This is the atomic snake_case + spine cutover for client events. The `AnalyticsEvent` union changes and every client emit site updates with it; the repo compiles and the suite is green only when all edits land together — so this is one task, one commit.

**Files:**
- Modify: `src/lib/analytics.ts` (union, `track`, `buildOutboundEvent`)
- Modify: `src/components/analytics/outbound-tracker.tsx`
- Modify: `src/components/analytics/contact-link.tsx`
- Modify: `src/components/analytics/use-impression.ts`, `impression.tsx`
- Modify: `src/components/analytics/use-scroll-depth.ts`, `scroll-depth.tsx`
- Modify call sites: `src/components/project-card.tsx:44`, `src/components/story-card.tsx:17`, `src/app/page.tsx:165`, `src/app/(stories)/stories/[slug]/page.tsx:38`
- Modify tests: `src/lib/analytics.test.ts`, `src/lib/analytics-pipeline.test.ts`

- [ ] **Step 1: Rewrite the event union + `track` + `buildOutboundEvent`** in `src/lib/analytics.ts`

Replace the existing `OutboundProps` type, `AnalyticsEvent` union, `track`, and `buildOutboundEvent` with:

```ts
import { TAXONOMY_VERSION, type ContentType, type OutboundCategory, type HomeSection } from "./analytics-taxonomy";
// (categorizeOutbound is already defined in this file from Task 2)

export type OutboundProps = {
  content_type: ContentType; content_id?: string; category: OutboundCategory;
  host: string; href: string; label?: string;
};

export type AnalyticsEvent =
  | { name: "outbound"; props: OutboundProps }
  | { name: "contact_click"; props: { content_type: "contact"; channel: "email" | "linkedin"; category: "professional" } }
  | { name: "cv_download"; props: { content_type: ContentType; category: "professional" } } // reserved: wire on a CV CTA
  | { name: "section_view"; props: { content_type: "home"; content_id: HomeSection; position?: number } }
  | { name: "scroll_depth"; props: { content_type: "story"; content_id: string; depth: 25 | 50 | 75 | 100; value: number } }
  | { name: "impression"; props: { content_type: ContentType; content_id?: string; position?: number } }
  | { name: "project_expand"; props: { content_type: "project"; content_id: string } } // reserved: wire on expand UI
  | { name: "talk_photos"; props: { content_type: "talk"; content_id: string; action: "open" | "advance" } }; // reserved

/** Fire a typed event. Centrally stamps the taxonomy version `v`. No-op outside production / SSR / when blocked. Never throws. */
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

And replace `buildOutboundEvent` with the spine-aware version:

```ts
/** Build an `outbound` event from a link's href + content context. Returns null for internal/invalid links. Pure. */
export function buildOutboundEvent(input: {
  href: string | null;
  currentHost: string;
  contentType: ContentType;
  contentId?: string;
  label?: string;
}): OutboundProps | null {
  const { href, currentHost, contentType, contentId, label } = input;
  if (!href) return null;
  if (href.startsWith("mailto:"))
    return { content_type: contentType, content_id: contentId, category: "professional", host: "mailto", href, label };
  let url: URL;
  try { url = new URL(href, `https://${currentHost}`); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.host === currentHost) return null;
  return { content_type: contentType, content_id: contentId, category: categorizeOutbound(url.host), host: url.host, href: url.href, label };
}
```

> Keep the existing `MILESTONES` const and `newMilestones` helper unchanged. Remove the now-unused old `Window.umami` `declare global` block in `analytics.ts` **only if** it duplicates the one now in `analytics-identity.ts` — to avoid a duplicate-identifier error, keep the augmentation in ONE file. Leave it in `analytics-identity.ts` (Task 3) and delete the block from `analytics.ts`.

- [ ] **Step 2: Update `outbound-tracker.tsx`** — read the new data attributes (default `content_type=nav`)

Replace the `buildOutboundEvent({...})` call args:

```tsx
const props = buildOutboundEvent({
  href: anchor.getAttribute("href"),
  currentHost: window.location.host,
  contentType: (anchor.dataset.contentType as ContentType) ?? "nav",
  contentId: anchor.dataset.contentId,
  label: anchor.dataset.analyticsLabel ?? anchor.textContent?.trim() ?? undefined,
});
```

Add the import at the top:

```tsx
import type { ContentType } from "@/lib/analytics-taxonomy";
```

- [ ] **Step 3: Update `contact-link.tsx`** — new `contact_click` shape

Replace the `track(...)` call:

```tsx
track({ name: "contact_click", props: { content_type: "contact", channel, category: "professional" } });
```

- [ ] **Step 4: Update impression** — `element/id` → `content_type/content_id`

`src/components/analytics/use-impression.ts` — change signature + track call:

```ts
import type { ContentType } from "@/lib/analytics-taxonomy";

export function useImpression(contentType: ContentType, contentId?: string) {
  // ...unchanged observer setup...
  // inside the intersection callback:
  track({ name: "impression", props: { content_type: contentType, content_id: contentId } });
  // ...
  // dependency array becomes [contentType, contentId]
}
```

`src/components/analytics/impression.tsx` — change props:

```tsx
import type { ContentType } from "@/lib/analytics-taxonomy";
import { useImpression } from "./use-impression";

export function Impression({ contentType, contentId, children, className }: {
  contentType: ContentType; contentId?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useImpression(contentType, contentId);
  return <div ref={ref} className={className}>{children}</div>;
}
```

- [ ] **Step 5: Update scroll-depth** — story-only, add timing `value`

`src/components/analytics/use-scroll-depth.ts`:

```ts
"use client";

import { useEffect, useRef } from "react";
import { newMilestones, track } from "@/lib/analytics";

/** Fire `scroll_depth` milestones (25/50/75/100) once each for a story, with elapsed ms since load (reading velocity). */
export function useScrollDepth(contentId: string) {
  const fired = useRef<Set<number>>(new Set());
  useEffect(() => {
    fired.current = new Set();
    const start = performance.now();
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable <= 0 ? 100 : Math.round((doc.scrollTop / scrollable) * 100);
      for (const depth of newMilestones(pct, fired.current)) {
        fired.current.add(depth);
        track({
          name: "scroll_depth",
          props: { content_type: "story", content_id: contentId, depth: depth as 25 | 50 | 75 | 100, value: Math.round(performance.now() - start) },
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [contentId]);
}
```

`src/components/analytics/scroll-depth.tsx`:

```tsx
"use client";
import { useScrollDepth } from "./use-scroll-depth";

/** Mount-only component that activates story scroll-depth tracking. */
export function ScrollDepth({ contentId }: { contentId: string }) {
  useScrollDepth(contentId);
  return null;
}
```

- [ ] **Step 6: Update call sites**

`src/components/project-card.tsx:44`:
```tsx
const impressionCb = useImpression("project", title);
```
(unchanged signature shape — `useImpression(contentType, contentId)`; `"project"` + `title` are already correct, so this line stays. Verify it still type-checks.)

`src/components/story-card.tsx:17`:
```tsx
const impressionCb = useImpression("story", story.slug);
```
(also already correct — verify type-checks.)

`src/app/page.tsx:165` — the contact impression:
```tsx
<Impression contentType="contact">
```
(was `element="section" id="contact"`.)

`src/app/page.tsx:23` — **remove** the homepage `<ScrollDepth page="home" />` line and its import (homepage uses `section_view` instead — wired in Task 7). Delete:
```tsx
import { ScrollDepth } from '@/components/analytics/scroll-depth';
// ...
<ScrollDepth page="home" />
```

`src/app/(stories)/stories/[slug]/page.tsx:38`:
```tsx
<ScrollDepth contentId={slug} />
```
(was `page={`story:${slug}`}`.)

- [ ] **Step 7: Update `analytics.test.ts`** — rename events + new outbound signature

Replace the `buildOutboundEvent` describe block and the `track` event names:

```ts
describe("buildOutboundEvent", () => {
  const host = "antwan.me";
  test("external link → props with category + spine", () => {
    expect(buildOutboundEvent({ href: "https://www.haktiv.ai/x", currentHost: host, contentType: "project", contentId: "haktiv", label: "HAKTIV" }))
      .toEqual({ content_type: "project", content_id: "haktiv", category: "other", host: "www.haktiv.ai", href: "https://www.haktiv.ai/x", label: "HAKTIV" });
  });
  test("github link → category code", () => {
    expect(buildOutboundEvent({ href: "https://github.com/AntwanSherif", currentHost: host, contentType: "nav" })?.category).toBe("code");
  });
  test("internal link → null", () => {
    expect(buildOutboundEvent({ href: "/stories", currentHost: host, contentType: "nav" })).toBeNull();
  });
  test("mailto → host 'mailto', category professional", () => {
    expect(buildOutboundEvent({ href: "mailto:a@b.com", currentHost: host, contentType: "contact" }))
      .toEqual({ content_type: "contact", content_id: undefined, category: "professional", host: "mailto", href: "mailto:a@b.com", label: undefined });
  });
  test("null/garbage href → null", () => {
    expect(buildOutboundEvent({ href: null, currentHost: host, contentType: "nav" })).toBeNull();
    expect(buildOutboundEvent({ href: "::::", currentHost: host, contentType: "nav" })).toBeNull();
  });
});
```

In the `track` describe block, update event names + assert `v` is injected:
```ts
test("calls window.umami.track with v stamped in", () => {
  const spy = vi.fn();
  (globalThis as any).window = { umami: { track: spy } };
  track({ name: "contact_click", props: { content_type: "contact", channel: "email", category: "professional" } });
  expect(spy).toHaveBeenCalledWith("contact_click", { v: 1, content_type: "contact", channel: "email", category: "professional" });
});
test("no-ops (no throw) when umami is absent", () => {
  (globalThis as any).window = {};
  expect(() => track({ name: "impression", props: { content_type: "contact" } })).not.toThrow();
});
test("no-ops outside production", () => {
  vi.stubEnv("NODE_ENV", "development");
  const spy = vi.fn();
  (globalThis as any).window = { umami: { track: spy } };
  track({ name: "impression", props: { content_type: "contact" } });
  expect(spy).not.toHaveBeenCalled();
});
```
(Replace the old `cv-download` / `contact-click` SSR/absent/no-op tests with the equivalents above using new names; keep the SSR `window` undefined test, updating its event to `{ name: "impression", props: { content_type: "contact" } }`.)

- [ ] **Step 8: Update the outbound assertion in `analytics-pipeline.test.ts`**

```ts
test("outbound: a project link click on antwansherif.com yields a correct event", () => {
  const props = buildOutboundEvent({ href: "https://www.haktiv.ai", currentHost: "antwansherif.com", contentType: "project", contentId: "haktiv", label: "HAKTIV" });
  expect(props).toEqual({ content_type: "project", content_id: "haktiv", category: "other", host: "www.haktiv.ai", href: "https://www.haktiv.ai/", label: "HAKTIV" });
});
```
(Leave the two `story-view`/`story-unlock` payload tests in this file unchanged for now — they use `buildUmamiPayload` directly and stay green until Task 9 renames the server events.)

- [ ] **Step 9: Typecheck + run the full suite**

Run: `pnpm exec tsc --noEmit && pnpm test`
Expected: typecheck clean; all tests PASS. If `tsc` flags a missed call site, fix it (every `track`/`useImpression`/`Impression`/`ScrollDepth`/`buildOutboundEvent` usage must match the new shapes).

- [ ] **Step 10: Commit**

```bash
git add src/lib/analytics.ts src/lib/analytics.test.ts src/lib/analytics-pipeline.test.ts src/components/analytics/ src/components/project-card.tsx src/components/story-card.tsx src/app/page.tsx "src/app/(stories)/stories/[slug]/page.tsx"
git commit -m "feat(analytics): snake_case + content spine cutover for client events"
```

---

### Task 6: `section_view` for the homepage

**Files:**
- Create: `src/components/analytics/use-section-view.ts`
- Create: `src/components/analytics/home-section-views.tsx`
- Test: `src/components/analytics/section-view.test.ts`
- Modify: `src/app/page.tsx` (mount the component)

- [ ] **Step 1: Write the failing test** (pure payload builder)

```ts
// src/components/analytics/section-view.test.ts
import { describe, test, expect } from "vitest";
import { sectionViewEvent } from "./use-section-view";

describe("sectionViewEvent", () => {
  test("builds a home section_view event for a known section", () => {
    expect(sectionViewEvent("projects", 6)).toEqual({
      name: "section_view",
      props: { content_type: "home", content_id: "projects", position: 6 },
    });
  });
  test("ignores ids that are not known homepage sections", () => {
    expect(sectionViewEvent("not-a-section", 0)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/analytics/section-view.test.ts`
Expected: FAIL — cannot find `./use-section-view`.

- [ ] **Step 3: Implement the hook + pure builder**

```ts
// src/components/analytics/use-section-view.ts
"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { HOME_SECTIONS, type HomeSection } from "@/lib/analytics-taxonomy";

/** Pure: build a `section_view` event for a section id, or null if the id isn't a known homepage section. */
export function sectionViewEvent(id: string, position: number): AnalyticsEvent | null {
  if (!(HOME_SECTIONS as string[]).includes(id)) return null;
  return { name: "section_view", props: { content_type: "home", content_id: id as HomeSection, position } };
}

/** Observe each `section[id]` once; fire `section_view` when it first crosses into view. */
export function useSectionViews() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const fired = new Set<string>();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !fired.has(id)) {
            fired.add(id);
            const event = sectionViewEvent(id, HOME_SECTIONS.indexOf(id as HomeSection));
            if (event) track(event);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const s of sections) obs.observe(s);
    return () => obs.disconnect();
  }, []);
}
```

```tsx
// src/components/analytics/home-section-views.tsx
"use client";
import { useSectionViews } from "./use-section-view";

/** Mount-only: tracks homepage section reach (drives the churn funnel). */
export function HomeSectionViews() {
  useSectionViews();
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/analytics/section-view.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Mount on the homepage** — `src/app/page.tsx`

Add the import and replace the removed `<ScrollDepth>` line (near line 23, just inside `<main>`):

```tsx
import { HomeSectionViews } from '@/components/analytics/home-section-views';
// ...
<main className='min-h-dvh flex flex-col gap-10 sm:gap-14 relative'>
  <HomeSectionViews />
```

- [ ] **Step 6: Typecheck + commit**

Run: `pnpm exec tsc --noEmit && pnpm test`
Expected: PASS.

```bash
git add src/components/analytics/use-section-view.ts src/components/analytics/home-section-views.tsx src/components/analytics/section-view.test.ts src/app/page.tsx
git commit -m "feat(analytics): homepage section_view reach tracking"
```

---

### Task 7: Wire visitor identity into the app

**Files:**
- Create: `src/components/analytics/visitor-identity.tsx`
- Modify: `src/app/layout.tsx` (global mount)
- Modify: `src/app/(stories)/stories/[slug]/page.tsx` (company session prop)

- [ ] **Step 1: Create the client component**

```tsx
// src/components/analytics/visitor-identity.tsx
"use client";

import { useEffect } from "react";
import { getOrCreateVisitorId, identifyVisitor } from "@/lib/analytics-identity";

/** Mints/loads the localStorage visitor UUID and hands it to Umami's identify().
 *  Pass `company` on gated story pages to also tag the session (company comes from the server cookie). */
export function VisitorIdentity({ company }: { company?: string }) {
  useEffect(() => {
    try {
      const id = getOrCreateVisitorId(window.localStorage);
      identifyVisitor({ id, data: company ? { company } : undefined });
    } catch {
      /* analytics must never break the page */
    }
  }, [company]);
  return null;
}
```

- [ ] **Step 2: Mount globally in `src/app/layout.tsx`** — next to the other analytics components (around line 83-84)

```tsx
import { VisitorIdentity } from '@/components/analytics/visitor-identity';
// ...
<AnalyticsScripts />
<OutboundTracker />
<VisitorIdentity />
```

- [ ] **Step 3: Tag the session with `company` on story pages** — `src/app/(stories)/stories/[slug]/page.tsx`

The page is a gated server component. Read the validated auth cookie, derive the (non-secret) company slug, and pass it to a second `VisitorIdentity`:

```tsx
import { cookies } from "next/headers";
import { companyFromPassword } from "@/lib/stories-password";
import { VisitorIdentity } from "@/components/analytics/visitor-identity";
// ... inside the component, before the return (it is async):
const password = (await cookies()).get("stories-auth")?.value;
const company = password ? companyFromPassword(password) ?? undefined : undefined;
// ... in the JSX, alongside <ScrollDepth /> / <StoryViewBeacon />:
<VisitorIdentity company={company} />
```

> The slug `company` is non-secret (it already ships in `story_unlock`/`story_view`). Never pass the password.

- [ ] **Step 4: Typecheck + commit**

Run: `pnpm exec tsc --noEmit && pnpm test`
Expected: PASS (no new tests; the helpers are covered by Task 3, the wiring is thin glue verified manually in Task 10).

```bash
git add src/components/analytics/visitor-identity.tsx src/app/layout.tsx "src/app/(stories)/stories/[slug]/page.tsx"
git commit -m "feat(analytics): wire localStorage visitor identity + company session tag"
```

---

### Task 8: Server event cutover (snake_case + spine + `gate_fail`)

**Files:**
- Modify: `src/lib/umami-server.ts` (`sendServerEvent` injects `v`)
- Modify: `src/app/(stories)/stories/track-actions.ts` (story_view)
- Modify: `src/app/(stories)/stories/unlock/actions.ts` (story_unlock + gate_fail)
- Modify: `src/lib/umami-server.test.ts`, `src/lib/analytics-pipeline.test.ts` (rename + spine)

- [ ] **Step 1: Inject `v` in `sendServerEvent`** — `src/lib/umami-server.ts`

Import the version and stamp it into the outgoing data:

```ts
import { TAXONOMY_VERSION } from "./analytics-taxonomy";
```
In `sendServerEvent`, change the `buildUmamiPayload` call's data:
```ts
body: JSON.stringify(buildUmamiPayload({
  websiteId, hostname: input.hostname, name: input.name,
  data: { v: TAXONOMY_VERSION, ...(input.data ?? {}) },
})),
```

- [ ] **Step 2: Update `track-actions.ts`** — `story_view` with spine

```ts
await sendServerEvent({
  hostname,
  name: "story_view",
  data: { content_type: "story", content_id: story, company },
});
```

- [ ] **Step 3: Update `unlock/actions.ts`** — `story_unlock` with spine + emit `gate_fail` on rejection

Add imports:
```ts
import { sendServerEvent, buildGateFailData, storySlugFromPath } from "@/lib/umami-server";
```

In the failure branch (before the redirect), emit `gate_fail`:
```ts
if (!(await validate(seed, input.trim()))) {
  const hostname = (await headers()).get("host") ?? "antwansherif.com";
  await sendServerEvent({ hostname, name: "gate_fail", data: buildGateFailData(input.trim(), storySlugFromPath(safeTo)) });
  redirect(`/stories/unlock?from=${encodeURIComponent(safeTo)}&error=1`, RedirectType.replace);
}
```

In the success branch, update the unlock event to carry the spine:
```ts
await sendServerEvent({
  hostname,
  name: "story_unlock",
  data: { content_type: "story", content_id: storySlugFromPath(safeTo), company },
});
```

- [ ] **Step 4: Update server tests** — `src/lib/umami-server.test.ts`

Rename the `buildUmamiPayload` story-event assertions to snake_case + spine:
```ts
test("wraps name + data + hostname into Umami's event shape", () => {
  expect(
    buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: "prism", company: "Acme" } })
  ).toEqual({
    type: "event",
    payload: { website: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: "prism", company: "Acme" }, url: "/" },
  });
});
```
(Update the `story-unlock` test similarly to `story_unlock`.)

- [ ] **Step 5: Update the pipeline tests** — `src/lib/analytics-pipeline.test.ts`

Rename both story assertions to snake_case + spine, keeping the "password never travels" check:
```ts
test("story_view: a valid password produces a payload carrying company+content_id but NOT the password", () => {
  const password = "Acme-7f3k9x2qph";
  const company = companyFromPassword(password);
  expect(company).toBe("Acme");
  const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: "prism", company: company! } });
  expect(payload.payload.data).toEqual({ content_type: "story", content_id: "prism", company: "Acme" });
  expect(JSON.stringify(payload)).not.toContain("7f3k9x2qph");
});

test("story_unlock: per-domain hostname is preserved for the split view", () => {
  const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwansherif.com", name: "story_unlock", data: { content_type: "story", content_id: "prism", company: "Acme" } });
  expect(payload.payload.hostname).toBe("antwansherif.com");
});
```

- [ ] **Step 6: Typecheck + full suite**

Run: `pnpm exec tsc --noEmit && pnpm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/umami-server.ts src/lib/umami-server.test.ts src/lib/analytics-pipeline.test.ts "src/app/(stories)/stories/track-actions.ts" "src/app/(stories)/stories/unlock/actions.ts"
git commit -m "feat(analytics): snake_case + spine for server events; emit gate_fail"
```

---

### Task 9: Sync the intent docs

**Files:**
- Modify: `src/components/analytics/AGENTS.md`

- [ ] **Step 1: Update the "Wired vs reserved" + "Never" sections** to match the new catalog

Replace the **Wired now** line:
```markdown
**Wired now:** `pageview`, `web-vitals` (auto via `data-performance`), `outbound` (with `category` + `content_type`/`content_id`), `contact_click{channel,category}`, `section_view` (homepage section reach), `scroll_depth` (stories, with reading-velocity `value`), `impression` (project/story cards, contact section), `story_unlock`, `story_view` (both with `company` + `content_id`), `gate_fail` (failed unlock attempts). Visitor identity via `localStorage` UUID → `identify()`. All events carry the `v` taxonomy version + the `content_type` spine. Full catalog: `docs/superpowers/specs/2026-06-13-analytics-event-taxonomy-design.md`.
```

Add to the **Never** list:
```markdown
- Never log a *valid* story password. `gate_fail` captures only *rejected* attempts (truncated ≤64 chars) plus a `format_valid` shape flag — never a derived `company`. A one-character mistype of a real password is an accepted residual (see the identity ADR).
```

- [ ] **Step 2: Commit**

```bash
git add src/components/analytics/AGENTS.md
git commit -m "docs(analytics): sync AGENTS.md with the new event taxonomy"
```

---

### Task 10: Integration / user-flow test + manual verification

**Files:**
- Create: `src/lib/analytics-flows.test.ts`

- [ ] **Step 1: Write a flow test** stitching the pure builders into the funnels they power

```ts
// src/lib/analytics-flows.test.ts
import { describe, test, expect } from "vitest";
import { buildOutboundEvent, categorizeOutbound } from "./analytics";
import { sectionViewEvent } from "@/components/analytics/use-section-view";
import { buildGateFailData, buildUmamiPayload, storySlugFromPath } from "./umami-server";
import { HOME_SECTIONS } from "./analytics-taxonomy";

describe("homepage churn funnel inputs", () => {
  test("every homepage section maps to a valid section_view step", () => {
    const events = HOME_SECTIONS.map((s, i) => sectionViewEvent(s, i));
    expect(events.every((e) => e?.name === "section_view")).toBe(true);
    expect(events.map((e) => e?.props.content_id)).toEqual(HOME_SECTIONS);
  });
});

describe("recruiter-conversion funnel inputs", () => {
  test("a professional outbound is categorized for the recruiter segment", () => {
    const props = buildOutboundEvent({ href: "https://www.linkedin.com/in/x", currentHost: "antwan.me", contentType: "contact" });
    expect(props?.category).toBe("professional");
  });
  test("a code outbound is categorized for the engineer segment", () => {
    expect(categorizeOutbound("github.com")).toBe("code");
  });
});

describe("story funnel inputs", () => {
  test("unlock → view share content_id and carry company; password never travels", () => {
    const slug = storySlugFromPath("/stories/prism");
    const unlock = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_unlock", data: { content_type: "story", content_id: slug, company: "Acme" } });
    const view = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: slug, company: "Acme" } });
    expect(unlock.payload.data).toMatchObject({ content_id: "prism", company: "Acme" });
    expect(view.payload.data).toMatchObject({ content_id: "prism", company: "Acme" });
  });
  test("gate_fail carries the attempt + shape flag, never a company", () => {
    const d = buildGateFailData("guess123xy", "prism");
    expect(d.content_id).toBe("prism");
    expect(d).not.toHaveProperty("company");
  });
});
```

- [ ] **Step 2: Run it**

Run: `pnpm exec vitest run src/lib/analytics-flows.test.ts`
Expected: PASS.

- [ ] **Step 3: Run the whole suite + typecheck + build**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm build`
Expected: all green; build succeeds.

- [ ] **Step 4: Manual verification checklist** (no e2e harness — verify in a production-like build)

Document results in the commit body. With the app pointed at the Umami instance (prod env vars), confirm in the Umami dashboard's real-time/Sessions view:
- [ ] Loading the homepage fires `section_view` for sections as you scroll (`hero` … `contact`).
- [ ] An external link click fires `outbound` with the right `category`.
- [ ] The contact LinkedIn link fires `contact_click{category:professional}` and does NOT double-fire `outbound`.
- [ ] Scrolling a story fires `scroll_depth` with a non-zero `value`.
- [ ] Unlocking a story fires `story_unlock`; opening it fires `story_view` (both with `content_id` + `company`).
- [ ] A wrong password fires `gate_fail` with the truncated `attempt` + `format_valid`, and no `company`.
- [ ] `localStorage['as_vid']` is set and stable across reloads; a return visit is recognized.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics-flows.test.ts
git commit -m "test(analytics): integration flow tests for funnels + story/gate events"
```

---

### Task 11: Umami data reset (manual, user-performed)

Not code — a one-time operational step the **user** performs (per the spec's open decision). After the branch merges and deploys:

- [ ] In the Umami dashboard (`stats.antwansherif.com` → website settings → **Reset**), clear the existing data so the new schema starts clean (also removes the `setup-check`/`domain-check`/`manual-pageview-test` noise).
- [ ] Confirm new events arrive under the snake_case names with `v:1`.

> If the user prefers to keep historical data, skip the reset — the `v:1` stamp lets dashboards filter old vs new shapes. Default recommendation: reset (data is sparse test traffic).

---

## Self-Review

**Spec coverage:**
- snake_case names + spine → Tasks 5, 8. ✅
- `content_type`/`content_id`/`category`/`value`/`v` → Tasks 1, 2, 5, 8. ✅
- Reserved seats (`content_group`, `position`, `render_variant`, `experiment`) → type-valid in Tasks 1/5 (`position` on impression/section_view), not emitted. ✅ (`content_group`/`render_variant`/`experiment` live as session/event data the schema accepts via `Record<string, unknown>` on the server channel + future union additions — documented as reserved, not built.)
- `section_view` homepage + churn funnel → Task 6. ✅
- `scroll_depth` story-only + timing `value` → Task 5. ✅
- `gate_fail` (attempt, format_valid, no company) → Tasks 4, 8. ✅
- Visitor identity (UUID + identify, company session tag) → Tasks 3, 7. ✅
- Migration clean cutover → Tasks 5, 8. ✅
- Dashboard enablement → not code (Task 11 + spec); flow inputs validated in Task 10. ✅
- TDD pure helpers + thin glue + integration test → Tasks 1-6, 10. ✅
- Docs sync (AGENTS.md, catalog) → Task 9. ✅

**Placeholder scan:** no TBD/TODO; every code step shows full code. ✅

**Type consistency:** `useImpression(contentType, contentId)`, `Impression{contentType, contentId}`, `ScrollDepth{contentId}`, `buildOutboundEvent({contentType, contentId})`, `track({name, props})` with central `v` injection, `identifyVisitor({id, data})`, `buildGateFailData(attempt, contentId)` — names consistent across tasks. ✅

**Note for executor:** `position` is included on `section_view` (DOM index) and is available on `impression`; if you later add card position to `project-card`/`story-card`, thread it through `useImpression`. Out of scope here.
</content>
