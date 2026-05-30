# Stories Pages — Design Spec

**Date:** 2026-05-29
**Scope:** `/stories` index page + `/stories/prism` detail page

---

## Overview

A set of private, interview-focused pages that let Antwan walk an interviewer through initiative deep-dives (2–3 min each). Not linked from the site nav. Not indexed by search engines or bots. Accessible only via direct URL.

First initiative: **PRISM** at Flink (Pricing & Promotions Platform, Apr 2023 – Nov 2025).

---

## Routing & Privacy

- Route group: `src/app/(stories)/` — groups all stories pages under a shared layout with no URL segment impact
- Shared layout at `src/app/(stories)/layout.tsx` exports `metadata.robots = { index: false, follow: false }` — applies to all pages in the group without per-page repetition
- Excluded from `sitemap.ts` if one exists (or left out if not)
- No navigation links anywhere on the site pointing to `/stories`
- URLs: `/stories` (index), `/stories/prism` (detail)

---

## Data Layer

New file: `src/data/stories.tsx`

Typed TypeScript objects — no MDX. Schema:

```ts
type Metric = { value: string; label: string }
type TechTag = string
type FlowStep = { label: string; sublabel?: string }
type Feature = { name: string; description: string }
type StarStory = { situation: string; task: string; action: string; result: string }

type Story = {
  slug: string
  company: string
  role: string
  period: string
  initiative: string
  tagline: string           // one narrative sentence for card + hero
  metrics: Metric[]         // 4 metrics total (2×2 grid on detail, 2 shown on card)
  techTags: TechTag[]
  problem: string           // prose paragraph
  architectureFlow: FlowStep[]
  features: Feature[]
  bulkUploadFlow: FlowStep[]
  challenges: string[]
  star: StarStory
}

export const stories: Story[] = [...]
```

---

## `/stories` Index Page

**File:** `src/app/(stories)/stories/page.tsx`

**Layout:** Page heading ("Stories") + subtitle, then a responsive grid of initiative cards. Max-width 816px, matching the rest of the portfolio.

**Card anatomy** (one per initiative):
- Eyebrow: Company · Role · Period
- Headline: Initiative name
- Narrative: `story.tagline` — one punchy sentence in the user's voice
- Metrics: first 2 entries from `story.metrics` as accent-colored callout chips
- Tech tags: `story.techTags` as small grey chips
- Spotlight hover effect: reuses the cursor-tracked glow pattern from `project-card.tsx`
- Full card is a link to `/stories/[slug]`

**Animations:** `BlurFade` entrance with `BLUR_FADE_DELAY = 0.04` stagger, matching homepage sections.

---

## `/stories/prism` Detail Page

**File:** `src/app/(stories)/stories/[slug]/page.tsx` (dynamic route, resolves via `stories.find(s => s.slug === params.slug)`)

**Max-width:** 816px. Four sections, scrolling vertically.

### Section 1 — Hero
- Back link: `← Stories` (top-left, subtle)
- Eyebrow: Company · Role · Period
- Display headline: Initiative name
- Ownership sentence: `story.tagline`
- 2×2 metric grid: all 4 metrics with value (large, indigo accent) + label

### Section 2 — Problem & Architecture
- Subsection heading: "The Problem"
- Prose: `story.problem`
- Subsection heading: "Architecture"
- Flow chain: `story.architectureFlow` rendered as horizontal chips connected by `→` arrows (e.g. React/Next.js → tRPC BFF → Backend Microservices). Wraps gracefully on narrow viewports.

### Section 3 — Features
- Section heading: "What We Built"
- Feature grid: `story.features` as cards (name + description). Responsive 2-col grid.
- Bulk Upload deep-dive: dedicated callout block with `story.bulkUploadFlow` rendered as a flow chain (CSV Upload → Validation → Queue → Promotions Engine)

### Section 4 — Challenges & STAR
- Section heading: "Challenges"
- Bullet list: `story.challenges`
- Section heading: "A Story" (or "STAR Story")
- STAR block: each field (Situation / Task / Action / Result) labeled and rendered as a structured prose block

**Animations:** `BlurFade` per section, same stagger pattern.

---

## Build Order & Commits

**Commit 1:** `src/data/stories.tsx` + `src/app/(stories)/layout.tsx` + `src/app/(stories)/stories/page.tsx` + card component. User reviews before proceeding.

**Commit 2:** `src/app/(stories)/stories/[slug]/page.tsx` + any detail-specific sub-components.

Spec + plan committed together before any implementation begins.
