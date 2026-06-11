"use client";

import { useEffect, useRef } from "react";
import { newMilestones, track } from "@/lib/analytics";

/** Fire `scroll-depth` milestones (25/50/75/100) once each for the given page key. */
export function useScrollDepth(page: string) {
  const fired = useRef<Set<number>>(new Set());
  useEffect(() => {
    fired.current = new Set();
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable <= 0 ? 100 : Math.round((doc.scrollTop / scrollable) * 100);
      for (const depth of newMilestones(pct, fired.current)) {
        fired.current.add(depth);
        track({ name: "scroll-depth", props: { page, depth: depth as 25 | 50 | 75 | 100 } });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // catch short pages already fully visible
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);
}
