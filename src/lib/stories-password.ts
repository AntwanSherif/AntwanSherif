// Per-company, self-rotating story passwords.
//
// A password looks like  Acme-7f3k9x2qph  — a company slug plus an unforgeable
// code derived from a single secret seed and the current month:
//
//   code = base62( HMAC-SHA256(SEED, "<slug>|<YYYY-MM>") )[:10]
//
// The seed (STORIES_SEED) is the only secret and never leaves the env. Anyone can
// read this derivation — without the seed they can't produce a valid code, and the
// code for next month is independent of this month's. The generator that prints
// passwords lives in the private submodule; this file is only the validator the
// public app needs at request time.
//
// Web Crypto only (crypto.subtle) so the same code runs on the edge (proxy.ts),
// in Node server actions, and in the CLI.

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const CODE_LENGTH = 10;
const encoder = new TextEncoder();

/** Calendar-month key in UTC, e.g. "2026-06". */
export function periodKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** The previous calendar month, e.g. "2026-05" (or "2025-12" across a year boundary). */
export function previousPeriodKey(date: Date): string {
  const prev = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1));
  return periodKey(prev);
}

/** Strip a company name to alphanumeric characters (the display + HMAC slug). */
function sanitizeSlug(raw: string): string {
  return raw.replace(/[^0-9A-Za-z]/g, "");
}

async function hmac(seed: string, message: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(seed),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return new Uint8Array(sig);
}

/** Constant-time string comparison. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Derive the bare code for a (slug, period). Slug is lowercased so casing doesn't matter. */
export async function deriveCode(
  seed: string,
  slug: string,
  period: string,
  length = CODE_LENGTH,
): Promise<string> {
  const sani = sanitizeSlug(slug).toLowerCase();
  const bytes = await hmac(seed, `${sani}|${period}`);
  let code = "";
  for (let i = 0; i < length; i++) code += BASE62[bytes[i] % 62];
  return code;
}

/** Build the full shareable password for a company at a given time. */
export async function passwordFor(
  seed: string,
  slug: string,
  date: Date = new Date(),
  length = CODE_LENGTH,
): Promise<string> {
  const display = sanitizeSlug(slug);
  const code = await deriveCode(seed, display, periodKey(date), length);
  return `${display}-${code}`;
}

/**
 * Parse the company slug out of a password of the form `<slug>-<code>`.
 * Mirrors validate()'s parsing. Returns null for malformed input.
 * Never returns the code portion. Does NOT itself prove validity — call
 * validate() first when authenticity matters (it always does before tracking).
 */
export function companyFromPassword(candidate: string): string | null {
  const idx = candidate.lastIndexOf("-");
  if (idx <= 0 || idx >= candidate.length - 1) return null;
  const slug = sanitizeSlug(candidate.slice(0, idx));
  return slug.length === 0 ? null : slug;
}

/** True if `candidate` is a valid password for any company in the current or previous period. */
export async function validate(
  seed: string,
  candidate: string,
  date: Date = new Date(),
  length = CODE_LENGTH,
): Promise<boolean> {
  if (!seed || !candidate) return false;
  const idx = candidate.lastIndexOf("-");
  if (idx <= 0 || idx >= candidate.length - 1) return false;

  const slug = candidate.slice(0, idx);
  const code = candidate.slice(idx + 1);
  if (sanitizeSlug(slug).length === 0) return false;

  for (const period of [periodKey(date), previousPeriodKey(date)]) {
    const expected = await deriveCode(seed, slug, period, length);
    if (timingSafeEqual(code, expected)) return true;
  }
  return false;
}
