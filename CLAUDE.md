# Portfolio Build — Claude Instructions

## Plan Reference

Full build plan is at `~/.claude/plans/antwan-portfolio.md`. Always read it before starting a session to know current phase and pending tasks.

---

## Project Overview

Antwan Sherif's personal portfolio — senior frontend engineer + AI tools builder.

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` syntax — NOT v3 config objects)
- **Animations**: Motion (Framer Motion v12)
- **Components**: shadcn/ui (Radix primitives) + Magic UI
- **Content**: `content-collections` for MDX blog posts
- **Package manager**: `pnpm`

---

## Key File Locations

| What                       | Where                     |
| -------------------------- | ------------------------- |
| All personalizable data    | `src/data/resume.tsx`     |
| Homepage sections          | `src/app/page.tsx`        |
| Global styles + CSS tokens | `src/app/globals.css`     |
| Section components         | `src/components/section/` |
| Magic UI components        | `src/components/magicui/` |
| shadcn/ui primitives       | `src/components/ui/`      |
| Skill SVG icons            | `src/components/ui/svgs/` |
| Blog MDX files             | `content/`                |
| Blog app route             | `src/app/blog/`           |

---

## Design System

### Color Tokens (dark-first palette — set these in `globals.css`)

```css
--background: #0a0a0f;
--surface: #13131a;
--accent-1: #f0c542; /* gold — primary CTA, highlights */
--accent-2: #4dd0e1; /* cyan — tags, links */
--accent-ai: #7c3aed; /* violet — AI tools badge only */
--text-primary: #f8f8f8;
--text-muted: #888;
```

### Typography

- **Display**: Cal Sans (`@calcom/font`) — hero headings
- **Body**: Geist Sans (`geist` package)
- **Mono**: Geist Mono (`geist` package)

Install: `pnpm add geist @calcom/font`

### Tailwind v4 Rules

- Use `@theme inline { }` for custom tokens, NOT `tailwind.config.ts` theme extensions
- Use CSS variable syntax: `--color-accent-1: var(--accent-1)`
- Arbitrary values use standard Tailwind: `bg-[#F0C542]`

---

## Architecture Rules

1. **Data lives in `src/data/resume.tsx`** — all personal content (name, bio, jobs, projects, skills) goes here. Components consume `DATA` from this file.
2. **Sections are standalone components** in `src/components/section/` — each section gets its own file.
3. **Client components** (`'use client'`) only when needed: canvas animations, mouse events, `useEffect`, `useState`.
4. **Server components by default** — page.tsx and section wrappers stay RSC.

---

## Planned Sections (homepage, in order)

1. **Hero** — name (scramble text effect), role, tagline, SourceField canvas bg, magnetic CTAs
2. **About** — 2–3 paragraph narrative, avatar, social links
3. **Work Experience** — timeline component (reuse/restyle existing `WorkSection`)
4. **Projects** — 2-col card grid, AI badge (violet), 3D tilt, shimmer tags
5. **Skills** — icon grid grouped by category
6. **Personal Life / Beyond the Code** — photo placeholders, hobby tags, "currently into"
7. **Contact** — email CTA + socials

Sections currently wired up: Hero (basic), About, Work, Education, Skills, Projects, Hackathons, Contact.

Sections to build/replace per plan: Hero (full visual), Personal Life, remove Hackathons from homepage.

---

## Key Components to Build (not yet created)

- `src/components/SourceField.tsx` — canvas particle field for hero bg (`'use client'`)
- `src/components/ScrambleText.tsx` — diagonal stripe scramble on hero name
- `src/components/MagneticButton.tsx` — magnetic cursor CTA button
- `src/components/PersonalSection.tsx` — "Beyond the Code" section

---

## Micro-Interactions

All animations must:

- Respect `prefers-reduced-motion` via `@media (prefers-reduced-motion: reduce)` and Motion's `useReducedMotion()`
- Be GPU-accelerated where possible (`will-change: transform`, `transform3d`)

| Interaction                              | Location                          |
| ---------------------------------------- | --------------------------------- |
| Diagonal stripe scramble on load + hover | Hero name                         |
| Magnetic cursor attraction               | Hero CTA buttons                  |
| Full-page color wipe transition          | Route changes (`AnimatePresence`) |
| Staggered fade-up on scroll              | Section entries                   |
| 3D perspective tilt on mouse move        | Project cards                     |
| Shimmer sweep on hover                   | Tech tags                         |
| Scale pop + tooltip                      | Skill icons                       |

---

## Coding Conventions

- Prefer editing existing components over creating new files
- Keep `src/data/resume.tsx` as the single source of truth for all content
- Use `cn()` (from `src/lib/utils.ts`) for conditional classnames
- Dynamic imports for heavy client components: `dynamic(() => import(...), { ssr: false })`
- All images via `next/image` with explicit `width`/`height` or `fill`
- No inline styles — use Tailwind classes or CSS variables

---

## Current Status (as of 2026-04-09)

- Data file exists with placeholder Dillion Verma content (needs replacing with Antwan's data)
- All base sections wired up on homepage
- Custom color palette **not yet applied** to globals.css
- Hero visual effects (SourceField, scramble, magnetic) **not yet built**
- Personal Life section **not yet built**
- Fonts (Cal Sans, Geist) **not yet installed**

