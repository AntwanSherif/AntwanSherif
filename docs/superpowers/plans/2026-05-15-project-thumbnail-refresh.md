# Project Thumbnail Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four project thumbnail SVGs with iterated versions, give three flat-black cards a `#0c0d14` tint, and add an "In Progress" badge to the Insta Super Edit card.

**Architecture:** Thumbnails are presentational React Server Components in `src/components/project-thumbnails/`, mapped by title in `index.tsx` and rendered through `ProjectCard`. Conversions are deterministic ports of `~/Downloads/Antwan Sherif Portfolio/thumb-revised2.jsx`.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind v4, pnpm.

> **Verification note:** This project has no test framework (no `test` script; presentational SVG components). "Verify" everywhere means: `pnpm lint` passes AND `pnpm build` compiles with no type/lint errors. There are no unit tests to write — adding a test harness is out of scope.

---

## File Structure

- `src/components/project-thumbnails/dinney.tsx` — replaced (Rev2_DINNEY, `#0c0d14` bg)
- `src/components/project-thumbnails/elmawkaa.tsx` — replaced (Rev2_ELMAWKAA, `#0c0d14` bg, semantic clipPath ids)
- `src/components/project-thumbnails/twenty-one-farmer.tsx` — replaced (Rev2_21FARMER, `#040e04` bg, semantic defs ids)
- `src/components/project-thumbnails/insta-super-edit.tsx` — replaced (Rev_ISE_Mercury + module-local `IGPost`, `#08000e` bg, photo via public asset)
- `src/components/project-thumbnails/haktiv.tsx` — Phase 1 only: background rect color
- `public/thumbnails/freddie-nobg.png` — new asset
- `src/data/resume.tsx` — add `status: 'in-progress'` to the Insta Super Edit project
- `src/components/section/projects-section.tsx` — pass `status` prop
- `src/components/project-card.tsx` — `status` prop + gold badge
- `index.tsx` / `THUMBNAIL_MAP` — unchanged (export names preserved)

Work proceeds on the existing `thumbnail-refresh` branch.

---

## Task 1: Phase 1 — colored backgrounds on current components

**Files:**
- Modify: `src/components/project-thumbnails/haktiv.tsx`
- Modify: `src/components/project-thumbnails/elmawkaa.tsx`
- Modify: `src/components/project-thumbnails/dinney.tsx`

- [ ] **Step 1: Change the Haktiv background rect**

In `src/components/project-thumbnails/haktiv.tsx`, change the solid background rect (the one with `fill="#0A0A0F"`, not the `url(#rev-h-glow)` rect) to:

```tsx
<rect width="400" height="200" fill="#0c0d14" />
```

Leave the `<rect width="400" height="200" fill="url(#rev-h-glow)" />` line and all other markup unchanged.

- [ ] **Step 2: Change the ElMawkaa background rect**

In `src/components/project-thumbnails/elmawkaa.tsx`, change `<rect width="400" height="200" fill="#0A0A0F" />` to:

```tsx
<rect width="400" height="200" fill="#0c0d14" />
```

- [ ] **Step 3: Change the Dinney background rect**

In `src/components/project-thumbnails/dinney.tsx`, change `<rect width="400" height="200" fill="#0A0A0F" />` to:

```tsx
<rect width="400" height="200" fill="#0c0d14" />
```

- [ ] **Step 4: Verify**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/project-thumbnails/haktiv.tsx src/components/project-thumbnails/elmawkaa.tsx src/components/project-thumbnails/dinney.tsx
git commit -m "feat: tint Haktiv/ElMawkaa/Dinney thumbnail backgrounds (#0c0d14)"
```

---

## Task 2: Copy the Insta Super Edit photo asset

**Files:**
- Create: `public/thumbnails/freddie-nobg.png`

- [ ] **Step 1: Copy the PNG into public/thumbnails**

Run:

```bash
mkdir -p public/thumbnails && cp "/Users/antwan/Downloads/Antwan Sherif Portfolio/uploads/freddie-nobg.png" public/thumbnails/freddie-nobg.png
```

- [ ] **Step 2: Verify the file exists and is a PNG**

Run: `file public/thumbnails/freddie-nobg.png`
Expected: output contains `PNG image data`.

- [ ] **Step 3: Commit**

```bash
git add public/thumbnails/freddie-nobg.png
git commit -m "feat: add Freddie photo asset for Insta Super Edit thumbnail"
```

---

## Task 3: Replace the Dinney thumbnail (Rev2_DINNEY)

**Files:**
- Modify (full rewrite): `src/components/project-thumbnails/dinney.tsx`

- [ ] **Step 1: Replace the entire file contents**

Write `src/components/project-thumbnails/dinney.tsx` with exactly:

```tsx
import { DotGrid } from './dot-grid';

export function DinneyThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <rect width="400" height="200" fill="#0c0d14" />
      <DotGrid />
      <rect x="20" y="22" width="190" height="156" fill="none" stroke="rgba(248,248,248,0.2)" strokeWidth="1.2" />
      {[
        { cx: 65, cy: 65, res: false },
        { cx: 160, cy: 65, res: true },
        { cx: 65, cy: 135, res: true },
        { cx: 160, cy: 135, res: false },
      ].map(({ cx, cy, res }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="none" stroke={res ? 'rgba(240,197,66,0.55)' : 'rgba(248,248,248,0.16)'} strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="13" fill={res ? 'rgba(240,197,66,0.1)' : 'rgba(248,248,248,0.04)'} stroke={res ? 'rgba(240,197,66,0.4)' : 'rgba(248,248,248,0.1)'} strokeWidth="1" />
          {res && (
            <g>
              <line x1={cx - 4.5} y1={cy - 2} x2={cx - 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <line x1={cx - 6.5} y1={cy - 6} x2={cx - 6.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 4.5} y1={cy - 7} x2={cx - 4.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx - 2.5} y1={cy - 6} x2={cx - 2.5} y2={cy - 2} stroke="#F0C542" strokeWidth="1" strokeLinecap="round" />
              <line x1={cx + 4.5} y1={cy + 1} x2={cx + 4.5} y2={cy + 6} stroke="#F0C542" strokeWidth="1.4" strokeLinecap="round" />
              <path d={`M${cx + 3} ${cy - 7} L${cx + 3} ${cy} L${cx + 6} ${cy} Z`} fill="#F0C542" />
            </g>
          )}
        </g>
      ))}
      <rect x="224" y="22" width="156" height="120" rx="4" fill="rgba(248,248,248,0.02)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
      <text x="232" y="36" fill="rgba(248,248,248,0.4)" fontSize="8" fontFamily="monospace">RESERVATIONS</text>
      <line x1="224" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {Array.from({ length: 7 }).map((_, d) =>
        Array.from({ length: 5 }).map((_, t) => {
          const filled = [[0, 2], [1, 1], [2, 3], [3, 0], [4, 2], [5, 4], [6, 1], [2, 0]].some(([dd, tt]) => dd === d && tt === t);
          return (
            <rect
              key={`${d}-${t}`}
              x={232 + d * 20}
              y={50 + t * 16}
              width="16"
              height="12"
              rx="2"
              fill={filled ? 'rgba(240,197,66,0.5)' : 'rgba(248,248,248,0.05)'}
              stroke={filled ? '#F0C542' : 'rgba(248,248,248,0.1)'}
              strokeWidth="0.7"
            />
          );
        })
      )}
      <rect x="224" y="152" width="156" height="26" rx="4" fill="rgba(248,248,248,0.02)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
      <text x="232" y="170" fill="rgba(248,248,248,0.4)" fontSize="9" fontFamily="monospace">PARTY</text>
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${288 + i * 22}, 165)`}>
          <circle cx="0" cy="-2" r="3" fill="#F0C542" />
          <path d="M-4.5 5 Q0 0 4.5 5 L4.5 7 L-4.5 7 Z" fill="#F0C542" />
        </g>
      ))}
      <text x="372" y="170" textAnchor="end" fill="#F0C542" fontSize="14" fontFamily="monospace" fontWeight="bold">× 3</text>
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint`
Expected: no errors (no unused imports; `DotGrid` is used).

- [ ] **Step 3: Commit**

```bash
git add src/components/project-thumbnails/dinney.tsx
git commit -m "feat: replace Dinney thumbnail with Rev2 artwork (4 tables, party of 3)"
```

---

## Task 4: Replace the ElMawkaa thumbnail (Rev2_ELMAWKAA)

**Files:**
- Modify (full rewrite): `src/components/project-thumbnails/elmawkaa.tsx`

- [ ] **Step 1: Replace the entire file contents**

Write `src/components/project-thumbnails/elmawkaa.tsx` with exactly:

```tsx
export function ElmawkaaThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <clipPath id="elmawkaa-glass">
          <rect width="58" height="42" rx="4" />
        </clipPath>
        <clipPath id="elmawkaa-brick">
          <rect width="58" height="42" rx="4" />
        </clipPath>
      </defs>
      <rect width="400" height="200" fill="#0c0d14" />
      <g transform="translate(130, 30)">
        <path
          d="M0 20 Q9 30 18 20 Q27 30 36 20 Q45 30 54 20 Q63 30 72 20 Q81 30 90 20 Q99 30 108 20 Q117 30 126 20 Q135 30 140 20 L140 0 L0 0 Z"
          fill="rgba(240,197,66,0.22)"
          stroke="#F0C542"
          strokeWidth="1.2"
        />
        <rect y="20" width="140" height="130" rx="3" fill="rgba(240,197,66,0.04)" stroke="rgba(240,197,66,0.55)" strokeWidth="1.6" />
        <text x="70" y="64" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">MARKET</text>
        <text x="70" y="84" textAnchor="middle" fill="#F0C542" fontSize="15" fontFamily="monospace" fontWeight="bold" letterSpacing="2">PLACE</text>
        {[10, 54, 98].map((x, i) => (
          <g key={i}>
            <rect x={x} y="102" width="32" height="42" rx="2" fill="rgba(248,248,248,0.04)" stroke="rgba(248,248,248,0.2)" strokeWidth="0.9" />
            <rect x={x + 3} y="106" width="10" height="8" rx="1" fill="rgba(240,197,66,0.2)" stroke="rgba(240,197,66,0.4)" strokeWidth="0.6" />
            <rect x={x + 19} y="106" width="10" height="8" rx="1" fill="rgba(240,197,66,0.2)" stroke="rgba(240,197,66,0.4)" strokeWidth="0.6" />
            <rect x={x + 9} y="118" width="14" height="26" rx="1" fill="rgba(248,248,248,0.07)" stroke="rgba(248,248,248,0.12)" strokeWidth="0.6" />
          </g>
        ))}
      </g>
      <g transform="translate(10, 30)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3, 4].map(c => (
            <circle key={`${r}-${c}`} cx={7 + c * 11} cy={7 + r * 8} r="1.7" fill="rgba(248,248,248,0.48)" />
          ))
        )}
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(240,197,66,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#F0C542" fontSize="7.5" fontFamily="monospace" fontWeight="bold">CONCRETE</text>
      </g>
      <g transform="translate(332, 30)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        {[12, 20, 28].map(y => (
          <line key={y} x1="8" y1={y} x2="50" y2={y} stroke="rgba(248,248,248,0.52)" strokeWidth="3.5" />
        ))}
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(240,197,66,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#F0C542" fontSize="7.5" fontFamily="monospace" fontWeight="bold">STEEL</text>
      </g>
      <g transform="translate(10, 128)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        <g clipPath="url(#elmawkaa-glass)">
          {[-20, -8, 4, 16, 28, 40, 52].map(x => (
            <line key={x} x1={x} y1="0" x2={x + 38} y2="42" stroke="rgba(77,208,225,0.58)" strokeWidth="1.8" />
          ))}
        </g>
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(77,208,225,0.2)" />
        <text x="29" y="41" textAnchor="middle" fill="#4dd0e1" fontSize="7.5" fontFamily="monospace" fontWeight="bold">GLASS</text>
      </g>
      <g transform="translate(332, 128)">
        <rect width="58" height="42" rx="4" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.2" />
        <g clipPath="url(#elmawkaa-brick)">
          {[8, 19, 30].map((y, r) =>
            [0, 1, 2, 3].map(c => {
              const off = r % 2 === 0 ? 0 : 8;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={3 + c * 14 + off}
                  y={y}
                  width="12"
                  height="9"
                  rx="1.5"
                  fill="rgba(217,119,6,0.45)"
                  stroke="rgba(217,119,6,0.65)"
                  strokeWidth="0.5"
                />
              );
            })
          )}
        </g>
        <rect x="0" y="34" width="58" height="8" rx="0 0 4 4" fill="rgba(217,119,6,0.22)" />
        <text x="29" y="41" textAnchor="middle" fill="rgba(217,119,6,0.9)" fontSize="7.5" fontFamily="monospace" fontWeight="bold">BRICK</text>
      </g>
      <g stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeDasharray="4,3" fill="none">
        <line x1="70" y1="52" x2="131" y2="72" />
        <line x1="330" y1="52" x2="270" y2="72" />
        <line x1="70" y1="148" x2="131" y2="130" />
        <line x1="330" y1="148" x2="270" y2="130" />
      </g>
    </svg>
  );
}
```

> Note: `rx="0 0 4 4"` is intentionally kept verbatim from the approved source. SVG ignores the invalid multi-value `rx` (renders as square corners); do not "fix" it — it matches the approved artwork.

- [ ] **Step 2: Verify**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/project-thumbnails/elmawkaa.tsx
git commit -m "feat: replace ElMawkaa thumbnail with Rev2 artwork (tall MARKETPLACE, labeled cards)"
```

---

## Task 5: Replace the 21Farmer thumbnail (Rev2_21FARMER)

**Files:**
- Modify (full rewrite): `src/components/project-thumbnails/twenty-one-farmer.tsx`

- [ ] **Step 1: Replace the entire file contents**

Write `src/components/project-thumbnails/twenty-one-farmer.tsx` with exactly:

```tsx
import { DotGrid } from './dot-grid';

export function TwentyOneFarmerThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="farmer-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="farmer-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#040e04" />
      <rect width="400" height="200" fill="url(#farmer-glow)" />
      <DotGrid />
      <g filter="url(#farmer-shadow)">
        <rect x="20" y="22" width="172" height="156" fill="none" stroke="rgba(248,248,248,0.18)" strokeWidth="1.2" />
        <rect x="20" y="22" width="172" height="48" fill="rgba(77,208,225,0.08)" />
        <rect x="20" y="70" width="172" height="56" fill="rgba(34,197,94,0.14)" />
        <rect x="20" y="126" width="172" height="52" fill="rgba(34,197,94,0.07)" />
      </g>
      <line x1="20" y1="70" x2="192" y2="70" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2" />
      <line x1="20" y1="126" x2="192" y2="126" stroke="rgba(34,197,94,0.22)" strokeWidth="1" />
      <text x="106" y="50" textAnchor="middle" fill="rgba(77,208,225,0.5)" fontSize="8" fontFamily="monospace">ATMOSPHERE</text>
      <text x="106" y="100" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="monospace">TOPSOIL</text>
      <text x="106" y="156" textAnchor="middle" fill="rgba(34,197,94,0.36)" fontSize="8" fontFamily="monospace">SUBSOIL</text>
      {[60, 106, 152].map((cx, i) => (
        <g key={i} filter="url(#farmer-shadow)">
          <line x1={cx} y1="22" x2={cx} y2="70" stroke="rgba(240,197,66,0.4)" strokeWidth="1" strokeDasharray="2,2" />
          <path d={`M${cx - 8} 64 Q${cx} 56 ${cx + 8} 64`} fill="none" stroke="rgba(240,197,66,0.55)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 12} 58 Q${cx} 44 ${cx + 12} 58`} fill="none" stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 15} 52 Q${cx} 34 ${cx + 15} 52`} fill="none" stroke="rgba(240,197,66,0.2)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy="70" r="6.5" fill="rgba(240,197,66,0.14)" stroke="#F0C542" strokeWidth="1.3" />
          <circle cx={cx} cy="70" r="3" fill="#F0C542" />
        </g>
      ))}
      <rect x="208" y="22" width="172" height="156" rx="4" fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#farmer-shadow)" />
      <text x="216" y="36" fill="rgba(34,197,94,0.6)" fontSize="8" fontFamily="monospace">LIVE · SENSOR DATA</text>
      <circle cx="370" cy="33" r="2.8" fill="#22c55e">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="208" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {[
        { l: 'Soil', v: 0.75, y: 52 },
        { l: 'Water', v: 0.55, y: 72 },
        { l: 'Temp', v: 0.88, y: 92 },
        { l: 'Yield', v: 0.65, y: 112 },
        { l: 'pH', v: 0.72, y: 132 },
        { l: 'Humid', v: 0.8, y: 152 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="216" y={y + 9} fill="rgba(248,248,248,0.35)" fontSize="7.5" fontFamily="monospace">{l}</text>
          <rect x="248" y={y} width="100" height="11" rx="2" fill="rgba(34,197,94,0.1)" />
          <rect x="248" y={y} width={100 * v} height="11" rx="2" fill="rgba(34,197,94,0.5)" />
          <text x="372" y={y + 9} textAnchor="end" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">{Math.round(v * 100)}%</text>
        </g>
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/project-thumbnails/twenty-one-farmer.tsx
git commit -m "feat: replace 21Farmer thumbnail with Rev2 artwork (text strata labels restored)"
```

---

## Task 6: Replace the Insta Super Edit thumbnail (Rev_ISE_Mercury)

**Files:**
- Modify (full rewrite): `src/components/project-thumbnails/insta-super-edit.tsx`

- [ ] **Step 1: Replace the entire file contents**

Write `src/components/project-thumbnails/insta-super-edit.tsx` with exactly:

```tsx
import { DotGrid } from './dot-grid';

function IGPost({ x, y }: { x: number; y: number }) {
  const W = 96;
  const PH = W;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={W} height={W + 60} rx="6" fill="#0a0a0f" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="6" fill="rgba(168,85,247,0.55)" stroke="rgba(168,85,247,0.7)" strokeWidth="0.8" />
      <rect x="24" y="10" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="24" y="16" width="18" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x={W - 18} y="7" width="13" height="13" rx="3.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      <circle cx={W - 11.5} cy="13.5" r="3.8" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
      <circle cx={W - 7.5} cy="9.5" r="1" fill="rgba(255,255,255,0.8)" />
      <line x1="0" y1="28" x2={W} y2="28" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <rect x="0" y="28" width={W} height={PH} fill="rgba(168,85,247,0.28)" />
      <polygon points={`${W * 0.4},28 ${W * 0.6},28 ${W * 0.75},${28 + PH} ${W * 0.25},${28 + PH}`} fill="rgba(236,72,153,0.18)" />
      <line x1="0" y1={28 + PH} x2={W} y2={28 + PH} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d={`M10 ${28 + PH + 9} Q8 ${28 + PH + 6} 10 ${28 + PH + 3} Q12 ${28 + PH + 6} 10 ${28 + PH + 9} Z`} fill="rgba(255,255,255,0.6)" />
      <circle cx="22" cy={28 + PH + 6} r="3.5" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
      <path
        d={`M32 ${28 + PH + 3} L42 ${28 + PH + 6} L32 ${28 + PH + 9}`}
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="6" y={28 + PH + 16} width="50" height="2.5" rx="1" fill="rgba(255,255,255,0.22)" />
      <rect x="6" y={28 + PH + 22} width="35" height="2.5" rx="1" fill="rgba(255,255,255,0.14)" />
    </g>
  );
}

export function InstaSuperEditThumbnail() {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full block">
      <defs>
        <radialGradient id="ise-glow" cx="28%" cy="40%" r="45%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="ise-shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#08000e" />
      <rect width="400" height="200" fill="url(#ise-glow)" />
      <DotGrid />
      <g transform="translate(8,0)">
        <polygon points="28,26 36,26 58,142 48,142" fill="rgba(236,72,153,0.24)" />
        <polygon points="46,26 54,26 78,142 64,142" fill="rgba(168,85,247,0.22)" />
        <polygon points="64,26 72,26 92,142 78,142" fill="rgba(77,208,225,0.2)" />
        <polygon points="12,142 102,142 92,160 22,160" fill="rgba(248,248,248,0.08)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
        <image href="/thumbnails/freddie-nobg.png" x="8" y="37" width="98" height="112" preserveAspectRatio="xMidYMax meet" />
        <g filter="url(#ise-shadow)" transform="rotate(-10 95 50)">
          <rect x="80" y="40" width="28" height="20" rx="2.5" fill="rgba(248,248,248,0.1)" stroke="rgba(236,72,153,0.6)" strokeWidth="1.2" />
          <rect x="86" y="44" width="16" height="12" rx="1" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="94" cy="50" r="2.8" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="89" cy="46.5" r="0.7" fill="rgba(236,72,153,0.85)" />
        </g>
        <g filter="url(#ise-shadow)" transform="rotate(8 100 78)">
          <rect x="86" y="68" width="26" height="20" rx="2.5" fill="rgba(248,248,248,0.1)" stroke="rgba(168,85,247,0.6)" strokeWidth="1.2" />
          <polygon points="94.8,73.8 94.8,83.8 104.8,78.8" fill="rgba(168,85,247,0.9)" />
        </g>
      </g>
      <g stroke="rgba(248,248,248,0.32)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="132" y1="100" x2="162" y2="100" />
        <path d="M157 94 L164 100 L157 106" />
      </g>
      <rect x="170" y="44" width="76" height="112" rx="8" fill="rgba(240,197,66,0.1)" stroke="#F0C542" strokeWidth="1.6" filter="url(#ise-shadow)" />
      <text x="208" y="75" textAnchor="middle" fill="#F0C542" fontSize="16" fontFamily="monospace" fontWeight="bold">AI</text>
      <line x1="180" y1="87" x2="236" y2="87" stroke="rgba(240,197,66,0.18)" strokeWidth="0.8" />
      {[
        { l: 'Quality', v: 0.88, y: 98 },
        { l: 'Rank', v: 0.72, y: 116 },
        { l: 'Curate', v: 0.95, y: 134 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="178" y={y + 7} fill="rgba(240,197,66,0.55)" fontSize="7" fontFamily="monospace">{l}</text>
          <rect x="210" y={y} width="28" height="8" rx="2" fill="rgba(240,197,66,0.1)" />
          <rect x="210" y={y} width={28 * v} height="8" rx="2" fill="rgba(240,197,66,0.6)" />
        </g>
      ))}
      <g stroke="rgba(248,248,248,0.32)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <line x1="252" y1="100" x2="282" y2="100" />
        <path d="M277 94 L284 100 L277 106" />
      </g>
      <IGPost x={290} y={24} />
    </svg>
  );
}
```

- [ ] **Step 2: Verify build (also exercises the public asset path)**

Run: `pnpm build`
Expected: compiles with no type or lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/project-thumbnails/insta-super-edit.tsx
git commit -m "feat: replace Insta Super Edit thumbnail with Freddie photo + IG post"
```

---

## Task 7: Insta Super Edit "In Progress" badge

**Files:**
- Modify: `src/data/resume.tsx` (Insta Super Edit project entry)
- Modify: `src/components/section/projects-section.tsx`
- Modify: `src/components/project-card.tsx`

- [ ] **Step 1: Add the status field to the Insta Super Edit project**

In `src/data/resume.tsx`, in the `projects` array, find the `Insta Super Edit` entry and add a `status` field immediately after its `active: false,` line:

```tsx
      title: 'Insta Super Edit',
      href: '',
      dates: 'Apr 2026 - Present',
      active: false,
      status: 'in-progress',
```

Leave all other project entries unchanged. (`DATA` is `as const`, so only this entry gets the `status` property — handled type-safely in Step 2.)

- [ ] **Step 2: Pass the status prop in projects-section**

In `src/components/section/projects-section.tsx`, add a `status` prop to the `<ProjectCard />` call. The full updated `<ProjectCard />` element:

```tsx
              <ProjectCard
                href={project.href}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={project.video}
                links={project.links}
                status={'status' in project ? project.status : undefined}
                thumbnailSlot={THUMBNAIL_MAP[project.title]}
              />
```

(`'status' in project` narrows the `as const` union so TypeScript accepts `project.status` only where it exists.)

- [ ] **Step 3: Add the status prop and badge to ProjectCard**

In `src/components/project-card.tsx`, add `status` to the `Props` interface (after `thumbnailSlot?`):

```tsx
  thumbnailSlot?: React.ReactNode;
  status?: 'in-progress';
```

Add `status` to the destructured parameters:

```tsx
export function ProjectCard({ title, href, description, dates, tags, link, image, video, thumbnailSlot, status, links, className }: Props) {
```

Inside the `<div className='relative shrink-0'>` block, immediately **after** the closing of the `links && links.length > 0` block and **before** that div closes, add:

```tsx
        {status === 'in-progress' && (
          <div className='absolute top-2 left-2 flex flex-wrap gap-2'>
            <Badge
              className='flex items-center gap-1.5 text-xs bg-[#F0C542] text-black hover:bg-[#F0C542]/90'
              variant='default'
            >
              In Progress
            </Badge>
          </div>
        )}
```

(Placed at `top-2 left-2` so it never overlaps the `top-2 right-2` link badges. `Badge` is already imported at the top of the file.)

- [ ] **Step 4: Verify**

Run: `pnpm build`
Expected: compiles with no type or lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/resume.tsx src/components/section/projects-section.tsx src/components/project-card.tsx
git commit -m "feat: add In Progress badge to Insta Super Edit project card"
```

---

## Task 8: Final full verification

**Files:** none (verification only)

- [ ] **Step 1: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: build succeeds; no type errors; `/projects` content compiles.

- [ ] **Step 3: Manual visual check (report findings, do not auto-fix)**

Run `pnpm dev`, open the homepage projects grid, and confirm:
- Dinney, ElMawkaa, Haktiv show the `#0c0d14` background; 21Farmer/ISE/12AM unchanged.
- Dinney = 4 tables + party of 3; ElMawkaa = tall MARKET/PLACE + CONCRETE/STEEL/GLASS/BRICK; 21Farmer = ATMOSPHERE/TOPSOIL/SUBSOIL labels; Insta Super Edit = Freddie photo visible + IG post.
- The gold "In Progress" badge appears on the Insta Super Edit card only.

If anything is off, report it for review rather than silently patching.

---

## Self-Review

**Spec coverage:**
- Phase 1 backgrounds → Task 1 ✓
- Photo asset → Task 2; photo wiring → Task 6 ✓
- Replace Dinney/ElMawkaa/21Farmer/ISE → Tasks 3–6 ✓
- Conversion rules (className, DotGrid, drop window assign, semantic defs ids) → Tasks 3–6 ✓
- Semantic defs id rename map (ise-glow/ise-shadow, farmer-glow/farmer-shadow, elmawkaa-glass/elmawkaa-brick) → Tasks 4–6 ✓
- 21Farmer keeps `#040e04` + `<animate>`; ISE keeps `#08000e`; Dinney/ElMawkaa use `#0c0d14` → Tasks 3–6 ✓
- Haktiv/12AM artwork untouched (Haktiv bg only) → Task 1; not in Tasks 3–6 ✓
- ISE "In Progress" badge, status field, gold color → Task 7 ✓
- Verification via lint/build → every task + Task 8 ✓
- Phase 4 animations explicitly out of scope → not in this plan ✓

**Placeholder scan:** No TBD/TODO; every code step contains complete file contents or exact edits.

**Type consistency:** Export names unchanged (`DinneyThumbnail`, `ElmawkaaThumbnail`, `TwentyOneFarmerThumbnail`, `InstaSuperEditThumbnail`) so `index.tsx`/`THUMBNAIL_MAP` need no edits. `status?: 'in-progress'` is consistent across `resume.tsx`, the `'status' in project` guard, and `ProjectCard` Props. `IGPost` defined and used only within `insta-super-edit.tsx`.
