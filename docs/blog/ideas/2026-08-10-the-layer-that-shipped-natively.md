---
captured: 2026-08-10
session: session_01LnYyLRsbMzmKBc86LngPh5
session_url: https://claude.ai/code/session_01LnYyLRsbMzmKBc86LngPh5
repo: github.com/AntwanSherif/dotfiles (primary) + github.com/AntwanSherif/encoreshot
branch: main (dotfiles) · chore/worktree-env-symlink (encoreshot)
surface: both
---

# Post idea: "The layer that shipped natively"

> **Anonymization note for the writing session.** Roughly half the concrete detail here is
> EncoreShot's (`bin/worktree-up`, `.env` handling, the 25 accumulated worktrees). The Act-1
> Builder rule in `~/.claude/docs/blog-drafts.md` is *EncoreShot-only*, and this session is a
> tooling/config story that happens to use EncoreShot as its worked example. **Decide at drafting
> time**: either keep it generic ("a monorepo I work on") and lose nothing, or name it and accept
> the Act-1 constraint. Recommendation: generic — the story is about the tooling, not the product.

> **Six angles from one session.** They are not one post. Suggested slicing is at the bottom under
> *How to slice this*.

## The story in one paragraph

I had a complete home-grown git-worktree system: two shell scripts, a landing skill, three
enforcement hooks, and a section of CLAUDE.md explaining the ritual. Then I asked what
`claude --worktree` actually did — and found that Claude Code had shipped native worktrees:
a CLI flag, in-session enter/exit tools, per-subagent isolation, hooks to override creation,
a file to copy gitignored secrets in, and — the part I could never have built — in-process
enforcement that blocks a session from writing into the main checkout at all. The obvious
conclusion was to delete my layer. The actual conclusion, after reading my own hooks instead
of reasoning about them, was that two of the three survived, because native's enforcement is
scoped to the main checkout and says nothing about a worktree writing into its *sibling* — and
I had 25 live siblings. The interesting part isn't which tool won. It's that the audit only
produced a correct answer once I stopped comparing summaries and opened the files.

## The beats (each a candidate section)

1. **The setup.** What I'd built, and why it felt necessary at the time. Two scripts, three
   hooks, one skill, a CLAUDE.md section. All of it load-bearing, all of it earned.
2. **The discovery.** `claude --help | grep -i worktree`. It was all there, and had been for a
   while. `--worktree`, `--tmux`, `isolation: worktree`, `.worktreeinclude`, `WorktreeCreate`
   hooks, `EnterWorktree`/`ExitWorktree` tools.
3. **The first wrong answer.** I said native enforcement was "strictly stronger" and recommended
   deleting both guard hooks. That was reasoning from the docs.
4. **Reading the actual file.** One of my hooks blocked writes from worktree A into worktree B.
   Native blocks writes into *the main checkout* — the docs are explicit about that scope.
   Siblings are unguarded. With 25 live worktrees, that's the failure most likely to bite.
   The hook's own header comment had said so all along.
5. **What survived, and why the reason matters.** Not "mine is better" — the two survivors cover
   states native declines to cover *by design*: the main checkout before you're in a worktree,
   and sibling worktrees once you are. Everything that overlapped got deleted without ceremony.
6. **The thing I found by accident.** 25 worktrees had silently accumulated because one config
   value said they should never expire. See *Additional gold* below — it's a better post than
   this beat.

## The reframe to land

**An audit that compares summaries produces a confident wrong answer. The correct answer only
appears when you open the file.** I was wrong twice in one session — both times from reasoning
about a thing instead of reading it, both times corrected in under a minute once I did.

## Candidate titles

- The layer that shipped natively
- I rebuilt a feature that already existed, and two thirds of it still earned its keep
- What survives when the platform catches up
- Read the file

---

## Additional gold: "One dial, two jobs"

### The story

I found 25 stale worktrees in one repo. The cause was a single setting — `cleanupPeriodDays:
99999` — which I'd set deliberately, and correctly, for a completely different reason. That one
value governs **both** how long chat transcripts are retained **and** how often orphaned agent
worktrees get swept. I keep transcripts forever because two other tools mine them (a token
analyzer and my blog-capture flow). The price of that, invisible until this session, was that
worktrees never expire. There is no separate key. So the "fix" — set it to six months — would
have silently deleted every transcript older than six months to solve a disk-clutter problem.

### The beats

1. The symptom: 25 worktrees, `git worktree list` unreadable.
2. The obvious fix: lower the retention setting to something sane.
3. The catch: read what the setting actually controls. Two unrelated subsystems, one number.
4. The real fix: leave the dial alone, write a 130-line sweep script that does the narrow job.
5. The general shape: a config value that serves two consumers has a *hidden* consumer, and
   you find it by changing the value.

### The reframe to land

**Before you change a config value, find everything that reads it.** A single dial serving two
subsystems will always be tuned for the louder one, and the quieter one pays silently. The
tell is when the "obvious fix" costs something in a completely different domain.

### Candidate titles

- One dial, two jobs
- The setting that was doing something else too
- What else reads this number?

---

## Additional gold: "The guard was protecting me from my own choice"

### The story

My worktree setup copied `.env` files from the main checkout into each new worktree. Copies
drift, so teardown grew a guard: refuse to remove a worktree whose `.env` differed from main's,
because `git worktree remove --force` deletes gitignored files without a word and git has no
opinion about them. Sensible guard. Genuinely saved work. Then, on being asked "why not
symlink?", I defended the copy — and was wrong, because I'd assumed sessions edit `.env` when
in fact my own rules forbid it. Once the premise fell, so did the guard: **symlinks can't drift,
so a drift guard has nothing to do.** The guard wasn't protecting me from a hazard in the world.
It was protecting me from a decision I had made one file earlier.

### The beats

1. The guard, and why it looked like good engineering (it was — given the copy).
2. The question that broke it: "why not symlink?"
3. My wrong defence: worktrees need per-worktree env values. True for exactly one variable, in
   a case not currently in play.
4. The collapse: no drift means no drift guard. 40 lines became 20, and the remaining ones
   guard the *one* case that still loses work — a real file where a link was expected.
5. The uncomfortable bit: the guard had a beautiful comment explaining why it was necessary.
   Good documentation of a bad premise reads exactly like good engineering.

### The reframe to land

**Some guards protect you from the world. Others protect you from a choice you made upstream.
The second kind looks identical to the first — and disappears entirely when you revisit the
choice.** Ask of any defensive code: *if I changed the decision above this, would this still
have a job?*

### Candidate titles

- The guard was protecting me from my own choice
- Copies drift. Symlinks don't. So what was the guard for?
- Defensive code that defends a decision

---

## Additional gold: "I was wrong twice, both times from not reading"

### The story

Two confident, wrong recommendations in one session, both from an agent (me) reasoning about
artifacts rather than opening them. **First:** "native enforcement is strictly stronger than
your hooks, delete them" — reversed after reading the hook and finding it covered sibling
worktrees, which native explicitly doesn't. **Second:** "keep copying `.env`, symlinks are
wrong here" — reversed when the human pointed out the premise (that sessions edit `.env`) was
false, and stated in the project's own CLAUDE.md. Both corrections took under a minute once the
right file was open. Neither would ever have arrived from thinking harder.

### The beats

1. Wrong answer #1 and how confidently it was delivered.
2. What reading the file changed — and that the file's own header comment had already said it.
3. Wrong answer #2, and the human correcting the *premise* rather than the conclusion.
4. The pattern: both errors were about the user's own system, which is exactly where an agent
   has no training data and maximum apparent fluency.
5. The practical rule that fell out: when an agent audits *your* config, make it cite the file.

### The reframe to land

**An agent is most confidently wrong about your own setup — the one place it has no priors and
every appearance of expertise.** Documentation describes the intended shape. The file describes
the actual one. On your own system, only the second is evidence.

### Candidate titles

- I was wrong twice, both times from not reading
- The agent is most confident exactly where it knows least
- Cite the file

---

## Additional gold: "The plan you approve is the plan you can't see"

### The story

Claude Code's auto mode routes actions through a safety classifier. When plan mode finishes and
the classifier judges the plan safe, it **collapses the plan body** behind a `/plan to preview`
command. The whole point of plan mode is human review before edits land — and the classifier's
"this looks fine" quietly substitutes itself for the review it was meant to precede. There is no
setting to turn it off; the upstream request to expose one is still open. A second related issue:
after one approved plan, auto mode's execute-immediately guidance can override a later explicit
"plan carefully before this one."

The workaround turned out to be better than the thing I wanted. Publish the plan as a hosted
artifact and hand over the URL. The collapsed inline body stops mattering, because the real plan
lives at a link that survives the session, updates in place, and can be read on a phone.

### The beats

1. What plan mode is for: a human gate before edits.
2. What auto mode does to it: collapses the artifact you're gating on.
3. Why that's a category error — a safety classifier's judgement is not a substitute for review;
   it's an input to it.
4. No toggle exists. The upstream issue is open.
5. Routing around it: publish, don't print. And the accidental upgrade — scrollback can't be
   linked, sorted, or reopened; a page can.

### The reframe to land

**A safety check that hides the artifact it approved has replaced your review with its own.**
Convenience features that collapse output are fine everywhere except the one place the output
*is* the deliverable.

### Candidate titles

- The plan you approve is the plan you can't see
- When the safety check ate the review
- Publish, don't print

---

## Additional gold: "A preference that isn't written down doesn't exist"

### The story

Asked what I would "actually do differently" to use a new capability more, the honest answer was:
*nothing*. Not because I didn't intend to — because intent held in a conversation evaporates at
the next context compaction. Anything an agent merely *decides* during a session is gone by the
following one. The only durable mechanism is a rule with **named triggers** in the config file.
"Use artifacts when appropriate" is unenforceable and unfalsifiable. A list — *a plan reaching
approval, a review with more than three findings, a comparison wider than three columns* — is
both. The exclusions matter as much as the triggers: without "does not fire on single-file diffs
or anything under a screenful", you get a gallery of one-liners that nobody opens.

### The beats

1. The question: "what will you actually do differently?"
2. The uncomfortable answer: nothing, unless it's written down.
3. Why: compaction. An agent's good intentions have a half-life measured in turns.
4. What a durable rule looks like: named triggers, and named *exclusions*.
5. The corollary for anyone writing agent config: if you can't tell whether the rule was
   violated, it isn't a rule.

### The reframe to land

**With agents, a preference and a rule differ by exactly one thing: whether it survives
compaction.** Everything else is a nice conversation you had once.

### Candidate titles

- A preference that isn't written down doesn't exist
- Rules need triggers, not adjectives
- Your agent's memory is a config file

---

## How to slice this

Six angles. They split cleanly along audience:

| | Angle | Audience | Standalone? |
|---|---|---|---|
| **Primary** | The layer that shipped natively | Devs using agentic tooling | Yes — strongest narrative |
| **A** | One dial, two jobs | General engineering | Yes — short, sharp, universal |
| **B** | The guard was protecting me from my own choice | General engineering | Yes — best pure-craft piece |
| **C** | I was wrong twice, both times from not reading | Agent-tooling audience | Yes — good LinkedIn single |
| **D** | The plan you approve is the plan you can't see | Claude Code users | Yes — timely, live issue |
| **E** | A preference that isn't written down doesn't exist | Agent-config audience | Yes — short |

**Recommendation at capture time (not binding):** Primary as the anchor post with **C** folded in
as its middle act — C *is* the mechanism by which Primary reaches the right answer, and separating
them costs the story its turn. **A** and **B** merge well into one piece about *config decisions
with invisible second consumers* — both are "the thing you're about to change is doing something
else too." **D** and **E** are short standalones; D is the most immediately useful to strangers
and the most time-sensitive, since it describes an open bug that may get fixed.

**The counter-argument worth weighing:** B is the best-written idea here and merging it into a
two-part piece with A may bury it. If only one of these ever gets drafted, draft B.

---

## Raw material to mine (lossless)

### Session frame

- **Date:** 2026-08-10. **Claude Code v2.1.226.** Model: Opus 5. Auto mode on by default.
- **Trigger question from the founder:** "All this time I had my own logic for worktrees and
  scripts like `worktree-up`, `worktree-down`, and the `land-worktree` skill. However I see Claude
  could be run with `claude --worktree` or `isolation: worktree` on a subagent, or `/batch` for big
  migrations. Do a web search and educate yourself."
- Ended with two commits shipped and this capture.

### What native actually provides (verified against `claude --help` on the installed build + docs)

| Feature | Behaviour |
|---|---|
| `claude -w <name>` / `--worktree` | Creates `.claude/worktrees/<name>/`, branch `worktree-<name>`, starts the session inside |
| `--worktree "#1234"` | Fetches `pull/N/head`, creates `.claude/worktrees/pr-N` |
| `--tmux` | tmux session for the worktree; iTerm2 native panes where available; `--tmux=classic` for plain tmux. Requires `--worktree` |
| `EnterWorktree` / `ExitWorktree` | In-session tools. Moves cwd, write access, and project config (CLAUDE.md, settings) |
| `isolation: worktree` | Subagent frontmatter field, or a field on an agent dispatch. One temp worktree each |
| `WorktreeCreate` / `WorktreeRemove` hooks | Replace the git logic entirely — custom directory, or non-git VCS (SVN/Perforce/Mercurial) |
| `.worktreeinclude` | gitignore-syntax file; copies matching **gitignored** files (`.env` etc.) into every worktree Claude creates |
| `worktree.baseRef` | `"fresh"` (default, branches from `origin/HEAD`) or `"head"` (branches from local HEAD, carrying unpushed work) |
| Cleanup | Interactive exit prompts keep/remove. `-p` runs never clean up. Periodic sweep for subagent/background worktrees, gated on `cleanupPeriodDays` |

**The enforcement detail that decided the whole audit** — once a session is in a worktree, Claude
Code blocks, for the session *and every subagent it spawns*:
- `Edit`/`Write`/`NotebookEdit` targeting a path in the main checkout
- Bash/PowerShell/Monitor commands whose working directory resolves to the main checkout, or that
  it cannot verify stay outside it
- git redirects into the main checkout — `git -C`, `--git-dir`, `GIT_DIR`, `GIT_WORK_TREE`, or a
  `cd` into main before running git

**Scoped to the main checkout.** Sibling worktrees are not mentioned and not covered. This is the
single fact the whole post turns on.

### `/batch`

A *skill*, not a separate engine. Splits one large change into 5–30 worktree-isolated subagents,
each opening its own PR. Docs describe it as "a packaged use of subagents and worktrees, not a
separate coordination style." Not present in this install's skill list — couldn't confirm it's
enabled. Caveats: decomposition failures surface at plan time (a unit depending on another just
fails), and N parallel PRs collide with a one-branch landing ritual.

### The parallelism taxonomy (useful framing, from the docs)

| Approach | What it gives you |
|---|---|
| Subagents | Delegated workers inside one session, returning a summary |
| Agent view (`claude agents`) | Dispatch + monitor background sessions on one screen |
| Agent teams | Coordinated sessions, shared task list, inter-agent messaging. Experimental, off by default |
| Dynamic workflows | A *script* holding the plan instead of turn-by-turn judgement. For codebase-wide audits, 500-file migrations, cross-checked research |

Worktrees, cross-session messaging, and `/batch` are described as *supporting* tools, not
coordination styles in themselves.

### The hand-rolled layer, and the verdict on each piece

| Mine | Verdict | Reason |
|---|---|---|
| `worktree-scope-guard.sh` | **Keep** | Blocks worktree A → worktree B. Native covers main checkout only. 25 live siblings in one repo |
| `worktree-first-nudge.sh` → renamed `ask-worktree-on-trunk-or-dirty.sh` | **Keep, message fixed** | Fires on the *first* edit while on trunk or on a branch dirty with someone else's work. Native only engages once already inside a worktree |
| `block-worktree-destroy.sh` | Keep | Nothing native protects *other* worktrees |
| `land-worktree` skill | Keep | Regroup → rebase → ff → tear down → close the tracking issue. Native offers a keep/remove prompt |
| `bin/worktree-up` | Keep, ~30 of 211 lines superseded | Only the `.env` seeding overlaps `.worktreeinclude`. Dev-server launch, cmux log tabs, and the cross-worktree port registry have no native equivalent |
| `bin/worktree-down` | Keep, guard rewritten | Kills dev servers by port (the project's one sanctioned exception to a never-kill rule), cleans the registry |
| `superpowers:using-git-worktrees` (plugin skill) | Keep | v6.2.0 **already routes to native tools for creation**. Its remaining value is Step 0 (existing-isolation detection *with a submodule guard* — `GIT_DIR != GIT_COMMON` is true in submodules too) and Step 3 (baseline test run so later failures aren't ambiguous) |

**The two wrong answers, in order.** (1) "Native enforcement is strictly stronger — retire both
guard hooks." Reversed after reading `worktree-scope-guard.sh`. Its own header comment already
recorded the gap: *"worktree-scope-guard.sh deliberately allows every write when the session is in
the MAIN checkout, which is exactly the state the rule bans."* (2) "Keep copying `.env`." Reversed
by the founder in one line: no session is allowed to edit `.env` — it's a stated project
invariant — so the per-worktree-divergence premise was false.

### The rename

`worktree-first-nudge.sh` → `ask-worktree-on-trunk-or-dirty.sh`. The old name said neither what it
asked nor when. Naming convention in that hooks directory splits into `block-*` (hard denies) and
`*-guard`; this one **asks, never denies**, so `block-` would have been actively misleading. New
name encodes the *trigger*, because "why did this fire?" is the question a guard's name should
answer. Renamed with `git mv` so history records `R`, not `D` + untracked. Four references updated:
live settings, the chezmoi settings template, the README table, the TODO entry.

### The `cleanupPeriodDays` finding

- Default is **30 days**, minimum 1. Ours: **99999**.
- Controls: session files / chat transcripts **and** the agent-worktree sweep. One key, no split.
- Why it was set high: a token-analysis tool mines Claude Code history, and the blog-capture
  flow reads sessions. Losing transcripts costs more than disk.
- The sweep, when it runs, **skips any worktree still holding work** (changed/untracked files or
  unpushed commits) and locks a worktree while its agent runs. It never removes `--worktree` ones.
- Rejected fix: `180`. Would silently delete every transcript older than six months.
- Chosen fix: a `claude-worktree-sweep.sh` script. Reports by default; `--remove` deletes only
  worktrees with nothing modified, nothing untracked, no commits off the default branch, and no
  lock. Never passes `--force`. Labels each `[agent]` or `[yours]`.
- **Bug found while testing it:** `--all-mine` triple-counted (78 instead of 26) because two
  sibling directories in the workspace are *themselves worktrees of the main repo*, so all three
  entry points resolved to the same root. Fixed by deduping resolved roots. Nice small beat about
  testing a tool against real data rather than a tidy fixture.
- Final state of that repo: **25 worktrees — 4 safe, 21 holding work.** Twelve are `agent-*`
  research branches carrying 1–12 commits each; the rest are real feature worktrees, the largest
  at 22 commits, one with 1069 untracked files.

### The `.env` copy → symlink change

**Before:** `worktree-up` discovered every `.env*` under the main checkout (excluding `*.example`,
which are tracked) and `cp`'d them in, never overwriting an existing file. `worktree-down` then
refused teardown if any copy differed from main's — comparing only, never printing, because the
files hold secrets. It reported *which file* differed, never a diff.

**The prior bug that shaped the guard** (from the code comments, worth stealing): discovery in
`worktree-down` had to *mirror* `worktree-up`'s or the pair leaks. It once matched `-name '.env'`
exactly while `worktree-up` seeded every `.env*`, so `apps/landing/.env.local` was copied in,
edited, and destroyed on teardown without a word — **guarded on the way in, unguarded on the way
out.** Also: the seeding list was once hardcoded to two app directories, so a third app's `.env`
was silently skipped and that worktree failed in a way that read like a port bug. Discovery
replaced the list.

**After:** `ln -s` to the absolute path under main. Non-destructive in two directions — an existing
link is left alone; a pre-existing *real* file is kept **with a warning** rather than replaced,
because replacing it would silently repoint someone's deliberate values at main's. Teardown's
guard shrank from drift-comparison to a single case: a real file where a link was expected. Links
own nothing, so `--force` deletes the link and main's file is untouched. Discovery had to change
to `-type f -o -type l`, since `-type f` alone doesn't match the symlinks it must skip.

**What symlinks buy:** one file behind every path, so a var added anywhere is visible everywhere
immediately. The old model let each worktree silently run a *different vintage* of the file.

**What they cost:** an edit in a worktree now writes through to main. Documented as a consequence
rather than hidden.

**Community position (searched):** genuinely split — symlink when the file should stay in sync
across worktrees, copy when worktrees need different values. Tools like dotenv-vault, 1Password
CLI, and Doppler sidestep it by pulling from a central store. So the right answer is
project-specific, which is why the first attempt at it was wrong.

**Left unsolved and said so:** a dev server that floats its port on collision genuinely wants a
per-worktree `BETTER_AUTH_URL`. A `.env.local` precedence layer would fix it — Vite and Astro
honour it by construction, but the Hono/Bun API's env loading is unverified. Parked rather than
guessed.

**Migration decision — forward-only.** Existing worktrees keep their copies; the rewritten guard
handles both shapes, so they die off as they land. Converting 21 in-flight worktrees would have
risked destroying a real divergence to buy tidiness on trees that will be gone within weeks.

**Discovered while writing the TODO:** an existing backlog item to migrate to **dotenvx**
(encrypted `.env` in git) already promised that `worktree-up` "loses its secret-`cp` lines." So the
symlink change is *partial credit against an existing item*, not a new one — it kills the
env-vars-lost-on-branch-delete failure that item names, but secrets remain untracked,
un-encrypted, and absent on a fresh clone. Enriched the existing entry instead of filing a
near-duplicate. Small, good beat about backlog hygiene: the dedup rule caught a real overlap.

### The auto-mode / plan-mode material

- Auto mode became the **default** for Pro/Max/Team on 2026-08-14 (announced). Routes every action
  through a classifier designed to block anything irreversible, destructive, or aimed outside your
  environment. Deny and explicit ask rules are evaluated *before* the classifier.
- `EnterPlanMode` is a **model-invoked tool** — the agent can propose entering plan mode itself.
  It still requires user approval, so "silently enters plan mode" (the tip that prompted the
  question) overstates it. `/plan <prompt>` scopes plan mode to a single turn.
- **Issue #58795** (open): the classifier collapses the plan body behind `/plan to preview` when it
  judges the plan safe. Framing from the issue, worth quoting: *the classifier's "this looks safe"
  judgment is useful as a signal, but it shouldn't silently replace the user's review by collapsing
  the artifact they were asked to approve.*
- **Issue #53276:** after an initial approved `ExitPlanMode`, later explicit requests to "plan
  carefully" don't re-enter plan mode — auto mode's execute-immediately guidance wins.
- Config surface is large and prose-based: `autoMode.environment` (trust slots, context slots,
  sensitivity slots), `allow` / `soft_deny` / `hard_deny` as **natural-language rules**, a
  `"$defaults"` splice token, `classifyAllShell` to route every shell command through the
  classifier. Inspect with `claude auto-mode config` / `defaults` / `critique`.
- **The classifier reads your CLAUDE.md.** An instruction like "never force push" steers both the
  model and the classifier. That's a genuinely interesting design point for a post.
- Precedence inside the classifier: `hard_deny` unconditional → `soft_deny` → `allow` as exceptions
  to soft denies → explicit user intent overrides remaining soft blocks. "Clean up the repo" is not
  intent to force-push; "force-push this branch" is.

### The artifacts material

- Claude Code Artifacts: turn session results into interactive web pages, generated from full
  session context. Updates at the same URL with version history. Private by default.
- Community/enterprise uses found: PR walkthroughs (diff + why + tests + risks), incident timelines
  that update as an investigation progresses, license audits, architecture overviews, prototypes
  for stakeholder communication.
- **Could not verify a canonical community-catalog URL.** Secondary coverage describes one;
  Anthropic's own publish-and-share help article documents publishing and link-sharing with no
  gallery mentioned. Declined to guess a URL. Verifiable alternatives: the artifact list API
  (own + shared), and the community-curated `madewithclaude/awesome-claude-artifacts` on GitHub.
- The rule written as a result names triggers *and* exclusions. Exclusions: direct answers,
  single-file diffs, status lines, anything under a screenful.

### Sources

- https://code.claude.com/docs/en/worktrees
- https://code.claude.com/docs/en/agents
- https://code.claude.com/docs/en/auto-mode-config
- https://code.claude.com/docs/en/settings
- https://claude.com/blog/auto-mode-default-in-claude-code
- https://github.com/anthropics/claude-code/issues/58795 — plan-body collapse
- https://github.com/anthropics/claude-code/issues/53276 — plan mode silently exits under auto mode
- https://the-decoder.com/anthropic-brings-artifacts-to-claude-code-letting-teams-share-live-pages-from-coding-sessions/
- https://github.com/madewithclaude/awesome-claude-artifacts
- https://www.gitworktree.org/guides/gitignore — worktree `.env` handling
- https://cretezy.com/2026/worktree-copy — auto-copy files into worktrees
- https://claudefa.st/blog/guide/mechanics/simplify-batch-commands — `/batch`
- https://medium.com/@AdithyaGiridharan/claude-codes-native-git-worktree-support-parallel-ai-agents-without-the-chaos-3746f089682d

### What shipped this session

**dotfiles `0fcecbf`** — `feat(claude): adopt native worktrees, keep the two guards native doesn't
cover`. 7 files, +301/−5. `worktree.baseRef: "head"`; CLAUDE.md worktree section rewritten around
the three entry points; a new CLAUDE.md rule to publish Artifacts for review-shaped output;
the hook rename; `claude-worktree-sweep.sh`; `cw`/`cwt`/`cwp` zsh functions; a README section with
an ASCII diagram of all five lanes; two TODO entries.

**encoreshot `d4de51c`** — `chore: symlink .env into worktrees instead of copying it`. 3 files,
+55/−32, on `chore/worktree-env-symlink`. Full test suite green (api 382, qr 25, landing 112,
ui 20, mobile 88, web 406, root 80 — 0 fail).

**encoreshot `ca34941`** — `docs(todo): park the worktree sweep, and bank partial credit on the
dotenvx item`.

**A small beat worth keeping:** the first commit attempt was refused by a pre-commit test gate —
`vitest: command not found`, `Cannot find package 'nanoid'`. Cause: a fresh worktree has no
`node_modules`, which is *exactly* the thing native worktrees don't set up for you and the project
CLAUDE.md already tells you to fix. The temptation was `SKIP_TESTS=1`. Running `bun install`
instead took 2.57 seconds and turned a skipped gate into a green suite. The gate was right; it
just needed the documented step.

### Dead ends and non-findings (kept deliberately)

- **`/batch` could not be confirmed as enabled** in this install. Documented, but absent from the
  skill list and from `~/.claude`. Reported as unverified rather than assumed.
- **No `/worktree` slash command exists** in this build, despite the superpowers skill listing one
  as a possibility on other harnesses.
- **Branch naming is not configurable** — native prefixes `worktree-`. Investigated whether it
  would break anything: release tooling routes on commit scopes, not branch names, so it's
  cosmetic. Accepted rather than worked around.
- **No way to disable the plan-body collapse.** Confirmed by finding the open feature request,
  not by assuming.
- **Blog folder "didn't exist"** — an early claim in-session, wrong: I'd checked
  `portfolio/docs/blog/` when the repo root is `portfolio/AntwanSherif/`. Tiny, but it's a third
  instance of the same failure mode as the two big ones, which makes it useful evidence for
  angle C rather than an embarrassment to hide.
