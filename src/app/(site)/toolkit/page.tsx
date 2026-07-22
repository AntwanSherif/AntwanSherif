import type { Metadata } from 'next';
import BlurFade from '@/components/magicui/blur-fade';
import ToolkitSection from '@/components/section/toolkit-section';
import { ToolOfTheDay } from '@/components/tool-of-the-day-loader';

export const metadata: Metadata = {
  title: 'Toolkit | Antwan Sherif',
  description:
    'The tools, apps, and gear I reach for every day — and why I keep reaching for them.',
};

const BLUR_FADE_DELAY = 0.04;

export default function ToolkitPage() {
  return (
    <main
      id='main-content'
      className='flex flex-col min-h-0 gap-y-10 max-w-2xl mx-auto px-4'
    >
      {/* Hero */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className='flex flex-col gap-y-2 pt-10'>
          <h1 className='text-2xl font-bold tracking-tight'>My Toolkit</h1>
          <p className='text-muted-foreground text-sm leading-relaxed max-w-lg'>
            Agents for the heavy lifting, purpose-built tools for everything else — and a stack that&apos;s earned its place through shipping, not hype.
          </p>
        </div>
      </BlurFade>

      {/* Tool of the Day */}
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <ToolOfTheDay />
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <ToolkitSection />
      </BlurFade>
    </main>
  );
}
