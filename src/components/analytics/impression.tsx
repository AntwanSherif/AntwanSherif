"use client";
import { useImpression } from "./use-impression";

/** Wrap a scoped element to emit a one-time `impression` when it enters view. */
export function Impression({ element, id, children, className }: {
  element: string; id?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useImpression(element, id);
  return <div ref={ref} className={className}>{children}</div>;
}
