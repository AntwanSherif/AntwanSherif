# Portfolio Build — Claude Instructions

## Intent Layer

Child `AGENTS.md` files hold each area's local patterns; read the relevant one before editing (global rule):

- **Components**: `src/components/AGENTS.md` - Shared UI components, section layout, animation primitives
- **Data**: `src/data/AGENTS.md` - Content source of truth + the public/private story split (read before touching `story-cards.tsx`, `story-details.tsx`, or `stories-private/`)
- **Analytics**: `src/components/analytics/AGENTS.md` - Cookieless Umami event tracking (client + server channels). Read before adding/changing tracking, swapping the analytics vendor, or debugging events. As-built values + runbook: `docs/analytics-operations.md`; decision + alternatives: `docs/adr/2026-06-13-analytics-stack-umami-self-hosted.md`.

### Global Invariants

- All personal content lives in `src/data/resume.tsx` — never hardcode content in components
- Server components by default; add `'use client'` only for interactivity/hooks
- Use `cn()` from `src/lib/utils.ts` for all conditional classnames
- Package manager is **pnpm**

## Story Content Split (public/private)

This repo is **public** (it's the GitHub profile repo). Work-story content is sensitive, so it's split out
into a **private git submodule**. Full details + workflow live in `src/data/AGENTS.md` — read that before
editing any story content. Quick orientation:

- **Public repo** (`AntwanSherif/AntwanSherif`): everything except the story narrative — including the
  PUBLIC teaser data (`src/data/story-cards.tsx`) shown on the un-gated `/stories` list.
- **Private repo** (`AntwanSherif/AntwanSherif-stories`): the story narrative (`details.tsx`), mounted as a
  submodule at `src/data/stories-private/` and rendered only on the gated `/stories/[slug]` pages.

See `src/data/AGENTS.md` for the public/private field boundary (and the leak it prevents).

### How submodules work (one-paragraph primer)

A submodule is a nested git repo whose files the parent does NOT store — the parent stores only a **pinned
commit pointer** (a "bookmark") plus `.gitmodules` (the URL→path map). Editing the private repo does NOT
change the public build until you **bump the pointer** in the public repo. That's two commits for one
logical change (commit the content in the submodule, then commit the moved pointer in the parent) — it's
deliberate, so the public build is always reproducible.

### Editing story content (edit-in-place)

```bash
$EDITOR src/data/stories-private/details.tsx   # narrative (private); teaser -> src/data/story-cards.tsx
pnpm stories:publish "edit: ..."     # pushes private repo, then bumps public pointer (right order)
```
`pnpm stories:publish` wraps the two-step dance safely; `pnpm stories:status` shows if the pointer is
stale. **Order matters** (the script enforces it): push the submodule FIRST, then bump the pointer.
Bumping a pointer to an unpushed commit breaks every fresh clone and Vercel.

### Fresh clone

`git clone --recurse-submodules ...` (or `git submodule update --init` after a plain clone). Without it,
`stories-private/` is empty and `pnpm build` fails.

### Vercel

**Vercel does NOT support private git submodules** — its docs state private/SSH submodules fail during the
build. So the build must fetch the private content itself with a token:

1. Fine-grained GitHub PAT scoped to `AntwanSherif-stories`, **Contents: Read-only**.
2. Add it to Vercel as env var `STORIES_REPO_TOKEN` (plus `STORIES_SEED`; remove `STORIES_PASSWORD`).
3. Override the Vercel **Install Command**:
   ```bash
   rm -rf src/data/stories-private && \
   git clone --depth 1 https://x-access-token:$STORIES_REPO_TOKEN@github.com/AntwanSherif/AntwanSherif-stories.git src/data/stories-private && \
   pnpm install
   ```

This drops the real content where the wrapper expects it, bypassing submodule auth. **Not yet configured** —
required before the first deploy.

## Story Gate (password)

`/stories/*` is password-protected by `src/proxy.ts` (Next 16 middleware, edge runtime).
Passwords are **per-company and rotate monthly**, derived from one secret:

```
password = Company-<10 base62>   e.g.  Acme-7f3k9x2qph
code      = base62(HMAC-SHA256(STORIES_SEED, "<slug>|<YYYY-MM>"))[:10]
```

- **Validation** lives in `src/lib/stories-password.ts` (`validate`), used by both `proxy.ts`
  and the unlock server action. Edge-safe (Web Crypto only). Test-covered: `*.test.ts` (`pnpm test`).
- **Generation** is private: `src/data/stories-private/admin.ts` (in the submodule). Run
  `node src/data/stories-private/admin.ts <Company>` for one company, or `… admin.ts list` to print
  every company in the private `companies.txt` roster. Don't add a password generator to the public repo.
- **The only secret is `STORIES_SEED`** — a static, high-entropy value in `.env.local` (gitignored)
  and Vercel. Never `STORIES_PASSWORD` anymore. Rotating the seed invalidates every company at once.
- **Grace + expiry:** the current and previous month both validate; the auth cookie also has a 7-day
  `maxAge`. A shared password naturally dies ~1 month after the period it was issued in.

## Dev Server Ports

Start the dev server with **`pnpm dev`** (which runs `bin/dev`). This repo owns the **`3130–3139`** slot — see `~/.config/dev-ports.md`.

- The app pins **`3130`** but is a **leaf** (nothing addresses it by URL), so on collision it **auto-increments** up the slot, then spills to `8000–8999`. It is never blocked.
- **Never assume the port; never hardcode `3000`.** The *actually bound* port is written to **`.dev/port`** at the repo root — read it to find the running server.
- **Never kill a process to free a port** (`lsof | kill`, `fuser -k`). Collisions are absorbed by auto-increment, so there's nothing to clear.

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

Color tokens (dark-first gold/cyan/violet palette), typography (Cal Sans + Geist), Tailwind v4 token rules, and the micro-interaction spec by surface: `docs/design-system.md`. Roadmap, planned sections, and build status live in the plan (see *Plan Reference*), not here.

---

## Conventions

- **`src/data/resume.tsx` is the single source of truth for all content** (name, bio, jobs, projects, skills) — components consume `DATA` from it; never hardcode content inline. Prefer editing existing components over adding files.
- **Server components by default**; add `'use client'` only when needed (canvas animations, mouse events, `useEffect`/`useState`). `page.tsx` and section wrappers stay RSC.
- **Sections are standalone components** in `src/components/section/`, one file each.
- **`cn()`** (`src/lib/utils.ts`) for all conditional classnames; **no inline styles** — Tailwind classes or CSS variables.
- **Dynamic imports** for heavy client components: `dynamic(() => import(...), { ssr: false })`.
- **All images via `next/image`** with explicit `width`/`height` or `fill`.
- **Animations** respect `prefers-reduced-motion` (CSS media query + Motion's `useReducedMotion()`) and are GPU-accelerated (`transform3d`, `will-change: transform`) where possible. Interaction-by-surface spec: `docs/design-system.md`.

