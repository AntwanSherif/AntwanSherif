"use client";

import { useEffect } from "react";
import { buildOutboundEvent, track } from "@/lib/analytics";
import type { ContentType } from "@/lib/analytics-taxonomy";
import { CAMPAIGN_STORAGE_KEY, stampSiteCampaign } from "@/lib/site-campaign";

/** Reads the campaign persisted by VisitorIdentity, if any. Storage access can throw
 *  (private browsing, storage disabled) — falls back to "no campaign known". */
function readStoredCampaign(): string | undefined {
  try {
    return window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Site-wide delegated click listener that emits a single `outbound` event per external-link click,
 *  and stamps a persisted campaign onto own-property destinations before navigation. */
export function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.closest("[data-analytics-skip-outbound]")) return; // named conversions opt out
      const campaign = readStoredCampaign();
      if (campaign) {
        const stamped = stampSiteCampaign(anchor.href, campaign, window.location.host);
        if (stamped !== anchor.href) anchor.href = stamped;
      }
      const props = buildOutboundEvent({
        href: anchor.getAttribute("href"),
        currentHost: window.location.host,
        contentType: (anchor.dataset.contentType as ContentType) ?? "nav",
        contentId: anchor.dataset.contentId,
        label: anchor.dataset.analyticsLabel ?? anchor.textContent?.trim() ?? undefined,
      });
      if (props) track({ name: "outbound", props: campaign ? { ...props, company: campaign } : props });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
