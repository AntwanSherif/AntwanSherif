import { describe, test, expect } from "vitest";
import { buildOutboundEvent, categorizeOutbound } from "./analytics";
import { sectionViewEvent } from "@/components/analytics/use-section-view";
import { buildGateFailData, buildUmamiPayload, storySlugFromPath } from "./umami-server";
import { HOME_SECTIONS } from "./analytics-taxonomy";

describe("homepage churn funnel inputs", () => {
  test("every homepage section maps to a valid section_view step", () => {
    const events = HOME_SECTIONS.map((s, i) => sectionViewEvent(s, i));
    expect(events.every((e) => e?.name === "section_view")).toBe(true);
    expect(events.map((e) => (e as { props: { content_id: string } } | null)?.props.content_id)).toEqual(HOME_SECTIONS);
  });
});

describe("recruiter-conversion funnel inputs", () => {
  test("a professional outbound is categorized for the recruiter segment", () => {
    const props = buildOutboundEvent({ href: "https://www.linkedin.com/in/x", currentHost: "antwan.me", contentType: "contact" });
    expect(props?.category).toBe("professional");
  });
  test("a code outbound is categorized for the engineer segment", () => {
    expect(categorizeOutbound("github.com")).toBe("code");
  });
});

describe("story funnel inputs", () => {
  test("unlock → view share content_id and carry company; password never travels", () => {
    const slug = storySlugFromPath("/stories/prism");
    const unlock = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_unlock", data: { content_type: "story", content_id: slug, company: "Acme" } });
    const view = buildUmamiPayload({ websiteId: "w1", hostname: "antwan.me", name: "story_view", data: { content_type: "story", content_id: slug, company: "Acme" } });
    expect(unlock.payload.data).toMatchObject({ content_id: "prism", company: "Acme" });
    expect(view.payload.data).toMatchObject({ content_id: "prism", company: "Acme" });
  });
  test("gate_fail carries the attempt + shape flag, never a company", () => {
    const d = buildGateFailData("guess123xy", "prism");
    expect(d.content_id).toBe("prism");
    expect(d).not.toHaveProperty("company");
  });
});
