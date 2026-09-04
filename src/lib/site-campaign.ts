// Site-wide company campaign capture, orthogonal to the CV's own ?co= handling in
// cv-campaign.ts (unmodified). Reuses its slug + ownership primitives.
//
// Design: docs/superpowers/specs/2026-09-04-site-wide-company-attribution-design.md

import { slugifyCompany, isOwnPropertyUrl } from './cv-campaign'

export const CAMPAIGN_STORAGE_KEY = 'as_campaign'

/** Parse `?co=` out of a query string and slugify it. Returns null when absent, empty,
 *  or all-punctuation. Pure. */
export function readCampaignFromLocation(search: string): string | null {
  const raw = new URLSearchParams(search).get('co')
  if (!raw) return null
  const slug = slugifyCompany(raw)
  return slug || null
}

/** Stamp `utm_source=portfolio` (only when no utm_source is already present) and
 *  `utm_campaign=<slug>` onto an own-property URL. No-ops for third-party URLs, an
 *  empty slug, a URL that already carries utm_campaign, or an unparseable URL. Pure. */
export function stampSiteCampaign(url: string, slug: string): string {
  if (!slug || !isOwnPropertyUrl(url)) return url
  const parsed = new URL(url)
  if (parsed.searchParams.has('utm_campaign')) return url
  if (!parsed.searchParams.has('utm_source')) parsed.searchParams.set('utm_source', 'portfolio')
  parsed.searchParams.set('utm_campaign', slug)
  return parsed.toString()
}
