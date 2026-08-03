# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.

Where any of these files don't exist, **proceed silently** — `antwan:domain-modeling` (reached via `grill-with-docs` and `improve-codebase-architecture`) creates them lazily, when terms or decisions actually get resolved.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 2026-07-14-01-event-sourced-orders.md
│   └── 2026-07-14-02-postgres-for-write-model.md
└── src/
```

`antwan:domain-modeling` owns the decision-record format — filenames, the mandatory frontmatter, the index table, and how superseding works. It is the single source of truth; read it there rather than inferring the convention from the tree above.

Multi-context repo (presence of `CONTEXT-MAP.md` at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `antwan:domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing decision record, surface it explicitly rather than silently overriding. Cite the record by **what it decided**, not by a number — a bare id is something the reader has to go look up:

> _Contradicts the event-sourced-orders decision — but worth reopening because…_
