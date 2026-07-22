# Toolkit — Excluded Tools

Companion to `src/data/toolkit.ts`. Every tool that was **considered and left off** `/toolkit`, with a
one-line reason. The point is to not re-litigate the same candidate every six months — if a tool is
here, it was looked at and passed on.

**Last full machine scan:** 2026-07-26 (Homebrew casks + leaves, `/Applications`, global npm/pnpm,
`~/.local/bin`, Claude Code plugins, configured MCP servers, PATH probe for common dev CLIs).

## Inclusion bar

A tool earns a card if it's **actually installed and used**, and at least one of:

- it says something about how the work gets done (a real opinion, not a default),
- it's non-obvious enough that a reader might not know it,
- it's load-bearing — removing it would visibly change the workflow.

It does *not* earn a card for being merely present on the machine.

## Removed from the page

Tools that were listed but aren't installed. The page's value is that it's true, so they came off.

| Tool | Reason |
| --- | --- |
| Warp | Not installed — no binary, no app. `$SHELL` is `/bin/zsh`. |
| Fish Shell | Not installed. Shell is zsh. |
| Starship | Not installed and not referenced in `.zshrc`. |
| Notion | No desktop app; longer-form thinking actually lands in Obsidian. |

Cursor and WisperFlow were also flagged as missing from the machine but **kept deliberately** — both
still reflect real usage patterns (Cursor for inline completions, WisperFlow alongside Handy).

## Considered, not added

### Generic utilities — true but uninteresting

| Tool | Reason |
| --- | --- |
| `wget` | Everyone has it. No opinion expressed by using it. |
| `coreutils` | GNU coreutils on macOS is table stakes, not a choice worth a card. |
| `jq` | Genuinely used daily, but too universal to teach anyone anything. |
| `ripgrep` (`rg`) | Same — the default search tool for a decade. Reconsider only if paired into a "CLI staples" card. |
| `pkgconf` | Build-time dependency, pulled in transitively. |
| `zsh-autosuggestions` / `zsh-completions` | Shell config, not tooling. Would belong in a dotfiles post, not the toolkit. |

### Invisible plumbing — dependencies of something else

| Tool | Reason |
| --- | --- |
| `poppler` | PDF toolkit (`pdftoppm`, `pdftotext`). Installed to rasterize `public/cv.pdf` for visual verification — plumbing behind the CV workflow, not a tool in its own right. |
| `ffmpeg` | Media transcoding for one-off conversions. Ubiquitous and incidental. |
| `minio` / `mc` | S3-compatible object storage, installed for a specific project's local dev. Not part of the general workflow. |

### Not tools — apps everybody already has

| Tool | Reason |
| --- | --- |
| Slack, Zoom, Spotify | Communication and background noise. Zero signal. |
| GarageBand, iMovie, Pages/Numbers/Keynote | Preinstalled Apple apps. |
| Google Chrome, Safari | Browsers as browsers. Arc already covers the browser-as-a-choice angle. |

### Real tools, wrong page

| Tool | Reason |
| --- | --- |
| DB Browser for SQLite | Used occasionally for local DB inspection, but too infrequent to be load-bearing. |
| draw.io | Diagrams a few times a year. Not part of the daily loop. |
| MacDroid / My Files for Samsung Galaxy | Android file transfer. Personal, not professional. |
| QuickDrop, PicView | Small single-purpose utilities. Not worth the reader's attention. |
| ChatGPT.app, Claude.app | Consumer chat clients. The interesting story is the *agentic* layer (Claude Code, Codex), not the chat window. |

### Deliberate passes on strong candidates

| Tool | Reason |
| --- | --- |
| Codex (OpenAI CLI) | Installed and functional, but decided against surfacing a second coding agent on the page. Revisit if the multi-agent workflow becomes something worth writing about. |
| Antigravity IDE | Google's agent-first IDE, installed for evaluation. Not yet part of the real workflow — adding it would overstate the usage. |
| `gh` (GitHub CLI) | Used constantly, but the GitHub card already carries the "where async review lives" point. A second GitHub-shaped card dilutes it. |
| `eve` (Vercel agent CLI) | Early evaluation only. Not load-bearing yet. |
| `chezmoi`-adjacent dotfile managers | N/A — chezmoi won and is on the page. |

## Suggested, not evaluated — knowledge gap, NOT rejected

**Read this section differently from the ones above.** These were surfaced as curated suggestions on
2026-07-26 (tools *not* installed, offered as candidates). They're absent from the page simply
because they're unfamiliar — no judgement was made about any of them. Treat every row as an open
question, not a closed one.

| Tool | Space | What it does |
| --- | --- | --- |
| OpenRouter | AI | One API key across every model provider; routing and fallback |
| LiteLLM | AI | Self-hosted provider proxy with spend caps |
| Braintrust / LangSmith | AI | LLM eval + tracing — measuring whether a prompt change helped |
| Repomix / gitingest | AI | Repo → one LLM-ready file |
| aider | AI | Terminal coding agent |
| Continue.dev | AI | Open-source IDE agent; self-hosted answer to Cursor |
| v0 | AI / frontend | Vercel's UI generation, Next.js + shadcn shaped |
| Perplexity | AI | Research with citations |
| Cloudflare (Workers/R2) | Infra | Edge compute + object storage |
| Turborepo | Infra | Monorepo build orchestration and caching |
| Supabase | Infra | Postgres + auth + storage as one product |
| Bruno | Web dev | Local-first, git-friendly API client |
| OrbStack | Web dev | Fast Docker/Linux VMs on macOS |
| Sentry | Infra | Error and performance monitoring |
| Tailscale | Infra | Private mesh networking (WireGuard) |
| Figma | Design | The industry-standard design tool |
| tldraw | Design | Infinite canvas with a strong embeddable SDK |
| Radix Colors | Design | Perceptually-uniform palettes with dark mode built in |
| Screen Studio | Design | Screen recordings with automatic polish — the demo-video tool |
| CleanShot X / Shottr | Design | Screenshot capture + annotation |
| Rive | Design | Interactive vector animation with a runtime |
| Polypane | Web dev | Multi-viewport dev browser with a11y overlays |
| Granola | Productivity | AI meeting notes |
| Readwise Reader | Productivity | Read-later + highlights, syncs into Obsidian |
| Karabiner-Elements | Productivity | Deep macOS keyboard remapping |
| Homerow | Productivity | Vim-style keyboard navigation for macOS |
| Hammerspoon | Productivity | Lua-scripted macOS automation |
| 1Password | Productivity | Secrets, with CLI and SSH agent integration |

If one of these later gets tried and passed on, **move the row up** into "Considered, not added" with
a real reason. Leaving it here means the question is still open.

## Parked: skills, plugins, and the agent-config layer

**Deliberately deferred — needs its own session.** See `docs/toolkit-skills-parked.md`.

This covers Superpowers (already on the page), gstack, the `browse` CLI, the Claude Code plugin
ecosystem (Vercel, Cloudflare, frontend-design, second-brain), configured MCP servers, and
third-party skill collections. It's a large enough topic that scattering it across individual tool
cards would undersell it.

## Adding to this doc

When a tool gets rejected, add the row **and the reason** in the same commit as any toolkit change.
A reason like "not a good fit" is useless in six months — say what specifically disqualified it.
