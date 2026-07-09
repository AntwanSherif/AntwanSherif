// Pure, isomorphic campaign utilities for CV company attribution.
// Usable from edge routes and RSC — no node built-ins.
//
// Vocabulary: utm_campaign=<company-slug> is appended to own-property links only
// (antwansherif.com + encoreshot.com) when the URL already carries utm_source=cv.
// Third-party links (LinkedIn, GitHub, haktiv.com, …) are never tagged.

/** Lowercase; collapse runs of non-alphanumeric characters to a single hyphen;
 *  trim leading/trailing hyphens. Empty or all-punctuation input → `""`. */
export function slugifyCompany(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const OWN_HOSTS = new Set(['antwansherif.com', 'encoreshot.com'])

/** True iff the URL's hostname is exactly one of the own-property domains.
 *  Apex-only: subdomains and lookalike hosts are false. Returns false on unparseable input. */
export function isOwnPropertyUrl(url: string): boolean {
  try {
    return OWN_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

/** Append `utm_campaign=<slug>` to a URL **only when**:
 *  - the URL already contains `utm_source=cv`, AND
 *  - the URL does not already contain `utm_campaign`, AND
 *  - slug is non-empty.
 *  Otherwise returns the URL unchanged. Idempotent. */
export function withCampaign(url: string, slug: string): string {
  if (!slug || !url.includes('utm_source=cv') || url.includes('utm_campaign=')) return url
  return `${url}&utm_campaign=${slug}`
}
