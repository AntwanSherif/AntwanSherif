# Card Polish + Thumbnail Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Widen the project cards and add always-on, reduced-motion-safe CSS micro-animations to all six thumbnail SVGs (RSC-safe), fixing the 12AM moon-crescent bug along the way.

**Architecture:** Keyframes/classes live in `src/app/globals.css` (replacing the orphan `sensor-pulse` block); components get `className`/wrapper-`<g>` hooks. Transforms that animate are always on inner wrappers, never on an element that already has an SVG `transform=` attribute.

**Tech Stack:** Next.js 16 RSC, React 19, Tailwind v4, pnpm. No test framework — "verify" = `pnpm lint` clean + `pnpm build` 0 errors (+ noted visual checks).

Branch: `card-polish-animations` (already created).

---

## Task 1: Wider cards (Phase A)

**Files:** `src/components/section/projects-section.tsx`, `src/components/project-card.tsx`

- [ ] **Step 1 — widen grid.** In `projects-section.tsx` change the grid wrapper class `max-w-200` to `max-w-280` (only that token; leave `grid grid-cols-1 gap-3 sm:grid-cols-2 mx-auto auto-rows-fr` as-is).

- [ ] **Step 2 — aspect thumbnail.** In `project-card.tsx` replace every thumbnail container/fallback `w-full h-48` with `w-full aspect-[2/1]` (keep any `overflow-hidden`, `object-cover`, `bg-muted`). There are 6 occurrences: two `<div className='w-full h-48 overflow-hidden'>`, two `<div className='w-full h-48 bg-muted' />`, the `ProjectImage` `<img className='w-full h-48 object-cover' …>` (→ `w-full aspect-[2/1] object-cover`), and the two `<video className='w-full h-48 object-cover' …>` (→ `w-full aspect-[2/1] object-cover`). Do not change anything else.

- [ ] **Step 3 — verify.** `pnpm build` → expect success, 0 errors.

- [ ] **Step 4 — commit.**
```
git add src/components/section/projects-section.tsx src/components/project-card.tsx
git commit -m "feat: widen project cards and use 2:1 aspect thumbnails"
```

---

## Task 2: Consolidated thumbnail-animations CSS

**Files:** `src/app/globals.css`

- [ ] **Step 1 — replace the orphan block.** Find the existing block that starts at `/* ── Thumbnail animations ─` and contains `@keyframes sensor-pulse`, `.sensor-pulse`, and its `@media (prefers-reduced-motion: reduce)` rule (ends around line 337). Replace that entire block (from the `/* ── Thumbnail animations` comment through the closing of that reduced-motion `@media` block) with EXACTLY:

```css
/* ── Thumbnail animations (always-on, RSC-safe, additive) ───────── */
@keyframes moonBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
@keyframes moonGlow   { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes moonStar   { 0%, 100% { opacity: .25; } 50% { opacity: .95; } }
@keyframes connFlow   { to { stroke-dashoffset: -14; } }
@keyframes receivePulse { 0%, 100% { opacity: .62; } 50% { opacity: 1; } }
@keyframes freddieSway { 0%, 100% { transform: rotate(-1.5deg); } 50% { transform: rotate(1.5deg); } }
@keyframes beamSweep  { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes beamSweepB { 0%, 100% { transform: rotate(6deg); } 50% { transform: rotate(-6deg); } }
@keyframes beamPulse  { 0%, 100% { opacity: .10; } 50% { opacity: .85; } }
@keyframes waveEmit   { 0%, 100% { opacity: .12; } 55% { opacity: .6; } }
@keyframes livePulse  { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
@keyframes signalUp   { to { stroke-dashoffset: -8; } }
@keyframes barSoil  { 0% { transform: scaleX(1); } 20% { transform: scaleX(1.04); } 42% { transform: scaleX(.94); } 66% { transform: scaleX(1.025); } 84% { transform: scaleX(.97); } 100% { transform: scaleX(1); } }
@keyframes barTemp  { 0% { transform: scaleX(1); } 16% { transform: scaleX(1.1); } 34% { transform: scaleX(.81); } 54% { transform: scaleX(1.07); } 72% { transform: scaleX(.88); } 88% { transform: scaleX(1.02); } 100% { transform: scaleX(1); } }
@keyframes barYield { 0% { transform: scaleX(1); } 28% { transform: scaleX(1.025); } 50% { transform: scaleX(.95); } 70% { transform: scaleX(1.012); } 88% { transform: scaleX(.975); } 100% { transform: scaleX(1); } }
@keyframes barHumid { 0% { transform: scaleX(1); } 22% { transform: scaleX(.91); } 46% { transform: scaleX(1.08); } 64% { transform: scaleX(.95); } 82% { transform: scaleX(1.04); } 100% { transform: scaleX(1); } }
@keyframes trophyBreath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
@keyframes shineSweep { 0% { transform: translateX(-30px) rotate(20deg); opacity: 0; } 12% { opacity: .85; } 45% { opacity: .85; } 57% { transform: translateX(30px) rotate(20deg); opacity: 0; } 100% { opacity: 0; } }
@keyframes gleam { 0%, 100% { opacity: .12; } 50% { opacity: .55; } }
@keyframes lbGrow { 0% { transform: scaleX(.55); } 55% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
@keyframes bookPulse { 0%, 100% { opacity: 0; } 45% { opacity: .6; } }
@keyframes platePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

/* 12AM */
.thumb-moon { transform-box: fill-box; transform-origin: center; animation: moonBreath 5s ease-in-out infinite; }
.thumb-moonglow { animation: moonGlow 4s ease-in-out infinite; }
.thumb-stars circle { transform-box: fill-box; transform-origin: center; animation: moonStar 3s ease-in-out infinite; }
.thumb-stars circle:nth-child(2n) { animation-delay: .7s; }
.thumb-stars circle:nth-child(3n) { animation-delay: 1.4s; }
.thumb-stars circle:nth-child(5n) { animation-delay: 2s; }

/* ElMawkaa */
.thumb-flow { animation: connFlow 1.5s linear infinite; }
.thumb-receive { animation: receivePulse 2.4s ease-in-out infinite; }

/* Insta Super Edit */
.thumb-freddie { transform-box: fill-box; transform-origin: 50% 100%; animation: freddieSway 3.8s ease-in-out infinite; }
.thumb-beam { transform-box: fill-box; transform-origin: 50% 0%; }
.thumb-beam.b1 { animation: beamSweep 4.2s ease-in-out infinite, beamPulse 1.6s ease-in-out infinite; }
.thumb-beam.b2 { animation: beamSweepB 3.4s ease-in-out infinite, beamPulse 1.6s ease-in-out infinite .5s; }
.thumb-beam.b3 { animation: beamSweep 4.8s ease-in-out infinite .6s, beamPulse 1.6s ease-in-out infinite 1s; }

/* 21Farmer */
.thumb-wave { animation: waveEmit 2.6s ease-in-out infinite; }
.thumb-wave.w2 { animation-delay: .45s; }
.thumb-wave.w3 { animation-delay: .9s; }
.thumb-live { animation: livePulse 2s ease-in-out infinite; }
.thumb-signal { animation: signalUp 1.3s linear infinite; }
.thumb-bar { transform-box: fill-box; transform-origin: left center; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
.thumb-bar.bSoil  { animation-name: barSoil;  animation-duration: 7s; }
.thumb-bar.bTemp  { animation-name: barTemp;  animation-duration: 5.5s; animation-delay: .6s; }
.thumb-bar.bYield { animation-name: barYield; animation-duration: 9.5s; }
.thumb-bar.bHumid { animation-name: barHumid; animation-duration: 6.5s; animation-delay: 1.4s; }

/* Haktiv */
.thumb-trophy { transform-box: fill-box; transform-origin: center; animation: trophyBreath 3.8s ease-in-out infinite; }
.thumb-shine { transform-box: fill-box; transform-origin: center; animation: shineSweep 4.5s ease-in-out infinite; }
.thumb-gleam { animation: gleam 2.6s ease-in-out infinite; }
.thumb-lb { transform-box: fill-box; transform-origin: left center; animation: lbGrow 4s ease-in-out infinite; }
.thumb-lb.r2 { animation-delay: .5s; }
.thumb-lb.r3 { animation-delay: 1s; }
.thumb-lb.r4 { animation-delay: 1.5s; }

/* Dinney */
.thumb-book { opacity: 0; animation: bookPulse 3.4s ease-in-out infinite; }
.thumb-book.b2 { animation-delay: 1.2s; }
.thumb-book.b3 { animation-delay: 2.3s; }
.thumb-plate { transform-box: fill-box; transform-origin: center; animation: platePulse 3.6s ease-in-out infinite; }
.thumb-plate.p2 { animation-delay: 1.1s; }

@media (prefers-reduced-motion: reduce) {
  .thumb-moon, .thumb-moonglow, .thumb-stars circle, .thumb-flow, .thumb-receive,
  .thumb-freddie, .thumb-beam, .thumb-wave, .thumb-live, .thumb-signal, .thumb-bar,
  .thumb-trophy, .thumb-shine, .thumb-gleam, .thumb-lb, .thumb-book, .thumb-plate {
    animation: none !important;
  }
}
```

- [ ] **Step 2 — verify.** `pnpm build` → success, 0 errors. (`grep -n "sensor-pulse" src -r` must return nothing.)

- [ ] **Step 3 — commit.**
```
git add src/app/globals.css
git commit -m "feat: consolidated thumbnail animation keyframes/classes"
```

---

## Task 3: 12AM — moon mask fix + animation

**File:** `src/components/project-thumbnails/twelve-am.tsx`

- [ ] **Step 1 — add masks to `<defs>`.** Inside the existing `<defs>` (which has `rev-12-sh` and `rev-12-glow`), change the `rev-12-glow` filter to have an enlarged region and add two masks. The `<defs>` becomes:

```tsx
      <defs>
        <filter id="rev-12-sh"><feDropShadow dx="4" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.9)" /></filter>
        <filter id="rev-12-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13" /></filter>
        <mask id="moon-body" maskUnits="userSpaceOnUse" x="220" y="24" width="160" height="140">
          <circle cx="290" cy="92" r="60" fill="#fff" />
          <circle cx="308" cy="80" r="54" fill="#000" />
        </mask>
        <mask id="moon-glow-mask" maskUnits="userSpaceOnUse" x="210" y="14" width="180" height="160">
          <circle cx="290" cy="92" r="66" fill="#fff" />
          <circle cx="308" cy="80" r="54" fill="#000" />
        </mask>
      </defs>
```

- [ ] **Step 2 — wrap stars.** Wrap the `{stars.map(…)}` expression in a group:
```tsx
      <g className="thumb-stars">
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.4 : 0.9} fill="white" fillOpacity={0.32 + (i % 3) * 0.12} />
        ))}
      </g>
```

- [ ] **Step 3 — replace the moon block.** Replace the six moon circles (the glow `r="64"`, body `r="60"`, the three crater circles `r=8/14/6`, and the `#06061a` `r="54"` circle) with the masked, crescent-glow, animated structure:

```tsx
      <g className="thumb-moon">
        <g className="thumb-moonglow" filter="url(#rev-12-glow)">
          <g mask="url(#moon-glow-mask)">
            <circle cx="290" cy="92" r="66" fill="rgba(200,200,240,0.5)" />
          </g>
        </g>
        <g mask="url(#moon-body)">
          <circle cx="290" cy="92" r="60" fill="#e0deed" filter="url(#rev-12-sh)" />
          <circle cx="266" cy="78" r="8" fill="rgba(0,0,0,0.07)" />
          <circle cx="304" cy="102" r="14" fill="rgba(0,0,0,0.06)" />
          <circle cx="284" cy="118" r="6" fill="rgba(0,0,0,0.07)" />
        </g>
      </g>
```

(The `<circle cx="308" cy="80" r="54" fill="#06061a" />` is deleted — that was the bug. The post-card `<g … transform="rotate(-3 110 110)">` block stays unchanged, after this.)

- [ ] **Step 4 — verify.** `pnpm build` → success. Visual: crescent is real (dark side shows faint glow/stars, no opaque disc); glow is crescent-shaped; moon breathes, glow pulses, stars twinkle.

- [ ] **Step 5 — commit.**
```
git add src/components/project-thumbnails/twelve-am.tsx
git commit -m "fix: real masked crescent for 12AM moon + breathe/glow/star animation"
```

---

## Task 4: ElMawkaa — flow + receive

**File:** `src/components/project-thumbnails/elmawkaa.tsx`

- [ ] **Step 1 — class the connectors.** On the connector group (the one with `strokeDasharray="4,3"` containing the four `<line>`s), add `className="thumb-flow"`. It should read:
```tsx
      <g className="thumb-flow" stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeDasharray="4,3" fill="none">
```

- [ ] **Step 2 — class the sign.** Add `className="thumb-receive"` to the two `<text>` elements `MARKET` and `PLACE`:
```tsx
        <text className="thumb-receive" x="70" y="64" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">MARKET</text>
        <text className="thumb-receive" x="70" y="84" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">PLACE</text>
```

- [ ] **Step 3 — verify.** `pnpm build` → success. Visual: connectors flow toward the building; MARKET/PLACE gently pulse.

- [ ] **Step 4 — commit.**
```
git add src/components/project-thumbnails/elmawkaa.tsx
git commit -m "feat: ElMawkaa connector flow + marketplace receive pulse"
```

---

## Task 5: Insta Super Edit — lights over Freddie + sway

**File:** `src/components/project-thumbnails/insta-super-edit.tsx`

- [ ] **Step 1 — wrap Freddie.** Replace the Freddie image line with a wrapped group:
```tsx
        <g className="thumb-freddie"><image href="/thumbnails/freddie-nobg.png" x="8" y="37" width="98" height="112" preserveAspectRatio="xMidYMax meet" /></g>
```

- [ ] **Step 2 — move beams above Freddie + class them.** The three light-beam `<polygon>`s currently render *before* the stage/Freddie inside `<g transform="translate(8,0)">`. Remove them from their current position and re-insert them **immediately after the second media-tile group** (the last child of the `translate(8,0)` group), with classes:
```tsx
        <polygon className="thumb-beam b1" points="28,26 36,26 58,142 48,142" fill="rgba(236,72,153,0.24)" />
        <polygon className="thumb-beam b2" points="46,26 54,26 78,142 64,142" fill="rgba(168,85,247,0.22)" />
        <polygon className="thumb-beam b3" points="64,26 72,26 92,142 78,142" fill="rgba(77,208,225,0.2)" />
```
Net order inside `translate(8,0)`: stage polygon → `thumb-freddie` group → photo media tile `<g>` → video media tile `<g>` → the three `thumb-beam` polygons. Nothing else changes (arrows stay static, no class).

- [ ] **Step 3 — verify.** `pnpm build` → success. Visual: beams sweep+pulse over Freddie (he shows through the transparent colour), Freddie sways at the mic, arrows static.

- [ ] **Step 4 — commit.**
```
git add src/components/project-thumbnails/insta-super-edit.tsx
git commit -m "feat: Insta Super Edit concert lights over Freddie + sway"
```

---

## Task 6: 21Farmer — waves, live, signal, distinct bars

**File:** `src/components/project-thumbnails/twenty-one-farmer.tsx`

- [ ] **Step 1 — live dot (remove SMIL).** Replace the live-dot circle (the one containing `<animate attributeName="opacity" …/>`) with:
```tsx
      <circle className="thumb-live" cx="370" cy="33" r="2.8" fill="#22c55e" />
```
(Delete the nested `<animate>` element entirely.)

- [ ] **Step 2 — sensors.** Each of the three sensor `<g filter="url(#farmer-shadow)">` groups contains a dashed vertical `<line>` and three arc `<path>`s. Add `className="thumb-signal"` to each dashed `<line strokeDasharray="2,2" …>`, and to the three `<path>`s add `className="thumb-wave w1"`, `"thumb-wave w2"`, `"thumb-wave w3"` (outer→inner: the `0.55` opacity path = w1, `0.35` = w2, `0.2` = w3). Apply identically in all three sensor groups.

- [ ] **Step 3 — bars.** The six data rows each have a darker track rect and a brighter fill rect (`fill="rgba(34,197,94,0.5)"`, `width={...}`). On the **fill** rect for Soil add `className="thumb-bar bSoil"`, Temp `thumb-bar bTemp`, Yield `thumb-bar bYield`, Humid `thumb-bar bHumid`. Do **not** add a class to Water or pH fill rects (static).

- [ ] **Step 4 — verify.** `pnpm build` → success. `grep -n "<animate" src/components/project-thumbnails/twenty-one-farmer.tsx` returns nothing. Visual: waves emit, dot pulses, signal flows up stalks, 4 bars fluctuate independently, Water/pH static.

- [ ] **Step 5 — commit.**
```
git add src/components/project-thumbnails/twenty-one-farmer.tsx
git commit -m "feat: 21Farmer waves/live/signal + distinct live data bars (SMIL->CSS)"
```

---

## Task 7: Haktiv — trophy wrapper + shine + leaderboard

**File:** `src/components/project-thumbnails/haktiv.tsx`

- [ ] **Step 1 — clipPath.** In `<defs>` (which has `rev-h-glow`, `rev-h-sh`) add:
```tsx
        <clipPath id="haktiv-cup"><path d="M-22 -44 Q-20 -30 -18 -12 Q-15 4 0 8 Q15 4 18 -12 Q20 -30 22 -44 Z" /></clipPath>
```

- [ ] **Step 2 — wrap trophy + add shine/gleam.** The outer `<g transform="translate(86, 100)" filter="url(#rev-h-sh)">` stays. Wrap ALL its children in a new inner `<g className="thumb-trophy">`. Immediately before the `$` `<text x="0" y="-16" …>` (still inside `.thumb-trophy`), insert:
```tsx
        <g clipPath="url(#haktiv-cup)"><rect className="thumb-shine" x="-7" y="-50" width="9" height="64" fill="rgba(255,255,255,0.5)" /></g>
        <ellipse className="thumb-gleam" cx="-8" cy="-30" rx="2.6" ry="10" fill="#fff7d6" />
```
Resulting structure: `<g transform="translate(86, 100)" filter="url(#rev-h-sh)"><g className="thumb-trophy"> …all existing trophy shapes… <g clipPath…><rect thumb-shine/></g> <ellipse thumb-gleam/> <text>$</text> </g></g>`.

- [ ] **Step 3 — leaderboard bars.** The four leaderboard rows each map to a `<g key={i}>` with a circle, two rects, and a text. Add `className="thumb-lb r1"`…`"thumb-lb r4"` to the **first** `<rect>` in each row (the `x="202" y={y + 6}` width `{60 * bar + 20}` one), r1 for the first row through r4 for the fourth. Since rows are produced by `.map`, change the inner first rect to:
```tsx
          <rect className={`thumb-lb r${i + 1}`} x="202" y={y + 6} width={60 * bar + 20} height="3.5" rx="2" fill="rgba(248,248,248,0.2)" />
```

- [ ] **Step 4 — verify.** `pnpm build` → success. Visual: trophy stays centred (no jump), shine sweeps the cup, faint gleam, leaderboard bars grow in staggered.

- [ ] **Step 5 — commit.**
```
git add src/components/project-thumbnails/haktiv.tsx
git commit -m "feat: Haktiv trophy shine/breathe (wrapper-fixed) + leaderboard populate"
```

---

## Task 8: Dinney — booked pulses + plate pulse

**File:** `src/components/project-thumbnails/dinney.tsx`

- [ ] **Step 1 — plate wrappers.** The four tables are produced by `[{cx,cy,res}…].map(...)`. For the two `res: true` tables the inner content must pulse. Wrap the per-table animated content: change the table `.map` body so that when `res` is true the ring+plate+utensils are inside `<g className={\`thumb-plate ${i === 1 ? 'p1' : 'p2'}\`}>`. Concretely, the map callback returns:
```tsx
        <g key={i}>
          {res ? (
            <g className={`thumb-plate ${i === 1 ? 'p1' : 'p2'}`}>
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="rgba(240,197,66,0.55)" strokeWidth="1.2" />
              <circle cx={cx} cy={cy} r="13" fill="rgba(240,197,66,0.1)" stroke="rgba(240,197,66,0.4)" strokeWidth="1" />
              <line x1={cx - 4.5} y1={cy - 2} x2={cx - 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <line x1={cx - 6.5} y1={cy - 6} x2={cx - 6.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 4.5} y1={cy - 7} x2={cx - 4.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 2.5} y1={cy - 6} x2={cx - 2.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx + 4.5} y1={cy + 1} x2={cx + 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <path d={`M${cx + 3} ${cy - 7} L${cx + 3} ${cy} L${cx + 6} ${cy} Z`} fill="#F0C542" />
            </g>
          ) : (
            <g>
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="rgba(248,248,248,0.16)" strokeWidth="1.2" />
              <circle cx={cx} cy={cy} r="13" fill="rgba(248,248,248,0.04)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
            </g>
          )}
        </g>
```
(`i === 1` is the (160,65) reserved table → `p1`; the other `res:true` (65,135) → `p2`. Geometry/values are unchanged from the current file — only grouping/classes added. `transform-origin:center` + `transform-box:fill-box` scales each plate about its own bbox centre, so position is preserved.)

- [ ] **Step 2 — booked overlays.** Immediately AFTER the reservations grid `{Array.from({ length: 7 }).map(…)}` block and before the `PARTY` rect, add three overlay rects:
```tsx
      <rect className="thumb-book b1" x="292" y="82" width="16" height="12" rx="2" fill="#F0C542" />
      <rect className="thumb-book b2" x="332" y="66" width="16" height="12" rx="2" fill="#F0C542" />
      <rect className="thumb-book b3" x="232" y="114" width="16" height="12" rx="2" fill="#F0C542" />
```

- [ ] **Step 3 — verify.** `pnpm build` → success. Visual: dimmed + filled grid all still visible; three cells pulse gold on top of dim cells; the two reserved plates pulse; other two tables static.

- [ ] **Step 4 — commit.**
```
git add src/components/project-thumbnails/dinney.tsx
git commit -m "feat: Dinney booked-cell pulses + reserved-plate pulse"
```

---

## Task 9: Final verification

**Files:** none (verification only)

- [ ] **Step 1 — lint.** `pnpm lint` → 0 errors (pre-existing warnings in unrelated worktree/generated files acceptable).
- [ ] **Step 2 — build.** `pnpm build` → success, 0 errors.
- [ ] **Step 3 — grep checks.** `grep -rn "sensor-pulse\|<animate" src/` → no matches (orphan CSS gone, SMIL removed).
- [ ] **Step 4 — visual (report, don't auto-fix).** `pnpm dev`, open the projects grid: cards wider, thumbnails fill 2:1 with no crop/letterbox; each of the six animates as specified; emulate `prefers-reduced-motion: reduce` and confirm all six go fully static. Report any discrepancy for review.

---

## Self-Review

**Spec coverage:** Phase A → Task 1; CSS → Task 2; 12AM moon-fix+anim → Task 3; ElMawkaa → 4; ISE (beams over Freddie + sway, arrows static) → 5; 21Farmer (SMIL→CSS, waves/signal/4 bars) → 6; Haktiv (wrapper fix + shine + gleam + leaderboard) → 7; Dinney (plates + booked, dimmed cells preserved) → 8; verification → 9. All spec sections covered.

**Placeholder scan:** none — every step has exact classes/markup/commands.

**Consistency:** class names match exactly between Task 2 CSS and Tasks 3–8 usage (`thumb-moon/-moonglow/-stars`, `thumb-flow/-receive`, `thumb-freddie/-beam b1..b3`, `thumb-wave w1..w3/-live/-signal/-bar bSoil..bHumid`, `thumb-trophy/-shine/-gleam/-lb r1..r4`, `thumb-book b1..b3/-plate p1..p2`). Wrapper-vs-transform-attr rule honored for Haktiv (`thumb-trophy` inner), Dinney plates (no transform attr — safe), 12AM moon (no transform attr — safe), ISE Freddie (image has no transform attr — wrapped anyway for origin), beams (polygons, no transform attr). Reduced-motion selector lists every class.
