"use client";

import { useEffect } from "react";
import { getOrCreateVisitorId, identifyVisitor } from "@/lib/analytics-identity";

/** Sticky for the page session: once any mount learns the company, later mounts re-send it.
 *  This makes the global (id-only, in layout) and story-page (id+company) mounts order-independent —
 *  whichever identify() call lands last still carries the company, regardless of Umami's merge semantics. */
let sessionCompany: string | undefined;

/** Mints/loads the localStorage visitor UUID and hands it to Umami's identify().
 *  Pass `company` on gated story pages to also tag the session (company comes from the server cookie). */
export function VisitorIdentity({ company }: { company?: string }) {
  useEffect(() => {
    try {
      if (company) sessionCompany = company;
      const id = getOrCreateVisitorId(window.localStorage);
      identifyVisitor({ id, data: sessionCompany ? { company: sessionCompany } : undefined });
    } catch {
      /* analytics must never break the page */
    }
  }, [company]);
  return null;
}
