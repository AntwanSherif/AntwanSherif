// Client-side analytics: a typed, safe wrapper over Umami's window.umami.track,
// plus pure helpers used by the DOM glue (so the glue stays untested-thin).

export type OutboundProps = { href: string; host: string; label?: string; context?: string };

export type AnalyticsEvent =
  | { name: "outbound"; props: OutboundProps }
  | { name: "cv-download"; props?: undefined } // reserved: fire when a CV/résumé download CTA is added
  | { name: "contact-click"; props: { channel: "email" | "linkedin" } }
  | { name: "scroll-depth"; props: { page: string; depth: 25 | 50 | 75 | 100 } }
  | { name: "impression"; props: { element: string; id?: string } }
  | { name: "project-expand"; props: { project: string } }
  | { name: "talk-photos"; props: { talk: string; action: "open" | "advance" } };

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

/** Fire a typed event. No-op outside production, during SSR, or when the tracker is blocked/absent. Never throws. */
export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    // cv-download has no props; the cast is safe because every other variant's props is a plain object.
    window.umami?.track(event.name, (event as { props?: Record<string, unknown> }).props);
  } catch {
    /* analytics must never break the page */
  }
}

export const MILESTONES = [25, 50, 75, 100] as const;

/** Scroll-depth milestones newly crossed at `scrollPct` that haven't fired yet. */
export function newMilestones(scrollPct: number, fired: Set<number>): number[] {
  return MILESTONES.filter((m) => scrollPct >= m && !fired.has(m));
}

/** Build an `outbound` event from a link's href + context. Returns null for internal/invalid links. Pure. */
export function buildOutboundEvent(input: {
  href: string | null;
  currentHost: string;
  label?: string;
  context?: string;
}): OutboundProps | null {
  const { href, currentHost, label, context } = input;
  if (!href) return null;
  if (href.startsWith("mailto:")) return { href, host: "mailto", label, context };
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}`);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.host === currentHost) return null;
  return { href: url.href, host: url.host, label, context };
}
