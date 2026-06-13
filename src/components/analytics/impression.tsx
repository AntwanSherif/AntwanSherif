"use client";
import type { ContentType } from "@/lib/analytics-taxonomy";
import { useImpression } from "./use-impression";

/** Wrap a scoped element to emit a one-time `impression` when it enters view. */
export function Impression({ contentType, contentId, children, className }: {
  contentType: ContentType; contentId?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useImpression(contentType, contentId);
  return <div ref={ref} className={className}>{children}</div>;
}
