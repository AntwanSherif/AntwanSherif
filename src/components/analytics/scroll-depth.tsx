"use client";
import { useScrollDepth } from "./use-scroll-depth";

/** Mount-only component that activates scroll-depth tracking for a page. */
export function ScrollDepth({ page }: { page: string }) {
  useScrollDepth(page);
  return null;
}
