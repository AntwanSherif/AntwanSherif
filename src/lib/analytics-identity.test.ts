import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getOrCreateVisitorId, identifyVisitor, VISITOR_ID_KEY } from "./analytics-identity";

function fakeStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  } as Storage;
}

describe("getOrCreateVisitorId", () => {
  test("mints and persists a uuid on first call", () => {
    const s = fakeStorage();
    const id = getOrCreateVisitorId(s);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(s.getItem(VISITOR_ID_KEY)).toBe(id);
  });
  test("returns the same id on subsequent calls", () => {
    const s = fakeStorage();
    expect(getOrCreateVisitorId(s)).toBe(getOrCreateVisitorId(s));
  });
});

describe("identifyVisitor", () => {
  const realWindow = globalThis.window;
  afterEach(() => { (globalThis as any).window = realWindow; vi.unstubAllEnvs(); });
  beforeEach(() => { vi.stubEnv("NODE_ENV", "production"); });

  test("calls umami.identify with id only when no data", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc" });
    expect(spy).toHaveBeenCalledWith("abc");
  });
  test("calls umami.identify with id + data when data present", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc", data: { company: "Acme" } });
    expect(spy).toHaveBeenCalledWith("abc", { company: "Acme" });
  });
  test("no-ops (no throw) when umami absent", () => {
    (globalThis as any).window = {};
    expect(() => identifyVisitor({ id: "abc" })).not.toThrow();
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy } };
    identifyVisitor({ id: "abc" });
    expect(spy).not.toHaveBeenCalled();
  });
});
