"use client";

import { useEffect, useRef } from "react";
import { trackStoryView } from "@/app/(stories)/stories/track-actions";

/** Fires the story-view Server Action exactly once per story on mount/navigation.
 *  Prefetch fetches the payload but never mounts this, so prefetch does not count as a view.
 *  Keyed by story so soft-navigating between stories tracks each one (the instance is reused). */
export function StoryViewBeacon({ story }: { story: string }) {
  const sent = useRef<string | false>(false);
  useEffect(() => {
    if (sent.current === story) return; // already sent this story (incl. strict-mode double-invoke)
    sent.current = story;
    void trackStoryView(story);
  }, [story]);
  return null;
}
