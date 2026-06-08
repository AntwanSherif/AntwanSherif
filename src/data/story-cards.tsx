import type { StoryCardData } from "./story-types";

// PUBLIC teaser data for the /stories list cards — impact + brief description only.
// The private narrative for each story lives in the submodule (see story-details.tsx).
export const storyCards: StoryCardData[] = [
  {
    slug: "prism",
    company: "Flink",
    initiative: "PRISM",
    tagline:
      "Replaced a 2-day ops cycle with a 2-hour self-serve workflow handling 500K–1M+ promotions per day.",
    metrics: [
      { value: "2d → ~2hr", label: "deploy time" },
      { value: "500K–1M+", label: "promotions/day" },
      { value: "0", label: "backend changes required" },
      { value: "12-field cap", label: "bypassed via bulk upload" },
    ],
    techTags: ["React", "Next.js", "tRPC", "TypeScript", "TanStack Query", "Playwright"],
  },
  {
    slug: "range-promotions",
    company: "Flink",
    initiative: "Range Promotions",
    tagline:
      "Enabled multi-SKU bundle promotions (e.g. add Pepsi + Red Bull + Fanta, get 20% off) — shipped across DE, NL, and FR, driving +18% average order value.",
    metrics: [
      { value: "+18% AOV", label: "avg order value" },
      { value: "3 markets", label: "DE · NL · FR" },
    ],
    techTags: ["React", "Next.js", "TypeScript", "TanStack Query"],
  },
  {
    slug: "mdq",
    company: "Flink",
    initiative: "Maximum Discounted Quantity (MDQ)",
    tagline:
      "Introduced a per-item discount cap to stop bulk order abuse — units beyond the limit revert to full price, driving +5% average order value.",
    metrics: [
      { value: "+5% AOV", label: "avg order value" },
      { value: "4-yr-old", label: "cart code refactored" },
    ],
    techTags: ["React", "Next.js", "TypeScript"],
  },
  {
    slug: "core-observability",
    company: "Trade Republic",
    initiative: "core-observability",
    tagline:
      "RFC to production in a new domain, week one. 3/5 web teams adopted. The LGTM migration RFC built on top of it.",
    metrics: [
      { value: "3 / 5", label: "web teams adopted" },
      { value: "Week 1", label: "assigned at TR" },
    ],
    techTags: ["TypeScript", "Vue 3", "Vite", "Sentry SDK"],
  },
  {
    slug: "core-analytics",
    company: "Trade Republic",
    initiative: "core-analytics",
    tagline:
      "Replaced a €1M/year vendor contract with a consent-first, GDPR-compliant analytics SDK — adopted across Trade Republic's entire web platform.",
    metrics: [
      { value: "€1M/yr", label: "vendor cost eliminated" },
      { value: "5 projects", label: "audited safe to migrate" },
    ],
    techTags: ["TypeScript", "Vue 3", "Snowplow", "Vite"],
  },
];
