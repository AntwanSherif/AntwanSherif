# Data

Single source of truth for all portfolio content. Components consume from here — never hardcode content.
Owns: resume data, work-story content. Does NOT own: UI rendering (`src/components/`), routing (`src/app/`).

## The public/private split

This portfolio repo is **public** (it doubles as the GitHub profile repo, `AntwanSherif/AntwanSherif`).
Story data is split into **two tiers** so the un-gated `/stories` list can show teasers while the
sensitive narrative stays private and gated:

| File / path | Repo | Visibility | Contents |
|-------------|------|-----------|----------|
| `resume.tsx` | `AntwanSherif` | public | Name, bio, jobs, projects, skills (the `DATA` export) |
| `story-types.ts` | `AntwanSherif` | public | Shared types: `Metric`, `StoryCardData`, `StoryDetail`, `FlowStep`, … |
| `story-cards.tsx` | `AntwanSherif` | public | **PUBLIC teaser data** (`storyCards`): slug, company, initiative, tagline, metrics, techTags |
| `story-details.tsx` | `AntwanSherif` | public | Thin wrapper: `export * from "./stories-private/details"` |
| `stories-private/` | `AntwanSherif-stories` | **private** | `details.tsx` (the narrative) + `admin.ts` generator + `companies.txt` (git submodule) |

`stories-private/` is a **git submodule** — a separate private repo mounted at this path. The public repo
stores only a pinned commit pointer. See root CLAUDE.md → "Story Content Split" for how submodules work.

## Contracts & Invariants

- **The public `/stories` list page is NOT gated.** It must import **only** `storyCards` from
  `@/data/story-cards`. **Never** import `@/data/story-details` (or `storyDetails`) into the list page or
  any un-gated/client component — that re-leaks the narrative onto a public page. Guarded by
  `story-cards.test.ts` (asserts `storyCards` carries no private fields).
- **`storyCards` (public) holds teaser fields only**: `slug`, `company`, `initiative`, `tagline`,
  `metrics`, `techTags`. No `problem`/`star`/`challenges`/etc.
- **`storyDetails` (private, keyed by slug)** holds the narrative: `role`, `period`, `problem`,
  `architectureFlow?`, `uiSections?`, `features?`, `bulkUploadFlow?`, `challenges?`, `star?`. Imported
  **only** by the gated `/stories/[slug]` page (via `@/data/story-details`), which merges card + detail.
- **A `pnpm build` clone needs the submodule.** Vercel does NOT support private submodules — the build
  fetches the content via a token instead (see root CLAUDE.md → "Story Content Split" → Vercel).

## Patterns

**Editing story content (edit-in-place workflow):**
```bash
# 1. Edit inside the submodule (it's a full working clone).
#    Narrative -> details.tsx (private). Teaser (impact/tagline) -> ../story-cards.tsx (public).
$EDITOR src/data/stories-private/details.tsx

# 2. Publish — runs the two-step dance safely (push private repo, THEN bump public pointer)
pnpm stories:publish "edit: <what changed>"
```
`pnpm stories:publish` (→ `scripts/publish-stories.sh`) commits & pushes the content to the private repo,
then bumps the pinned pointer in the public repo and pushes that — in the correct order. Run
`pnpm stories:status` anytime to see whether the submodule has uncommitted changes or the pointer is stale.

Doing it by hand is the same two commits across two repos:
```bash
cd src/data/stories-private && git commit -am "edit: ..." && git push   # PRIVATE repo
cd ../../.. && git add src/data/stories-private \
  && git commit -m "chore: bump stories submodule" && git push          # PUBLIC repo (moved pointer)
```

**Fresh clone / new machine:** `git clone ... && git submodule update --init` (or
`git clone --recurse-submodules ...`). Without this, `stories-private/` is an empty directory and the
build fails.

**Editing public data (bio, jobs, projects):** just edit `resume.tsx` directly — it's a normal file.

## Anti-patterns

- ❌ Importing `@/data/story-details` / `storyDetails` into the public `/stories` list page or any client
  component — re-leaks the narrative onto an un-gated page (the exact bug this split fixed).
- ❌ Putting narrative fields (`problem`, `star`, …) into the public `story-cards.tsx`.
- ❌ Editing `stories-private/details.tsx` and forgetting step 2 — the public build keeps using the old
  pinned commit until the pointer is bumped.
- ❌ Committing the pointer bump (step 2) without first pushing the submodule (step 1) — the public repo
  would point at a commit that doesn't exist on the remote, breaking everyone else's clone and Vercel.

## Related Context

- How submodules work + Vercel token setup: root CLAUDE.md → "Story Content Split"
- Story page routes: `../app/(stories)/`
- Story UI components: `../components/story-card.tsx`, `../components/flow-chain.tsx`
