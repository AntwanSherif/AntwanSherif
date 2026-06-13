// Self-managed visitor identity: a localStorage UUID handed to Umami's identify()
// so a visitor is recognizable across the daily-salt hash rotation (cross-day cohorts).
// Mirrors track()'s discipline: prod-only, client-only, never throws.
// See docs/adr/2026-06-13-analytics-visitor-identity.md.

export const VISITOR_ID_KEY = "as_vid";

/** Read the persisted visitor UUID, minting + storing one on first visit. Pure (storage injected). */
export function getOrCreateVisitorId(storage: Pick<Storage, "getItem" | "setItem">): string {
  const existing = storage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(VISITOR_ID_KEY, id);
  return id;
}

/** Attach the visitor id (and optional session props) to Umami's session. No-op outside production / SSR / when blocked. */
export function identifyVisitor(input: { id: string; data?: Record<string, unknown> }): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    if (input.data && Object.keys(input.data).length > 0) {
      window.umami?.identify?.(input.id, input.data);
    } else {
      window.umami?.identify?.(input.id);
    }
  } catch {
    /* analytics must never break the page */
  }
}
