import { describe, test, expect } from "vitest";
import { buildUmamiPayload, buildGateFailData, storySlugFromPath } from "./umami-server";

describe("buildUmamiPayload", () => {
  test("wraps name + data + hostname into Umami's event shape", () => {
    expect(
      buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: "prism", company: "Acme" } })
    ).toEqual({
      type: "event",
      payload: {
        website: "w1",
        hostname: "antwan.me",
        name: "story_view",
        data: { content_type: "story", content_id: "prism", company: "Acme" },
        url: "/",
      },
    });
  });
  test("preserves the company-only data for story-unlock", () => {
    const p = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_unlock", data: { content_type: "story", content_id: "prism", company: "Acme" } });
    expect(p.payload.name).toBe("story_unlock");
    expect(p.payload.data).toEqual({ content_type: "story", content_id: "prism", company: "Acme" });
  });
});

describe("buildGateFailData", () => {
  test("captures the raw attempt, never derives company", () => {
    const d = buildGateFailData("totally-wrong", "prism");
    expect(d).toEqual({ content_type: "story", content_id: "prism", attempt: "totally-wrong", format_valid: false });
    expect(d).not.toHaveProperty("company");
  });
  test("flags a guess that matches the Company-<base62> shape", () => {
    expect(buildGateFailData("Acme-7f3k9x2qph", "prism").format_valid).toBe(true);
  });
  test("truncates the attempt to 64 chars", () => {
    expect(buildGateFailData("x".repeat(200), "prism").attempt).toHaveLength(64);
  });
});

describe("storySlugFromPath", () => {
  test("extracts the slug from a story path", () => {
    expect(storySlugFromPath("/stories/prism")).toBe("prism");
    expect(storySlugFromPath("/stories/prism?error=1")).toBe("prism");
  });
  test("falls back to 'stories' for the list or unknown paths", () => {
    expect(storySlugFromPath("/stories")).toBe("stories");
    expect(storySlugFromPath("/")).toBe("stories");
  });
});
