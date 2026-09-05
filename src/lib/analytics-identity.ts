// Self-managed visitor identity: a localStorage UUID handed to Umami's identify()
// so a visitor is recognizable across the daily-salt hash rotation (cross-day cohorts).
// Mirrors track()'s discipline: prod-only, client-only, never throws.
// See docs/adr/2026-06-13-analytics-visitor-identity.md.

export const VISITOR_ID_KEY = "as_vid";

/** Bounds on waiting for the tracker script (`AnalyticsScripts`, `strategy="afterInteractive"`)
 *  to finish loading before giving up on an identify() call — see identifyVisitor. */
export const IDENTIFY_MAX_ATTEMPTS = 20;
export const IDENTIFY_RETRY_DELAY_MS = 250;

/** Read the persisted visitor UUID, minting + storing one on first visit. Pure (storage injected). */
export function getOrCreateVisitorId(storage: Pick<Storage, "getItem" | "setItem">): string {
  const existing = storage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(VISITOR_ID_KEY, id);
  return id;
}

/** Attach the visitor id (and optional session props) to Umami's session. No-op outside
 *  production / SSR / when blocked. `VisitorIdentity` calls this from a mount-time effect,
 *  which can run before the tracker script has finished loading — `window.umami` is then
 *  still undefined. Rather than silently dropping the call, retry on a short interval (up
 *  to IDENTIFY_MAX_ATTEMPTS) until `window.umami.identify` exists. */
export function identifyVisitor(input: { id: string; data?: Record<string, unknown> }, attempt = 0): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    const identify = window.umami?.identify;
    if (!identify) {
      if (attempt < IDENTIFY_MAX_ATTEMPTS) {
        setTimeout(() => identifyVisitor(input, attempt + 1), IDENTIFY_RETRY_DELAY_MS);
      }
      return;
    }
    if (input.data && Object.keys(input.data).length > 0) {
      identify(input.id, input.data);
    } else {
      identify(input.id);
    }
  } catch {
    /* analytics must never break the page */
  }
}
