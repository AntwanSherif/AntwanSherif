"use client";

/**
 * <Term id="working-memory">working memory</Term>
 *
 * Renders children with a dashed underline and reveals the glossary definition
 * on hover/focus (desktop) or click/tap (mobile).
 *
 * Decision: self-contained component rather than Radix Popover (not installed).
 * Hover opens the panel on desktop; click/tap pins it open on all devices.
 * Keyboard: Tab to focus → opens, Escape to close.
 * Respects prefers-reduced-motion via Tailwind's motion-safe: variant.
 */

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { glossary } from "@/data/glossary";

interface TermProps {
  /** Glossary entry id from src/data/glossary.ts */
  id: string;
  /** Visible text rendered in the post */
  children: ReactNode;
}

export function Term({ id, children }: TermProps) {
  const entry = glossary[id];

  // `hoverOpen` — controlled by onMouseEnter / onMouseLeave on the container
  // `pinned`    — controlled by click; stays open until Escape or click outside
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const isOpen = hoverOpen || pinned;

  const containerRef = useRef<HTMLSpanElement>(null);

  const close = useCallback(() => {
    setHoverOpen(false);
    setPinned(false);
  }, []);

  // Escape key + click-outside collapse the pinned state
  useEffect(() => {
    if (!pinned) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPinned(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pinned, close]);

  // Unknown term — render bare children without any decoration
  if (!entry) {
    return <>{children}</>;
  }

  const firstSource = entry.sources[0];

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        onFocus={() => setHoverOpen(true)}
        onBlur={(e) => {
          // Only close hover-open when focus leaves the whole container
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setHoverOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          // Reset button defaults
          "cursor-help bg-transparent p-0 m-0 border-0",
          // Dashed underline — subtle, respects current text color
          "border-b border-dashed border-current/50",
          // Keyboard focus ring
          "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          // Inherit prose styles
          "font-[inherit] text-[inherit] leading-[inherit]",
        )}
      >
        {children}
      </button>

      {/* Popover panel */}
      {isOpen && (
        <span
          role="dialog"
          aria-label={`Definition: ${entry.term}`}
          className={cn(
            // Positioning — above the term, left-aligned
            "absolute z-50 bottom-full left-0 mb-2",
            // Size + shape
            "w-72 max-w-[90vw] rounded-lg",
            // Surface
            "border border-border bg-popover text-popover-foreground shadow-lg",
            // Spacing
            "p-3 text-sm",
            // Entrance animation — suppressed when prefers-reduced-motion: reduce
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150",
          )}
        >
          {/* Term name — block spans, not <p>: a <Term> lives inside a
              markdown <p>, so nested <p> would be invalid (validateDOMNesting) */}
          <span className="block font-semibold text-foreground mb-1 capitalize">
            {entry.term}
          </span>

          {/* Short definition */}
          <span className="block text-muted-foreground leading-snug">
            {entry.shortDef}
          </span>

          {/* Practitioner-framework caveat */}
          {entry.evidence === "practitioner-framework" && (
            <span className="mt-1.5 block text-xs text-muted-foreground/60 italic">
              Practitioner framework — not peer-reviewed.
            </span>
          )}

          {/* First source link */}
          {firstSource && (
            <a
              href={firstSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-muted-foreground/60 hover:text-foreground transition-colors underline underline-offset-2 truncate max-w-full"
            >
              {firstSource.label}
            </a>
          )}
        </span>
      )}
    </span>
  );
}
