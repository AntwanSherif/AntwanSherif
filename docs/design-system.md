# Design System

Design reference for the portfolio. The always-on conventions (server-first, `cn()`, reduced-motion) live in `CLAUDE.md`; the tokens, type, and interaction spec live here. Build status and roadmap live in the plan (`~/.claude/plans/antwan-portfolio.md`).

## Color tokens (dark-first palette — set in `src/app/globals.css`)

```css
--background: #0a0a0f;
--surface: #13131a;
--accent-1: #f0c542; /* gold — primary CTA, highlights */
--accent-2: #4dd0e1; /* cyan — tags, links */
--accent-ai: #7c3aed; /* violet — AI tools badge only */
--text-primary: #f8f8f8;
--text-muted: #888;
```

## Typography

- **Display**: Cal Sans (`@calcom/font`) — hero headings
- **Body**: Geist Sans (`geist` package)
- **Mono**: Geist Mono (`geist` package)

Install: `pnpm add geist @calcom/font`

## Tailwind v4 rules

- Use `@theme inline { }` for custom tokens, NOT `tailwind.config.ts` theme extensions
- Use CSS variable syntax: `--color-accent-1: var(--accent-1)`
- Arbitrary values use standard Tailwind: `bg-[#F0C542]`

## Micro-interactions (spec by surface)

All animations respect `prefers-reduced-motion` (CSS media query + Motion's `useReducedMotion()`) and are GPU-accelerated (`transform3d`, `will-change: transform`) where possible.

| Interaction                              | Location                          |
| ---------------------------------------- | --------------------------------- |
| Diagonal stripe scramble on load + hover | Hero name                         |
| Magnetic cursor attraction               | Hero CTA buttons                  |
| Full-page color wipe transition          | Route changes (`AnimatePresence`) |
| Staggered fade-up on scroll              | Section entries                   |
| 3D perspective tilt on mouse move        | Project cards                     |
| Shimmer sweep on hover                   | Tech tags                         |
| Scale pop + tooltip                      | Skill icons                       |
