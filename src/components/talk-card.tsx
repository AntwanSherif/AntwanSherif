'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, MapPin, Calendar } from 'lucide-react';
import BlurFade from '@/components/magicui/blur-fade';
import { DATA } from '@/data/resume';

export function TalkCard({ talk, delay }: { talk: (typeof DATA.talks)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - left}px`);
    el.style.setProperty('--my', `${e.clientY - top}px`);
  };

  return (
    <BlurFade delay={delay}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className='spotlight-card relative rounded-2xl border border-border bg-card overflow-hidden'
      >
        <div className='spotlight-overlay spotlight-fill' />
        <div className='spotlight-overlay spotlight-border' />

        {talk.images.length > 0 && (
          <div className='flex gap-2 overflow-x-auto p-3 scrollbar-none'>
            {talk.images.map((image, i) => (
              <div key={i} className='relative flex-none h-44 w-72 rounded-xl overflow-hidden'>
                <Image
                  src={image.src}
                  alt={`${talk.title} — photo ${i + 1}`}
                  fill
                  className='object-cover'
                  style={{ objectPosition: image.objectPosition }}
                  sizes='288px'
                />
              </div>
            ))}
          </div>
        )}

        <div className='p-4 sm:p-5 flex flex-col gap-3'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div className='flex flex-col gap-1'>
              <h3 className='font-semibold text-base leading-snug'>{talk.title}</h3>
              <span className='text-xs font-medium text-accent-2 uppercase tracking-wide'>{talk.event}</span>
            </div>
            {talk.links.length > 0 && (
              <div className='flex-none flex items-center gap-2'>
                {talk.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-accent-2 transition-colors'
                  >
                    <ExternalLink className='size-3' />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Calendar className='size-3' />
              {talk.date}
            </span>
            <span className='flex items-center gap-1'>
              <MapPin className='size-3' />
              {talk.location}
            </span>
          </div>

          <p className='text-sm text-muted-foreground leading-relaxed'>{talk.description}</p>
        </div>
      </div>
    </BlurFade>
  );
}

