import { describe, test, expect } from "vitest";
import { sectionViewEvent } from "./use-section-view";
import { HOME_SECTIONS } from "@/lib/analytics-taxonomy";

describe("sectionViewEvent", () => {
  test("builds a home section_view event for a known section", () => {
    expect(sectionViewEvent("projects", 6)).toEqual({
      name: "section_view",
      props: { content_type: "home", content_id: "projects", position: 6 },
    });
  });
  test("ignores ids that are not known homepage sections", () => {
    expect(sectionViewEvent("not-a-section", 0)).toBeNull();
  });
  test("every HOME_SECTION maps to its canonical index as position", () => {
    HOME_SECTIONS.forEach((id, i) => {
      expect(sectionViewEvent(id, HOME_SECTIONS.indexOf(id))).toEqual({
        name: "section_view",
        props: { content_type: "home", content_id: id, position: i },
      });
    });
  });
});
