# Blog Idea: I Was Burning 32k Tokens Before Typing a Word

**Status:** Draft idea
**Category:** Developer tools / AI productivity
**Estimated length:** 8–10 min read

---

## The Hook

Every Claude Code session I started was already ~32,000 tokens deep before I typed a single character. That's not a prompt — that's a novel's worth of context eaten before the work begins. Worse, a meaningful chunk of it was pure duplication: the same rules loaded twice, verbose reference material nobody reads inline, and MCP servers for tools I've never opened.

The counterintuitive part: Claude Code's context overhead isn't Claude's fault. It's almost entirely self-inflicted configuration bloat that accumulates invisibly as you customize your setup.

---

## The Problem

Running the `token-optimizer` skill surfaced the actual numbers:

- **Real session baseline:** 31,913 tokens loaded before first message
- **Estimated optimizable total:** ~19,101 tokens carrying real overhead
- **Identified waste:** ~2,700 tokens of duplication, always-loaded verbose sections, and missing runtime compression

The audit flagged four categories of waste:

1. **Memory file duplication** — Project-level memory files were restating rules already in the global `CLAUDE.md`. Same content, loaded again in every project session.
2. **Unconditionally loaded verbose sections** — Two CLAUDE.md sections (the merged skill workflow guide at ~23 lines, and the worktree merge sequencing section at ~40 lines) were always in context even for sessions that never touch either workflow.
3. **Idle MCP servers** — Six MCP integrations (Canva, Miro, Gmail, Google Calendar, Google Drive, Atlassian) were registered and loaded into every session. I've used maybe one of them this year.
4. **No runtime compression** — Long grep, git log, and test output was hitting context raw. No truncation, no compression — just wall-of-text dumped into the window.

---

## The Audit

The `token-optimizer` skill is a Claude Code skill that reads your active session's context composition, estimates token costs per source, and surfaces the highest-leverage cuts. It breaks down:

- Which CLAUDE.md sections are largest
- Which memory files exist and their estimated sizes
- Which MCP servers are loaded (and therefore burning context even if unused)
- Whether any runtime compression hooks are active

Running it produced a ranked list of optimization opportunities with rough token estimates for each. That list became the work order.

The key insight from the audit: most of the waste was *structural* — the kind that compounds across every session, not just expensive one-off prompts.

---

## The Fix (with concrete steps)

### 1. Memory deduplication (~1,260 tokens per project session)

Deleted 4 project-level memory files in `~/.claude/projects/*/memory/` that were restating rules verbatim from the global `CLAUDE.md`. The global file wins — project memory should add project-specific context, not echo global rules.

One stale file (interview prep board details that no longer matched reality) was condensed rather than deleted.

```bash
# Find project memory files
ls ~/.claude/projects/*/memory/

# Delete files that duplicate global CLAUDE.md rules
rm ~/.claude/projects/<project>/memory/MEMORY.md  # if it only duplicates global rules
```

### 2. Lazy-loading verbose sections (~710 tokens from global context)

Extracted two verbose CLAUDE.md sections to standalone reference files:

- `~/.claude/docs/merged-skill-workflow.md` — the ~23-line skill composition guide
- `~/.claude/docs/worktree-merge-sequencing.md` — the ~40-line merge sequencing protocol

Replaced each with a 2-line pointer in CLAUDE.md:

```markdown
## Merged Skill Workflow
See ~/.claude/docs/merged-skill-workflow.md for the full guide.
Invoke only when a skill-composition question arises.
```

Claude reads the reference file on demand; the inline wall of text is gone from the baseline.

### 3. Config hardening

Added `permissions.deny` rules to block accidental large-directory reads — node_modules, `.git/objects`, build output folders. These aren't useful context, they're just expensive accidents waiting to happen.

Denied the 6 idle MCP servers in `~/.claude/settings.json`. Each registered server adds to the tool listing overhead even with zero calls.

Halved `skillListingBudgetFraction` from 16% to 8% — the skill menu was eating more context budget than warranted for a list that rarely changes.

### 4. Skill archival

Moved 2 unused skills from the active skill menu to an archive directory. Active skills appear in the tool listing; archived ones don't. Small cut, but it adds up across every session.

### 5. Runtime compression via `rtk`

The biggest leverage point that was completely missing: runtime output compression. Without it, a `git log --oneline -50` or a failing test suite dumps raw text straight into context.

```bash
brew install rtk
rtk init -g  # wires a global Bash hook in ~/.claude/settings.json
```

`rtk` sits as a proxy between shell output and context. It compresses grep, git, and test output 80–92% before it reaches the window — identical semantics, a fraction of the tokens. This is the install-and-forget optimization.

### 6. Intent-layer scaffolding

Applied the `intent-layer` skill to 6 active projects. This creates `AGENTS.md` files at key directory boundaries — each one is a 20–40 line orientation document that tells an agent what's in that directory without reading any source files.

The token economics flip: instead of cold-reading 5 source files to understand a module's purpose, an agent reads 1 AGENTS.md and knows where to look. The upfront cost is writing the AGENTS.md; the payoff is every subsequent session in that project.

---

## What Actually Moved the Needle

Honest accounting:

**Estimated global context reduction:** −668 tokens (−3.5% on global config baseline)

That's smaller than the ~2,700-token projection, and the gap is real — not a rounding error. The reasons:

- **Project memory deletions are scoped.** The ~1,260 tokens from Task 2 only reduce overhead in the specific project sessions those files belonged to. The global estimated total doesn't reflect per-project savings.
- **Intent-layer AGENTS.md files add tokens back** to those project sessions on the first cold read. It's a net-positive trade (structured orientation vs. raw file reads), but it's not free.
- **The real measurement requires a fresh session.** Token counts from the current session include everything loaded at start. The optimizer's "before" number is locked in at session start; you see the full reduction only when you open a new session cold.

The headline number worth holding onto isn't −668. It's:
- ~1,260 tokens saved per project session (deduplication)
- 80–92% runtime output compression active globally (rtk)
- 6 idle MCP servers no longer eating tool-listing budget

The compression win from `rtk` is the one that will compound most over time — it applies to every shell command output for the rest of every session.

---

## Tools Worth Knowing

**rtk** — Runtime output compression proxy for Claude Code.
```bash
brew install rtk
rtk init -g
```
Compresses shell output (git, grep, test runners) 80–92% before it hits context. Zero config after init. This is the single highest-leverage install if you use shell-heavy workflows.

**Intent-layer skill** — Scaffolds AGENTS.md orientation files at directory boundaries.

Available in the Claude Code skill registry (or install directly from the crafter-station/skills GitHub repo). Run it against any project directory to generate structured navigation documents for AI agents.

```
/intent-layer
```

---

## The Lesson

Claude Code's context overhead is almost entirely a configuration problem, not a Claude problem. The model doesn't decide what gets loaded — your settings files do. And because those files accumulate incrementally (add an MCP server here, paste a rule there, create a memory file for a project), the bloat is invisible until you audit it.

The three levers that matter most, roughly in order:

1. **Stop loading what you don't use.** Idle MCP servers, duplicate memory files, always-on verbose sections — these are invisible taxes on every session. Audit and cut ruthlessly.
2. **Compress runtime output.** A failing test suite printed raw is 3,000 tokens. Compressed, it's 300. `rtk` handles this automatically.
3. **Build navigation structure, not inline documentation.** AGENTS.md files let agents orient without reading source. Inline CLAUDE.md walls-of-text get loaded unconditionally whether or not they're relevant.

The meta-lesson: treat your Claude Code configuration like production infrastructure. It needs the same audit discipline you'd apply to a slow query or an oversized bundle — periodic review, ruthless cutting, instrumentation so you can see what's actually happening.

---

## Assets

Screenshots taken during the audit session:

**Before:**
- `docs/blog/ideas/assets/token-optimizer-before/full-dashboard.png` — full token-optimizer dashboard output
- `docs/blog/ideas/assets/token-optimizer-before/optimization-list.png` — ranked list of optimization opportunities
- `docs/blog/ideas/assets/token-optimizer-before/overhead-breakdown.png` — context breakdown by source
- `docs/blog/ideas/assets/token-optimizer-before/session-baseline.png` — 31,913 token baseline reading

**After:**
- `docs/blog/ideas/assets/token-optimizer-after/optimization-list.png` — post-optimization opportunities list
- `docs/blog/ideas/assets/token-optimizer-after/overhead-breakdown.png` — reduced overhead breakdown
- `docs/blog/ideas/assets/token-optimizer-after/session-baseline.png` — baseline reading after changes

---

## Open Questions / Future Angles

- **Measure on a true cold start.** The "after" numbers here are estimates; the real post-optimization baseline requires closing this session and opening a fresh one with no warm context. That measurement is the lede for the published version.
- **Is the intent-layer payoff measurable?** Claim is that agents navigate faster with AGENTS.md. Could test by comparing "tokens consumed to complete a task in a project" with vs. without intent-layer scaffolding.
- **rtk compression claimed vs. actual.** The 80–92% figure is from rtk's docs. Worth measuring on actual project workflows — git log output, pytest failures, eslint output — to get real numbers for the post.
- **The MCP server token cost breakdown.** What does each registered server actually cost? Would be interesting to show the per-server token overhead to make the "deny unused servers" argument more concrete.
- **Productizing the audit.** The token-optimizer skill requires knowing it exists. Is there a case for wiring it as a periodic hook (e.g., run on session start and flag if overhead exceeds a threshold)?
- **Audience question:** Is this for developers who already use Claude Code heavily, or is it an argument for *why* to use it carefully? The tone shifts depending on which reader you're writing for.
