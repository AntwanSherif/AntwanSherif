import { DATA } from '@/data/resume';
import { TalkCard } from '@/components/talk-card';

const BLUR_FADE_DELAY = 0.04;

export default function TalksSection() {
  return (
    <div className='flex min-h-0 flex-col gap-y-8'>
      <div className='flex flex-col gap-y-4 items-center justify-center'>
        <div className='flex items-center w-full'>
          <div className='flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent' />
          <div className='border bg-primary z-10 rounded-xl px-4 py-1'>
            <span className='text-background text-sm font-medium'>Talks</span>
          </div>
          <div className='flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent' />
        </div>
        <p className='text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center'>
          Conference talks and community events I&apos;ve spoken at.
        </p>
      </div>

      <div className='flex flex-col gap-6'>
        {DATA.talks.map((talk, id) => (
          <TalkCard key={talk.title} talk={talk} delay={BLUR_FADE_DELAY * 14 + id * 0.05} />
        ))}
      </div>
    </div>
  );
}
