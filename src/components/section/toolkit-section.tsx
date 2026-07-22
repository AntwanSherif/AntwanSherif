'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { SkillBadge } from '@/components/skill-badge';
import { TOOLKIT_DATA, SKILL_TAGS } from '@/data/toolkit';
import { DATA } from '@/data/resume';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

// ─── Data ─────────────────────────────────────────────────────────────────

const allTools = TOOLKIT_DATA.flatMap((cat) =>
  cat.tools.map((tool) => ({ ...tool, category: cat.label }))
);

// All unique tags across tools + skills, sorted by frequency
const tagCounts: Record<string, number> = {};
allTools.forEach((t) => t.tags?.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] ?? 0) + 1; }));
Object.values(SKILL_TAGS).flat().forEach((tag) => { tagCounts[tag] = (tagCounts[tag] ?? 0) + 1; });
const allTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([tag]) => tag);

// ─── Logo ─────────────────────────────────────────────────────────────────

function ToolLogo({ icon, name, size = 'sm' }: { icon?: string; name: string; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'size-10 rounded-xl' : 'size-5 rounded-md';
  const textCls = size === 'lg' ? 'text-base' : 'text-[10px]';
  if (!icon) {
    return (
      <span className={cn(cls, textCls, 'bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0')}>
        {name[0]}
      </span>
    );
  }
  // next/image bypassed: favicons are tiny remote images from Google's s2 service — not worth
  // adding every tool's domain to next.config allowlist just for 32px icons.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={icon} alt='' width={size === 'lg' ? 40 : 20} height={size === 'lg' ? 40 : 20} className={cn(cls, 'object-contain bg-muted shrink-0')} />;
}

// ─── Tag filter ───────────────────────────────────────────────────────────

function TagFilter({ activeTag, currentParams }: { activeTag: string | null; currentParams: URLSearchParams }) {
  const router = useRouter();

  function toggle(tag: string | null) {
    const next = new URLSearchParams(currentParams.toString());
    if (tag) next.set('tag', tag);
    else next.delete('tag');
    router.replace(`?${next.toString()}`, { scroll: false });
    const resultCount = tag
      ? allTools.filter((t) => t.tags?.includes(tag)).length
      : allTools.length;
    track({ name: 'tool_filter_click', props: { content_type: 'tool', tag: tag ?? 'all', result_count: resultCount } });
  }

  return (
    <div className='flex flex-wrap gap-2'>
      <button
        onClick={() => toggle(null)}
        aria-pressed={activeTag === null}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
          activeTag === null
            ? 'bg-[var(--accent-1)] text-background border-[var(--accent-1)]'
            : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
        )}
      >
        All
      </button>
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(activeTag === tag ? null : tag)}
          aria-pressed={activeTag === tag}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            activeTag === tag
              ? 'bg-[var(--accent-1)] text-background border-[var(--accent-1)]'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
          )}
        >
          {tag}
          <span className='ml-1 opacity-50'>{tagCounts[tag]}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Tool card ────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: typeof allTools[0] }) {
  return (
    <a
      href={tool.url}
      target='_blank'
      rel='noopener noreferrer'
      data-content-type='tool'
      data-content-id={tool.name}
      className='group relative rounded-xl border border-border bg-card/40 overflow-hidden h-36 hover:border-[var(--accent-1)]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    >
      {/* Rest state — hover-capable devices only */}
      <div className='flex flex-col items-center justify-center gap-2.5 h-full [@media(hover:none)]:hidden'>
        <ToolLogo icon={tool.icon} name={tool.name} size='lg' />
        <span className='text-sm font-semibold text-foreground text-center px-3 leading-tight'>{tool.name}</span>
        <span className='text-[10px] text-muted-foreground'>{tool.category}</span>
      </div>

      {/* Reveal panel — slides up on hover/focus; always visible on touch */}
      <div className='absolute inset-0 bg-card/95 backdrop-blur-sm flex flex-col gap-2 p-4 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0 transition-transform duration-200 ease-out'>
        <div className='flex items-center gap-2'>
          <ToolLogo icon={tool.icon} name={tool.name} />
          <span className='text-sm font-semibold text-[var(--accent-1)] leading-tight flex-1'>{tool.name}</span>
          {tool.isNew && (
            <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-1)] font-semibold'>New</span>
          )}
          <ExternalLink className='size-3 opacity-60 shrink-0' />
        </div>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-3'>{tool.description}</p>
        {tool.tags && (
          <div className='flex gap-1 flex-wrap mt-auto'>
            {tool.tags.map((tag) => (
              <span key={tag} className='text-[9px] px-1.5 py-0.5 rounded-full border border-border text-muted-foreground'>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

// ─── Inner section (reads URL params) ────────────────────────────────────

const KNOWN_SOURCES = new Set(['skills_home', 'navbar', 'hotkeys']);

function ToolkitSectionInner() {
  const params = useSearchParams();
  const activeTag = params.get('tag');
  const fromSource = params.get('from');

  useEffect(() => {
    const source = fromSource && KNOWN_SOURCES.has(fromSource) ? fromSource : 'direct';
    track({ name: 'toolkit_entry', props: { content_type: 'tool', source } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTools = activeTag
    ? allTools.filter((t) => t.tags?.includes(activeTag))
    : allTools;

  const visibleSkills = DATA.skills.filter(
    (s) => !activeTag || SKILL_TAGS[s.name]?.includes(activeTag)
  );

  return (
    <section className='flex flex-col gap-8'>
      <TagFilter activeTag={activeTag} currentParams={params} />

      {/* Stack band */}
      {visibleSkills.length > 0 && (
        <div className='flex flex-col gap-3'>
          <h2 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Stack</h2>
          <div className='flex flex-wrap gap-2'>
            {visibleSkills.map((skill) => (
              <SkillBadge
                key={skill.name}
                name={skill.name}
                icon={skill.icon ? <skill.icon className='size-4 rounded overflow-hidden object-contain' /> : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tools band */}
      {visibleTools.length > 0 && (
        <div className='flex flex-col gap-3'>
          <h2 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Daily Drivers</h2>
          <div className='grid grid-cols-2 gap-3'>
            {visibleTools.map((tool) => <ToolCard key={tool.name} tool={tool} />)}
          </div>
        </div>
      )}

      {visibleTools.length === 0 && visibleSkills.length === 0 && (
        <p className='text-sm text-muted-foreground py-4'>Nothing tagged &ldquo;{activeTag}&rdquo;.</p>
      )}
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────

export default function ToolkitSection() {
  return (
    <Suspense>
      <ToolkitSectionInner />
    </Suspense>
  );
}
