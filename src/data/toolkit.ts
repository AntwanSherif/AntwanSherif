
export interface Tool {
  name: string;
  url: string;
  description: string; // 1–2 sentence rationale
  icon?: string; // absolute URL or '/icons/...' path; optional
  tags?: string[];
  isNew?: boolean; // flag recently added tools
  hideFromToD?: boolean; // exclude from Tool of the Day — reserved for "obvious" tools everyone already knows
}

// Tags for the tech-stack skills — shares vocabulary with tool tags
// so the unified filter on /toolkit spans both.
export const SKILL_TAGS: Record<string, string[]> = {
  'React':             ['frontend', 'ui'],
  'Next.js':           ['frontend', 'framework'],
  'TypeScript':        ['frontend', 'language'],
  'Vue.js':            ['frontend', 'ui'],
  'Nuxt':              ['frontend', 'framework'],
  'Node.js':           ['backend'],
  'tRPC':              ['backend', 'api'],
  'TanStack Query':    ['frontend', 'data'],
  'GraphQL':           ['api', 'data'],
  'Playwright':        ['testing', 'automation'],
  'Vitest':            ['testing'],
  'Jest':              ['testing'],
  'Vercel AI SDK':     ['ai', 'tooling'],
  'MCP Servers':       ['ai', 'agents'],
  'Micro-frontends':   ['frontend', 'architecture'],
  'Monorepos':         ['tooling', 'architecture'],
  'CI/CD':             ['automation', 'tooling'],
};

export interface ToolCategory {
  label: string;
  slug: string; // kebab-case, used as id="#slug" anchor
  tools: Tool[];
}

export const TOOLKIT_DATA: ToolCategory[] = [
  {
    label: 'AI & Agents',
    slug: 'ai-agents',
    tools: [
      {
        name: 'Claude Code',
        url: 'https://claude.ai/code',
        icon: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=64',
        description:
          'My primary coding agent. Handles everything from refactors to full-feature branches — I treat it like a senior pair who never gets tired.',
        tags: ['ai', 'coding', 'agents'],
        hideFromToD: true,
      },
      {
        name: 'CMUX',
        url: 'https://cmux.com',
        icon: '/logos/cmux.png',
        description:
          'Terminal multiplexer for running multiple Claude/Codex sessions in parallel. Keeps me focused by surfacing which agent needs my input without constant tab-switching.',
        tags: ['terminal', 'agents', 'focus'],
      },
      {
        name: 'Cursor',
        url: 'https://cursor.sh',
        icon: 'https://www.google.com/s2/favicons?domain=cursor.sh&sz=64',
        description:
          'When I need inline completions inside a file without spinning up a full agent loop. Good for the fast, surgical edits where a full agentic cycle is overkill.',
        tags: ['ai', 'editor', 'completions'],
        hideFromToD: true,
      },
      {
        name: 'Superpowers',
        url: 'https://superpowers.ai',
        icon: 'https://www.google.com/s2/favicons?domain=superpowers.ai&sz=64',
        description:
          'Skills marketplace for Claude Code — drops reusable agentic workflows into any project without copy-pasting prompt boilerplate across repos.',
        tags: ['ai', 'agents', 'tooling'],
        isNew: true,
      },
      {
        name: 'RTK',
        url: 'https://www.rtk-ai.app',
        icon: 'https://www.google.com/s2/favicons?domain=rtk-ai.app&sz=64',
        description:
          'A CLI proxy that reshapes command output before it reaches the model — the same git or grep call, 60–90% fewer tokens. The savings compound quietly across a long session.',
        tags: ['ai', 'cli', 'tokens'],
        isNew: true,
      },
      {
        name: 'Vibe Annotations',
        url: 'https://chromewebstore.google.com/detail/vibe-annotations-visual-f/gkofobaeeepjopdpahbicefmljcmpeof',
        icon: '/logos/vibe-annotations.png',
        description:
          'Click a live page, leave a comment, and the agent reads it as structured feedback over MCP. Closes the gap between "that button is wrong" and a commit that fixes it.',
        tags: ['ai', 'agents', 'ui', 'feedback'],
        isNew: true,
      },
      {
        name: 'Visual Plan',
        url: 'https://github.com/BuilderIO/skills/blob/main/skills/visual-plan/README.md',
        icon: '/logos/github.png',
        description:
          'Turns the plan an agent would otherwise bury in chat into an interactive MDX document — architecture diagrams, wireframes, file maps, open questions. The approval gate before any code gets written.',
        tags: ['ai', 'agents', 'planning', 'docs'],
        isNew: true,
      },
    ],
  },
  {
    label: 'Local LLMs',
    slug: 'local-llms',
    tools: [
      {
        name: 'Ollama',
        url: 'https://ollama.com',
        icon: 'https://www.google.com/s2/favicons?domain=ollama.com&sz=64',
        description:
          'Local inference for the work that shouldn\'t leave the machine — embeddings, quick classification, bulk passes I don\'t want to meter per token. One pull and the model is serving.',
        tags: ['ai', 'llm', 'local'],
        hideFromToD: true,
      },
      {
        name: 'LM Studio',
        url: 'https://lmstudio.ai',
        icon: 'https://www.google.com/s2/favicons?domain=lmstudio.ai&sz=64',
        description:
          'The GUI half of running models locally. Where I actually compare two quantizations side by side before committing one to a pipeline.',
        tags: ['ai', 'llm', 'local'],
      },
    ],
  },
  {
    label: 'Design & Diagrams',
    slug: 'design-diagrams',
    tools: [
      {
        name: 'Claude Design',
        url: 'https://claude.com/product/design',
        icon: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=64',
        description:
          'Goes from a written brief to real design directions before I open a design tool. Best used for the divergent pass — generating options worth arguing about, not the final pixels.',
        tags: ['design', 'ai', 'ui'],
        isNew: true,
      },
      {
        name: 'Excalidraw',
        url: 'https://excalidraw.com',
        icon: 'https://www.google.com/s2/favicons?domain=excalidraw.com&sz=64',
        description:
          'Diagrams that stay deliberately hand-drawn. The looseness is the feature — nobody mistakes an Excalidraw sketch for a finished spec, so people actually push back on it.',
        tags: ['design', 'diagrams', 'architecture'],
      },
      {
        name: 'Miro',
        url: 'https://miro.com',
        icon: 'https://www.google.com/s2/favicons?domain=miro.com&sz=64',
        description:
          'The infinite canvas for the messy front end of a project — flows, affinity mapping, workshops with people who don\'t read documents. Where thinking happens before it earns structure.',
        tags: ['design', 'whiteboard', 'planning'],
        hideFromToD: true,
      },
    ],
  },
  {
    label: 'Infra & Data',
    slug: 'infra-data',
    tools: [
      {
        name: 'Vercel',
        url: 'https://vercel.com',
        icon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64',
        description:
          'Where this site and most of my side projects ship. Per-PR preview deploys mean design review happens on a real URL instead of a screenshot in a comment thread.',
        tags: ['hosting', 'deploy', 'frontend'],
        hideFromToD: true,
      },
      {
        name: 'Neon',
        url: 'https://neon.com',
        icon: 'https://www.google.com/s2/favicons?domain=neon.com&sz=64',
        description:
          'Serverless Postgres with real branching — a database branch per PR to match the preview deploy. Scales to zero between side projects, which is most of the time.',
        tags: ['database', 'postgres', 'backend', 'data'],
      },
      {
        name: 'Umami',
        url: 'https://umami.is',
        icon: 'https://www.google.com/s2/favicons?domain=umami.is&sz=64',
        description:
          'Cookieless analytics I self-host. I get the numbers I actually act on without handing visitor data to an ad network — and without a consent banner in the way.',
        tags: ['analytics', 'privacy', 'data'],
      },
    ],
  },
  {
    label: 'Code Review',
    slug: 'code-review',
    tools: [
      {
        name: 'CodeRabbit',
        url: 'https://coderabbit.ai',
        icon: 'https://www.google.com/s2/favicons?domain=coderabbit.ai&sz=64',
        description:
          'AI-powered PR reviewer that catches things humans miss on the second pass. Particularly good at spotting edge cases and suggesting test coverage gaps.',
        tags: ['code-review', 'ai', 'pr'],
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        icon: '/logos/github.png',
        description:
          'Old faithful. Still where the async conversation actually lives — CodeRabbit surfaces the issues, humans resolve them here.',
        tags: ['code-review', 'git', 'async'],
        hideFromToD: true,
      },
      {
        name: 'Linear',
        url: 'https://linear.app',
        icon: 'https://www.google.com/s2/favicons?domain=linear.app&sz=64',
        description:
          'Issue tracker that actually stays out of the way. The Git integration means PR reviews and issue state stay in sync without manual ceremony.',
        tags: ['planning', 'issues', 'git'],
      },
    ],
  },
  {
    label: 'Productivity',
    slug: 'productivity',
    tools: [
      {
        name: 'WisperFlow',
        url: 'https://wisperflow.com',
        icon: 'https://www.google.com/s2/favicons?domain=wisperflow.com&sz=64',
        description:
          'Voice-to-text that actually understands technical language. Lets me dictate commit messages, docs, and Slack replies without losing the thread.',
        tags: ['voice', 'dictation', 'writing'],
      },
      {
        name: 'Raycast',
        url: 'https://raycast.com',
        icon: 'https://www.google.com/s2/favicons?domain=raycast.com&sz=64',
        description:
          'Replaced Spotlight years ago and never looked back. The window management + clipboard history + script commands make it feel like a second keyboard.',
        tags: ['launcher', 'automation', 'mac'],
      },
      {
        name: 'Grammarly',
        url: 'https://grammarly.com',
        icon: 'https://www.google.com/s2/favicons?domain=grammarly.com&sz=64',
        description:
          'Second pass on anything client-facing. Catches tone drift and the sentence I wrote at 1am that felt airtight at the time.',
        tags: ['writing', 'editing', 'productivity'],
        hideFromToD: true,
      },
      {
        name: 'Handy',
        url: 'https://handy.computer',
        icon: 'https://www.google.com/s2/favicons?domain=handy.computer&sz=64',
        description:
          'Open-source speech-to-text that runs entirely on-device. Nothing leaves the machine, which is the whole point when the thing being dictated is client work.',
        tags: ['voice', 'dictation', 'local', 'privacy'],
      },
      {
        name: 'Obsidian',
        url: 'https://obsidian.md',
        icon: 'https://www.google.com/s2/favicons?domain=obsidian.md&sz=64',
        description:
          'Plain markdown files on disk, not rows in someone else\'s database. My notes will outlive whichever app I\'m using this year — and agents can read them directly.',
        tags: ['notes', 'docs', 'knowledge-base', 'local'],
        hideFromToD: true,
      },
      {
        name: 'Maccy',
        url: 'https://maccy.app',
        icon: 'https://www.google.com/s2/favicons?domain=maccy.app&sz=64',
        description:
          'Clipboard history behind one keystroke. Sounds trivial until you\'re shuttling six values between a terminal, a config file, and a browser tab.',
        tags: ['clipboard', 'mac', 'productivity'],
      },
      {
        name: 'Amphetamine',
        url: 'https://apps.apple.com/app/amphetamine/id937984704',
        icon: '/logos/amphetamine.png',
        description:
          'Keeps the Mac awake while long agent runs and builds finish. Trigger-based rather than blanket — it sleeps again the moment the work does.',
        tags: ['mac', 'utility', 'focus'],
      },
      {
        name: 'Arc Browser',
        url: 'https://arc.net',
        icon: 'https://www.google.com/s2/favicons?domain=arc.net&sz=64',
        description:
          'Spaces keep client work, side projects, and personal tabs from bleeding into each other. The command bar makes it feel more like an OS than a browser.',
        tags: ['browser', 'focus', 'organization'],
      },
    ],
  },
  {
    label: 'Editor & Terminal',
    slug: 'editor-terminal',
    tools: [
      {
        name: 'VS Code',
        url: 'https://code.visualstudio.com',
        icon: 'https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64',
        description:
          'Still the editor I reach for. The extension ecosystem and debugger integration are hard to beat, and it pairs well with the Claude Code CLI.',
        tags: ['editor', 'ide'],
        hideFromToD: true,
      },
      {
        name: 'Biome',
        url: 'https://biomejs.dev',
        icon: 'https://www.google.com/s2/favicons?domain=biomejs.dev&sz=64',
        description:
          'One Rust binary doing the job of ESLint and Prettier, fast enough to run on save without noticing. Two configs collapse into one, which is most of the appeal.',
        tags: ['tooling', 'linting', 'formatting'],
      },
      {
        name: 'chezmoi',
        url: 'https://chezmoi.io',
        icon: 'https://www.google.com/s2/favicons?domain=chezmoi.io&sz=64',
        description:
          'Dotfiles under version control with per-machine templating and real secret handling. A new machine becomes one command instead of an afternoon of half-remembered config.',
        tags: ['dotfiles', 'cli', 'config'],
      },
      {
        name: 'Bun',
        url: 'https://bun.sh',
        icon: 'https://www.google.com/s2/favicons?domain=bun.sh&sz=64',
        description:
          'What I reach for when startup time is the bottleneck — one-off TypeScript files and quick scripts run without a build step. Real projects still ship on pnpm.',
        tags: ['runtime', 'javascript', 'cli'],
        hideFromToD: true,
      },
    ],
  },
];
