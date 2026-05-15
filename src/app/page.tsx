/* eslint-disable @next/next/no-img-element */
import BlurFade from '@/components/magicui/blur-fade';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DATA } from '@/data/resume';
import Link from 'next/link';
import Markdown from 'react-markdown';
import ContactSection from '@/components/section/contact-section';
import ProjectsSection from '@/components/section/projects-section';
import TalksSection from '@/components/section/talks-section';
import WorkSection from '@/components/section/work-section';
import { ArrowUpRight } from 'lucide-react';
import ScrambleText from '@/components/ScrambleText';
import MagneticButton from '@/components/MagneticButton';
import SourceFieldClient from '@/components/SourceFieldClient';
import { SkillBadge } from '@/components/skill-badge';
const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className='min-h-dvh flex flex-col gap-10 sm:gap-14 relative'>
      <section id='hero' className='relative min-h-[80vh] flex items-center'>
        {/* Particle field background — extends beyond padding edges */}
        <SourceFieldClient className='absolute inset-y-0 -left-6 -right-6 opacity-40 pointer-events-none' />

        <div className='relative z-10 w-full space-y-6'>
          <BlurFade delay={BLUR_FADE_DELAY}>
            <Avatar className='size-20 md:size-24 border rounded-full shadow-lg ring-2 ring-border'>
              <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h1 className='font-bricolage text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-none wrap-break-word'>
              <ScrambleText text={DATA.name} />
            </h1>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className='text-lg sm:text-xl text-muted-foreground max-w-md'>{DATA.description}</p>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className='flex flex-wrap gap-3 pt-2'>
              <MagneticButton
                href='#projects'
                className='bg-[var(--accent-1)] text-[#0a0a0f] hover:bg-[var(--accent-1)]/90'
              >
                View Work
              </MagneticButton>
              <MagneticButton
                href='#contact'
                className='border border-border text-foreground hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'
              >
                Get in Touch
              </MagneticButton>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id='about'>
        <div className='flex min-h-0 flex-col gap-y-4'>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className='text-xl font-bold'>About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className='prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert'>
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id='work'>
        <div className='flex min-h-0 flex-col gap-y-6'>
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className='text-xl font-bold'>Work Experience</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>
      <section id='education'>
        <div className='flex min-h-0 flex-col gap-y-6'>
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className='text-xl font-bold'>Education</h2>
          </BlurFade>
          <div className='flex flex-col gap-8'>
            {DATA.education.map((education, index) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + index * 0.05}>
                <Link
                  href={education.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-x-3 justify-between group'
                >
                  <div className='flex items-center gap-x-3 flex-1 min-w-0'>
                    {education.logoUrl ? (
                      <img
                        src={education.logoUrl}
                        alt={education.school}
                        className='size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none'
                      />
                    ) : (
                      <div className='size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none' />
                    )}
                    <div className='flex-1 min-w-0 flex flex-col gap-0.5'>
                      <div className='font-semibold leading-none flex items-center gap-2'>
                        {education.school}
                        <ArrowUpRight
                          className='h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200'
                          aria-hidden
                        />
                      </div>
                      <div className='font-sans text-sm text-muted-foreground'>{education.degree}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none'>
                    <span>
                      {education.start} - {education.end}
                    </span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id='skills'>
        <div className='flex min-h-0 flex-col gap-y-4'>
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className='text-xl font-bold'>Skills</h2>
          </BlurFade>
          <div className='flex flex-wrap gap-2'>
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <SkillBadge
                  name={skill.name}
                  icon={
                    skill.icon ? <skill.icon className='size-4 rounded overflow-hidden object-contain' /> : undefined
                  }
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id='talks'>
        <BlurFade delay={BLUR_FADE_DELAY * 15}>
          <TalksSection />
        </BlurFade>
      </section>
      <section id='projects'>
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection />
        </BlurFade>
      </section>
      <section id='contact'>
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}

