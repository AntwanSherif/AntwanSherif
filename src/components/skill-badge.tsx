'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SkillBadge({ name, icon, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - left}px`);
    el.style.setProperty('--my', `${e.clientY - top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2 cursor-default overflow-hidden',
        className
      )}
    >
      <div className='spotlight-fill-sm pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100' />
      {icon && <span className='relative z-10 flex items-center'>{icon}</span>}
      <span className='text-foreground text-sm font-medium relative z-10'>{name}</span>
    </div>
  );
}

