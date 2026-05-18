# Project Enrichment & Thumbnail Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich project descriptions for ElMawkaa, Haktiv, and 21Farmer, then wire up SVG thumbnail components into each project card using the RSC donut pattern.

**Architecture:** Two commits. Commit 1 updates `src/data/resume.tsx` only (descriptions, hrefs, links). Commit 2 adds `src/components/project-thumbnails/` (7 new files), extends `ProjectCard` with a `thumbnailSlot` prop, and wires `ProjectsSection` to pass thumbnails per project.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, inline SVG React components, RSC donut pattern (Server Component passes ReactNode into Client Component).

---

## File Map

**Commit 1 — descriptions:**
- Modify: `src/data/resume.tsx` — update ElMawkaa, Haktiv, 21Farmer entries

**Commit 2 — thumbnails:**
- Create: `src/components/project-thumbnails/dot-grid.tsx`
- Create: `src/components/project-thumbnails/haktiv.tsx`
- Create: `src/components/project-thumbnails/elmawkaa.tsx`
- Create: `src/components/project-thumbnails/twenty-one-farmer.tsx`
- Create: `src/components/project-thumbnails/dinney.tsx`
- Create: `src/components/project-thumbnails/twelve-am.tsx`
- Create: `src/components/project-thumbnails/insta-super-edit.tsx`
- Create: `src/components/project-thumbnails/index.tsx`
- Modify: `src/components/project-card.tsx` — add `thumbnailSlot?: React.ReactNode`
- Modify: `src/components/section/projects-section.tsx` — import THUMBNAIL_MAP, pass thumbnailSlot

---

## Task 1: Update project descriptions in resume.tsx

**Files:**
- Modify: `src/data/resume.tsx`

- [ ] **Step 1: Update ElMawkaa entry**

In `src/data/resume.tsx`, find the `ElMawkaa` project object (currently around line 229) and replace its `href`, `description`, and `links` fields:

```tsx
{
  title: 'ElMawkaa',
  href: 'https://www.wamda.com/2024/10/ayen-acquires-elmawkaa-seven-figure-deal',
  dates: 'Jun 2018 - Jan 2019',
  active: false,
  description:
    'Egyptian ConTech B2B marketplace — connecting contractors, engineers, and property owners with vetted building material suppliers across MENA. Replaced fragmented, phone-based procurement with a matching algorithm that surfaces competing supplier bids within minutes.\n\n**Acquired by Ayen** (Saudi PropTech leader) in an SAR seven-figure deal (Oct 2024). Traction: **65K app downloads**, **90K unique website visits**, **+20% MoM GMV growth**, **1.3K+ suppliers** and **8K+ contractors** onboarded.',
  technologies: ['React', 'Redux', 'firebase', 'Material-UI'],
  links: [
    {
      type: 'Acquired by Ayen',
      href: 'https://www.wamda.com/2024/10/ayen-acquires-elmawkaa-seven-figure-deal',
      icon: <Icons.globe className='size-3' />
    }
  ],
  image: '',
  video: ''
},
```

- [ ] **Step 2: Update Haktiv entry**

Find the `HAKTIV` project object and replace its `href`, `description`, and the href in its `links` array:

```tsx
{
  title: 'HAKTIV',
  href: 'https://www.haktiv.ai',
  dates: 'Oct 2020 - Apr 2021',
  active: false,
  description:
    'First bug bounty and crowdsourced penetration testing platform in the Middle East and Africa — a marketplace connecting tech companies with vetted security researchers to responsibly disclose vulnerabilities.\n\nThe company has since rebranded as **Haktiv AI**, pivoting to AI-powered GRC compliance automation, now backed by Microsoft, Misk, and Plug and Play.',
  technologies: ['React', 'TypeScript', 'React Query'],
  links: [
    {
      type: 'Website',
      href: 'https://www.haktiv.ai',
      icon: <Icons.globe className='size-3' />
    }
  ],
  image: '',
  video: ''
},
```

- [ ] **Step 3: Update 21Farmer entry**

Find the `21Farmer` project object and replace its `description`:

```tsx
{
  title: '21Farmer',
  href: '',
  dates: 'Feb 2020 - Jun 2020',
  active: false,
  description:
    'Cloud-based precision agriculture platform — combining IoT sensor hardware with a web dashboard for real-time soil health monitoring, automated irrigation control, and multi-plot field tracking via interactive map visualizations.',
  technologies: ['Next.js', 'React', 'Redux', 'Mapbox', 'Material-UI'],
  links: [],
  image: '',
  video: ''
},
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif
git add src/data/resume.tsx
git commit -m "$(cat <<'EOF'
feat: enrich ElMawkaa, Haktiv, and 21Farmer project descriptions

- ElMawkaa: adds acquisition by Ayen (SAR 7-figure deal), traction metrics
  (65K downloads, 90K visits, +20% MoM GMV, 1.3K+ suppliers, 8K+ contractors),
  updates href to acquisition announcement
- Haktiv: adds MEA context, notes rebrand to Haktiv AI + new backers,
  updates href and link to haktiv.ai
- 21Farmer: rewrites description to highlight IoT + precision agriculture focus
EOF
)"
```

---

## Task 2: Create shared DotGrid component

**Files:**
- Create: `src/components/project-thumbnails/dot-grid.tsx`

- [ ] **Step 1: Create the file**

```tsx
export function DotGrid() {
  const dots: React.ReactNode[] = [];
  for (let x = 0; x <= 400; x += 22)
    for (let y = 0; y <= 200; y += 22)
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="rgba(255,255,255,0.05)" />);
  return <g>{dots}</g>;
}
```

---

## Task 3: Create Haktiv thumbnail

**Files:**
- Create: `src/components/project-thumbnails/haktiv.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { DotGrid } from './dot-grid';

export function HaktivThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="rev-h-glow" cx="22%" cy="50%" r="38%">
          <stop offset="0%" stopColor="#F0C542" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F0C542" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-h-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#0A0A0F" />
      <rect width="400" height="200" fill="url(#rev-h-glow)" />
      <DotGrid />
      <g transform="translate(86, 100)" filter="url(#rev-h-sh)">
        <ellipse cx="0" cy="-44" rx="22" ry="5" fill="#F0C542" />
        <path
          d="M-22 -44 Q-20 -30 -18 -12 Q-15 4 0 8 Q15 4 18 -12 Q20 -30 22 -44 Z"
          fill="rgba(240,197,66,0.92)"
          stroke="#F0C542"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="-44" rx="18" ry="3" fill="rgba(140,100,20,0.65)" />
        <path d="M-22 -34 Q-38 -30 -38 -18 Q-38 -6 -24 -6" fill="none" stroke="#F0C542" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 -34 Q38 -30 38 -18 Q38 -6 24 -6" fill="none" stroke="#F0C542" strokeWidth="3" strokeLinecap="round" />
        <path d="M-5 8 Q-7 14 -6 20 L6 20 Q7 14 5 8 Z" fill="#F0C542" />
        <rect x="-18" y="20" width="36" height="6" fill="#F0C542" />
        <rect x="-22" y="26" width="44" height="6" rx="1" fill="#F0C542" />
        <ellipse cx="0" cy="32" rx="22" ry="2.5" fill="rgba(140,100,20,0.7)" />
        <text x="0" y="-16" textAnchor="middle" fill="#1a0a04" fontSize="14" fontFamily="monospace" fontWeight="bold">$</text>
      </g>
      <rect x="172" y="38" width="212" height="126" rx="6"
        fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#rev-h-sh)" />
      <line x1="172" y1="54" x2="384" y2="54" stroke="rgba(248,248,248,0.08)" />
      <text x="180" y="50" fill="rgba(248,248,248,0.4)" fontSize="8" fontFamily="monospace">TOP RESEARCHERS</text>
      {[
        { y: 62, amt: '$2,400', bar: 1 },
        { y: 86, amt: '$1,800', bar: 0.75 },
        { y: 110, amt: '$950', bar: 0.4 },
        { y: 134, amt: '$650', bar: 0.27 },
      ].map(({ y, amt, bar }, i) => (
        <g key={i}>
          <circle cx="188" cy={y + 10} r="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
          <rect x="202" y={y + 6} width={60 * bar + 20} height="3.5" rx="2" fill="rgba(248,248,248,0.2)" />
          <rect x="202" y={y + 13} width={40 * bar + 10} height="2.5" rx="1" fill="rgba(248,248,248,0.09)" />
          <text x="372" y={y + 14} textAnchor="end" fill="#F0C542" fontSize="11" fontFamily="monospace" fontWeight="bold">{amt}</text>
        </g>
      ))}
      <text x="372" y="180" textAnchor="end" fill="rgba(240,197,66,0.65)" fontSize="9" fontFamily="monospace" fontWeight="bold">TOTAL · $24,200</text>
    </svg>
  );
}
```

---

## Task 4: Create ElMawkaa thumbnail

**Files:**
- Create: `src/components/project-thumbnails/elmawkaa.tsx`

- [ ] **Step 1: Create the file**

```tsx
export function ElmawkaaThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <clipPath id="rev-em-glass"><rect width="68" height="54" rx="6" /></clipPath>
        <clipPath id="rev-em-brick"><rect width="68" height="54" rx="6" /></clipPath>
      </defs>
      <rect width="400" height="200" fill="#0A0A0F" />
      <g transform="translate(135, 38)">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <polygon key={i} points={`${10 + i * 17},0 ${4 + i * 17},14 ${16 + i * 17},14`}
            fill="rgba(240,197,66,0.18)" stroke="#F0C542" strokeWidth="1" />
        ))}
        <rect y="14" width="130" height="110" fill="rgba(240,197,66,0.04)" stroke="#F0C542" strokeWidth="1.8" />
        <text x="65" y="56" textAnchor="middle" fill="#F0C542" fontSize="13"
          fontFamily="monospace" fontWeight="bold" letterSpacing="3">MARKETPLACE</text>
        <line x1="20" y1="64" x2="110" y2="64" stroke="rgba(240,197,66,0.35)" strokeWidth="1" />
        <text x="65" y="76" textAnchor="middle" fill="rgba(248,248,248,0.4)" fontSize="8"
          fontFamily="monospace" letterSpacing="2">MENA · CONSTRUCTION</text>
        {[10, 49, 88].map((x, i) => (
          <g key={i}>
            <rect x={x} y="88" width="32" height="28" fill="rgba(248,248,248,0.05)" stroke="rgba(248,248,248,0.22)" strokeWidth="1" />
            <rect x={x + 11} y="98" width="10" height="18" fill="rgba(248,248,248,0.1)" stroke="rgba(248,248,248,0.15)" strokeWidth="0.6" />
            <rect x={x + 4} y="92" width="6" height="4" fill="rgba(240,197,66,0.18)" />
            <rect x={x + 22} y="92" width="6" height="4" fill="rgba(240,197,66,0.18)" />
          </g>
        ))}
      </g>
      {/* Concrete */}
      <g transform="translate(14, 38)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4, 5].map(c => (
          <circle key={`${r}-${c}`} cx={9 + c * 10} cy={9 + r * 9} r="1.6" fill="rgba(248,248,248,0.48)" />
        )))}
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" />
      </g>
      {/* Steel */}
      <g transform="translate(318, 38)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        {[14, 22, 30, 38].map(y => <line key={y} x1="10" y1={y} x2="58" y2={y} stroke="rgba(248,248,248,0.5)" strokeWidth="2.2" />)}
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.85" />
      </g>
      {/* Glass */}
      <g transform="translate(14, 108)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        <g clipPath="url(#rev-em-glass)">
          {[-30, -15, 0, 15, 30, 45, 60, 75].map(x => (
            <line key={x} x1={x} y1="0" x2={x + 44} y2="54" stroke="rgba(77,208,225,0.55)" strokeWidth="1.5" />
          ))}
        </g>
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.55" />
      </g>
      {/* Brick */}
      <g transform="translate(318, 108)">
        <rect width="68" height="54" rx="6" fill="rgba(248,248,248,0.06)" stroke="rgba(248,248,248,0.22)" strokeWidth="1.4" />
        <g clipPath="url(#rev-em-brick)">
          {[10, 24, 38].map((y, r) => [0, 1, 2, 3].map(c => {
            const off = r % 2 === 0 ? 0 : 8;
            return <rect key={`${r}-${c}`} x={4 + c * 16 + off} y={y} width="14" height="10" rx="1.5"
              fill="rgba(217,119,6,0.42)" stroke="rgba(217,119,6,0.6)" strokeWidth="0.6" />;
          }))}
        </g>
        <rect x="8" y="46" width="52" height="3.5" rx="1.5" fill="#F0C542" fillOpacity="0.7" />
      </g>
      {/* Arrows */}
      <g stroke="rgba(240,197,66,0.4)" strokeWidth="1.2" strokeDasharray="4,3" fill="none">
        <line x1="82" y1="64" x2="138" y2="76" />
        <line x1="318" y1="64" x2="262" y2="76" />
        <line x1="82" y1="134" x2="138" y2="120" />
        <line x1="318" y1="134" x2="262" y2="120" />
      </g>
    </svg>
  );
}
```

---

## Task 5: Create 21Farmer thumbnail

**Files:**
- Create: `src/components/project-thumbnails/twenty-one-farmer.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { DotGrid } from './dot-grid';

export function TwentyOneFarmerThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="rev-f-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-f-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#040e04" />
      <rect width="400" height="200" fill="url(#rev-f-glow)" />
      <DotGrid />
      <g filter="url(#rev-f-sh)">
        <rect x="20" y="22" width="172" height="156" fill="none" stroke="rgba(248,248,248,0.18)" strokeWidth="1.2" />
        <rect x="20" y="22" width="172" height="48" fill="rgba(77,208,225,0.08)" />
        <rect x="20" y="70" width="172" height="56" fill="rgba(34,197,94,0.14)" />
        <rect x="20" y="126" width="172" height="52" fill="rgba(34,197,94,0.07)" />
      </g>
      <line x1="20" y1="70" x2="192" y2="70" stroke="rgba(34,197,94,0.35)" strokeWidth="1.2" />
      <line x1="20" y1="126" x2="192" y2="126" stroke="rgba(34,197,94,0.22)" strokeWidth="1" />
      {/* Sun */}
      <g transform="translate(36, 42)">
        <circle r="5" fill="rgba(77,208,225,0.6)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const rad = (a * Math.PI) / 180;
          return (
            <line key={a}
              x1={7 * Math.cos(rad)} y1={7 * Math.sin(rad)}
              x2={10 * Math.cos(rad)} y2={10 * Math.sin(rad)}
              stroke="rgba(77,208,225,0.55)" strokeWidth="1.1" />
          );
        })}
      </g>
      {/* Cloud 1 */}
      <g transform="translate(74, 46)" fill="rgba(77,208,225,0.45)">
        <ellipse cx="0" cy="0" rx="10" ry="4" />
        <ellipse cx="-5" cy="-2" rx="5" ry="3" />
        <ellipse cx="5" cy="-1" rx="6" ry="3" />
      </g>
      {/* Cloud 2 */}
      <g transform="translate(140, 50)" fill="rgba(77,208,225,0.35)">
        <ellipse cx="0" cy="0" rx="9" ry="3.5" />
        <ellipse cx="-4" cy="-2" rx="5" ry="3" />
      </g>
      {/* Grass tufts */}
      <g transform="translate(40, 110)" stroke="rgba(34,197,94,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M0 0 Q-2 -5 -4 -10" />
        <path d="M0 0 Q0 -7 -1 -12" />
        <path d="M0 0 Q3 -5 4 -10" />
      </g>
      <g transform="translate(140, 110)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M0 0 Q-2 -5 -3 -9" />
        <path d="M0 0 Q0 -6 -1 -11" />
        <path d="M0 0 Q3 -4 4 -8" />
      </g>
      {/* Pebbles */}
      <g transform="translate(50, 152)">
        <ellipse cx="0" cy="0" rx="5" ry="3" fill="rgba(34,197,94,0.4)" />
        <ellipse cx="11" cy="-2" rx="4" ry="2.5" fill="rgba(34,197,94,0.32)" />
        <ellipse cx="-7" cy="3" rx="3.5" ry="2.2" fill="rgba(34,197,94,0.35)" />
      </g>
      <g transform="translate(140, 154)">
        <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="rgba(34,197,94,0.36)" />
        <ellipse cx="9" cy="-2" rx="3.5" ry="2" fill="rgba(34,197,94,0.3)" />
        <ellipse cx="-6" cy="2" rx="3" ry="2" fill="rgba(34,197,94,0.32)" />
      </g>
      {/* IoT sensors with waves */}
      {[80, 124, 168].map((cx, i) => (
        <g key={i} filter="url(#rev-f-sh)">
          <line x1={cx} y1="22" x2={cx} y2="70" stroke="rgba(240,197,66,0.4)" strokeWidth="1" strokeDasharray="2,2" />
          <path d={`M${cx - 8} 64 Q${cx} 56 ${cx + 8} 64`} fill="none" stroke="rgba(240,197,66,0.55)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 12} 58 Q${cx} 44 ${cx + 12} 58`} fill="none" stroke="rgba(240,197,66,0.35)" strokeWidth="1.1" strokeLinecap="round" />
          <path d={`M${cx - 15} 52 Q${cx} 32 ${cx + 15} 52`} fill="none" stroke="rgba(240,197,66,0.2)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cx} cy="70" r="6.5" fill="rgba(240,197,66,0.14)" stroke="#F0C542" strokeWidth="1.3" />
          <circle cx={cx} cy="70" r="3" fill="#F0C542" />
        </g>
      ))}
      {/* Dashboard */}
      <rect x="208" y="22" width="172" height="156" rx="4"
        fill="rgba(248,248,248,0.03)" stroke="rgba(248,248,248,0.12)" strokeWidth="1" filter="url(#rev-f-sh)" />
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
        { l: 'Humid', v: 0.80, y: 152 },
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

---

## Task 6: Create Dinney thumbnail

**Files:**
- Create: `src/components/project-thumbnails/dinney.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { DotGrid } from './dot-grid';

export function DinneyThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="400" height="200" fill="#0A0A0F" />
      <DotGrid />
      <rect x="20" y="22" width="190" height="156" fill="none" stroke="rgba(248,248,248,0.2)" strokeWidth="1.2" />
      {[
        { cx: 80, cy: 60, res: false },
        { cx: 160, cy: 60, res: true },
        { cx: 80, cy: 110, res: true },
        { cx: 160, cy: 110, res: false },
        { cx: 120, cy: 160, res: false },
      ].map(({ cx, cy, res }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="none"
            stroke={res ? 'rgba(240,197,66,0.55)' : 'rgba(248,248,248,0.16)'} strokeWidth="1.2" />
          <circle cx={cx} cy={cy} r="13"
            fill={res ? 'rgba(240,197,66,0.1)' : 'rgba(248,248,248,0.04)'}
            stroke={res ? 'rgba(240,197,66,0.4)' : 'rgba(248,248,248,0.1)'} strokeWidth="1" />
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
      {/* Calendar */}
      <rect x="224" y="22" width="156" height="120" rx="4" fill="rgba(248,248,248,0.02)" stroke="rgba(248,248,248,0.1)" strokeWidth="1" />
      <text x="232" y="36" fill="rgba(248,248,248,0.4)" fontSize="8" fontFamily="monospace">RESERVATIONS</text>
      <line x1="224" y1="42" x2="380" y2="42" stroke="rgba(248,248,248,0.08)" />
      {Array.from({ length: 7 }).map((_, d) =>
        Array.from({ length: 5 }).map((_, t) => {
          const filled = [[0, 2], [1, 1], [2, 3], [3, 0], [4, 2], [5, 4], [6, 1], [2, 0]].some(([dd, tt]) => dd === d && tt === t);
          return (
            <rect key={`${d}-${t}`} x={232 + d * 20} y={50 + t * 16} width="16" height="12" rx="2"
              fill={filled ? 'rgba(240,197,66,0.5)' : 'rgba(248,248,248,0.05)'}
              stroke={filled ? '#F0C542' : 'rgba(248,248,248,0.1)'} strokeWidth="0.7" />
          );
        })
      )}
      {/* Party of 3 */}
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

---

## Task 7: Create 12AM Thoughts thumbnail

**Files:**
- Create: `src/components/project-thumbnails/twelve-am.tsx`

- [ ] **Step 1: Create the file**

```tsx
export function TwelveAmThumbnail() {
  const stars: [number, number][] = [
    [42, 18], [88, 12], [150, 28], [280, 8], [340, 32], [58, 86], [170, 72], [300, 62],
    [22, 40], [114, 52], [200, 18], [248, 46], [180, 108], [320, 98], [365, 160], [138, 148], [268, 118],
  ];
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="rev-12-sh"><feDropShadow dx="4" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.9)" /></filter>
        <filter id="rev-12-glow"><feGaussianBlur stdDeviation="16" /></filter>
      </defs>
      <rect width="400" height="200" fill="#06061a" />
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.4 : 0.9} fill="white" fillOpacity={0.32 + (i % 3) * 0.12} />
      ))}
      <circle cx="290" cy="92" r="64" fill="rgba(200,200,240,0.1)" filter="url(#rev-12-glow)" />
      <circle cx="290" cy="92" r="60" fill="#e0deed" filter="url(#rev-12-sh)" />
      <circle cx="266" cy="78" r="8" fill="rgba(0,0,0,0.07)" />
      <circle cx="304" cy="102" r="14" fill="rgba(0,0,0,0.06)" />
      <circle cx="284" cy="118" r="6" fill="rgba(0,0,0,0.07)" />
      <circle cx="308" cy="80" r="54" fill="#06061a" />
      <g filter="url(#rev-12-sh)" transform="rotate(-3 110 110)">
        <rect x="40" y="60" width="140" height="100" rx="10" fill="#16162a" stroke="rgba(129,140,248,0.32)" strokeWidth="1.5" />
        <circle cx="58" cy="78" r="6" fill="rgba(129,140,248,0.4)" />
        <rect x="70" y="74" width="34" height="4" rx="2" fill="rgba(255,255,255,0.16)" />
        <rect x="70" y="83" width="22" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
        <rect x="52" y="104" width="116" height="4" rx="2" fill="rgba(255,255,255,0.13)" />
        <rect x="52" y="116" width="100" height="4" rx="2" fill="rgba(255,255,255,0.13)" />
        <rect x="52" y="128" width="80" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <path d="M58 152 Q52 146 58 142 Q64 146 58 152 Z" fill="rgba(129,140,248,0.55)" />
        <rect x="68" y="146" width="16" height="4" rx="1.5" fill="rgba(129,140,248,0.35)" />
      </g>
    </svg>
  );
}
```

---

## Task 8: Create Insta Super Edit thumbnail

**Files:**
- Create: `src/components/project-thumbnails/insta-super-edit.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { DotGrid } from './dot-grid';

export function InstaSuperEditThumbnail() {
  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="rev-ise-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="rev-ise-sh">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
        </filter>
      </defs>
      <rect width="400" height="200" fill="#08000e" />
      <rect width="400" height="200" fill="url(#rev-ise-glow)" />
      <DotGrid />
      <g transform="translate(10, 0)">
        <polygon points="30,28 38,28 60,142 50,142" fill="rgba(236,72,153,0.24)" />
        <polygon points="48,28 56,28 80,142 66,142" fill="rgba(168,85,247,0.22)" />
        <polygon points="66,28 74,28 96,142 82,142" fill="rgba(77,208,225,0.2)" />
        <polygon points="14,142 102,142 92,160 24,160" fill="rgba(248,248,248,0.07)" stroke="rgba(248,248,248,0.2)" strokeWidth="1" />
        <g transform="translate(58, 104)">
          <circle cx="0" cy="-22" r="7" fill="rgba(248,248,248,0.85)" />
          <path d="M-9 -12 L-11 18 L-7 38 L7 38 L11 18 L9 -12 Z" fill="rgba(248,248,248,0.85)" />
          <path d="M-9 -10 L-22 -14 L-22 -10 L-7 -6 Z" fill="rgba(248,248,248,0.85)" />
        </g>
        <line x1="36" y1="80" x2="36" y2="142" stroke="rgba(248,248,248,0.4)" strokeWidth="1.1" />
        <ellipse cx="36" cy="80" rx="3" ry="4" fill="#F0C542" />
        <ellipse cx="36" cy="80" rx="1.5" ry="2.5" fill="rgba(240,197,66,0.65)" />
        {[18, 30, 42, 54, 66, 78, 90, 102].map((x, i) => (
          <ellipse key={i} cx={x} cy={176} rx={i % 2 === 0 ? 5.5 : 4.5} ry={i % 2 === 0 ? 10 : 8}
            fill="rgba(0,0,0,0.65)" stroke="rgba(248,248,248,0.22)" strokeWidth="0.7" />
        ))}
        <g filter="url(#rev-ise-sh)" transform="rotate(-10 90 50)">
          <rect x="78" y="42" width="26" height="18" rx="2" fill="rgba(248,248,248,0.12)" stroke="rgba(236,72,153,0.55)" strokeWidth="1.2" />
          <rect x="84" y="48" width="14" height="8" rx="1" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="91" cy="52" r="2.2" fill="none" stroke="rgba(236,72,153,0.85)" strokeWidth="0.9" />
          <circle cx="86.5" cy="49.5" r="0.6" fill="rgba(236,72,153,0.85)" />
        </g>
        <g filter="url(#rev-ise-sh)" transform="rotate(8 100 78)">
          <rect x="86" y="68" width="26" height="18" rx="2" fill="rgba(248,248,248,0.12)" stroke="rgba(168,85,247,0.55)" strokeWidth="1.2" />
          <polygon points="94,73 94,82 102,77.5" fill="rgba(168,85,247,0.85)" />
        </g>
      </g>
      <g stroke="rgba(248,248,248,0.3)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <line x1="122" y1="100" x2="150" y2="100" />
        <path d="M145 94 L152 100 L145 106" />
      </g>
      <rect x="158" y="38" width="84" height="124" rx="8"
        fill="rgba(240,197,66,0.1)" stroke="#F0C542" strokeWidth="1.6" filter="url(#rev-ise-sh)" />
      <text x="200" y="76" textAnchor="middle" fill="#F0C542" fontSize="16" fontFamily="monospace" fontWeight="bold">AI</text>
      <line x1="172" y1="84" x2="228" y2="84" stroke="rgba(240,197,66,0.18)" strokeWidth="0.8" />
      {[
        { l: 'Quality', v: 0.88, y: 100 },
        { l: 'Rank', v: 0.72, y: 120 },
        { l: 'Curate', v: 0.95, y: 140 },
      ].map(({ l, v, y }) => (
        <g key={l}>
          <text x="170" y={y + 6} fill="rgba(240,197,66,0.55)" fontSize="7" fontFamily="monospace">{l}</text>
          <rect x="200" y={y} width="32" height="8" rx="2" fill="rgba(240,197,66,0.1)" />
          <rect x="200" y={y} width={32 * v} height="8" rx="2" fill="rgba(240,197,66,0.6)" />
        </g>
      ))}
      <g stroke="rgba(248,248,248,0.3)" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <line x1="248" y1="100" x2="276" y2="100" />
        <path d="M271 94 L278 100 L271 106" />
      </g>
      {/* Story */}
      <g filter="url(#rev-ise-sh)">
        <rect x="284" y="30" width="44" height="110" rx="6" fill="#0a0a0f" stroke="rgba(236,72,153,0.6)" strokeWidth="1.4" />
        <rect x="296" y="34" width="20" height="3" rx="1.5" fill="rgba(248,248,248,0.15)" />
        <rect x="288" y="42" width="36" height="9" fill="rgba(0,0,0,0.5)" />
        <rect x="290" y="44" width="6" height="5" rx="1" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <circle cx="293" cy="46.5" r="1.4" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.6" />
        <rect x="316" y="44" width="6" height="5" rx="1.2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <circle cx="319" cy="46.5" r="1.2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.6" />
        <circle cx="320.5" cy="44.8" r="0.5" fill="rgba(248,248,248,0.8)" />
        <rect x="288" y="54" width="36" height="56" rx="2" fill="rgba(236,72,153,0.4)" />
        <path d="M293 122 Q290 119 293 116 Q296 119 293 122 Z" fill="rgba(248,248,248,0.7)" />
        <circle cx="302" cy="119" r="2" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" />
        <path d="M310 116 L316 119 L310 122" fill="none" stroke="rgba(248,248,248,0.7)" strokeWidth="0.7" strokeLinejoin="round" />
      </g>
      {/* Reel */}
      <g filter="url(#rev-ise-sh)">
        <rect x="336" y="44" width="44" height="110" rx="6" fill="#0a0a0f" stroke="rgba(168,85,247,0.55)" strokeWidth="1.4" />
        <rect x="348" y="48" width="20" height="3" rx="1.5" fill="rgba(248,248,248,0.15)" />
        <rect x="340" y="56" width="36" height="80" rx="2" fill="rgba(168,85,247,0.4)" />
        <circle cx="358" cy="96" r="9" fill="rgba(0,0,0,0.45)" />
        <polygon points="355,91 355,101 364,96" fill="rgba(248,248,248,0.9)" />
        <rect x="342" y="58" width="9" height="9" rx="1.5" fill="none" stroke="rgba(248,248,248,0.6)" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
```

---

## Task 9: Create barrel export with THUMBNAIL_MAP

**Files:**
- Create: `src/components/project-thumbnails/index.tsx`

- [ ] **Step 1: Create the file**

Note: file extension is `.tsx` because it contains JSX (React element instantiation).

```tsx
import { DinneyThumbnail } from './dinney';
import { ElmawkaaThumbnail } from './elmawkaa';
import { HaktivThumbnail } from './haktiv';
import { InstaSuperEditThumbnail } from './insta-super-edit';
import { TwelveAmThumbnail } from './twelve-am';
import { TwentyOneFarmerThumbnail } from './twenty-one-farmer';

export { DinneyThumbnail, ElmawkaaThumbnail, HaktivThumbnail, InstaSuperEditThumbnail, TwelveAmThumbnail, TwentyOneFarmerThumbnail };

export const THUMBNAIL_MAP: Record<string, React.ReactNode> = {
  'HAKTIV': <HaktivThumbnail />,
  'ElMawkaa': <ElmawkaaThumbnail />,
  '21Farmer': <TwentyOneFarmerThumbnail />,
  'Dinney': <DinneyThumbnail />,
  '12AM Thoughts': <TwelveAmThumbnail />,
  'Insta Super Edit': <InstaSuperEditThumbnail />,
};
```

---

## Task 10: Update ProjectCard to accept thumbnailSlot

**Files:**
- Modify: `src/components/project-card.tsx`

- [ ] **Step 1: Add thumbnailSlot to Props interface**

In `src/components/project-card.tsx`, find the `Props` interface (around line 21) and add `thumbnailSlot`:

```ts
interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  thumbnailSlot?: React.ReactNode;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}
```

- [ ] **Step 2: Destructure thumbnailSlot and update image slot render logic**

Find the `ProjectCard` function signature (around line 38) and add `thumbnailSlot` to destructuring:

```ts
export function ProjectCard({ title, href, description, dates, tags, link, image, video, thumbnailSlot, links, className }: Props) {
```

Then find the image slot block inside the JSX (the section that currently reads `{video ? ... : image ? ... : ...}`, around line 63) and replace it with:

```tsx
{video ? (
  <video src={video} autoPlay loop muted playsInline className='w-full h-48 object-cover' />
) : thumbnailSlot ? (
  <div className='w-full h-48 overflow-hidden'>{thumbnailSlot}</div>
) : image ? (
  <ProjectImage src={image} alt={title} />
) : (
  <div className='w-full h-48 bg-muted' />
)}
```

---

## Task 11: Update ProjectsSection to pass thumbnailSlot

**Files:**
- Modify: `src/components/section/projects-section.tsx`

- [ ] **Step 1: Import THUMBNAIL_MAP and pass thumbnailSlot**

Replace the entire file content with:

```tsx
import BlurFade from '@/components/magicui/blur-fade';
import { ProjectCard } from '@/components/project-card';
import { THUMBNAIL_MAP } from '@/components/project-thumbnails';
import { DATA } from '@/data/resume';

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection() {
  return (
    <section id='projects'>
      <div className='flex min-h-0 flex-col gap-y-8'>
        <div className='flex flex-col gap-y-4 items-center justify-center'>
          <div className='flex items-center w-full'>
            <div className='flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent' />
            <div className='border bg-primary z-10 rounded-xl px-4 py-1'>
              <span className='text-background text-sm font-medium'>Projects</span>
            </div>
            <div className='flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent' />
          </div>
          <div className='flex flex-col gap-y-3 items-center justify-center'>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>Check out my side projects</h2>
            <p className='text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center'>
              From simple websites to complex web applications. Here are a few of my favorites.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-200 mx-auto auto-rows-fr'>
          {DATA.projects.map((project, id) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + id * 0.05} className='h-full'>
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
                thumbnailSlot={THUMBNAIL_MAP[project.title]}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 12: Verify and commit thumbnails

- [ ] **Step 1: Verify TypeScript compiles**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif && pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 2: Start dev server and verify visually**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif && pnpm dev
```

Open http://localhost:3000 and scroll to the Projects section. Each card should display its SVG thumbnail instead of the grey placeholder. Verify all 6 thumbnails render correctly. The 21Farmer sensor dot should pulse.

- [ ] **Step 3: Commit**

```bash
cd /Users/antwan/files/side-projects/portfolio/AntwanSherif
git add \
  src/components/project-thumbnails/dot-grid.tsx \
  src/components/project-thumbnails/haktiv.tsx \
  src/components/project-thumbnails/elmawkaa.tsx \
  src/components/project-thumbnails/twenty-one-farmer.tsx \
  src/components/project-thumbnails/dinney.tsx \
  src/components/project-thumbnails/twelve-am.tsx \
  src/components/project-thumbnails/insta-super-edit.tsx \
  src/components/project-thumbnails/index.tsx \
  src/components/project-card.tsx \
  src/components/section/projects-section.tsx
git commit -m "$(cat <<'EOF'
feat: add SVG thumbnails to project cards via RSC donut pattern

Ports 6 inline-SVG thumbnail components from Claude Design export into
src/components/project-thumbnails/. Each component is a pure server-renderable
function (no hooks, no browser APIs). Shared dot-grid background extracted to
dot-grid.tsx. THUMBNAIL_MAP in index.tsx maps project title → ReactNode.

ProjectCard gains a thumbnailSlot prop (ReactNode, renders ahead of image/video
fallbacks). ProjectsSection (Server Component) looks up and passes the thumbnail
for each project — zero client JS shipped for thumbnail rendering.
EOF
)"
```
