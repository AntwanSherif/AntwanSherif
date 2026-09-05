import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getOrCreateVisitorId,
  identifyVisitor,
  VISITOR_ID_KEY,
  IDENTIFY_MAX_ATTEMPTS,
  IDENTIFY_RETRY_DELAY_MS,
} from "./analytics-identity";

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
  afterEach(() => { (globalThis as any).window = realWindow; vi.unstubAllEnvs(); vi.useRealTimers(); });
  beforeEach(() => { vi.stubEnv("NODE_ENV", "production"); vi.useFakeTimers(); });

  test("calls umami.identify with id only when no data", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy }, localStorage: { getItem: () => null } };
    identifyVisitor({ id: "abc" });
    expect(spy).toHaveBeenCalledWith("abc");
  });
  test("calls umami.identify with id + data when data present", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy }, localStorage: { getItem: () => null } };
    identifyVisitor({ id: "abc", data: { company: "Acme" } });
    expect(spy).toHaveBeenCalledWith("abc", { company: "Acme" });
  });
  test("no-ops (no throw) when umami never becomes available", () => {
    (globalThis as any).window = { localStorage: { getItem: () => null } };
    expect(() => identifyVisitor({ id: "abc" })).not.toThrow();
    vi.advanceTimersByTime(IDENTIFY_RETRY_DELAY_MS * (IDENTIFY_MAX_ATTEMPTS + 1));
    expect(vi.getTimerCount()).toBe(0);
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy }, localStorage: { getItem: () => null } };
    identifyVisitor({ id: "abc" });
    expect(spy).not.toHaveBeenCalled();
  });
  test("retries when umami.identify isn't loaded yet, then calls it once available", () => {
    const win: { umami?: { identify: ReturnType<typeof vi.fn> }; localStorage?: { getItem: () => null } } = { localStorage: { getItem: () => null } };
    (globalThis as any).window = win;
    identifyVisitor({ id: "abc", data: { company: "zauber" } });
    const spy = vi.fn();
    win.umami = { identify: spy };
    vi.advanceTimersByTime(IDENTIFY_RETRY_DELAY_MS);
    expect(spy).toHaveBeenCalledWith("abc", { company: "zauber" });
  });
  test("stops retrying after IDENTIFY_MAX_ATTEMPTS with umami still unavailable", () => {
    (globalThis as any).window = { localStorage: { getItem: () => null } };
    identifyVisitor({ id: "abc" });
    vi.advanceTimersByTime(IDENTIFY_RETRY_DELAY_MS * IDENTIFY_MAX_ATTEMPTS);
    expect(vi.getTimerCount()).toBe(0);
  });
  test("no-ops when the admin flag is set", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { identify: spy }, localStorage: { getItem: () => "1" } };
    identifyVisitor({ id: "abc" });
    expect(spy).not.toHaveBeenCalled();
  });
  test("does not throw when localStorage access itself throws", () => {
    const spy = vi.fn();
    (globalThis as any).window = {
      umami: { identify: spy },
      get localStorage() { throw new Error("denied"); },
    };
    expect(() => identifyVisitor({ id: "abc" })).not.toThrow();
  });
});
