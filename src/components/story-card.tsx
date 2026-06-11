"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useRef } from "react";
import type { StoryCardData } from "@/data/story-types";
import { StoryThumbnail } from "@/components/story-thumbnails";
import { useImpression } from "@/components/analytics/use-impression";

interface StoryCardProps {
  story: StoryCardData;
  className?: string;
}

export function StoryCard({ story, className }: StoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const impressionCb = useImpression("story", story.slug);

  const setCardRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      cardRef.current = node;
      impressionCb(node);
    },
    [impressionCb],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - left}px`);
    el.style.setProperty("--my", `${e.clientY - top}px`);
  };

  const hasThumb = ["prism", "range-promotions", "mdq", "core-observability", "core-analytics"].includes(story.slug);

  return (
    <Link
      ref={setCardRef}
      href={`/stories/${story.slug}`}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative row-span-5 grid grid-rows-subgrid border border-border rounded-xl overflow-hidden cursor-pointer select-none bg-card shadow-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {/* Spotlight overlays */}
      <div className="spotlight-fill pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />
      <div className="spotlight-border pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />

      {/* Company logo — overlays top-right of the thumbnail */}
      <div className="absolute top-3 right-3 z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/logos/${story.company.toLowerCase().replace(/\s+/g, "-")}.png`}
          alt={story.company}
          className="w-8 h-8 rounded-lg border border-border bg-card object-contain p-1 shadow-sm"
        />
      </div>

      {/* Row 1 — thumbnail */}
      <div className="w-full aspect-2/1 overflow-hidden">
        {hasThumb ? (
          <StoryThumbnail slug={story.slug} />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* Row 2 — header */}
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground leading-tight">
            {story.company}
          </p>
          <h3 className="text-2xl font-extrabold leading-tight text-foreground">{story.initiative}</h3>
          <p className="text-xs font-medium leading-snug text-accent-2">{story.subtitle}</p>
        </div>
      </div>

      {/* Row 3 — tagline */}
      <div className="px-6 pt-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{story.tagline}</p>
      </div>

      {/* Row 4 — metric chips */}
      <div className="px-6 pt-4">
        {story.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {story.metrics.slice(0, 2).map((m) => (
              <div key={m.label} className="border border-border rounded-lg px-3 py-1.5 text-center">
                <div className="text-sm font-bold tabular-nums leading-tight text-[#7c3aed] dark:text-[#a78bfa]">
                  {m.value}
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 5 — tech tags (bottom-aligned so the last row lands on a shared baseline) */}
      <div className="px-6 pt-3 pb-6 flex flex-col justify-end">
        {story.techTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {story.techTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium border border-border rounded-md px-2 h-6 inline-flex items-center text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
