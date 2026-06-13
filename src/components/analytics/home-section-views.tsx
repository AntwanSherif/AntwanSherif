"use client";
import { useSectionViews } from "./use-section-view";

/** Mount-only: tracks homepage section reach (drives the churn funnel). */
export function HomeSectionViews() {
  useSectionViews();
  return null;
}
