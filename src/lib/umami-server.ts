// Server-side event sender for the "story channel". Ad-block- and prefetch-immune
// because it runs server→server. Never throws into a render.

import "server-only";

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
      body: JSON.stringify(buildUmamiPayload({ websiteId, hostname: input.hostname, name: input.name, data: input.data })),
      cache: "no-store",
    });
  } catch {
    /* analytics must never break a render */
  }
}
