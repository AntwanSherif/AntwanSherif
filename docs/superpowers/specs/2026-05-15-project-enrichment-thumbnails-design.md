# Project Enrichment & Thumbnail Integration

**Date:** 2026-05-15  
**Status:** Approved

---

## Overview

Two parallel improvements to the Projects section of the portfolio:

1. Enrich descriptions for ElMawkaa, Haktiv, and 21Farmer with researched metrics, acquisition outcomes, and accurate context.
2. Integrate Claude Design SVG thumbnail components into each project card using the RSC donut pattern — zero extra HTTP requests, server-rendered, no rasterization.

---

## Part 1 — Project Description Updates

All changes are in `src/data/resume.tsx`.

### ElMawkaa

**`href`:** Update from `''` to `'https://www.wamda.com/2024/10/ayen-acquires-elmawkaa-seven-figure-deal'` (acquisition announcement; original domain is dead).

**`description`:**
```
Egyptian ConTech B2B marketplace — connecting contractors, engineers, and property owners with vetted building material suppliers across MENA. Replaced fragmented, phone-based procurement with a matching algorithm that surfaces competing supplier bids within minutes.

**Acquired by Ayen** (Saudi PropTech leader) in an SAR seven-figure deal (Oct 2024). Traction: **65K app downloads**, **90K unique website visits**, **+20% MoM GMV growth**, **1.3K+ suppliers** and **8K+ contractors** onboarded.
```

**`links`:** Add one entry:
```ts
{ type: 'Acquired by Ayen', href: 'https://www.wamda.com/2024/10/ayen-acquires-elmawkaa-seven-figure-deal', icon: <Icons.globe className="size-3" /> }
```

---

### Haktiv

**`href`:** Update from `'https://haktiv.com'` to `'https://www.haktiv.ai'`.

**`description`:**
```
First bug bounty and crowdsourced penetration testing platform in the Middle East and Africa — a marketplace connecting tech companies with vetted security researchers to responsibly disclose vulnerabilities.

The company has since rebranded as **Haktiv AI**, pivoting to AI-powered GRC compliance automation, now backed by Microsoft, Misk, and Plug and Play.
```

**`links`:** Update existing Website link `href` from `'https://haktiv.com'` to `'https://www.haktiv.ai'`.

---

### 21Farmer

**`href`:** Leave as `''` (site is down, no canonical redirect available).

**`description`:**
```
Cloud-based precision agriculture platform — combining IoT sensor hardware with a web dashboard for real-time soil health monitoring, automated irrigation control, and multi-plot field tracking via interactive map visualizations.
```

---

## Part 2 — Thumbnail Integration

### Architecture: RSC Donut Pattern

`ProjectsSection` is a Server Component. `ProjectCard` is a Client Component (requires `useRef`, `onMouseMove`). Thumbnail SVGs are pure components (no hooks, no browser APIs) — they are server-rendered and passed into the client card as already-hydrated markup via a new `thumbnailSlot` prop.

```
ProjectsSection (Server Component)
  └── ProjectCard (Client Component)
        └── thumbnailSlot — server-rendered SVG, passed as React.ReactNode
```

No client JS is shipped for thumbnail rendering. The SVG `<animate>` in 21Farmer is SVG-native and works without JS.

---

### New files: `src/components/project-thumbnails/`

| File | Contents |
|------|----------|
| `dot-grid.tsx` | Shared `DotGrid` component (shared background used by all cards) |
| `haktiv.tsx` | `HaktivThumbnail` — dark bg, gold trophy, leaderboard table |
| `elmawkaa.tsx` | `ElmawkaaThumbnail` — building + 4 material sample cards |
| `twenty-one-farmer.tsx` | `TwentyOneFarmerThumbnail` — soil cross-section, IoT sensors, animated pulse |
| `dinney.tsx` | `DinneyThumbnail` — floor plan, calendar, reservation UI |
| `twelve-am.tsx` | `TwelveAmThumbnail` — stars, crescent moon, journal card |
| `insta-super-edit.tsx` | `InstaSuperEditThumbnail` — concert stage, AI box, phone mockups |
| `index.ts` | Barrel export + `THUMBNAIL_MAP` |

All components are ported directly from `thumb-revised.jsx` (from the Claude Design export). Each is a pure function returning an `<svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>`. No props needed.

**`index.ts` shape:**
```ts
import { HaktivThumbnail } from './haktiv'
// ... other imports

export const THUMBNAIL_MAP: Record<string, React.ReactNode> = {
  'HAKTIV': <HaktivThumbnail />,
  'ElMawkaa': <ElmawkaaThumbnail />,
  '21Farmer': <TwentyOneFarmerThumbnail />,
  'Dinney': <DinneyThumbnail />,
  '12AM Thoughts': <TwelveAmThumbnail />,
  'Insta Super Edit': <InstaSupEditThumbnail />,
}
```

---

### `ProjectCard` changes (`src/components/project-card.tsx`)

Add one prop to the `Props` interface:
```ts
thumbnailSlot?: React.ReactNode
```

Update the image slot render priority:
```
thumbnailSlot → video → image (string) → muted placeholder
```

Concretely, replace the existing image slot block with:
```tsx
{video ? (
  <video ... />
) : thumbnailSlot ? (
  <div className="w-full h-48 overflow-hidden">{thumbnailSlot}</div>
) : image ? (
  <ProjectImage src={image} alt={title} />
) : (
  <div className="w-full h-48 bg-muted" />
)}
```

---

### `projects-section.tsx` changes

Import `THUMBNAIL_MAP` from `@/components/project-thumbnails`. Pass `thumbnailSlot` to each `ProjectCard`:

```tsx
import { THUMBNAIL_MAP } from '@/components/project-thumbnails'

// inside the card render:
<ProjectCard
  ...
  thumbnailSlot={THUMBNAIL_MAP[project.title]}
/>
```

No changes to `resume.tsx` data shape — the thumbnail mapping is a rendering concern.

---

## What is NOT changing

- `resume.tsx` data shape (no new fields added)
- `ProjectCard` client boundary (stays `'use client'`)
- Any other section (Work, Skills, Talks, etc.)
- Existing `image` and `video` props on `ProjectCard` (still supported as fallback)

---

## Files changed

| File | Change |
|------|--------|
| `src/data/resume.tsx` | Description + href + links updates for 3 projects |
| `src/components/project-card.tsx` | Add `thumbnailSlot` prop, update image slot render logic |
| `src/components/section/projects-section.tsx` | Import `THUMBNAIL_MAP`, pass `thumbnailSlot` per card |
| `src/components/project-thumbnails/dot-grid.tsx` | New — shared dot grid SVG helper |
| `src/components/project-thumbnails/haktiv.tsx` | New — Haktiv SVG thumbnail |
| `src/components/project-thumbnails/elmawkaa.tsx` | New — ElMawkaa SVG thumbnail |
| `src/components/project-thumbnails/twenty-one-farmer.tsx` | New — 21Farmer SVG thumbnail |
| `src/components/project-thumbnails/dinney.tsx` | New — Dinney SVG thumbnail |
| `src/components/project-thumbnails/twelve-am.tsx` | New — 12AM Thoughts SVG thumbnail |
| `src/components/project-thumbnails/insta-super-edit.tsx` | New — Insta Super Edit SVG thumbnail |
| `src/components/project-thumbnails/index.ts` | New — barrel export + THUMBNAIL_MAP |
