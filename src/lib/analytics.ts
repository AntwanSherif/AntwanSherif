// Client-side analytics: a typed, safe wrapper over Umami's window.umami.track,
// plus pure helpers used by the DOM glue (so the glue stays untested-thin).

import { TAXONOMY_VERSION, type ContentType, type OutboundCategory, type HomeSection } from "./analytics-taxonomy";

export type OutboundProps = {
  content_type: ContentType; content_id?: string; category: OutboundCategory;
  host: string; href: string; label?: string;
};

export type AnalyticsEvent =
  | { name: "outbound"; props: OutboundProps }
  | { name: "contact_click"; props: { content_type: "contact"; channel: "email" | "linkedin"; category: "professional" } }
  | { name: "cv_download"; props: { content_type: "cv"; category: "professional" } } // real PDF download (true signal)
  | { name: "cv_print"; props: { content_type: "cv"; category: "professional" } } // browser print initiated (intent, not confirmed export)
  | { name: "cv_view"; props: { content_type: "nav"; category: "professional"; source: "navbar" } }
  | { name: "section_view"; props: { content_type: "home"; content_id: HomeSection; position?: number } }
  | { name: "scroll_depth"; props: { content_type: "story"; content_id: string; depth: 25 | 50 | 75 | 100; value: number } }
  | { name: "impression"; props: { content_type: ContentType; content_id?: string; position?: number } }
  | { name: "project_expand"; props: { content_type: "project"; content_id: string } } // reserved: wire on expand UI
  | { name: "talk_photos"; props: { content_type: "talk"; content_id: string; action: "open" | "advance" } }; // reserved

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
      identify?: (id: string, data?: Record<string, unknown>) => void;
    };
  }
}

/** Fire a typed event. Centrally stamps the taxonomy version `v`. No-op outside production / SSR / when blocked. Never throws. */
export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event.name, { v: TAXONOMY_VERSION, ...event.props });
  } catch {
    /* analytics must never break the page */
  }
}

export const MILESTONES = [25, 50, 75, 100] as const;

/** Scroll-depth milestones newly crossed at `scrollPct` that haven't fired yet. */
export function newMilestones(scrollPct: number, fired: Set<number>): number[] {
  return MILESTONES.filter((m) => scrollPct >= m && !fired.has(m));
}

/** Build an `outbound` event from a link's href + content context. Returns null for internal/invalid links. Pure. */
export function buildOutboundEvent(input: {
  href: string | null;
  currentHost: string;
  contentType: ContentType;
  contentId?: string;
  label?: string;
}): OutboundProps | null {
  const { href, currentHost, contentType, contentId, label } = input;
  if (!href) return null;
  if (href.startsWith("mailto:"))
    return { content_type: contentType, content_id: contentId, category: "professional", host: "mailto", href, label };
  let url: URL;
  try { url = new URL(href, `https://${currentHost}`); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.host === currentHost) return null;
  return { content_type: contentType, content_id: contentId, category: categorizeOutbound(url.host), host: url.host, href: url.href, label };
}

/** Classify an outbound destination host into a coarse category. Pure. */
export function categorizeOutbound(host: string): OutboundCategory {
  const h = host.toLowerCase();
  if (h === "mailto") return "professional";
  if (/(^|\.)(github\.com|gitlab\.com|npmjs\.com|codesandbox\.io|stackblitz\.com|codepen\.io)$/.test(h)) return "code";
  if (/(^|\.)linkedin\.com$/.test(h)) return "professional";
  if (/(^|\.)(x\.com|twitter\.com|instagram\.com|facebook\.com|youtube\.com|threads\.net|bsky\.app)$/.test(h)) return "social";
  if (/(^|\.)(dev\.to|medium\.com|substack\.com|hashnode\.dev|hackernoon\.com)$/.test(h)) return "content";
  return "other";
}
