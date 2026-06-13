import { describe, test, expect } from "vitest";
import { TAXONOMY_VERSION, HOME_SECTIONS } from "./analytics-taxonomy";

describe("analytics-taxonomy", () => {
  test("version is 1", () => {
    expect(TAXONOMY_VERSION).toBe(1);
  });
  test("HOME_SECTIONS lists the 8 homepage sections in DOM order", () => {
    expect(HOME_SECTIONS).toEqual([
      "hero", "about", "work", "education", "skills", "talks", "projects", "contact",
    ]);
  });
});
