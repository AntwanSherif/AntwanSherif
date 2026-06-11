import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { buildOutboundEvent, newMilestones, MILESTONES, track } from "./analytics";

describe("buildOutboundEvent", () => {
  const host = "antwan.me";
  test("external link → props with normalized host", () => {
    expect(buildOutboundEvent({ href: "https://www.haktiv.ai/x", currentHost: host, context: "project", label: "HAKTIV" }))
      .toEqual({ href: "https://www.haktiv.ai/x", host: "www.haktiv.ai", context: "project", label: "HAKTIV" });
  });
  test("internal link → null", () => {
    expect(buildOutboundEvent({ href: "/stories", currentHost: host })).toBeNull();
  });
  test("same-host absolute link → null", () => {
    expect(buildOutboundEvent({ href: "https://antwan.me/about", currentHost: host })).toBeNull();
  });
  test("mailto → host 'mailto'", () => {
    expect(buildOutboundEvent({ href: "mailto:a@b.com", currentHost: host, context: "contact" }))
      .toEqual({ href: "mailto:a@b.com", host: "mailto", context: "contact", label: undefined });
  });
  test("null/garbage href → null", () => {
    expect(buildOutboundEvent({ href: null, currentHost: host })).toBeNull();
    expect(buildOutboundEvent({ href: "::::", currentHost: host })).toBeNull();
  });
});

describe("newMilestones", () => {
  test("returns milestones newly crossed, not already fired", () => {
    expect(newMilestones(60, new Set([25]))).toEqual([50]);
  });
  test("returns nothing when none newly crossed", () => {
    expect(newMilestones(10, new Set())).toEqual([]);
  });
  test("100% returns all remaining", () => {
    expect(newMilestones(100, new Set([25, 50]))).toEqual([75, 100]);
  });
  test("MILESTONES are 25/50/75/100", () => {
    expect(MILESTONES).toEqual([25, 50, 75, 100]);
  });
});

describe("track", () => {
  const realWindow = globalThis.window;
  afterEach(() => { (globalThis as any).window = realWindow; vi.unstubAllEnvs(); });
  beforeEach(() => { vi.stubEnv("NODE_ENV", "production"); });

  test("calls window.umami.track in production", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "cv-download" });
    expect(spy).toHaveBeenCalledWith("cv-download", undefined);
  });
  test("passes props through", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "contact-click", props: { channel: "email" } });
    expect(spy).toHaveBeenCalledWith("contact-click", { channel: "email" });
  });
  test("no-ops (no throw) when umami is absent", () => {
    (globalThis as any).window = {};
    expect(() => track({ name: "cv-download" })).not.toThrow();
  });
  test("no-ops (no throw) during SSR when window is undefined", () => {
    const saved = (globalThis as any).window;
    delete (globalThis as any).window;
    try {
      expect(() => track({ name: "cv-download" })).not.toThrow();
    } finally {
      (globalThis as any).window = saved;
    }
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy } };
    track({ name: "cv-download" });
    expect(spy).not.toHaveBeenCalled();
  });
});
