"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

type Dir = "left" | "right" | "up" | "down";
const DIRS: Dir[] = ["left", "right", "up", "down"];

const OUT: Record<Dir, string> = {
  left: "translateX(-100%)",
  right: "translateX(100%)",
  up: "translateY(-100%)",
  down: "translateY(100%)",
};
const IN_START: Record<Dir, string> = {
  left: "translateX(100%)",
  right: "translateX(-100%)",
  up: "translateY(100%)",
  down: "translateY(-100%)",
};

const STRIPE_STYLE: React.CSSProperties = {
  background:
    "repeating-linear-gradient(-45deg, transparent 0px, var(--foreground) 2px, transparent 2px, transparent 9px)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1.5px var(--foreground)",
  font: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
};

interface ScrambleTextProps {
  text: string;
  className?: string;
  randomInterval?: number;
}

export default function ScrambleText({
  text,
  className,
  randomInterval = 1000,
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerLetter = useCallback((el: HTMLElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.dataset.animating === "true") return;
    el.dataset.animating = "true";

    const dir = el.dataset.dir as Dir;
    const front = el.querySelector<HTMLElement>(".sl-f");
    const back = el.querySelector<HTMLElement>(".sl-b");
    if (!front || !back) return;

    back.style.transition = "none";
    back.style.transform = IN_START[dir];

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ease = "150ms cubic-bezier(0.4,0,0.2,1)";
        front.style.transition = `transform ${ease}`;
        back.style.transition = `transform ${ease}`;
        front.style.transform = OUT[dir];
        back.style.transform = "translate(0%,0%)";

        setTimeout(() => {
          front.style.transition = `transform ${ease}`;
          back.style.transition = `transform ${ease}`;
          front.style.transform = "translate(0%,0%)";
          back.style.transform = IN_START[dir];

          setTimeout(() => {
            el.dataset.animating = "false";
          }, 150);
        }, 400);
      });
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-letter]"));

    const schedule = () => {
      const idle = letters.filter((el) => el.dataset.animating !== "true");
      if (idle.length > 0) triggerLetter(idle[Math.floor(Math.random() * idle.length)]);
      timerRef.current = setTimeout(schedule, randomInterval);
    };
    timerRef.current = setTimeout(schedule, 800);

    const handlers = letters.map((el) => {
      const fn = () => triggerLetter(el);
      el.addEventListener("mouseenter", fn);
      return { el, fn };
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      handlers.forEach(({ el, fn }) => el.removeEventListener("mouseenter", fn));
    };
  }, [text, randomInterval, triggerLetter]);

  const renderLetter = (char: string, idx: number) => {
    const dir = DIRS[idx % DIRS.length];
    return (
      <span
        key={`${char}-${idx}`}
        data-letter
        data-dir={dir}
        data-animating="false"
        style={{ position: "relative", display: "inline-block", overflow: "hidden" }}
      >
        <span className="sl-f" style={{ display: "block", transform: "translate(0%,0%)" }}>
          {char}
        </span>
        <span
          className="sl-b"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: IN_START[dir],
            ...STRIPE_STYLE,
          }}
        >
          {char}
        </span>
      </span>
    );
  };

  const words = text.split(" ");

  return (
    // flex-wrap so a long name wraps BETWEEN words instead of overflowing the
    // viewport on mobile; each word is its own nowrap unit so letters never split.
    <span
      ref={containerRef}
      className={cn(className)}
      role="img"
      aria-label={text}
      style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: "0.3em" }}
    >
      {words.map((word, w) => {
        const offset = words.slice(0, w).reduce((n, ww) => n + ww.length, 0);
        return (
          <span
            key={`w-${w}`}
            aria-hidden="true"
            style={{ display: "inline-flex", alignItems: "baseline", whiteSpace: "nowrap" }}
          >
            {word.split("").map((char, ci) => renderLetter(char, offset + ci))}
          </span>
        );
      })}
    </span>
  );
}
