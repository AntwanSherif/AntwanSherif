import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { FlowChain } from "@/components/flow-chain";
import { StoryThumbnail } from "@/components/story-thumbnails";
import { storyCards } from "@/data/story-cards";
import { storyDetails } from "@/data/story-details";
import { ScrollDepth } from "@/components/analytics/scroll-depth";
import { StoryViewBeacon } from "@/components/analytics/story-view-beacon";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const THUMB_SLUGS = ["prism", "range-promotions", "mdq", "core-observability", "core-analytics"];

const BLUR_FADE_DELAY = 0.04;

export function generateStaticParams() {
  return storyCards.map((s) => ({ slug: s.slug }));
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = storyCards.find((s) => s.slug === slug);
  if (!card) notFound();
  // Merge public card + private detail so the rest of the page reads one `story` object.
  // The detail content is imported only here (a gated route), never on the public list.
  const story = { ...card, ...storyDetails[card.slug] };

  return (
    <main className="flex flex-col min-h-[100dvh] gap-16 py-12 px-4 max-w-2xl mx-auto">
      <ScrollDepth page={`story:${slug}`} />
      <StoryViewBeacon story={slug} />
      {/* ── Section 1: Hero ─────────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <Link
            href="/stories"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Stories
          </Link>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {story.company} · {story.role} · {story.period}
          </p>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {story.initiative}
          </h1>
        </BlurFade>

        {THUMB_SLUGS.includes(story.slug) && (
          <BlurFade delay={BLUR_FADE_DELAY * 3.5}>
            <div className="w-full aspect-[2/1] rounded-xl overflow-hidden">
              <StoryThumbnail slug={story.slug} />
            </div>
          </BlurFade>
        )}

        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <p className="text-base text-muted-foreground leading-relaxed max-w-prose">
            {story.tagline}
          </p>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {story.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  background: "color-mix(in srgb, var(--accent-ai) 10%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent-ai) 25%, transparent)",
                }}
              >
                <div className="text-lg font-bold" style={{ color: "var(--accent-ai)" }}>
                  {m.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ── Section 2: Problem & Architecture ───────────────────── */}
      {(story.problem || story.architectureFlow) && (
        <section className="flex flex-col gap-8">
          {story.problem && (
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                The Problem
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-prose">
                {story.problem}
              </p>
            </BlurFade>
          )}

          {story.architectureFlow && (
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Architecture
              </h2>
              <div className="mt-4">
                <FlowChain steps={story.architectureFlow} />
              </div>
            </BlurFade>
          )}
        </section>
      )}

      {/* ── Section 3: UI/UX ────────────────────────────────────── */}
      {story.uiSections && story.uiSections.length > 0 && (
        <section className="flex flex-col gap-6">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">UI / UX</h2>
          </BlurFade>
          {story.uiSections.map((section, si) => (
            <BlurFade key={section.title} delay={BLUR_FADE_DELAY * (9 + si)}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
                {section.title}
              </p>
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${Math.min(section.placeholderCount, 3)}, 1fr)` }}
              >
                {Array.from({ length: section.placeholderCount }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-xl bg-muted border border-border flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground/40">screenshot</span>
                  </div>
                ))}
              </div>
            </BlurFade>
          ))}
        </section>
      )}

      {/* ── Section 5: Features ─────────────────────────────────── */}
      {story.features && story.features.length > 0 && (
        <section className="flex flex-col gap-6">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              What We Built
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {story.features.map((feature, i) => (
              <BlurFade key={feature.name} delay={BLUR_FADE_DELAY * (9 + i)}>
                <div className="rounded-xl border border-border bg-card p-4 h-full">
                  <h3 className="text-sm font-semibold text-foreground">{feature.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>

          {story.bulkUploadFlow && (
            <BlurFade delay={BLUR_FADE_DELAY * 20}>
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Bulk Upload — Pipeline
                </h3>
                <FlowChain steps={story.bulkUploadFlow} />
              </div>
            </BlurFade>
          )}
        </section>
      )}

      {/* ── Section 6: Challenges & STAR ────────────────────────── */}
      {(story.challenges || story.star) && (
        <section className="flex flex-col gap-8">
          {story.challenges && (
            <BlurFade delay={BLUR_FADE_DELAY * 21}>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Challenges
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {story.challenges.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1 shrink-0 text-muted-foreground/40">—</span>
                    {c}
                  </li>
                ))}
              </ul>
            </BlurFade>
          )}

          {story.star && (
            <BlurFade delay={BLUR_FADE_DELAY * 22}>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                A Story
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {(
                  [
                    { label: "Situation", value: story.star.situation },
                    { label: "Task", value: story.star.task },
                    { label: "Action", value: story.star.action },
                    { label: "Result", value: story.star.result },
                  ] as const
                ).map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div
                      className="shrink-0 w-20 text-xs font-semibold uppercase tracking-wider pt-0.5"
                      style={{ color: "var(--accent-ai)" }}
                    >
                      {item.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </BlurFade>
          )}
        </section>
      )}
    </main>
  );
}
