import { describe, test, expect } from "vitest";
import { buildOutboundEvent } from "./analytics";
import { buildUmamiPayload } from "./umami-server";
import { companyFromPassword } from "./stories-password";

describe("event pipeline", () => {
  test("outbound: a project link click on antwansherif.com yields a correct event", () => {
    const props = buildOutboundEvent({ href: "https://www.haktiv.ai", currentHost: "antwansherif.com", contentType: "project", contentId: "haktiv", label: "HAKTIV" });
    expect(props).toEqual({ content_type: "project", content_id: "haktiv", category: "other", host: "www.haktiv.ai", href: "https://www.haktiv.ai/", label: "HAKTIV" });
  });

  test("story_view: a valid password produces a payload carrying company+content_id but NOT the password", () => {
    const password = "Acme-7f3k9x2qph";
    const company = companyFromPassword(password);
    expect(company).toBe("Acme");
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: "prism", company: company! } });
    expect(payload.payload.data).toEqual({ content_type: "story", content_id: "prism", company: "Acme" });
    expect(JSON.stringify(payload)).not.toContain("7f3k9x2qph");
  });

  test("story_unlock: per-domain hostname is preserved for the split view", () => {
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwansherif.com", name: "story_unlock", data: { content_type: "story", content_id: "prism", company: "Acme" } });
    expect(payload.payload.hostname).toBe("antwansherif.com");
  });
});
