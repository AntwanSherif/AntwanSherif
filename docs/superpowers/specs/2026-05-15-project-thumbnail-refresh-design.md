# Project Thumbnail Refresh — Design

**Date:** 2026-05-15
**Status:** Approved (Phases 1–3). Phase 4 (micro-animations) deferred to its own spec.

## Summary

Replace four project-card thumbnail SVGs with iterated versions from Claude
Design, give three flat-black cards a subtle tinted background for visual
parity with the already-tinted cards, and add an "In Progress" badge to the
Insta Super Edit card. All thumbnails remain React Server Components.

Sources live in `~/Downloads/Antwan Sherif Portfolio/`:
- `thumb-revised2.jsx` — `Rev2_DINNEY`, `Rev2_ELMAWKAA`, `Rev2_21FARMER`, `Rev_ISE_Mercury`
- `uploads/freddie-nobg.png` — embedded photo for Insta Super Edit

Targets: `AntwanSherif/src/components/project-thumbnails/*.tsx`.

## Context

`THUMBNAIL_MAP` in `src/components/project-thumbnails/index.tsx` maps project
title → thumbnail component; `projects-section.tsx` passes it as
`thumbnailSlot` into `ProjectCard`. Of the six thumbnails:

- **Haktiv** and **12AM Thoughts** are already byte-identical to their
  requested "after" versions (`Rev_HAKTIV` / `Rev_12AM`). Their artwork is
  **not** changed (Haktiv's background is changed in Phase 1).
- **Dinney, ElMawkaa, 21Farmer, Insta Super Edit** are replaced.

Three cards (Insta Super Edit `#08000e`, 12AM `#06061a`, 21Farmer `#040e04`)
already sit on tinted near-blacks that lift the art off the `#0a0a0f` card
surface. Haktiv, ElMawkaa, Dinney are flat `#0A0A0F` and visually merge with
the card. The selected fix is a uniform cool slate `#0c0d14`.

## Phase 1 — Colored backgrounds (standalone commit)

Change the background `<rect width="400" height="200" fill="#0A0A0F" />` to
`fill="#0c0d14"` in the **current** components:

- `haktiv.tsx` — change the solid background rect only; keep the
  `url(#rev-h-glow)` overlay rect and all artwork unchanged.
- `elmawkaa.tsx` — change background rect to `#0c0d14`.
- `dinney.tsx` — change background rect to `#0c0d14`.

This is one reviewable commit. Phase 2 replaces ElMawkaa/Dinney artwork but
keeps `#0c0d14`, so the color is decided once and never regresses.

## Phase 2 — SVG replacement + cleanup

Replace these components from `thumb-revised2.jsx`:

| Target file | Source function |
| --- | --- |
| `dinney.tsx` | `Rev2_DINNEY` |
| `elmawkaa.tsx` | `Rev2_ELMAWKAA` |
| `twenty-one-farmer.tsx` | `Rev2_21FARMER` |
| `insta-super-edit.tsx` | `Rev_ISE_Mercury` (+ module-local `IGPost`) |

**Haktiv and 12AM are not touched in this phase.** `index.tsx` and
`THUMBNAIL_MAP` are unchanged (export names stay `DinneyThumbnail`,
`ElmawkaaThumbnail`, `TwentyOneFarmerThumbnail`, `InstaSuperEditThumbnail`).

### Conversion rules (per component)

1. `function Rev2_X()` → `export function XThumbnail()`; drop the
   `Object.assign(window, …)` block and any `window.__resources` reference.
2. `<svg … style={{width:'100%',height:'100%',display:'block'}}>` →
   `<svg … className="w-full h-full block">`. This satisfies the
   "inline styles → Tailwind" requirement. SVG presentation attributes
   (`fill`, `stroke`, `strokeWidth`, computed `width={…}`) stay as
   attributes — they are not inline styles and many are dynamic.
3. `<RevDG2 />` / `<RevDG />` → `import { DotGrid } from './dot-grid'` and
   render `<DotGrid />`. The inline helpers are byte-identical to the
   existing `DotGrid`; no duplicate helper is created.
4. Rename `<defs>` IDs to semantic per-project names and update every
   in-component reference:
   - Insta Super Edit: `ise3-glow` → `ise-glow`, `ise3-sh` → `ise-shadow`
   - 21Farmer: `r3f-glow` → `farmer-glow`, `r3f-sh` → `farmer-shadow`
   - ElMawkaa: `r3-glass` → `elmawkaa-glass`, `r3-brick` → `elmawkaa-brick`
   - Dinney: no `defs`
   21Farmer's SMIL `<animate>` on the live-status dot is preserved as-is.
5. Background rect fill: **Dinney and ElMawkaa use `#0c0d14`** (carry the
   Phase 1 color into the new artwork). **21Farmer keeps `#040e04`** and
   **Insta Super Edit keeps `#08000e`** — both are already tinted and are
   not part of the background-change set.

### Insta Super Edit photo

`Rev_ISE_Mercury` embeds the photo via an inline SVG
`<image href={window.__resources?.freddiePng || 'uploads/freddie-nobg.png'} …>`.

- Copy `~/Downloads/Antwan Sherif Portfolio/uploads/freddie-nobg.png` to
  `AntwanSherif/public/thumbnails/freddie-nobg.png`.
- Replace the `href` with a static root-absolute path:
  `href="/thumbnails/freddie-nobg.png"`.

**RSC verdict:** an inline SVG `<image>` is static markup and renders cleanly
in a React Server Component — no `next/image`, no `'use client'`, no
workaround. (`next/image` cannot be used inside `<svg>` regardless.) The
public asset URL resolves normally in the page render.

## Phase 3 — Insta Super Edit "In Progress" badge

- In `src/data/resume.tsx`: add an optional `status?: 'in-progress'` field to
  the project shape and set `status: 'in-progress'` on the Insta Super Edit
  entry. Do **not** repurpose the existing unused `active` boolean. Do **not**
  use the `links` array (the card filters out link badges with empty `href`,
  and this is a status, not a link).
- Thread the field through `projects-section.tsx` → `ProjectCard` props.
- In `src/components/project-card.tsx`: when `status === 'in-progress'`,
  render a **non-link** `Badge` inside the existing
  `absolute top-2 right-2` overlay container — same component, position, and
  shape as the "Acquired by Ayen" pill, but gold instead of black:
  `bg-[#F0C542] text-black` with the label `In Progress`. It must render
  independently of `href`/`links` and coexist with any link badges (Insta
  Super Edit has no links, so no collision today).

Color rationale: gold (`#F0C542`) is the design system's highlight accent;
violet (`#7c3aed`) is reserved for the AI-tools badge, so it is avoided to
prevent a semantic clash.

## Out of scope / deferred

- **Phase 4 — micro-animations.** Subtle CSS-keyframe animations layered onto
  the SVGs (e.g. 12AM moon glow, ElMawkaa dashed connectors, Insta Super Edit
  Freddie sway + arrows). Pure CSS keyframes only (SVG stays RSC), must
  respect `prefers-reduced-motion`, and must not alter original SVG geometry.
  This gets its own brainstorm round (multiple versions per project shown in
  the visual companion) and its own spec/plan.
- Pushing SVG presentation attributes into Tailwind classes (rejected:
  verbose, breaks on dynamic values, no rendering benefit).
- Any change to Haktiv or 12AM Thoughts artwork.

## Verification

- `pnpm build` compiles with no type or lint errors.
- All six thumbnails render in the projects grid.
- `public/thumbnails/freddie-nobg.png` resolves (Freddie photo visible in the
  Insta Super Edit thumbnail).
- Dinney, ElMawkaa, Haktiv show the `#0c0d14` background; 21Farmer/ISE/12AM
  unchanged backgrounds.
- The "In Progress" gold badge appears on the Insta Super Edit card only.

## Commit plan

1. Phase 1 — background color on the three current components.
2. Phase 2 — replacement + photo + cleanup (group logically; the photo asset
   may be its own commit).
3. Phase 3 — data field + ProjectCard badge.
