"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import type { Story } from "@/data/stories";

interface StoryCardProps {
  story: Story;
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

        <div className="p-6 flex flex-col gap-4 flex-1">
          {/* Eyebrow */}
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            {story.company} · {story.role} · {story.period}
          </p>

          {/* Initiative name */}
          <h3 className="text-xl font-semibold text-foreground leading-tight">
            {story.initiative}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {story.tagline}
          </p>

          {/* Top 2 metrics */}
          <div className="grid grid-cols-2 gap-2">
            {story.metrics.slice(0, 2).map((m) => (
              <div
                key={m.label}
                className="rounded-lg px-3 py-2 text-center"
                style={{
                  background: "rgb(from var(--accent-ai) r g b / 0.1)",
                  border: "1px solid rgb(from var(--accent-ai) r g b / 0.25)",
                }}
              >
                <div
                  className="text-base font-bold"
                  style={{ color: "var(--accent-ai)" }}
                >
                  {m.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tech tags */}
          {story.techTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
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
