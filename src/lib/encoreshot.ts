// Canonical EncoreShot links published from the portfolio, UTM-tagged so encoreshot.com's
// analytics can attribute where a visitor/signup came from. Build links through here rather
// than hand-writing UTM query strings in the data/components.
//
// Full link registry + vocabulary: the encoreshot repo, apps/landing/docs/utm-links.md.

const ENCORESHOT_BASE = 'https://encoreshot.com/'

export type EncoreshotSource = 'portfolio' | 'cv'
export type EncoreshotMedium = 'project' | 'web' | 'pdf'

/** Build a UTM-tagged encoreshot.com link. Omit `medium` when the render surface stamps it
 *  later (the CV link, which is one href rendered as both the live page and the PDF). */
export function encoreshotUrl({ source, medium }: { source: EncoreshotSource; medium?: EncoreshotMedium }): string {
  const params = new URLSearchParams({ utm_source: source })
  if (medium) params.set('utm_medium', medium)
  return `${ENCORESHOT_BASE}?${params.toString()}`
}

/** Stamp `utm_medium=<surface>` onto a UTM-tagged link that has a source but no medium yet
 *  (the CV link — same href, two surfaces: the live /cv page = 'web', the printed PDF = 'pdf').
 *  Any other href passes through untouched. Pure. */
export function stampSurfaceMedium(href: string, surface: 'web' | 'pdf'): string {
  if (!href.includes('utm_source=') || href.includes('utm_medium=')) return href
  return `${href}&utm_medium=${surface}`
}
