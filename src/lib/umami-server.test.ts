import { describe, test, expect } from "vitest";
import { buildUmamiPayload } from "./umami-server";

describe("buildUmamiPayload", () => {
  test("wraps name + data + hostname into Umami's event shape", () => {
    expect(
      buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-view", data: { company: "Acme", story: "prism" } })
    ).toEqual({
      type: "event",
      payload: {
        website: "w1",
        hostname: "antwan.me",
        name: "story-view",
        data: { company: "Acme", story: "prism" },
        url: "/",
      },
    });
  });
  test("preserves the company-only data for story-unlock", () => {
    const p = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-unlock", data: { company: "Acme" } });
    expect(p.payload.name).toBe("story-unlock");
    expect(p.payload.data).toEqual({ company: "Acme" });
  });
});
