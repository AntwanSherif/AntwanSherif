// Canonical EncoreShot links published from the portfolio, UTM-tagged so encoreshot.com's
// analytics can attribute where a visitor/signup came from. Build links through here rather
// than hand-writing UTM query strings in the data/components.
//
// Full link registry + vocabulary: the encoreshot repo, apps/landing/docs/utm-links.md.

import { isOwnPropertyUrl, withCampaign } from '@/lib/cv-campaign'

const ENCORESHOT_BASE = 'https://encoreshot.com/'
const PORTFOLIO_BASE = 'https://antwansherif.com/'

export type EncoreshotSource = 'portfolio' | 'cv'
export type EncoreshotMedium = 'project' | 'web' | 'pdf'

/** Build a UTM-tagged encoreshot.com link. Omit `medium` when the render surface stamps it
 *  later (the CV link, which is one href rendered as both the live page and the PDF).
 *  Pass `campaign` to add `utm_campaign=<slug>` for per-company CV attribution. */
export function encoreshotUrl({ source, medium, campaign }: { source: EncoreshotSource; medium?: EncoreshotMedium; campaign?: string }): string {
  const params = new URLSearchParams({ utm_source: source })
  if (medium) params.set('utm_medium', medium)
  if (campaign) params.set('utm_campaign', campaign)
  return `${ENCORESHOT_BASE}?${params.toString()}`
}

/** Build a UTM-tagged antwansherif.com link with `utm_source=cv`.
 *  Mirrors `encoreshotUrl` so the portfolio self-link carries baseline UTM attribution. */
export function portfolioUrl({ medium, campaign }: { medium?: EncoreshotMedium; campaign?: string }): string {
  const params = new URLSearchParams({ utm_source: 'cv' })
  if (medium) params.set('utm_medium', medium)
  if (campaign) params.set('utm_campaign', campaign)
  return `${PORTFOLIO_BASE}?${params.toString()}`
}

/** Stamp `utm_medium=<surface>` onto a UTM-tagged link that has a source but no medium yet
 *  (the CV link — same href, two surfaces: the live /cv page = 'web', the printed PDF = 'pdf').
 *  Any other href passes through untouched. Pure. */
export function stampSurfaceMedium(href: string, surface: 'web' | 'pdf'): string {
  if (!href.includes('utm_source=') || href.includes('utm_medium=')) return href
  return `${href}&utm_medium=${surface}`
}

/** Resolve a CV link href for rendering: stamp `utm_medium` for the surface, then —
 *  for own-property links only — append `utm_campaign` for per-company attribution.
 *  Third-party links (LinkedIn, GitHub, haktiv.com, …) pass through untouched. The one
 *  place `/cv` link hrefs are resolved, shared by CVDocument and its tests. Pure. */
export function resolveCvHref(href: string, surface: 'web' | 'pdf', campaign?: string): string {
  const stamped = stampSurfaceMedium(href, surface)
  return campaign && isOwnPropertyUrl(href) ? withCampaign(stamped, campaign) : stamped
}
