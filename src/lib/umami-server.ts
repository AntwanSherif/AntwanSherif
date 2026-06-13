// Server-side event sender for the "story channel". Ad-block- and prefetch-immune
// because it runs server→server. Never throws into a render.

import "server-only";
import { TAXONOMY_VERSION } from "./analytics-taxonomy";

export type UmamiPayload = {
  type: "event";
  payload: { website: string; hostname: string; name: string; data?: Record<string, unknown>; url: string };
};

/** Pure: build Umami's collect-endpoint body. */
export function buildUmamiPayload(input: {
  websiteId: string;
  hostname: string;
  name: string;
  data?: Record<string, unknown>;
}): UmamiPayload {
  return {
    type: "event",
    payload: {
      website: input.websiteId,
      hostname: input.hostname,
      name: input.name,
      data: input.data,
      url: "/",
    },
  };
}

/** Matches the Company-<10 base62> password shape — used only to flag whether a *failed*
 *  guess even looked like a real password. Never used to derive a company. */
const COMPANY_HASH_SHAPE = /^.+-[0-9A-Za-z]{10}$/;

/** Build the `gate_fail` event data for a rejected unlock attempt.
 *  Captures the raw (truncated) guess — NOT a derived company — plus whether it matched the password shape.
 *  Only ever called on attempts that already FAILED validation, so it can't carry a working password. */
export function buildGateFailData(attempt: string, contentId: string): {
  content_type: "story"; content_id: string; attempt: string; format_valid: boolean;
} {
  return {
    content_type: "story",
    content_id: contentId,
    attempt: attempt.slice(0, 64),
    format_valid: COMPANY_HASH_SHAPE.test(attempt),
  };
}

/** Extract a story slug from a path like `/stories/<slug>`; falls back to `stories`. Pure. */
export function storySlugFromPath(path: string): string {
  const m = path.match(/^\/stories\/([^/?#]+)/);
  return m ? m[1] : "stories";
}

/** Fire a server-side event. No-op outside production or when config is missing. Swallows all errors. */
export async function sendServerEvent(input: { hostname: string; name: string; data?: Record<string, unknown> }): Promise<void> {
  if (process.env.NODE_ENV !== "production") return;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;
  const endpoint = process.env.UMAMI_COLLECT_ENDPOINT;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!host || !endpoint || !websiteId) return;
  try {
    await fetch(`${host}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Umami requires a User-Agent; server requests have none by default.
        "User-Agent": "portfolio-server/1.0",
      },
      body: JSON.stringify(buildUmamiPayload({ websiteId, hostname: input.hostname, name: input.name, data: { ...(input.data ?? {}), v: TAXONOMY_VERSION } })), // v is authoritative — stamped last so caller data can't override it
      cache: "no-store",
    });
  } catch {
    /* analytics must never break a render */
  }
}
