# Components

Shared UI components for the portfolio. Owns: section layouts, animation primitives, DS atoms.
Does NOT own: page routing (`src/app/`), content data (`src/data/`).

## Entry Points

- `section/` - Homepage section components (Hero, About, Work, Projects, etc.)
- `magicui/` - Magic UI animated primitives (shimmer, blur-fade, etc.)
- `ui/` - shadcn/ui Radix primitives (button, card, badge, etc.)
- `SourceField.tsx` / `SourceFieldClient.tsx` - Canvas particle background
- `ScrambleText.tsx` - Diagonal scramble text effect
- `CtaButton.tsx` - CTA button/link with restrained hover lift + press feedback (CSS-only, reduced-motion safe)

## Contracts & Invariants

- All personal data comes from `src/data/resume.tsx` (DATA export) — never hardcode
- Client components (`'use client'`) only when component uses hooks, mouse events, or canvas
- All animations must respect `prefers-reduced-motion` via `useReducedMotion()` or CSS media query
- Use `cn()` from `src/lib/utils.ts` for conditional classnames — no template literal joins

## Patterns

Adding a new section:
1. Create file in `section/` (e.g. `section/PersonalSection.tsx`)
2. Import and render in `src/app/page.tsx`
3. Pull data from `DATA` in `src/data/resume.tsx`

Adding a client-only component:
1. Add `'use client'` at top
2. Wrap in `dynamic(() => import(...), { ssr: false })` if heavy

## Anti-patterns

- Never import page-level data anywhere except from `src/data/resume.tsx`
- Don't put route logic in components — that's `src/app/`
- Avoid inline `style={{}}` for values that have Tailwind equivalents

## Related Context

- Design system tokens: root CLAUDE.md Design System section
- App routes: `../app/` (Next.js App Router)

## Analytics
Event tracking lives in `src/components/analytics/` — see its `AGENTS.md`. When you add or change a feature, keep events in sync (verify / enrich / create).
