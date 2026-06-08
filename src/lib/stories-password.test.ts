import { describe, expect, test } from "vitest";
import {
  periodKey,
  previousPeriodKey,
  deriveCode,
  passwordFor,
  validate,
} from "./stories-password";

const SEED = "test-seed-do-not-use-in-prod";
// Fixed reference instants (UTC) so tests are deterministic.
const JUN = new Date("2026-06-15T12:00:00Z");
const JUL = new Date("2026-07-15T12:00:00Z");
const AUG = new Date("2026-08-15T12:00:00Z");
const JAN = new Date("2026-01-10T00:00:00Z");

describe("periodKey", () => {
  test("formats a date as YYYY-MM in UTC", () => {
    expect(periodKey(JUN)).toBe("2026-06");
  });

  test("previousPeriodKey rolls back one month", () => {
    expect(previousPeriodKey(JUN)).toBe("2026-05");
  });

  test("previousPeriodKey crosses the year boundary", () => {
    expect(previousPeriodKey(JAN)).toBe("2025-12");
  });
});

describe("deriveCode", () => {
  test("is deterministic for the same seed/slug/period", async () => {
    const a = await deriveCode(SEED, "acme", "2026-06");
    const b = await deriveCode(SEED, "acme", "2026-06");
    expect(a).toBe(b);
  });

  test("differs by company", async () => {
    const acme = await deriveCode(SEED, "acme", "2026-06");
    const globex = await deriveCode(SEED, "globex", "2026-06");
    expect(acme).not.toBe(globex);
  });

  test("differs by period (rotation)", async () => {
    const jun = await deriveCode(SEED, "acme", "2026-06");
    const jul = await deriveCode(SEED, "acme", "2026-07");
    expect(jun).not.toBe(jul);
  });

  test("differs by seed", async () => {
    const a = await deriveCode(SEED, "acme", "2026-06");
    const b = await deriveCode("a-different-seed", "acme", "2026-06");
    expect(a).not.toBe(b);
  });

  test("produces a 10-char base62 code", async () => {
    const code = await deriveCode(SEED, "acme", "2026-06");
    expect(code).toMatch(/^[0-9A-Za-z]{10}$/);
  });

  test("slug is case-insensitive", async () => {
    const lower = await deriveCode(SEED, "acme", "2026-06");
    const upper = await deriveCode(SEED, "ACME", "2026-06");
    expect(lower).toBe(upper);
  });
});

describe("passwordFor", () => {
  test("formats as <Slug>-<10 base62>", async () => {
    const pw = await passwordFor(SEED, "Acme", JUN);
    expect(pw).toMatch(/^Acme-[0-9A-Za-z]{10}$/);
  });

  test("sanitizes a company name with spaces/punctuation to alphanumeric", async () => {
    const pw = await passwordFor(SEED, "Goodgame Studios!", JUN);
    expect(pw).toMatch(/^GoodgameStudios-[0-9A-Za-z]{10}$/);
  });
});

describe("validate", () => {
  test("accepts a password from the current period", async () => {
    const pw = await passwordFor(SEED, "Acme", JUN);
    expect(await validate(SEED, pw, JUN)).toBe(true);
  });

  test("accepts last period's password (grace window)", async () => {
    const pw = await passwordFor(SEED, "Acme", JUN);
    expect(await validate(SEED, pw, JUL)).toBe(true);
  });

  test("rejects a password two periods old", async () => {
    const pw = await passwordFor(SEED, "Acme", JUN);
    expect(await validate(SEED, pw, AUG)).toBe(false);
  });

  test("rejects a tampered code with a valid format", async () => {
    expect(await validate(SEED, "Acme-0000000000", JUN)).toBe(false);
  });

  test("rejects a different seed's password", async () => {
    const pw = await passwordFor("attacker-seed", "Acme", JUN);
    expect(await validate(SEED, pw, JUN)).toBe(false);
  });

  test("accepts regardless of slug casing the visitor types", async () => {
    const pw = await passwordFor(SEED, "Acme", JUN); // "Acme-xxxx"
    const lowered = pw.toLowerCase(); // "acme-xxxx" — code part stays the same chars? no
    // Build a same-code candidate with a lowercased slug explicitly:
    const code = pw.split("-")[1];
    expect(await validate(SEED, `acme-${code}`, JUN)).toBe(true);
    void lowered;
  });

  test("rejects empty / malformed candidates", async () => {
    expect(await validate(SEED, "", JUN)).toBe(false);
    expect(await validate(SEED, "no-dash-here-but-weird", JUN)).toBe(false);
    expect(await validate(SEED, "-justcode", JUN)).toBe(false);
    expect(await validate("", "Acme-whatever1", JUN)).toBe(false);
  });

  test("two companies each validate with their own password, not each other's", async () => {
    const acme = await passwordFor(SEED, "Acme", JUN);
    const globex = await passwordFor(SEED, "Globex", JUN);
    expect(await validate(SEED, acme, JUN)).toBe(true);
    expect(await validate(SEED, globex, JUN)).toBe(true);
    // Acme's code under Globex's name must fail.
    const acmeCode = acme.split("-")[1];
    expect(await validate(SEED, `Globex-${acmeCode}`, JUN)).toBe(false);
  });
});

describe("lifecycle (integration)", () => {
  test("a shared link survives a month boundary then expires", async () => {
    // You generate and share a password mid-June.
    const shared = await passwordFor(SEED, "Acme", JUN);
    // The visitor unlocks in June — works.
    expect(await validate(SEED, shared, JUN)).toBe(true);
    // They come back in July (grace window) — still works.
    expect(await validate(SEED, shared, JUL)).toBe(true);
    // By August it's two periods old — access is gone.
    expect(await validate(SEED, shared, AUG)).toBe(false);
  });
});
