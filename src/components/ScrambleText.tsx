"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** How many frames each character cycles before settling */
  scrambleFrames?: number;
  /** Delay (ms) between each character starting to settle */
  staggerMs?: number;
}

export default function ScrambleText({
  text,
  className,
  scrambleFrames = 10,
  staggerMs = 40,
}: ScrambleTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const scramble = useCallback(() => {
    if (!spanRef.current) return;
    cancelAnimationFrame(rafRef.current);

    const chars = text.split("");
    // Track how many frames each character has been randomized
    const frameCount = chars.map((_, i) => -(i * Math.round(staggerMs / 16)));

    const render = () => {
      if (!spanRef.current) return;
      let done = true;
      const output = chars.map((char, i) => {
        if (char === " ") return " ";
        if (frameCount[i] >= scrambleFrames) return char;
        done = false;
        frameCount[i]++;
        if (frameCount[i] < 0) return char; // stagger delay: show original while waiting
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
      });
      spanRef.current.textContent = output.join("");
      if (!done) rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
  }, [text, scrambleFrames, staggerMs]);

  // Trigger on mount
  useEffect(() => {
    scramble();
    return () => cancelAnimationFrame(rafRef.current);
  }, [scramble]);

  return (
    <span
      ref={spanRef}
      className={cn("scramble-text", className)}
      onMouseEnter={scramble}
      aria-label={text}
    >
      {text}
    </span>
  );
}
