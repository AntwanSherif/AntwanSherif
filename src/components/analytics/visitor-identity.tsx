"use client";

import { useEffect } from "react";
import { getOrCreateVisitorId, identifyVisitor } from "@/lib/analytics-identity";
import { ADMIN_STORAGE_KEY, resolveAdminParam } from "@/lib/analytics-admin";
import { CAMPAIGN_STORAGE_KEY, readCampaignFromLocation } from "@/lib/site-campaign";

/** Sticky for the page session: once any mount learns the company, later mounts re-send it.
 *  This makes the global (id-only, in layout) and story-page (id+company) mounts order-independent —
 *  whichever identify() call lands last still carries the company, regardless of Umami's merge semantics. */
let sessionCompany: string | undefined;

/** Reads a previously-persisted site-wide campaign, or captures ?co= from the current URL
 *  and persists it. First-touch wins: a stored value is never overwritten by a later URL
 *  in the same tab session. Storage access can throw (private browsing) — falls back to
 *  "no campaign known" rather than breaking the page. */
function resolveSiteCampaign(): string | undefined {
  try {
    const stored = window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (stored) return stored;
    const fromUrl = readCampaignFromLocation(window.location.search);
    if (fromUrl) window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, fromUrl);
    return fromUrl ?? undefined;
  } catch {
    return undefined;
  }
}

/** Mints/loads the localStorage visitor UUID and hands it to Umami's identify().
 *  Pass `company` on gated story pages to also tag the session (company comes from the
 *  server cookie) — this always wins over a site-wide campaign, and is also written to
 *  the same sessionStorage key so OutboundTracker's outbound events stay in sync with
 *  identify() rather than reading a stale site-wide value. Absent that, falls back
 *  to a site-wide ?co= campaign captured on any page (see site-campaign.ts). */
export function VisitorIdentity({ company, isAdmin }: { company?: string; isAdmin?: boolean }) {
  useEffect(() => {
    try {
      const adminParam = resolveAdminParam(window.location.search);
      if (adminParam === "1") {
        window.localStorage.setItem(ADMIN_STORAGE_KEY, "1");
        // Umami's own tracker script checks this key itself and suppresses everything it
        // sends on its own (auto pageviews, web-vitals) — distinct from our `as_admin` key,
        // which only our own track()/identifyVisitor() calls check.
        window.localStorage.setItem("umami.disabled", "1");
      } else if (adminParam === "0") {
        window.localStorage.removeItem(ADMIN_STORAGE_KEY);
        window.localStorage.removeItem("umami.disabled");
      }

      if (company) {
        sessionCompany = company;
        try {
          window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, company);
        } catch {
          /* private browsing — outbound events fall back to the stale/no campaign */
        }
      } else sessionCompany = sessionCompany ?? resolveSiteCampaign();
      const id = getOrCreateVisitorId(window.localStorage);
      // `isAdmin` here is the gated-story content-access allowlist flag (sets the
      // `is_admin` session prop) — unrelated to the `as_admin` self-exclusion flag written
      // above in this same effect. See analytics-admin.ts for that one.
      const data = sessionCompany
        ? { company: sessionCompany, ...(isAdmin && { is_admin: true }) }
        : undefined;
      identifyVisitor({ id, data });
    } catch {
      /* analytics must never break the page */
    }
  }, [company, isAdmin]);
  return null;
}
