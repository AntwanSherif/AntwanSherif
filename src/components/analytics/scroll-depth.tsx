"use client";
import { useScrollDepth } from "./use-scroll-depth";

/** Mount-only component that activates story scroll-depth tracking. */
export function ScrollDepth({ contentId }: { contentId: string }) {
  useScrollDepth(contentId);
  return null;
}
