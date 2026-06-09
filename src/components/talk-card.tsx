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

  const hasImages = talk.images.length > 0;

  return (
    <BlurFade delay={delay}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className='group relative rounded-2xl border border-border bg-card overflow-hidden'
      >
        <div className='spotlight-fill pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100' />
        <div className='spotlight-border pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100' />

        {hasImages && (
          <div className='relative'>
            <div className='flex gap-2 overflow-x-auto p-3 pr-6 scrollbar-none'>
              {talk.images.map((image, i) => (
                <div
                  key={i}
                  className='relative flex-none rounded-xl overflow-hidden w-[clamp(16rem,93%,32rem)] aspect-[10/10] min-[600px]:w-[clamp(16rem,90%,32rem)] min-[600px]:aspect-[9/6] sm:w-[clamp(20rem,90%,30rem)] sm:aspect-[9/6] md:w-[clamp(24rem,95%,32rem)] md:aspect-[9/6]'
                >
                  <Image
                    src={image.src}
                    alt={`${talk.title} — photo ${i + 1}`}
                    fill
                    className='object-cover'
                    style={{ objectPosition: image.objectPosition }}
                    sizes='320px'
                  />
                </div>
              ))}
            </div>
            <div className='talk-overlay-fade pointer-events-none absolute inset-0' />
            <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col gap-0.5'>
              <span className='text-xs font-medium text-accent-2 uppercase tracking-wide'>{talk.event}</span>
              <h3 className='font-semibold text-xl leading-snug'>{talk.title}</h3>
            </div>
          </div>
        )}

        <div className='p-4 sm:p-5 flex flex-col gap-3'>
          {!hasImages && (
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs font-medium text-accent-2 uppercase tracking-wide'>{talk.event}</span>
              <h3 className='font-semibold text-base leading-snug'>{talk.title}</h3>
            </div>
          )}

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

          <div className='flex flex-wrap items-center gap-2 min-h-[2.125rem]'>
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
        </div>
      </div>
    </BlurFade>
  );
}
