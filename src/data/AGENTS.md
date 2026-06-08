# Data

Single source of truth for all portfolio content. Components consume from here — never hardcode content.
Owns: resume data, work-story content. Does NOT own: UI rendering (`src/components/`), routing (`src/app/`).

## The public/private split

Content here lives in **two repos** because this portfolio repo is **public** (it doubles as the
GitHub profile repo, `AntwanSherif/AntwanSherif`), but the work-story details are sensitive.

| File / path | Repo | Visibility | Contents |
|-------------|------|-----------|----------|
| `resume.tsx` | `AntwanSherif` | public | Name, bio, jobs, projects, skills (the `DATA` export) |
| `stories.tsx` | `AntwanSherif` | public | **3-line re-export wrapper only — no content** |
| `stories-private/` | `AntwanSherif-stories` | **private** | Real story content + `admin.ts` password generator (git submodule) |

`stories-private/` is a **git submodule** — a separate private repo (`AntwanSherif/AntwanSherif-stories`)
mounted at this path. The public repo stores only a pinned commit pointer to it, not the files.
See root CLAUDE.md → "Story Content Split" for how submodules work.

## Contracts & Invariants

- **`stories.tsx` must never contain story content.** It stays a thin `export * from "./stories-private/stories"`.
  Putting content back in it would leak it into the public repo. The wrapper exists so consumers keep
  importing `@/data/stories` unchanged.
- **The public import path is `@/data/stories`** — four consumers depend on it (stories pages,
  `flow-chain.tsx`, `story-card.tsx`). Never change the path; change content inside the submodule.
- **The submodule's exports must match what consumers expect**: types `Metric`, `FlowStep`, `Feature`,
  `StarStory`, `UiSection`, `Story`, and the `stories: Story[]` array. The wrapper re-exports all of them.
- **A `pnpm build` clone needs the submodule.** Vercel requires a deploy key for `AntwanSherif-stories`
  or the build fails at submodule-clone time.

## Patterns

**Editing story content (edit-in-place workflow):**
```bash
# 1. Edit inside the submodule (it's a full working clone)
$EDITOR src/data/stories-private/stories.tsx

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

- ❌ Pasting story content into `stories.tsx` (leaks to public repo).
- ❌ Editing `stories-private/stories.tsx` and forgetting step 2 — the public build keeps using the old
  pinned commit until the pointer is bumped.
- ❌ Committing the pointer bump (step 2) without first pushing the submodule (step 1) — the public repo
  would point at a commit that doesn't exist on the remote, breaking everyone else's clone and Vercel.

## Related Context

- How submodules work + Vercel deploy key: root CLAUDE.md → "Story Content Split"
- Story page routes: `../app/(stories)/`
- Story UI components: `../components/story-card.tsx`, `../components/flow-chain.tsx`
