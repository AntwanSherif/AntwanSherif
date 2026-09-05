import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { buildOutboundEvent, newMilestones, MILESTONES, track, categorizeOutbound } from "./analytics";

describe("buildOutboundEvent", () => {
  const host = "antwan.me";
  test("external link → props with category + spine", () => {
    expect(buildOutboundEvent({ href: "https://www.haktiv.ai/x", currentHost: host, contentType: "project", contentId: "haktiv", label: "HAKTIV" }))
      .toEqual({ content_type: "project", content_id: "haktiv", category: "other", host: "www.haktiv.ai", href: "https://www.haktiv.ai/x", label: "HAKTIV" });
  });
  test("github link → category code", () => {
    expect(buildOutboundEvent({ href: "https://github.com/AntwanSherif", currentHost: host, contentType: "nav" })?.category).toBe("code");
  });
  test("internal link → null", () => {
    expect(buildOutboundEvent({ href: "/stories", currentHost: host, contentType: "nav" })).toBeNull();
  });
  test("mailto → host 'mailto', category professional", () => {
    expect(buildOutboundEvent({ href: "mailto:a@b.com", currentHost: host, contentType: "contact" }))
      .toEqual({ content_type: "contact", content_id: undefined, category: "professional", host: "mailto", href: "mailto:a@b.com", label: undefined });
  });
  test("null/garbage href → null", () => {
    expect(buildOutboundEvent({ href: null, currentHost: host, contentType: "nav" })).toBeNull();
    expect(buildOutboundEvent({ href: "::::", currentHost: host, contentType: "nav" })).toBeNull();
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

  test("calls window.umami.track with v stamped in", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => null } };
    track({ name: "contact_click", props: { content_type: "contact", channel: "email", category: "professional" } });
    expect(spy).toHaveBeenCalledWith("contact_click", { v: 1, content_type: "contact", channel: "email", category: "professional" });
  });
  test("cv_view stamps v + nav/professional/source props", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => null } };
    track({ name: "cv_view", props: { content_type: "nav", category: "professional", source: "navbar" } });
    expect(spy).toHaveBeenCalledWith("cv_view", { v: 1, content_type: "nav", category: "professional", source: "navbar" });
  });
  test("cv_download and cv_print are distinct cv-spine events", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => null } };
    track({ name: "cv_download", props: { content_type: "cv", category: "professional" } });
    track({ name: "cv_print", props: { content_type: "cv", category: "professional" } });
    expect(spy).toHaveBeenNthCalledWith(1, "cv_download", { v: 1, content_type: "cv", category: "professional" });
    expect(spy).toHaveBeenNthCalledWith(2, "cv_print", { v: 1, content_type: "cv", category: "professional" });
  });
  test("no-ops (no throw) when umami is absent", () => {
    (globalThis as any).window = { localStorage: { getItem: () => null } };
    expect(() => track({ name: "impression", props: { content_type: "contact" } })).not.toThrow();
  });
  test("no-ops (no throw) during SSR when window is undefined", () => {
    const saved = (globalThis as any).window;
    delete (globalThis as any).window;
    try {
      expect(() => track({ name: "impression", props: { content_type: "contact" } })).not.toThrow();
    } finally {
      (globalThis as any).window = saved;
    }
  });
  test("no-ops outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => null } };
    track({ name: "impression", props: { content_type: "contact" } });
    expect(spy).not.toHaveBeenCalled();
  });
  test("no-ops when the admin flag is set", () => {
    const spy = vi.fn();
    (globalThis as any).window = { umami: { track: spy }, localStorage: { getItem: () => "1" } };
    track({ name: "contact_click", props: { content_type: "contact", channel: "email", category: "professional" } });
    expect(spy).not.toHaveBeenCalled();
  });
  test("does not throw when localStorage access itself throws", () => {
    const spy = vi.fn();
    (globalThis as any).window = {
      umami: { track: spy },
      get localStorage() { throw new Error("denied"); },
    };
    expect(() => track({ name: "contact_click", props: { content_type: "contact", channel: "email", category: "professional" } })).not.toThrow();
  });
});

describe("categorizeOutbound", () => {
  test("code platforms → code", () => {
    expect(categorizeOutbound("github.com")).toBe("code");
    expect(categorizeOutbound("www.npmjs.com")).toBe("code");
    expect(categorizeOutbound("codesandbox.io")).toBe("code");
  });
  test("linkedin + mailto → professional", () => {
    expect(categorizeOutbound("www.linkedin.com")).toBe("professional");
    expect(categorizeOutbound("mailto")).toBe("professional");
  });
  test("social networks → social", () => {
    expect(categorizeOutbound("x.com")).toBe("social");
    expect(categorizeOutbound("youtube.com")).toBe("social");
  });
  test("writing platforms → content", () => {
    expect(categorizeOutbound("dev.to")).toBe("content");
    expect(categorizeOutbound("medium.com")).toBe("content");
  });
  test("unknown host → other", () => {
    expect(categorizeOutbound("example.com")).toBe("other");
  });
});
