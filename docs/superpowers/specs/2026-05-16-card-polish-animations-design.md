# Project Cards Polish — Wider Cards + Thumbnail Micro-Animations

**Date:** 2026-05-16
**Status:** Approved (all decisions locked via interactive visual review).
**Branch:** `card-polish-animations`

## Summary

Two related improvements to the projects section:

1. **Wider cards (A).** The 2-column grid is widened and the thumbnail container
   switches from a fixed height to a 2:1 aspect box so the 2:1 SVGs always fill
   edge-to-edge (no crop, no letterbox) and long descriptions wrap shorter.
2. **Always-on micro-animations** on all six project thumbnails, implemented as
   pure CSS keyframes (SVGs stay React Server Components), additive
   (transform/opacity only — original geometry never altered), and disabled
   under `prefers-reduced-motion: reduce`.

One pre-existing thumbnail bug is fixed as part of this work (12AM moon).

## Phase A — Wider cards

- **Layout width (revised after live review):** the root container in
  `src/app/layout.tsx` was the bottleneck — `max-w-2xl` (~672px) clamped
  *every* section, so widening only the projects grid did nothing and a
  per-section breakout looked inconsistent. Final decision: widen the global
  container to `max-w-[816px]` (≈768px content after `px-6`) so ALL sections
  share one uniform width, and set the projects grid to `w-full` (fills the
  container, no separate `max-w` cap). Net project cards ≈378px — meaningfully
  wider than the original ~306px, consistent with every other section.
- (Superseded: the earlier `max-w-200`→`max-w-280` grid-only tweak — the grid
  cap is irrelevant once the container governs width uniformly.)
- `src/components/project-card.tsx`: the three thumbnail containers
  `w-full h-48 overflow-hidden` (and the two `bg-muted` fallbacks and
  `ProjectImage`/`video` branches) change the fixed `h-48` to an aspect box
  `aspect-[2/1]` (keep `w-full overflow-hidden`; raster `<img>`/`<video>`
  keep `object-cover`). Net: SVG thumbnails fill exactly (2:1 == 2:1), no
  cropping or letterboxing, just rendered larger (~277px tall at A width).
- No other layout changes. This is its own commit.

## Animation architecture

- All keyframes/classes live in `src/app/globals.css`, replacing the current
  orphaned `@keyframes sensor-pulse` / `.sensor-pulse` block (lines ~324–337)
  with a consolidated "Thumbnail animations" section.
- Classes are applied to SVG elements in the components via `className`
  (plain global CSS classes — consistent with existing `.spotlight-*`
  pattern; **no inline styles**, no Tailwind utilities for these).
- **Transform-clobber rule (critical):** never put a CSS-transform animation
  on an element that already has an SVG `transform="…"` attribute — the CSS
  transform replaces it and the element jumps to the origin (this was the
  Haktiv corner-jump bug). Always wrap: keep the positioned outer `<g
  transform=…>` untouched and add an **inner** `<g className="…">` that
  receives the animation, with `transform-box: fill-box` and an appropriate
  `transform-origin`.
- Stagger via `:nth-child`/modifier classes in CSS — never inline
  `animation-delay`.
- Single `@media (prefers-reduced-motion: reduce)` rule sets
  `animation: none !important` on every animation class.
- All motion is opacity / transform (scale, translate, rotate) or
  `stroke-dashoffset` only.

## Per-thumbnail specs

### 12AM Thoughts — `twelve-am.tsx`

**Bug-fix (required):** the crescent is currently faked with an opaque
background-coloured circle (`<circle … r="54" … fill="#06061a" />`) painted
over a full white disc. Replace it with real SVG masks:

- `mask#moon-body`: `<circle cx=290 cy=92 r=60 fill="#fff"/>` then
  `<circle cx=308 cy=80 r=54 fill="#000"/>`. Apply to a group wrapping the
  moon body + the three crater circles. Delete the `#06061a` circle.
- `mask#moon-glow`: `<circle cx=290 cy=92 r=66 fill="#fff"/><circle cx=308
  cy=80 r=54 fill="#000"/>`. The glow becomes a **crescent**: nest the blur
  filter *outside* the mask — `<g class="thumb-moonglow" filter="url(#rev-12-glow)"><g
  mask="url(#moon-glow)"><circle cx=290 cy=92 r=66 fill="rgba(200,200,240,0.5)"/></g></g>`
  (the old full glow circle is removed). `rev-12-glow` gets an enlarged
  filter region (`x=-50% y=-50% width=200% height=200%`).

**Animation (V2, no halo ring):**
- Wrap the whole moon assembly (glow group + masked body group) in
  `<g class="thumb-moon">` → `moonBreath` scale 1→1.03 (5s).
- `.thumb-moonglow` → `moonGlow` opacity .45→1 (4s).
- Wrap the 17 star circles in `<g class="thumb-stars">`; each `<circle>`
  gets `moonStar` opacity .25→.95 (3s), staggered with
  `.thumb-stars circle:nth-child(2n|3n)` delays.
- No halo/expanding ring.

### ElMawkaa — `elmawkaa.tsx`

- Connector `<g>` (the dashed `strokeDasharray="4,3"` group) → class
  `thumb-flow`, `connFlow` `stroke-dashoffset` 0→-14 (1.5s linear).
- The `MARKET` and `PLACE` `<text>` elements → class `thumb-receive`,
  `receivePulse` opacity .62→1 (2.4s).

### Insta Super Edit — `insta-super-edit.tsx`

- **Reorder:** move the three light-beam `<polygon>`s so they render
  *after* the Freddie `<image>` group (and media tiles) inside the
  `translate(8,0)` group — light washes over Freddie (fills already
  transparent rgba ~0.2; unchanged).
- Each beam → class `thumb-beam` + `b1/b2/b3`, `transform-box:fill-box`,
  `transform-origin:50% 0%` (top pivot); combined `beamSweep`/`beamSweepB`
  rotate ±7° + `beamPulse` opacity .10→.85, distinct durations
  (~4.2/3.4/4.8s) and delays per beam (the locked "C" sweep+pulse).
- Wrap the `<image>` in `<g class="thumb-freddie">`,
  `transform-origin:50% 100%`, `freddieSway` rotate ±1.5° (3.8s).
- Arrows: **no animation** (static).

### 21Farmer — `twenty-one-farmer.tsx`

- Replace the inline SMIL `<animate>` on the live dot with
  `<circle class="thumb-live" …/>` + `livePulse` opacity 1→.35 (2s).
- The three arc `<path>`s in each sensor group → class `thumb-wave` +
  `w1/w2/w3`, `waveEmit` opacity .12→.6 (2.6s, w2/w3 delayed).
- Each sensor's vertical dashed `<line>` → class `thumb-signal`,
  `signalUp` `stroke-dashoffset`→-8 (1.3s linear).
- Four data-bar fill rects (Soil, Temp, Yield, Humid only — **not** Water or
  pH) → class `thumb-bar` + `bSoil/bTemp/bYield/bHumid`,
  `transform-box:fill-box; transform-origin:left center`, each its own
  continuous keyframe + duration so they never sync:
  - `barSoil` 7s, `barTemp` 5.5s (largest swing), `barYield` 9.5s (subtle),
    `barHumid` 6.5s; small offset delays. Amplitudes vary per the locked
    final5 values (Temp ±~0.1–0.19, Yield ±~0.05, Soil/Humid moderate).
    Bars must not exceed the 100-unit track.

### Haktiv — `haktiv.tsx`

- Keep the outer `<g transform="translate(86, 100)" filter="url(#rev-h-sh)">`
  exactly. Add an **inner** `<g class="thumb-trophy">` wrapping all trophy
  shapes → `trophyBreath` scale 1→1.03 (3.8s) (fixes the jump bug).
- Add `clipPath#haktiv-cup` = the cup body path
  (`M-22 -44 Q-20 -30 -18 -12 Q-15 4 0 8 Q15 4 18 -12 Q20 -30 22 -44 Z`).
  Inside `.thumb-trophy`, before the `$` text, add
  `<g clip-path="url(#haktiv-cup)"><rect class="thumb-shine" x=-7 y=-50
  width=9 height=64 fill="rgba(255,255,255,0.5)"/></g>` →
  `shineSweep` translateX(-30→30px)+rotate(20deg)+opacity envelope (4.5s).
- Add a faint `<ellipse class="thumb-gleam" cx=-8 cy=-30 rx=2.6 ry=10
  fill="#fff7d6"/>` → `gleam` opacity .12→.55 (2.6s).
- Wrap the `$` `<text>` if needed for origin; no $ animation in V2.
- The four leaderboard "main" bars (the `x=202 y+6` rects) → class
  `thumb-lb` + `r1..r4`, `transform-box:fill-box; transform-origin:left
  center`, `lbGrow` scaleX .55→1→1 (4s) staggered (r2/r3/r4 delays).

### Dinney — `dinney.tsx`

- The reservation grid (filled + dimmed) and tables stay exactly as-is
  (dimmed cells must remain visible).
- Add three overlay `<rect class="thumb-book b1|b2|b3" rx=2 fill="#F0C542">`
  on currently-dimmed cells at `(292,82)`, `(332,66)`, `(232,114)` (16×12),
  rendered after the grid → `bookPulse` opacity 0→.6→0 (3.4s, b2/b3 delayed).
- Wrap each of the two **reserved** tables (cx 160,65 and 65,135 — the
  `res:true` ones, ring+plate+fork/knife) in `<g class="thumb-plate p1|p2">`,
  `transform-box:fill-box; transform-origin:center`, `platePulse` scale
  1→1.05 (3.6s, p2 delayed). The two non-reserved tables stay static.

## Out of scope

- Hover-gated or "ambient + hover" modes (always-on chosen).
- Animating Water/pH bars; Dinney party silhouettes; ISE arrows; ISE media
  tiles; ElMawkaa material-card cycle; 12AM halo ring; Haktiv `$` pulse
  (all explicitly rejected during review).
- Any artwork/colour change beyond the 12AM moon mask fix.

## Verification

- `pnpm lint` clean; `pnpm build` compiles (0 errors).
- All six thumbnails render and animate; `prefers-reduced-motion` makes them
  fully static (verify by toggling OS setting / emulation).
- 12AM crescent is a real mask (no dark disc; glow/halo are crescent-shaped).
- Haktiv trophy stays centred (no jump); 21Farmer SMIL removed, dot still
  pulses; Dinney dimmed cells still visible under the gold pulses.
- Cards are wider; SVG thumbnails fill with no crop/letterbox at the new width.

## Commit plan

1. Phase A — wider cards (2 files).
2. globals.css — consolidated thumbnail-animations CSS.
3. One commit per component: 12AM (incl. moon mask fix), ElMawkaa,
   Insta Super Edit, 21Farmer, Haktiv, Dinney.
4. Final verification.
