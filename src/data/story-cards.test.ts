import { describe, expect, test } from "vitest";
import { storyCards } from "./story-cards";

// The public list page (/stories) is NOT password-protected, so the card data must
// contain ONLY the public teaser fields — never the private narrative. This test is
// the guard that keeps detail content from ever leaking back into the public payload.

const PUBLIC_KEYS = ["slug", "company", "initiative", "subtitle", "tagline", "metrics", "techTags"].sort();
const PRIVATE_KEYS = [
  "role",
  "period",
  "problem",
  "architectureFlow",
  "uiSections",
  "features",
  "bulkUploadFlow",
  "challenges",
  "star",
];

describe("public story cards", () => {
  test("expose exactly the public teaser keys, nothing more", () => {
    for (const card of storyCards) {
      expect(Object.keys(card).sort()).toEqual(PUBLIC_KEYS);
    }
  });

  test.each(PRIVATE_KEYS)("never carry the private '%s' field", (key) => {
    for (const card of storyCards) {
      expect(card).not.toHaveProperty(key);
    }
  });

  test("cover the five expected stories", () => {
    expect(storyCards.map((c) => c.slug).sort()).toEqual([
      "core-analytics",
      "core-observability",
      "mdq",
      "prism",
      "range-promotions",
    ]);
  });
});
