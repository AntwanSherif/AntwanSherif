---
captured: 2026-08-17
session: 59a41ec7-ab39-457e-9267-d251d1314e98
repo: ~/files/side-projects/encoreshot (AntwanSherif/encoreshot)
branch: main (23 commits ahead of origin/main, unpushed)
surface: both
---

# Post idea: "I parallelised my work and built a data-loss machine"

## The story in one paragraph

I run several coding sessions at once, each in its own git worktree, each with its own dev servers and its own database. Isolation is the whole point — one session's half-finished migration must not reach another's. But isolation you cannot escape from is a cage rather than a sandbox: real photo uploads made inside a worktree were stranded there, so the honest consequence was "never upload anything except on main," which is not how anyone works. So I built an escape hatch — promote a night's photos from a worktree's database into main, behind a mandatory human gate. Then the escape hatch needed its own safety, and that is where it got interesting. A manual test run found four bugs. A code review **of the fixes for those four bugs** found eight more. Asking one further question — "is this bug a class or an instance?" — found a ninth, two files away, in the undo path. The worst of them was not a crash. It was a command that printed `📸 snapshotting main before promoting` and wrote nothing at all.

## The reframe to land

**The dangerous bug is not the one that crashes. It is the one that prints reassurance.** A crash is a request for attention. A green checkmark attached to something that did not happen is worse than silence, because it actively spends the trust you would otherwise have used to go and check.

## The beats (each a candidate section)

1. **Why worktrees.** Several sessions in parallel, each on a branch, each needing servers and data. Isolation is the feature.
2. **Isolation becomes a cage.** Each worktree gets its own database, preseeded as a byte-identical copy of main's. Real work done inside one is stranded. The rule it silently imposes: never do real work off main.
3. **The escape hatch.** Promote a Memory and its photos into main, human-gated, dry-run by default, with a promotion log so an undo can name exactly what one promotion created.
4. **The escape hatch needs its own safety.** Single-writer database, a lock to make double-opens loud, a shared object-storage bucket that makes "delete" mean something different than you think.
5. **The silent column drop.** The ORM builds its column list from the *executing* process's schema. A column main lacks is simply never sent. No error. `✓ promoted` still prints.
6. **The fix had a hole.** The type comparison couldn't tell two different enums apart, because the catalogue reports both as `USER-DEFINED`.
7. **The reassuring lie.** The snapshot that announced itself and wrote nothing. Proven by counting files against the day's own run.
8. **Class, not instance.** The review named one call site. The same bug sat in the undo path — the one place a pre-state matters most.
9. **Three lenses, three disjoint sets.** Testing and reviewing are not redundant, and neither is the "class or instance?" pass.
10. **Prose cannot enforce itself.** Three findings were confident doc comments falsified by the commit that carried them.
11. **The stuff I got wrong myself.** A hand-written table list, a documented trap I fell into anyway, my own notes lying to me.
12. **The teardown trap.** Ordering, and the set-difference check that made deleting anything safe at all.

## Candidate leading words (the load-bearing coinage — push on these)

- **"The reassuring lie"** — strongest. Names the whole class: output that asserts a thing happened when it didn't.
- **"A safety net that prints"** — the specific instance, vivid, but narrower.
- **"Cage vs sandbox"** — for the isolation half. Good, but a different post's spine.
- **"Confident prose"** — doc comments as unenforced claims. Sharp, slightly too abstract to carry a title.
- **"Green-looking failure"** — already in the repo's own vocabulary (`db:restore` "produced a green-looking run" — rows counted as failed, exit 0).
- **"Unmatched must never mean unexamined"** — lifted from this repo's port-guard notes. Beautiful line, arguably belongs to a different piece about parsers.

**Recommendation:** *the reassuring lie* as the spine; *cage vs sandbox* to open the setup; hold the rest as fragments.

## Candidate titles

- I parallelised my work and built a data-loss machine
- The reassuring lie
- My safety net printed a message and did nothing
- Isolation you can't escape from is a cage
- Three lenses, three disjoint sets of bugs
- The bug that prints a checkmark

## For the shaping session: prerequisites vs. what the piece must ground

**Prerequisite (reader brings it):** git branches and roughly what a worktree is · that software has a database · roughly what an ORM does · that files can live in cloud object storage · what a code review is.

**Must be grounded inside the piece:** that this dev database is *single-writer* and a second open corrupts rather than errors · *preseeding* (a worktree's database starts as a physical copy of main's) · *promotion* (moving rows from one database to another behind a gate) · the *shared bucket* consequence (same storage behind every worktree, so a delete anywhere is a delete everywhere) · *fingerprinting* a schema.

**The lever:** "single-writer corrupts rather than fails" is the one prerequisite the whole piece leans on, and a general reader does not have it. Ground it early and concretely, or every later beat costs double.

---

# Raw material to mine (lossless)

## Environment at capture time

- Repo `~/files/side-projects/encoreshot`, branch `main`, clean, **23 commits ahead of `origin/main`, unpushed**.
- Main's API running on `3125`, pgdata `…/encoreshot/apps/api/pgdata`, started `2026-08-17T10:35:38Z`.
- Branch `docs/rc-wrapup` awaiting landing (3 commits → regrouping to 2).
- All five smoke/fix worktrees torn down.

## 1. The setup — why worktrees at all

Several agent sessions run in parallel, each on its own branch, each needing its own dev servers and its own database. Each surface has a pinned port for the main checkout and a private float band for worktrees, so worktree #2's web is always the same number rather than whatever it grabbed first.

Isolation is the entire point: one session's half-finished schema change must not reach another's running app.

## 2. Isolation becomes a trap

Each worktree gets its own PGlite database, **preseeded as a byte-identical physical copy of main's** (via `dumpDataDir`/`loadDataDir` — never a second open of main's live directory). Row ids are preserved, which matters later.

So real uploads made in a worktree are stranded there. The founder's own framing, verbatim:

> "I don't want to be losing work between worktrees, otherwise I'm gonna be bound to not upload or pull setlist data in any worktree — which is not how I work."

**Isolation you can't escape from is a cage, not a sandbox.** The unspoken rule it imposes is "never do real work except on main", which defeats the reason for having worktrees at all.

## 3. The escape hatch

`db:reconcile` / `db:unpromote` — promote a Memory (one fan's night: their photos and notes) and its Assets from a worktree into main.

Design constraints the founder set:

> "HITL is EXTREMELY IMPORTANT here."

- Dry-run by default; nothing writes without an explicit confirmation at a TTY prompt.
- One transaction per Memory group.
- A promotion log (`.dev/promotions.json`) recording exactly which rows each promotion created — so an undo can name a promotion rather than guessing at "whatever happened most recently."
- The undo refuses with no id given, listing what *is* available. It never guesses at the latest one.
- A Show is **resolved**, never created directly — and never a deletion target on undo. (A Show is the event; a Memory is one fan's version of it. Many Memories point at one Show, so deleting a Show orphans all of them. This asymmetry is why the undo prints `kept — Show … (resolved, never a deletion target)`.)

## 4. The mechanism itself needs safety

**PGlite is single-writer, and a second open CORRUPTS rather than fails.** This is the constraint behind nearly every decision. Consequences:

- The CLI **never opens a database directly.** It talks to two live APIs over HTTP — its own worktree's and main's.
- It **positively identifies main** by comparing `/health`'s reported `pgdata` path against the path main's checkout would open, rather than trusting a port number. A port tells you a server is listening; it does not tell you whose.
- A PID lock file exists to make a second open loud rather than silent.
- "I only looked" is no defence: the corruption is in the *open*, not the write. Booting the engine replays the write-ahead log before any query runs, so a read-only viewer does the same damage. A database GUI destroyed the dev database this way once.

**The lock file bug.** The preseed copied main's **live lock file** into the new worktree, so a fresh worktree was born holding main's lock. Its API refused to boot, naming a PID that was **real, alive, and belonged to main**. Following the error message means killing main's database server to fix your worktree.

> Diagnostic worth memorising: `lsof -a -d cwd -p <pid>`. If the lock-holder's working directory is a *different checkout*, the lock is an artifact, not an opener.

Hit independently twice on the same day, by two different sessions, byte-identical each time.

**R2 (object storage) is a SHARED bucket across every worktree** — because the preseed preserves `userId`, and the object keys are `users/<userId>/originals/…`. Two consequences that pull opposite ways:

- Promotion moves **no bytes**. The photo is already where main's new row expects it.
- A **delete** in a worktree destroys **main's** bytes.

## 5. The silent column drop

Drizzle's `insert(table).values(row)` builds its column list from the table definition **in the executing process**. Promote a row from a worktree whose schema has a column main lacks, and that key is simply **never emitted**. No error. `✓ promoted` still prints. The row arrives missing data.

Found by scenario `RC-16` of a 16-scenario manual smoke bucket, run end to end across main plus two worktrees with real uploads. Harmless *that* time only because the dropped column happened to be null.

**Fixed** with a two-sided `information_schema` fingerprint handshake: both databases report their column shape, the CLI diffs them, and a disagreement **refuses the promotion** naming the column.

Proven live the next day. With a probe column present in a worktree and absent from main:

```
[db:reconcile] this worktree's database and main's do not agree on the tables a promotion writes:
    main has no `sessions.rc_smoke_probe` — promoting would drop it in silence
EXIT=1
```

**The check runs in the receiving process, so landing it IS the fix** — the guard only protects main once it is on main.

## 6. The fix had a hole

A code review caught that `information_schema`'s `data_type` collapses **every enum to `USER-DEFINED`** and **every array to `ARRAY`**. So two *different* enum types compared as identical — and one real column (`sessions.ingestMode`) is exactly that shape. A live hole in the fix for the hole. `udt_name` now travels alongside and carries the real type.

Formatting footnote worth keeping: the first version printed `integer (int4)` for everything, which is noise. The parenthetical was narrowed to only the two cases where `data_type` is genuinely ambiguous.

## 7. The reassuring lie — the headline

`db:reconcile` printed:

```
📸 snapshotting main before promoting
```

...and wrote nothing.

The endpoint **returns the snapshot in the HTTP response body** and creates no file. The CLI checked `res.ok` and discarded the body.

**Confirmed against that day's own run**, not theorised: the CLI announced two snapshots, at 12:25:43 and 12:35:25. The snapshot directory held only two files — both taken by hand, at neither of those times. So **every promotion that day ran with no recoverable pre-state.** Main survived because a human happened to snapshot manually, not because the tool did its job.

**The fix, and where it writes.** The body is now written to **main's** snapshot directory, not the calling worktree's — because a worktree gets torn down, taking any recovery file inside it. The snapshot is *of* main, so it belongs where main can still find it.

**Proven fixed the next day, on real data, twice.** Two `-pre-undo` files on disk at 2.6M each:

```
snapshot-2026-08-17T10-36-54-221Z-pre-undo.json
snapshot-2026-08-17T10-38-16-745Z-pre-undo.json
```

## 8. Class, not instance

The review named **one** call site: `db-reconcile.ts`.

Generalising the finding — asking "is this a class or an instance?" — found `db:unpromote` had the **identical** discarded-snapshot bug two files away. The **undo** path. Which is exactly when a pre-state matters most: you reach for undo because a promotion went wrong.

**Why it survived: two correct-looking call sites.** Each read as complete on its own, and nothing compared them. Both now go through one shared `snapshotMainToDisk` helper, so they cannot diverge again.

## 9. Three lenses, three disjoint sets

| Lens | Found |
|---|---|
| Running the 16-scenario manual bucket | **4 bugs** + 6 corrections to the spec's own assertions |
| A code review **of the fixes** | **8 more**, all legitimate, zero false positives |
| Asking "class or instance?" | **1 more**, in the undo path |

The manual run found bugs that only appear when two real databases disagree. The review found bugs in the fixes — including the worst of the session, which **no test could have caught**, because the code did exactly what it said and what it said was a lie about the filesystem.

Bonus finding from the run: the smoke-test file's own **cleanup ordering was impossible.** One scenario's guard only fires on a *promoted* asset; an earlier scenario un-promotes it. Written down, never executed, therefore never wrong until someone ran it.

## 10. Prose cannot enforce itself

Three of the eight review findings were **the same mistake**: a confident property asserted in a **doc comment**, in the very commit that made it false.

- *"a changed type is caught"* — it wasn't; enums compared as identical.
- *"one constant so a rename cannot break it"* — written beside the **third** copy of that constant.
- *"this distinguishes a missing table from agreement"* — it didn't.

Each is now a test or a corrected sentence. **A comment is a claim that nothing checks.**

## 11. Fragment assertions hide copy bugs

A refusal message on a destructive path read:

```
Refusing: 1 of this Asset is already promoted to main — …
```

Garbled English, shipped. The "N of M" frame is nonsense when M is 1.

**Why the test suite missed it:** every assertion used `toContain` on fragments — `"Wembley night"`, `"force=1"` — that survived the garble untouched. The tests now assert the **sentence**, plus a negative on the broken phrasing:

```ts
expect(body.error).toContain("This Asset is already promoted to main");
expect(body.error).not.toContain("of this Asset");
```

## 12. Hand-written inventories of machine-readable things

The first draft of the protected-table list **invented two tables that do not exist and missed three that do.** Written from memory, confidently.

The fix is not "be more careful." It's a drift test that reads the schema **reflectively** and fails until every declared table is accounted for — the same pattern the codebase already used to force new tables to be classified by recoverability.

## 13. Knowing the rule isn't running it

The pipe-eats-exit-code trap is **documented in this repo's own instructions**, for `tsc`. I stepped in it anyway:

```
git merge --ff-only <branch> 2>&1 | tail -2     # printed success
```

`tail` succeeded. The merge had said `fatal: Not possible to fast-forward`. A pipeline's exit status is the **last** command's — so the `&&` that looks like a guard isn't one. Chain a branch deletion behind that and you delete the branch holding the only copy of the work.

Then again, an hour later: `PIPESTATUS` is bash, the shell was zsh (`$pipestatus[1]`), so the check printed an empty string and proved nothing.

**Documentation as a defence has a ceiling, and I hit it twice in one day.**

## 14. Your own notes rot

The handoff document said a finding was "not on the board yet."

It had been filed weeks earlier — and was **written better than my note**, having already rejected two wrong fixes with reasons. Searching the board before filing is what caught it; trusting my own handoff would have produced a duplicate.

## 15. The teardown trap

Two orderings, neither obvious, both capable of destroying real data.

**First: purge object storage BEFORE removing the worktree.** The bucket is shared. Removing the worktree destroys the only database row that knows the object keys — leaving the bytes orphaned forever, with nothing left that can name them.

**Second, and sharper: a worktree's data is mostly *not* the worktree's.** It was preseeded as a copy of main's, so most rows are real production-ish uploads. Deleting one of *those* from the worktree destroys main's bytes through the shared bucket.

The check that makes teardown safe is a **set difference of asset ids against main**. Only ids unique to the worktree are safe to delete:

```
[.assets[].id] - [$main.assets[].id]     → []   # nothing unique; nothing safe to delete
```

Both worktrees came back empty. One had never had an upload at all.

Actual purge output, showing derivatives travelling with the original:

```json
{"deleted":"gDcnR96vcpkwcMJqpkQBp",
 "r2Deleted":["…/originals/…/IMG_8363.MOV",
              "…/originals/…/IMG_8363.MOV.keyframe0.jpg",
              "…/cache/…/scoring-f41f42.mp4"],
 "r2Missing":[]}
```

Which raised its own open question, now parked as a decision: deleting a photo takes its derivatives with it. **Right** for a deletion request (the derivatives are the same photograph). **Possibly wrong** for a cull, where the user is rejecting a shot from their album, not asking anyone to forget it existed. Same code path today, because nothing passes the *intent* down.

## 16. The payoff shape

**The dangerous bug is not a crash. It is an operation that prints reassurance.**

Three examples from this one codebase's history, all attached to something that did not happen:

- **`📸 snapshotting main`** — wrote nothing.
- **`✓ promoted`** — with a column silently dropped.
- **`✓ stopped`** — a teardown script passed multi-line `lsof` output to `kill` as a **single argument**, so on a port with two listeners it signalled **nothing** and printed success anyway.

And a fourth, from an earlier incident: a database restore that **counted rows as failed and exited 0**. Green-looking run, most rows missing. The lesson recorded at the time was not "the bug is gone" but "a restore reports counts and you read them."

## Loose fragments worth keeping

- **A green `/health` proves *a* server is up, not *your* server.** A watch-mode restart can fail on the outgoing process's own lock while the old process keeps serving — so the API answers 200 running the code you just replaced. Compare `/health`'s `startedAt` against when you saved the file.
- **"Which worktree am I in" and "which data am I looking at" are different questions.** A worktree's UI resolves its API through a port file that falls back to whatever's actually bound — commonly main's. So you can be running a branch's code against main's data without noticing. Answer the second question by asking the API, never by looking at your shell prompt.
- **The guard refusing you is the guard working.** The first undo attempt failed with "no port registry" — `/tmp` had been cleaned overnight. It refused rather than guessing at which server was main. That is the correct behaviour and it *felt* like a bug for about ten seconds.
- **A dry run that prints "removed".** The undo command shares one printer between its dry run and its real run, so `would remove:` is followed by `removed — assets:1` about rows nothing has touched. Harmless in context — and the exact shape of the bug that cost the day.
- **Some rules can't be mechanised, and saying so is part of the rule.** The port-kill guard is documented in this repo as "a speed bump, not a wall", with its own bypasses listed: a quoted `sh -c` wrapper, a bare `kill <pid>` after a separate lookup. Naming a guard's holes is more honest than implying it has none — and it is what makes the convention, rather than the hook, the thing that actually holds.
- On the naive fix for that guard: *"Unmatched must never mean unexamined."*

## Voice notes for the shaping session

- Antwan's builder voice: warm, jargon explained for a mixed audience, learning-in-public.
- Positioning: **Product Engineer**.
- **He commissioned and owns most of these bugs** — the piece narrates from inside the mistake, never from above it. The hand-written table list, the pipe trap, the doc comments: all his (or his agents'), and the post is better for saying so plainly.
- **Never blunt.**
- LinkedIn version closes with a **question**, not a follow-CTA.
- No AI-tells. Contrast-led where a comparison earns it.
