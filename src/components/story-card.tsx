"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import type { StoryCardData } from "@/data/story-types";
import { StoryThumbnail } from "@/components/story-thumbnails";

interface StoryCardProps {
  story: StoryCardData;
  className?: string;
}

export function StoryCard({ story, className }: StoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - left}px`);
    el.style.setProperty("--my", `${e.clientY - top}px`);
  };

  const hasThumb = ["prism", "range-promotions", "mdq", "core-observability", "core-analytics"].includes(story.slug);

  return (
    <Link href={`/stories/${story.slug}`} className="block h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative flex flex-col h-full border border-border rounded-xl overflow-hidden cursor-pointer bg-card",
          className
        )}
      >
        {/* Spotlight overlays */}
        <div className="spotlight-fill pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />
        <div className="spotlight-border pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 will-change-[opacity] group-hover:opacity-100" />

        {/* Company logo — always overlays top-right */}
        <div className="absolute top-3 right-3 z-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/${story.company.toLowerCase().replace(/\s+/g, "-")}.png`}
            alt={story.company}
            className="w-8 h-8 rounded-lg border border-border bg-card object-contain p-1 shadow-sm"
          />
        </div>

        {/* Thumbnail — always rendered for consistent card height */}
        <div className="w-full aspect-[2/1] overflow-hidden shrink-0">
          {hasThumb ? (
            <StoryThumbnail slug={story.slug} />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {/* Header */}
        <div className="px-5 pb-3 pt-4 pr-14 flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 leading-tight">
            {story.company}
          </p>
          <h3 className="text-2xl font-extrabold leading-tight text-foreground">
            {story.initiative}
          </h3>
        </div>

        {/* Body — tagline flex-1 pushes metrics + tags to bottom */}
        <div className="px-5 pb-5 flex flex-col gap-3 flex-1">
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {story.tagline}
          </p>
          {/* Metric chips — always 2-col grid so height is consistent across cards */}
          {story.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {story.metrics.slice(0, 2).map((m) => (
                <div
                  key={m.label}
                  className="border border-border rounded-lg px-3 py-1.5 text-center"
                >
                  <div
                    className="text-sm font-bold tabular-nums leading-tight"
                    style={{ color: "var(--accent-ai)" }}
                  >
                    {m.value}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          )}
          {/* Tech tags */}
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
      </div>
    </Link>
  );
}
