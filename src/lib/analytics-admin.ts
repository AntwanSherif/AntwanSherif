// The site owner's own-visit exclusion switch — a plain, non-secret query param
// (?admin=1 / ?admin=0), not a security boundary. Distinct from the gated-story
// `is_admin` session prop set via VisitorIdentity's `isAdmin` — that one flags a
// content-access allowlist match on /stories/[slug]; this one is a site-wide
// "don't send my own analytics at all" switch. Same word, unrelated mechanism.
//
// Design: docs/superpowers/specs/2026-09-05-self-exclude-and-cv-link-carryforward-design.md

export const ADMIN_STORAGE_KEY = 'as_admin'

/** Parse `?admin=` from a query string. '1' to set the flag, '0' to clear it; any
 *  other value (including absent, or empty) is "no instruction" — null. Pure. */
export function resolveAdminParam(search: string): '1' | '0' | null {
  const raw = new URLSearchParams(search).get('admin')
  return raw === '1' || raw === '0' ? raw : null
}

/** Whether this browser is currently flagged as the site owner's own admin visit.
 *  Pure (storage injected), mirrors getOrCreateVisitorId's style. */
export function isAdminVisit(storage: Pick<Storage, 'getItem'>): boolean {
  return storage.getItem(ADMIN_STORAGE_KEY) === '1'
}
