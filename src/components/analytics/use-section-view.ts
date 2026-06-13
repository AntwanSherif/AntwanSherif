"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { HOME_SECTIONS, type HomeSection } from "@/lib/analytics-taxonomy";

/** Pure: build a `section_view` event for a section id, or null if the id isn't a known homepage section. */
export function sectionViewEvent(id: string, position: number): AnalyticsEvent | null {
  if (!(HOME_SECTIONS as string[]).includes(id)) return null;
  return { name: "section_view", props: { content_type: "home", content_id: id as HomeSection, position } };
}

/** Observe each `section[id]` once; fire `section_view` when it first crosses into view. */
export function useSectionViews() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const fired = new Set<string>();
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !fired.has(id)) {
            fired.add(id);
            const event = sectionViewEvent(id, HOME_SECTIONS.indexOf(id as HomeSection));
            if (event) track(event);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const s of sections) obs.observe(s);
    return () => obs.disconnect();
  }, []);
}
