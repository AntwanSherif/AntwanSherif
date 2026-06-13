"use client";

import { useEffect, useRef } from "react";
import { newMilestones, track } from "@/lib/analytics";

/** Fire `scroll_depth` milestones (25/50/75/100) once each for a story, with elapsed ms since load (reading velocity). */
export function useScrollDepth(contentId: string) {
  const fired = useRef<Set<number>>(new Set());
  useEffect(() => {
    fired.current = new Set();
    const start = performance.now();
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable <= 0 ? 100 : Math.round((doc.scrollTop / scrollable) * 100);
      for (const depth of newMilestones(pct, fired.current)) {
        fired.current.add(depth);
        track({
          name: "scroll_depth",
          props: { content_type: "story", content_id: contentId, depth: depth as 25 | 50 | 75 | 100, value: Math.round(performance.now() - start) },
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [contentId]);
}
