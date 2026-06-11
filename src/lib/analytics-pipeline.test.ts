import { describe, test, expect } from "vitest";
import { buildOutboundEvent } from "./analytics";
import { buildUmamiPayload } from "./umami-server";
import { companyFromPassword } from "./stories-password";

describe("event pipeline", () => {
  test("outbound: a project link click on antwansherif.com yields a correct event", () => {
    const props = buildOutboundEvent({ href: "https://www.haktiv.ai", currentHost: "antwansherif.com", context: "project", label: "HAKTIV" });
    expect(props).toEqual({ href: "https://www.haktiv.ai/", host: "www.haktiv.ai", context: "project", label: "HAKTIV" });
  });

  test("story-view: a valid password produces a payload carrying company+story but NOT the password", () => {
    const password = "Acme-7f3k9x2qph";
    const company = companyFromPassword(password);
    expect(company).toBe("Acme");
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story-view", data: { company: company!, story: "prism" } });
    const serialized = JSON.stringify(payload);
    expect(payload.payload.data).toEqual({ company: "Acme", story: "prism" });
    expect(serialized).not.toContain("7f3k9x2qph"); // the secret code never travels
  });

  test("story-unlock: per-domain hostname is preserved for the split view", () => {
    const payload = buildUmamiPayload({ websiteId: "w1", hostname: "antwansherif.com", name: "story-unlock", data: { company: "Acme" } });
    expect(payload.payload.hostname).toBe("antwansherif.com");
  });
});
