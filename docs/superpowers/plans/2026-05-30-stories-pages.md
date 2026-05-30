# Stories Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build private, noindex `/stories` index and `/stories/prism` detail pages in the portfolio — interview-only initiative deep-dives, accessible by direct URL only.

**Architecture:** Route group `src/app/(stories)/` with a shared layout that applies `robots: noindex` to every page in the group. Index page renders `StoryCard` components from `src/data/stories.tsx`. Detail page is a dynamic `[slug]` route that looks up the story by slug.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, BlurFade (motion/react), spotlight hover (existing CSS classes + `--mx`/`--my` pattern from `project-card.tsx`)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/data/stories.tsx` | Create | Types + PRISM data (single source of truth) |
| `src/app/(stories)/layout.tsx` | Create | Shared noindex metadata for all `/stories/*` pages |
| `src/components/story-card.tsx` | Create | Spotlight card for the index grid (`'use client'`) |
| `src/app/(stories)/stories/page.tsx` | Create | `/stories` index — grid of initiative cards |
| `src/app/(stories)/stories/[slug]/page.tsx` | Create | `/stories/prism` detail — 4-section deep dive |
| `src/components/flow-chain.tsx` | Create | Reusable flow-step chip renderer (used twice in detail) |

---

## ── COMMIT 1: Index page + PRISM card ──────────────────────────────

### Task 1: Data layer — `src/data/stories.tsx`

**Files:**
- Create: `src/data/stories.tsx`

- [ ] **Step 1: Create the file with types and PRISM data**

```ts
export type Metric = { value: string; label: string };
export type FlowStep = { label: string; sublabel?: string };
export type Feature = { name: string; description: string };
export type StarStory = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

export type Story = {
  slug: string;
  company: string;
  role: string;
  period: string;
  initiative: string;
  tagline: string;
  metrics: Metric[];
  techTags: string[];
  problem: string;
  architectureFlow: FlowStep[];
  features: Feature[];
  bulkUploadFlow: FlowStep[];
  challenges: string[];
  star: StarStory;
};

export const stories: Story[] = [
  {
    slug: "prism",
    company: "Flink",
    role: "Senior Software Engineer",
    period: "Apr 2023 – Nov 2025",
    initiative: "PRISM",
    tagline:
      "Replaced a 2-day ops cycle with a 2-hour self-serve workflow handling 500K–1M+ promotions per day.",
    metrics: [
      { value: "2d → ~2hr", label: "deploy time" },
      { value: "500K–1M+", label: "promotions/day" },
      { value: "0", label: "backend changes required" },
      { value: "12-field cap", label: "bypassed via bulk upload" },
    ],
    techTags: ["React", "Next.js", "tRPC", "TypeScript", "TanStack Query", "Playwright"],
    problem:
      "Flink's commercial team managed pricing and promotions through a fragmented mix of manual backend configurations and spreadsheets. Each deployment required engineering involvement and took up to 2 days — at a scale of 500K–1M+ promotions per day, this was a serious operational bottleneck. A hardcoded 12-field cap in the original schema made bulk campaigns impossible without direct backend intervention.",
    architectureFlow: [
      { label: "React / Next.js", sublabel: "Internal Backoffice" },
      { label: "tRPC BFF", sublabel: "Type-safe API layer" },
      { label: "Backend Microservices", sublabel: "Pricing & Promotions" },
    ],
    features: [
      {
        name: "Bulk Upload",
        description:
          "CSV-based mass promotion creation, bypassing the 12-field cap via a dedicated upload pipeline.",
      },
      {
        name: "Segment Promotions",
        description:
          "Targeted promotions scoped to specific customer segments. Drove +12% add-to-cart conversion.",
      },
      {
        name: "Segment Pricing",
        description:
          "Dynamic pricing rules per customer segment, enabling personalised offers at scale.",
      },
      {
        name: "Maximum Discount Quantity",
        description:
          "Per-promotion cap on discounted units. Drove +5% AOV by preventing margin abuse.",
      },
      {
        name: "Bulk Actions",
        description:
          "Multi-select operations (activate, pause, delete) across the promotions table.",
      },
      {
        name: "URL State",
        description:
          "Filter and pagination state persisted in the URL — enabling shareable, deep-linkable views.",
      },
      {
        name: "Subscriptions Management",
        description:
          "In-housed subscription tier management, removing dependency on a third-party vendor.",
      },
      {
        name: "Delivery Fees",
        description: "Configurable delivery fee rules per market and customer segment.",
      },
      {
        name: "Event Logs",
        description:
          "Immutable audit trail of all promotion changes — who changed what and when.",
      },
      {
        name: "Role Access Control",
        description:
          "Granular permission system scoping backoffice actions by team and region.",
      },
    ],
    bulkUploadFlow: [
      { label: "CSV Upload" },
      { label: "Validation" },
      { label: "Queue" },
      { label: "Promotions Engine" },
    ],
    challenges: [
      "Schema migration — extending the original 12-field promotion schema without breaking existing promotions or downstream consumers.",
      "Type safety across the BFF boundary — keeping the tRPC contract in sync as the backend team iterated on their APIs.",
      "Bulk upload reliability — CSV imports at 1M+ row scale needed idempotent processing, progress feedback, and graceful failure recovery.",
      "Multi-market edge cases — pricing rules behaved differently across DE, NL, and FR due to tax, currency, and regional campaign policies.",
      "Operational trust — the commercial team needed confidence that a self-serve change wouldn't silently break live promotions at scale.",
    ],
    star: {
      situation:
        "Flink's commercial team was spending up to 2 days per promotion deployment, relying on backend engineers for every configuration change. At 500K–1M+ promotions per day, this was costing real revenue and engineering capacity.",
      task: "I was asked to own the Pricing & Promotions backoffice end-to-end — from architecture to delivery — as the solo frontend lead working closely with backend engineers and the commercial product team.",
      action:
        "I designed a tRPC BFF layer to abstract the backend microservices, built a type-safe self-serve backoffice in React/Next.js, and introduced a bulk upload pipeline that bypassed the original 12-field schema cap. I shipped 10+ features across pricing, promotions, subscriptions, and delivery fee management.",
      result:
        "Deployment time dropped from ~2 days to ~2 hours. The commercial team became fully self-serve, handling 500K–1M+ promotions per day without engineering involvement. Segment Promotions drove +12% add-to-cart and Range Promotions drove +18% AOV.",
    },
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif
pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no errors from `src/data/stories.tsx`

---

### Task 2: Route group layout — `src/app/(stories)/layout.tsx`

**Files:**
- Create: `src/app/(stories)/layout.tsx`

- [ ] **Step 1: Create the layout**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

> This layout adds zero visual structure — it exists purely to inject the noindex metadata into every route under `(stories)/` without repeating it per page.

---

### Task 3: Story card component — `src/components/story-card.tsx`

**Files:**
- Create: `src/components/story-card.tsx`

- [ ] **Step 1: Create the client component**

```tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import type { Story } from "@/data/stories";

interface StoryCardProps {
  story: Story;
  className?: string;
}

export function StoryCard({ story, className }: StoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - left}px`);
    el.style.setProperty("--my", `${e.clientY - top}px`);
  };

  return (
    <Link href={`/stories/${story.slug}`} className="block h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative flex flex-col h-full border border-border rounded-xl overflow-hidden cursor-pointer bg-card",
          className
        )}
      >
        {/* Spotlight overlays */}
        <div className="spotlight-fill pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />
        <div className="spotlight-border pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />

        <div className="p-6 flex flex-col gap-4 flex-1">
          {/* Eyebrow */}
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {story.company} · {story.role} · {story.period}
          </p>

          {/* Initiative name */}
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {story.initiative}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {story.tagline}
          </p>

          {/* Top 2 metrics */}
          <div className="grid grid-cols-2 gap-2">
            {story.metrics.slice(0, 2).map((m) => (
              <div
                key={m.label}
                className="rounded-lg px-3 py-2 text-center"
                style={{
                  background: "rgb(from var(--accent-ai) r g b / 0.1)",
                  border: "1px solid rgb(from var(--accent-ai) r g b / 0.25)",
                }}
              >
                <div
                  className="text-base font-bold"
                  style={{ color: "var(--accent-ai)" }}
                >
                  {m.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tech tags */}
          {story.techTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {story.techTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium border border-border rounded-md px-2 h-6 inline-flex items-center text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no new errors

---

### Task 4: Index page — `src/app/(stories)/stories/page.tsx`

**Files:**
- Create: `src/app/(stories)/stories/page.tsx`

> Note: The route group folder is `(stories)` but the URL segment comes from the `stories` folder inside it. The final URL is `/stories`.

- [ ] **Step 1: Create the index page**

```tsx
import BlurFade from "@/components/magicui/blur-fade";
import { StoryCard } from "@/components/story-card";
import { stories } from "@/data/stories";

const BLUR_FADE_DELAY = 0.04;

export default function StoriesPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] gap-14 py-12">
      <section>
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-section font-semibold tracking-tight text-foreground">
            Stories
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">
            Initiative deep-dives — the problems I owned, how I approached them,
            and what shipped.
          </p>
        </BlurFade>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((story, i) => (
            <BlurFade key={story.slug} delay={BLUR_FADE_DELAY * (3 + i)}>
              <StoryCard story={story} className="h-full" />
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no new errors

---

### Task 5: Smoke-test commit 1

- [ ] **Step 1: Start the dev server and verify the page loads**

```bash
pnpm dev
```

Open `http://localhost:3000/stories` in a browser.

Expected:
- Page loads with "Stories" heading and the PRISM card
- Card shows eyebrow (Flink · Senior Software Engineer · Apr 2023 – Nov 2025), "PRISM" headline, tagline, 2 metric chips, tech tags
- Spotlight glow tracks the cursor on hover
- `/stories/prism` link resolves (404 is expected for now — detail page not yet built)

- [ ] **Step 2: Commit**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif
git add src/data/stories.tsx src/app/\(stories\)/layout.tsx src/components/story-card.tsx src/app/\(stories\)/stories/page.tsx docs/superpowers/specs/2026-05-29-stories-pages-design.md docs/superpowers/plans/2026-05-30-stories-pages.md
git commit -m "feat: /stories index page + PRISM card — spec, plan + implementation"
```

---

## ── USER REVIEW GATE ─────────────────────────────────────────────────
##
## STOP HERE. Show Antwan http://localhost:3000/stories and ask:
## "Does the index page and card look right? Any changes before I build
## the PRISM detail page?"
##
## Only proceed to Commit 2 after explicit approval.
##
## ─────────────────────────────────────────────────────────────────────

---

## ── COMMIT 2: PRISM detail page ──────────────────────────────────────

### Task 6: Flow chain component — `src/components/flow-chain.tsx`

**Files:**
- Create: `src/components/flow-chain.tsx`

Used in two places on the detail page: the architecture diagram and the bulk upload pipeline.

- [ ] **Step 1: Create the component**

```tsx
import type { FlowStep } from "@/data/stories";

interface FlowChainProps {
  steps: FlowStep[];
}

export function FlowChain({ steps }: FlowChainProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-center">
            <div className="text-sm font-medium text-foreground">{step.label}</div>
            {step.sublabel && (
              <div className="text-[10px] text-muted-foreground mt-0.5">{step.sublabel}</div>
            )}
          </div>
          {i < steps.length - 1 && (
            <span className="text-muted-foreground text-sm select-none">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

### Task 7: Detail page — `src/app/(stories)/stories/[slug]/page.tsx`

**Files:**
- Create: `src/app/(stories)/stories/[slug]/page.tsx`

- [ ] **Step 1: Create the detail page**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { FlowChain } from "@/components/flow-chain";
import { stories } from "@/data/stories";

const BLUR_FADE_DELAY = 0.04;

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <main className="flex flex-col min-h-[100dvh] gap-16 py-12">
      {/* ── Section 1: Hero ─────────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <Link
            href="/stories"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Stories
          </Link>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {story.company} · {story.role} · {story.period}
          </p>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h1 className="text-heading font-semibold tracking-tight text-foreground">
            {story.initiative}
          </h1>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <p className="text-lead text-muted-foreground max-w-prose">
            {story.tagline}
          </p>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {story.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  background: "rgb(from var(--accent-ai) r g b / 0.1)",
                  border: "1px solid rgb(from var(--accent-ai) r g b / 0.25)",
                }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: "var(--accent-ai)" }}
                >
                  {m.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ── Section 2: Problem & Architecture ───────────────────── */}
      <section className="flex flex-col gap-6">
        <BlurFade delay={BLUR_FADE_DELAY * 6} inView>
          <h2 className="text-section font-semibold tracking-tight text-foreground">
            The Problem
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-prose">
            {story.problem}
          </p>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 7} inView>
          <h2 className="text-section font-semibold tracking-tight text-foreground">
            Architecture
          </h2>
          <div className="mt-4">
            <FlowChain steps={story.architectureFlow} />
          </div>
        </BlurFade>
      </section>

      {/* ── Section 3: Features ─────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <BlurFade delay={BLUR_FADE_DELAY * 8} inView>
          <h2 className="text-section font-semibold tracking-tight text-foreground">
            What We Built
          </h2>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {story.features.map((feature, i) => (
            <BlurFade key={feature.name} delay={BLUR_FADE_DELAY * (9 + i)} inView>
              <div className="rounded-xl border border-border bg-card p-4 h-full">
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Bulk Upload deep-dive */}
        <BlurFade delay={BLUR_FADE_DELAY * 20} inView>
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Bulk Upload — Pipeline
            </h3>
            <FlowChain steps={story.bulkUploadFlow} />
          </div>
        </BlurFade>
      </section>

      {/* ── Section 4: Challenges & STAR ────────────────────────── */}
      <section className="flex flex-col gap-8">
        <BlurFade delay={BLUR_FADE_DELAY * 21} inView>
          <h2 className="text-section font-semibold tracking-tight text-foreground">
            Challenges
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {story.challenges.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-1 shrink-0 text-muted-foreground/40">—</span>
                {c}
              </li>
            ))}
          </ul>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 22} inView>
          <h2 className="text-section font-semibold tracking-tight text-foreground">
            A Story
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {(
              [
                { label: "Situation", value: story.star.situation },
                { label: "Task", value: story.star.task },
                { label: "Action", value: story.star.action },
                { label: "Result", value: story.star.result },
              ] as const
            ).map((item) => (
              <div key={item.label} className="flex gap-4">
                <div
                  className="shrink-0 w-20 text-xs font-semibold uppercase tracking-wider pt-0.5"
                  style={{ color: "var(--accent-ai)" }}
                >
                  {item.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | head -20
```

Expected: no errors

---

### Task 8: Smoke-test and commit 2

- [ ] **Step 1: Verify the detail page in the browser**

Open `http://localhost:3000/stories/prism`.

Expected:
- All 4 sections render: Hero (metrics 2×4 grid), Problem & Architecture (flow chain), Features (10-card grid + bulk upload pipeline), Challenges & STAR
- `← Stories` back link navigates to `/stories`
- BlurFade entrance animations play on scroll
- Violet (`--accent-ai`) accent on metrics and STAR labels

- [ ] **Step 2: Commit**

```bash
git add src/app/\(stories\)/stories/\[slug\]/page.tsx src/components/flow-chain.tsx
git commit -m "feat: /stories/prism detail page"
```

---

## Post-build checks

- [ ] Confirm `/stories` and `/stories/prism` both return `X-Robots-Tag: noindex` (check Network tab in DevTools or run `curl -I http://localhost:3000/stories | grep -i robot`)
- [ ] Confirm neither route appears in `sitemap.xml` if one exists (`http://localhost:3000/sitemap.xml`)
- [ ] Confirm no nav link on the homepage or layout points to `/stories`
