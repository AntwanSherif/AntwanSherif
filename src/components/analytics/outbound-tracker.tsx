"use client";

import { useEffect } from "react";
import { buildOutboundEvent, track } from "@/lib/analytics";
import type { ContentType } from "@/lib/analytics-taxonomy";

/** Site-wide delegated click listener that emits a single `outbound` event per external-link click. */
export function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.closest("[data-analytics-skip-outbound]")) return; // named conversions opt out
      const props = buildOutboundEvent({
        href: anchor.getAttribute("href"),
        currentHost: window.location.host,
        contentType: (anchor.dataset.contentType as ContentType) ?? "nav",
        contentId: anchor.dataset.contentId,
        label: anchor.dataset.analyticsLabel ?? anchor.textContent?.trim() ?? undefined,
      });
      if (props) track({ name: "outbound", props });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
