'use client';

// The canonical CV document. One design (the "Gradient Header" direction),
// parameterized by a config so the editor can A/B header concepts, side-project
// tech rendering, link style, and column widths — and so the public page can
// pin a chosen config. Every text field is wrapped in <Ed>, so the same
// component powers both the read-only public page and the in-place editor
// (editing is global: titles, dates, skills, sidebar content, all of it).

import { useReducedMotion, motion } from 'motion/react';
import Image from 'next/image';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { resolveCvHref } from '@/lib/encoreshot';
import type { CVData, CVEntry } from '@/data/cv';
import { FadeItem, Stagger } from './_shared';
import { Ed, EditContext } from './edit-context';

// One brand blue (sampled from the candidate's original CV PDF) carries the
// header, section labels and links — a single color story rather than three
// competing blues.
const BLUE = '#2251b2';
const INK = '#0F172A';
const GRAY = '#64748B';
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// Solid royal blue band (same brand blue as BLUE above).
const HEADER_SOLID = '#2251b2';
// Soft brand-blue marker for bullet dots — a gentle tint of the section-label
// blue, so bullets read as part of the blue story without competing with the
// stronger heading dots.
const MARKER = '#9bb0db';

export type TechStyle = 1 | 2 | 3;
export type LinkStyle = 1 | 2 | 3;
export type EmblemType = 'rings' | 'none';
export type SidebarStyle = 'flow' | 'card';

export type CVDocConfig = {
  techStyle: TechStyle;
  linkStyle: LinkStyle;
  emblem: EmblemType;
  sidebarStyle: SidebarStyle;
  // Main column's share of the width (sidebar gets the rest). One dial controls
  // the split rather than two independent fr values.
  colSplit: number;
  // Live design dials (1 = the tuned baseline). headerScale sizes the header
  // band + name; textScale / lineScale multiply body font-size and line-height
  // (scoped to the body grid via CSS vars, so columns stay fixed-width and the
  // print logic still holds at 1).
  headerScale: number;
  headerPad: number;
  textScale: number;
  lineScale: number;
};

export const DEFAULT_CONFIG: CVDocConfig = {
  techStyle: 1,
  linkStyle: 1,
  emblem: 'none',
  sidebarStyle: 'flow',
  colSplit: 0.617,
  headerScale: 1,
  headerPad: 1,
  textScale: 1,
  lineScale: 1
};

export type CVDocumentProps = {
  data: CVData;
  config?: CVDocConfig;
  editable?: boolean;
  onEdit?: (path: string, value: string) => void;
  // Which rendering of this CV: the live /cv page ('web') or the Puppeteer-printed
  // PDF ('pdf'). Stamps utm_medium on the UTM-tagged EncoreShot link (see stampSurfaceMedium).
  surface?: 'web' | 'pdf';
  // Company slug (e.g. from ?co=). When set, own-property links (antwansherif.com,
  // encoreshot.com) gain utm_campaign=<slug>; third-party links are never tagged.
  campaign?: string;
};

// Filled brand glyphs for the header links — closer to the candidate's
// original CV than Lucide's line icons. Paths from simple-icons (24×24).
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z';
const GITHUB_PATH =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';

function BrandGlyph({ d, size }: { d: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' aria-hidden>
      <path d={d} />
    </svg>
  );
}

function iconFor(label: string, size = 13) {
  const l = label.toLowerCase();
  if (l.includes('linkedin')) return <BrandGlyph d={LINKEDIN_PATH} size={size} />;
  if (l.includes('github')) return <BrandGlyph d={GITHUB_PATH} size={size} />;
  return <Globe size={size} strokeWidth={2} />;
}

export default function CVDocument({
  data,
  config = DEFAULT_CONFIG,
  editable = false,
  onEdit = () => {},
  surface = 'web',
  campaign
}: CVDocumentProps) {
  const reduce = useReducedMotion();
  // Card sidebar A/B: each sidebar block becomes its own panel. Keep padding
  // tight so the cards don't steal column width from the content.
  const isCard = config.sidebarStyle === 'card';
  const cardCls = isCard
    ? 'rounded-lg border border-[#e8ebf2] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.05)] print:px-3.5 print:py-3 print:shadow-none'
    : undefined;

  return (
    <EditContext.Provider value={{ editable, onEdit }}>
      <div
        className='cv-sheet mx-auto bg-white'
        style={{
          fontFamily: SANS,
          color: INK,
          // Defaults so header text (outside the grid) ignores the body dials;
          // the grid below overrides these with the live config values.
          ['--cv-text' as string]: 1,
          ['--cv-line' as string]: 1,
          // Column split, exposed so the print-only full-page column background
          // (.cv-colbg) can paint its white/sidebar boundary at the same x.
          ['--cv-split' as string]: config.colSplit
        }}
      >
        {/* Print-only, full-page column background: a fixed element repeats on
            every printed page and paints white (main) | hairline | tint
            (sidebar) edge-to-edge, so the sidebar reads as a full-height panel
            even where its cards stop. Hidden on screen. */}
        <div className='cv-colbg' aria-hidden />
        {/* Print-table wrapper: the thead repeats on every printed page (the
            reliable way to get a running header), so the slim identifier bar
            shows from page 2. On page 1 the full header (pulled up over the
            repeated thead in print) covers it. Hidden on screen. */}
        <table className='cv-doc'>
          <thead>
            <tr>
              <td>
                <div className='cv-runhead' aria-hidden>
                  <span>
                    <strong>{data.name}</strong> · {data.title}
                  </span>
                  <span>{data.email}</span>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Header data={data} config={config} reduce={!!reduce} surface={surface} campaign={campaign} />

                <div
                  className='grid gap-0'
                  style={{
                    gridTemplateColumns: `${config.colSplit}fr ${1 - config.colSplit}fr`,
                    ['--cv-text' as string]: config.textScale,
                    ['--cv-line' as string]: config.lineScale
                  }}
                >
                  {/* ---- main column ---- */}
                  <main className='space-y-6 px-9 py-8 print:space-y-4 print:py-6'>
                    <Stagger className='space-y-8 print:space-y-8' stagger={0.07}>
                      <FadeItem>
                        <Heading path='labels.summary'>{data.labels.summary}</Heading>
                        <div className='space-y-2'>
                          {data.summary.map((p, i) => (
                            <Ed
                              key={i}
                              as='p'
                              path={`summary.${i}`}
                              className='text-[calc(12px*var(--cv-text))] leading-[calc(1.375*var(--cv-line))]'
                              style={{ color: INK }}
                            >
                              {p}
                            </Ed>
                          ))}
                        </div>
                      </FadeItem>

                      <FadeItem>
                        <Heading path='labels.experience'>{data.labels.experience}</Heading>
                        <div className='cv-rail space-y-5 print:space-y-4'>
                          {data.experience.map((job, ji) => (
                            <div key={`${job.company}-${ji}`} className='cv-exp relative'>
                              {/* Timeline node: a filled brand-blue dot riding the
                          dotted spine (.cv-rail::before), one per role — the
                          connective device borrowed from the original PDF. */}
                              <span className='cv-node' aria-hidden style={{ background: BLUE }} />
                              <Ed
                                as='h3'
                                path={`experience.${ji}.role`}
                                className='text-[calc(14px*var(--cv-text))] font-bold leading-tight'
                                style={{ color: INK }}
                              >
                                {job.role}
                              </Ed>
                              <div className='mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5'>
                                <Ed
                                  path={`experience.${ji}.company`}
                                  className='text-[calc(11.5px*var(--cv-text))] font-medium'
                                  style={{ color: '#566374' }}
                                >
                                  {job.company}
                                </Ed>
                                <span className='text-[calc(11px*var(--cv-text))]' style={{ color: '#9aa6b8' }}>
                                  |
                                </span>
                                <span className='text-[calc(10.5px*var(--cv-text))]' style={{ color: GRAY }}>
                                  <Ed path={`experience.${ji}.start`}>{job.start}</Ed>
                                  {' – '}
                                  <Ed path={`experience.${ji}.end`}>{job.end}</Ed>
                                </span>
                                {job.tag ? (
                                  <ProjectBadge tone={job.tagTone}>
                                    <Ed path={`experience.${ji}.tag`}>{job.tag}</Ed>
                                  </ProjectBadge>
                                ) : null}
                              </div>
                              {job.context ? (
                                <Ed
                                  as='p'
                                  path={`experience.${ji}.context`}
                                  className='mt-0.5 text-[calc(11px*var(--cv-text))] italic'
                                  style={{ color: GRAY }}
                                >
                                  {job.context}
                                </Ed>
                              ) : null}
                              <div className='mt-2.5 space-y-3 print:mt-2 print:space-y-2'>
                                {job.groups.map((grp, gi) => (
                                  <div key={gi}>
                                    {grp.heading ? (
                                      <Ed
                                        as='p'
                                        path={`experience.${ji}.groups.${gi}.heading`}
                                        className='mb-1.5 text-[calc(10px*var(--cv-text))] font-semibold uppercase tracking-widest'
                                        style={{ color: '#64748b' }}
                                      >
                                        {grp.heading}
                                      </Ed>
                                    ) : null}
                                    <ul className='space-y-2 print:space-y-1.5'>
                                      {grp.bullets.map((b, bi) => (
                                        <li
                                          key={bi}
                                          className='relative pl-3.5 text-[calc(12px*var(--cv-text))] leading-[calc(1.375*var(--cv-line))]'
                                          style={{ color: INK }}
                                        >
                                          <span
                                            className='absolute left-0 top-2 h-1.5 w-1.5 rounded-full'
                                            style={{ background: MARKER }}
                                          />
                                          <Ed path={`experience.${ji}.groups.${gi}.bullets.${bi}`}>{b}</Ed>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </FadeItem>
                    </Stagger>
                  </main>

                  {/* ---- sidebar column ---- */}
                  <aside
                    className={cn('cv-aside py-8 print:py-5', isCard ? 'px-4' : 'px-7')}
                    style={{ borderLeft: '1px solid #eef1f6', background: '#fbfcfe' }}
                  >
                    <Stagger
                      className={isCard ? 'space-y-5 print:space-y-5' : 'space-y-6 print:space-y-4'}
                      stagger={0.06}
                    >
                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.projects'>{data.labels.projects}</Heading>
                        <div className='space-y-3.5 print:space-y-2.5'>
                          {data.projects.map((p, pi) => (
                            <div key={p.name} className='cv-proj'>
                              <div className='flex items-start justify-between gap-2'>
                                {p.href ? (
                                  <a
                                    href={resolveCvHref(p.href, surface, campaign)}
                                    className='text-[calc(12px*var(--cv-text))] font-semibold leading-tight underline-offset-2 hover:underline'
                                    style={{ color: BLUE }}
                                  >
                                    <Ed path={`projects.${pi}.name`}>{p.name}</Ed>
                                  </a>
                                ) : (
                                  <Ed
                                    path={`projects.${pi}.name`}
                                    className='text-[calc(12px*var(--cv-text))] font-semibold leading-tight'
                                    style={{ color: INK }}
                                  >
                                    {p.name}
                                  </Ed>
                                )}
                                {p.tag ? (
                                  <ProjectBadge tone={p.tagTone}>
                                    <Ed path={`projects.${pi}.tag`}>{p.tag}</Ed>
                                  </ProjectBadge>
                                ) : null}
                              </div>
                              {p.role ? (
                                <Ed
                                  as='p'
                                  path={`projects.${pi}.role`}
                                  className='text-[calc(10.5px*var(--cv-text))] font-medium'
                                  style={{ color: GRAY }}
                                >
                                  {p.role}
                                </Ed>
                              ) : null}
                              <Ed
                                as='p'
                                path={`projects.${pi}.description`}
                                className='mt-0.5 text-[calc(11px*var(--cv-text))] leading-[calc(1.375*var(--cv-line))]'
                                style={{ color: INK }}
                              >
                                {p.description}
                              </Ed>
                              <ProjectTech tech={p.tech} style={config.techStyle} projectIndex={pi} />
                            </div>
                          ))}
                        </div>
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.skills'>{data.labels.skills}</Heading>
                        <div className='space-y-4 print:space-y-2'>
                          {data.skills.map((g, gi) => (
                            <div key={g.category}>
                              <Ed
                                as='p'
                                path={`skills.${gi}.category`}
                                className='mb-1 text-[calc(11px*var(--cv-text))] font-semibold'
                                style={{ color: INK }}
                              >
                                {g.category}
                              </Ed>
                              <div className='flex flex-wrap gap-1'>
                                {g.items.map((it, ii) => (
                                  <Pill key={it}>
                                    <Ed path={`skills.${gi}.items.${ii}`}>{it}</Ed>
                                  </Pill>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.recognition'>{data.labels.recognition}</Heading>
                        <EntryList entries={data.recognition} basePath='recognition' />
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.leadership'>{data.labels.leadership}</Heading>
                        <EntryList entries={data.leadership} basePath='leadership' />
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.training'>{data.labels.training}</Heading>
                        <EntryList entries={data.training} basePath='training' />
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.languages'>{data.labels.languages}</Heading>
                        <ul className='space-y-1 text-[calc(11.5px*var(--cv-text))]' style={{ color: GRAY }}>
                          {data.languages.map((l, li) => (
                            <li key={l.language}>
                              <Ed path={`languages.${li}.language`} className='font-semibold' style={{ color: INK }}>
                                {l.language}
                              </Ed>
                              {' — '}
                              <Ed path={`languages.${li}.level`}>{l.level}</Ed>
                            </li>
                          ))}
                        </ul>
                      </FadeItem>

                      <FadeItem className={cn('cv-side', cardCls)}>
                        <Heading path='labels.education'>{data.labels.education}</Heading>
                        <div className='space-y-2'>
                          {data.education.map((e, ei) => (
                            <div key={ei}>
                              <Ed
                                as='p'
                                path={`education.${ei}.title`}
                                className='text-[calc(12px*var(--cv-text))] font-semibold'
                                style={{ color: INK }}
                              >
                                {e.title}
                              </Ed>
                              <Ed
                                as='p'
                                path={`education.${ei}.detail`}
                                className='text-[calc(11px*var(--cv-text))]'
                                style={{ color: GRAY }}
                              >
                                {e.detail}
                              </Ed>
                            </div>
                          ))}
                        </div>
                      </FadeItem>
                    </Stagger>
                  </aside>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </EditContext.Provider>
  );
}

/* ============================ HEADER (5 directions) ============================ */

// Corner emblem: the candidate's actual emblem, lifted from the original CV
// (the layered "orbital lens" mark) and keyed to a transparent white PNG so it
// composites cleanly on the header band. `unoptimized` + `priority` keep it
// eagerly loaded so it's present when the page is rendered to PDF.
function Emblem({ type, className }: { type: EmblemType; className?: string }) {
  if (type !== 'rings') return null;

  return (
    <div className={cn('pointer-events-none', className)} aria-hidden>
      <Image src='/emblem.png' alt='' width={60} height={60} priority unoptimized className='block' />
    </div>
  );
}

// Right-side header columns (Portfolio links + contact), matching the
// candidate's original CV: a compact two-column block beside the name, which
// keeps the header band short (vs. stacking contact rows under the name) and
// frees vertical space on page 1.
function HeaderLinks({
  data,
  surface,
  campaign
}: {
  data: CVData;
  surface: 'web' | 'pdf';
  campaign?: string;
}) {
  const colLabel = 'mb-2 text-[calc(13px*var(--cv-text))] font-bold uppercase tracking-[0.16em]';
  const labelStyle = { color: 'rgba(255,255,255,0.82)' };
  const row = 'flex items-center gap-1.5 text-[calc(10.5px*var(--cv-text))] leading-[1.55] whitespace-nowrap';
  return (
    <div className='flex gap-6'>
      <div>
        <p className={colLabel} style={labelStyle}>
          Portfolio
        </p>
        <div className='space-y-0.5'>
          {data.links.map((l, li) => (
            <a
              key={l.href}
              href={resolveCvHref(l.href, surface, campaign)}
              className={cn(row, 'underline-offset-2 hover:underline')}
              style={{ color: '#fff' }}
            >
              {iconFor(l.label, 12)}
              <Ed path={`links.${li}.display`}>{l.display}</Ed>
            </a>
          ))}
        </div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.92)' }}>
        <p className={colLabel} style={labelStyle}>
          Get in contact
        </p>
        <div className='space-y-0.5'>
          <span className={row}>
            <Mail size={12} strokeWidth={2} />
            <Ed path='email'>{data.email}</Ed>
          </span>
          <span className={row}>
            <Phone size={12} strokeWidth={2} />
            <Ed path='phone'>{data.phone}</Ed>
          </span>
          <span className={row}>
            <MapPin size={12} strokeWidth={2} />
            <Ed path='location'>{data.location}</Ed>
          </span>
        </div>
      </div>
    </div>
  );
}

function Header({
  data,
  config,
  reduce,
  surface,
  campaign
}: {
  data: CVData;
  config: CVDocConfig;
  reduce: boolean;
  surface: 'web' | 'pdf';
  campaign?: string;
}) {
  const anim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduce ? 0 : 0.6, ease: [0.21, 0.5, 0.3, 1] as const }
  };

  // 1 — Full-bleed gradient band with an eyebrow + corner emblem (PDF-style).
  return (
    <motion.header
      className='relative overflow-hidden rounded-t-[18px] px-8 text-white flex flex-col'
      style={{
        background: HEADER_SOLID,
        paddingTop: `calc(24px * ${config.headerPad})`,
        paddingBottom: `calc(24px * ${config.headerPad})`,
        minHeight: `calc(27px * ${config.headerScale} * 2 + 104px)`
      }}
      {...anim}
    >
      {/* Emblem: absolute top-right, visually anchored to the eyebrow line. */}
      <div className='absolute right-8' style={{ top: `calc(15px * ${config.headerPad})` }}>
        <Emblem type={config.emblem} />
      </div>
      {/* Eyebrow */}
      <Ed
        as='p'
        path='title'
        className='whitespace-nowrap text-[calc(10.8px*var(--cv-text))] font-semibold uppercase tracking-[0.3em]'
        style={{ color: 'rgba(255,255,255,0.72)' }}
      >
        {data.title}
      </Ed>
      {/* Name: absolute, centered in the full header height. w-min keeps
            "Sherif Labib" together so it stacks as "Antwan" / "Sherif Labib". */}
      <Ed
        as='h1'
        path='name'
        className='absolute left-8 top-1/2 -translate-y-1/2 mt-3 w-min font-bold uppercase leading-[0.95] tracking-wider'
        style={{ fontSize: `calc(27px * ${config.headerScale})` }}
      >
        {data.name.replace(/ (?=\S+$)/, String.fromCharCode(0xa0))}
      </Ed>
      {/* Spacer pushes HeaderLinks to the bottom of the header band. */}
      <div className='flex-1' />
      {/* HeaderLinks: bottom-right, aligned to footer of header. */}
      <div className='self-end pr-2'>
        <HeaderLinks data={data} surface={surface} campaign={campaign} />
      </div>
    </motion.header>
  );
}

/* ============================ CONTACT + LINKS ============================ */

function Contact({
  data,
  tone,
  linkStyle,
  align = 'left'
}: {
  data: CVData;
  tone: 'light' | 'dark';
  linkStyle: LinkStyle;
  align?: 'left' | 'right';
}) {
  const txt = tone === 'light' ? 'rgba(255,255,255,0.92)' : '#475569';
  const strong = tone === 'light' ? '#fff' : INK;
  const dim = tone === 'light' ? 'rgba(255,255,255,0.6)' : GRAY;
  const linkColor = tone === 'light' ? '#fff' : BLUE;
  const pillBg = tone === 'light' ? 'rgba(255,255,255,0.16)' : '#eef2fb';
  const pillBorder = tone === 'light' ? 'rgba(255,255,255,0.22)' : 'rgba(59,91,255,0.18)';
  const pillText = tone === 'light' ? '#fff' : '#3a4a6b';
  const justify = align === 'right' ? 'justify-end' : '';

  return (
    <div className={cn('space-y-2', align === 'right' && 'text-right')}>
      <div
        className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-[calc(11.5px*var(--cv-text))]', justify)}
        style={{ color: txt }}
      >
        <span className='flex items-center gap-1.5'>
          <Mail size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path='email'>{data.email}</Ed>
        </span>
        <span className='flex items-center gap-1.5'>
          <Phone size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path='phone'>{data.phone}</Ed>
        </span>
        <span className='flex items-center gap-1.5'>
          <MapPin size={13} strokeWidth={2} style={{ opacity: 0.85 }} />
          <Ed path='location'>{data.location}</Ed>
        </span>
      </div>

      {linkStyle === 1 ? (
        <div
          className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-[calc(11.5px*var(--cv-text))]', justify)}
          style={{ color: txt }}
        >
          {data.links.map((l, li) => (
            <a
              key={l.href}
              href={l.href}
              className='flex items-center gap-1.5 underline-offset-2 hover:underline'
              style={{ color: linkColor }}
            >
              {iconFor(l.label)}
              <Ed path={`links.${li}.display`}>{l.display}</Ed>
            </a>
          ))}
        </div>
      ) : null}

      {linkStyle === 2 ? (
        <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-1 text-[calc(11.5px*var(--cv-text))]', justify)}>
          {data.links.map((l, li) => (
            <span key={l.href} className='flex items-baseline gap-1.5'>
              <span
                className='text-[calc(10px*var(--cv-text))] font-semibold uppercase tracking-widest'
                style={{ color: dim }}
              >
                {l.label}
              </span>
              <a href={l.href} className='underline-offset-2 hover:underline' style={{ color: strong }}>
                <Ed path={`links.${li}.display`}>{l.display}</Ed>
              </a>
            </span>
          ))}
        </div>
      ) : null}

      {linkStyle === 3 ? (
        <div className={cn('flex flex-wrap items-center gap-2', justify)}>
          {data.links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className='flex items-center gap-1.5 rounded-full px-3 py-1 text-[calc(11px*var(--cv-text))] font-medium'
              style={{
                background: pillBg,
                color: pillText,
                border: `1px solid ${pillBorder}`
              }}
            >
              {iconFor(l.label, 12)}
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ============================ SIDE-PROJECT TECH (3 styles) ============================ */

function ProjectTech({ tech, style, projectIndex }: { tech: string[]; style: TechStyle; projectIndex: number }) {
  // 1 — Plain dotted text (lightest; clears the clash with the skills pills).
  if (style === 1) {
    return (
      <p className='mt-1 text-[calc(10.5px*var(--cv-text))]' style={{ color: GRAY }}>
        {tech.map((t, k) => (
          <span key={k}>
            {k > 0 ? '  ·  ' : ''}
            <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
          </span>
        ))}
      </p>
    );
  }
  // 2 — Mono "stack:" line.
  if (style === 2) {
    return (
      <p
        className='mt-1 text-[calc(10px*var(--cv-text))]'
        style={{
          color: GRAY,
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace"
        }}
      >
        <span style={{ color: '#94a3b8' }}>stack: </span>
        {tech.map((t, k) => (
          <span key={k}>
            {k > 0 ? ', ' : ''}
            <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
          </span>
        ))}
      </p>
    );
  }
  // 3 — Tiny outline (ghost) chips — distinct from the filled skills pills.
  return (
    <div className='mt-1.5 flex flex-wrap gap-1'>
      {tech.map((t, k) => (
        <span
          key={k}
          className='rounded px-1.5 py-px text-[calc(10px*var(--cv-text))] font-medium'
          style={{ color: '#5a6b8c', border: '1px solid #dde3ef' }}
        >
          <Ed path={`projects.${projectIndex}.tech.${k}`}>{t}</Ed>
        </span>
      ))}
    </div>
  );
}

/* ============================ SHARED BITS ============================ */

function Heading({ path, children }: { path: string; children: ReactNode }) {
  return (
    <h2
      className='cv-h mb-3 print:mb-2.5 text-[calc(15px*var(--cv-text))] font-extrabold uppercase tracking-[0.04em]'
      style={{ color: '#0f172a' }}
    >
      <Ed path={path}>{children}</Ed>
    </h2>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className='inline-block rounded-full px-2 py-0.5 text-[calc(10px*var(--cv-text))] font-medium'
      style={{ background: '#eef2fb', color: '#3a4a6b' }}
    >
      {children}
    </span>
  );
}

function EntryList({ entries, basePath }: { entries: CVEntry[]; basePath: string }) {
  return (
    <ul
      className='space-y-1.5 print:space-y-1 text-[calc(11.5px*var(--cv-text))] leading-[calc(1.375*var(--cv-line))]'
      style={{ color: GRAY }}
    >
      {entries.map((e, i) => (
        <li key={e.title}>
          <Ed path={`${basePath}.${i}.title`} className='font-semibold' style={{ color: INK }}>
            {e.title}
          </Ed>
          {e.detail ? (
            <>
              {' — '}
              <Ed path={`${basePath}.${i}.detail`}>{e.detail}</Ed>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

// Small status badge shown beside a project title (e.g. "In development",
// "Acquired ’24").
function ProjectBadge({
  tone = 'neutral',
  children
}: {
  tone?: 'neutral' | 'success' | 'amber' | 'violet';
  children: ReactNode;
}) {
  const palette = {
    neutral: { bg: '#eef1f6', color: '#475569' },
    success: { bg: '#eaf1ec', color: '#3f6b50' },
    amber: { bg: '#f1ece1', color: '#7a6526' },
    violet: { bg: '#ede9fe', color: '#6d28d9' }
  }[tone];
  return (
    <span
      className='shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[calc(10px*var(--cv-text))] font-semibold'
      style={{ background: palette.bg, color: palette.color }}
    >
      {children}
    </span>
  );
}

