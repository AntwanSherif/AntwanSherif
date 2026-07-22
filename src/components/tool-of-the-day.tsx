'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { TOOLKIT_DATA } from '@/data/toolkit';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

// Only surface genuinely surprising picks — obvious tools are excluded via hideFromToD
const discoveryTools = TOOLKIT_DATA.flatMap((cat) =>
  cat.tools
    .filter((tool) => !tool.hideFromToD)
    .map((tool) => ({ ...tool, category: cat.label }))
);

// Year offset shifts the starting position each year so Jan 1 doesn't always show the same tool.
// 37 is arbitrary — change it to reshuffle the rotation. Computed once at module load,
// so an open tab crossing midnight won't advance until reload (intentional for this widget).
const BASE_SEED = getDayOfYear() + new Date().getFullYear() * 37;

export function ToolOfTheDay() {
  const [offset, setOffset] = useState(0);
  const index = (BASE_SEED + offset) % discoveryTools.length;
  const tool = discoveryTools[index];

  useEffect(() => {
    if (!tool) return;
    if (offset === 0) {
      track({ name: 'tool_of_the_day_view', props: { content_type: 'tool', content_id: tool.name } });
    } else {
      const prevIndex = (BASE_SEED + offset - 1) % discoveryTools.length;
      const prevTool = discoveryTools[prevIndex];
      track({ name: 'tool_of_the_day_next', props: { content_type: 'tool', from_tool: prevTool.name, to_tool: tool.name } });
    }
  }, [tool, offset]);

  if (!tool) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--accent-1)]/30 bg-[var(--accent-1)]/5',
        'px-6 py-5 flex flex-col gap-2'
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <p className='text-xs font-semibold uppercase tracking-widest text-[var(--accent-1)]'>
            Tool of the Day
          </p>
          <span className='text-xs text-muted-foreground/60'>· {tool.category}</span>
        </div>
        <button
          onClick={() => setOffset((o) => o + 1)}
          title='Show another'
          className='flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--accent-1)] transition-colors'
        >
          <RotateCcw className='size-3' />
          <span>next</span>
        </button>
      </div>
      <a
        href={tool.url}
        target='_blank'
        rel='noopener noreferrer'
        data-content-type='tool'
        data-content-id={tool.name}
        data-analytics-skip-outbound
        onClick={() => track({ name: 'tool_of_the_day_open', props: { content_type: 'tool', content_id: tool.name } })}
        className='group flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-[var(--accent-1)] transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm'
      >
        {tool.name}
        <ExternalLink className='size-3.5 opacity-50 group-hover:opacity-100 transition-opacity' />
      </a>
      <p className='text-sm text-muted-foreground leading-relaxed'>{tool.description}</p>
    </div>
  );
}
