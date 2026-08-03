# Issue tracker: Local Markdown

Work for this repo lives in markdown, in two layers:

- **`TODO.md`** at the repo root — the **backlog**. Parked concerns accumulate here, and this is what `capture` dedups against.
- **`.scratch/<feature-slug>/`** — **work in flight**, one directory per feature, created when a concern wakes and becomes real work.

Both are **tracked in git**. `.scratch/` is named for scratch work but its contents are the durable record of a feature's specs and tickets, so it is committed rather than ignored.

## The backlog: `TODO.md`

A flat list of parked concerns, carrying two conventions and only two:

**The title is the identity.** A bolded title plus a one-line what-and-why. No numeric ids — renumbering a flat backlog is churn, and a name reads at a glance.

**Recurrence enriches in place.** When an idea arrives again, append a dated sub-bullet to the existing item rather than adding a second one.

```markdown
- [ ] **Cull pass before the keeper gate** — reviewer drowns in near-dupes before scoring  <!-- 2026-07-26 -->
  - enriched 2026-08-02: also applies to burst shots from the same song
```

When an item wakes, it graduates to `.scratch/<feature-slug>/` and its `TODO.md` line gets a pointer to that directory rather than being deleted — the backlog keeps the trail of when the idea first landed.

## Work in flight: `.scratch/`

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a single combined tickets file
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

**Two `Status:` vocabularies, and the ticket's kind decides which applies:**

- A **feature ticket** (from `to-tickets`) records triage state — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Where this repo remapped those strings, the mapping is in `triage-labels.md`.
- A **wayfinder ticket** (one carrying a `Type:` line) records progress through the map instead — `claimed` or `resolved`. The presence of `Type:` is the discriminator.

## When a skill says "publish to the issue tracker"

Which layer depends on what is being published:

- **A parked concern** (from `capture`) → append an item to `TODO.md`. It has no feature directory yet, and inventing one would put an unrefined idea in the work-in-flight layer.
- **A spec or a ticket** (from `to-spec`, `to-tickets`, `wayfinder`) → a file under `.scratch/<feature-slug>/`, creating the directory if needed. Derive `<feature-slug>` by kebab-casing the feature's title; where the work graduated from a `TODO.md` item, reuse that item's title so the pointer and the directory match.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
