# Parked: Skills & the Agent-Config Layer on /toolkit

**Status:** parked 2026-07-26, needs a dedicated session.
**Why parked:** this isn't a handful of tool cards — it's a whole layer of how the work gets done
(skills, plugins, MCP servers, agent config). Scattering it across individual `/toolkit` entries
would undersell it and make the page incoherent. Decide the *shape* first, then populate.

## The open question

How does the agentic-config layer appear on the portfolio? Three broad options, none chosen yet:

1. **Tool cards** — one card each for Superpowers, gstack, etc. Simple, consistent with the page,
   but flattens a system into a list and buries the interesting part.
2. **A dedicated `/toolkit` section or sub-page** — "How I configure agents," with its own framing.
   More room to explain the layering (skills → plugins → MCP → hooks), more work to design.
3. **A blog post, linked from one summary card** — the narrative form. Best for the ideas, worst for
   discoverability on the toolkit page itself.

Leaning toward (2) or (3). Do not decide this inside a toolkit-data commit.

## Full inventory as of 2026-07-26

### Claude Code plugins (installed)

| Plugin | Marketplace | Version | Scope |
| --- | --- | --- | --- |
| `superpowers` | superpowers-marketplace | 6.1.1 | user |
| `vercel` | claude-plugins-official | 0.44.0 | user |
| `cloudflare` | cloudflare | 1.0.0 | user |
| `frontend-design` | claude-plugins-official | (sha `78457a28`) | user |
| `second-brain` | antwan-second-brain | 0.1.0 | user — **own** |
| `encoreshot` | encoreshot-local | 0.1.0 | project-scoped — **own**, private |

### MCP servers (configured)

`playwright` · `chrome-devtools` · `vibe-annotations` · `vercel` · `plan`

Note: **vibe-annotations shipped to the page** as a standalone tool card (AI & Agents) — it stands on
its own as a browser-feedback loop, independent of this parked decision.

### CLI / agent tooling

| Tool | Where | Note |
| --- | --- | --- |
| `browse` (gstack) | npm global, `browse@0.8.3` | headless browser QA CLI; drives dogfooding of this very site |
| gstack skills | skill layer | `browse`, `design-shotgun`, `gstack-upgrade` |
| `rtk` | Homebrew, 0.42.1 | **shipped to the page** (AI & Agents) — token-minimizing CLI proxy |
| `@anthropic-ai/claude-code` | npm global, 2.1.220 | **shipped** (already on page) |
| `codex` | `~/.local/bin` → `~/.codex` standalone | excluded — see `toolkit-excluded.md` |
| `eve` | pnpm global, 0.15.3 | excluded — early evaluation only |
| `@playwright/mcp` | npm global, 0.0.75 | part of the MCP set above |

### Also in scope for the session

- **Matt Pocock's skills** — mentioned as worth covering; not yet inventoried.
- **Third-party skill collections generally** — the marketplace/discovery story.
- **Own skills** in `~/.claude/skills/` — the workspace-level machinery (`/standup`, `/new-project`,
  `/apply-pattern`) plus the personal `antwan:*` set. Publishing any of these is a separate
  public/private call.

## Constraints to carry into that session

- **Public/private split matters.** `encoreshot` is private and project-scoped. Own skills and the
  `second-brain` plugin need an explicit publish decision before they appear anywhere public.
- **The machinery/data boundary** (workspace `CLAUDE.md`): skills live in dotfiles, registry and
  patterns live in the workspace repo. Never copy between them — if the portfolio needs to display
  this inventory, it should be a generated view or a single home, not a third copy.
- **This doc will go stale.** Re-run the scan at the start of the session rather than trusting the
  table above.

## Rescan commands

```bash
cat ~/.claude/plugins/installed_plugins.json
npm ls -g --depth=0 && pnpm ls -g --depth=0
ls ~/.claude/skills/
python3 -c "import json;print(list(json.load(open('$HOME/.claude.json')).get('mcpServers',{})))"
```
