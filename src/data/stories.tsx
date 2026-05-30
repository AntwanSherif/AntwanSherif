export type Metric = { value: string; label: string };
export type FlowStep = { label: string; sublabel?: string };
export type Feature = { name: string; description: string };
export type StarStory = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

export type UiSection = { title: string; placeholderCount: number };

export type Story = {
  slug: string;
  company: string;
  role: string;
  period: string;
  initiative: string;
  tagline: string;
  metrics: Metric[];
  techTags: string[];
  problem: string;
  architectureFlow?: FlowStep[];
  uiSections?: UiSection[];
  features?: Feature[];
  bulkUploadFlow?: FlowStep[];
  challenges?: string[];
  star?: StarStory;
};

export const stories: Story[] = [
  {
    slug: "prism",
    company: "Flink",
    role: "Senior Software Engineer",
    period: "Apr 2023 – Nov 2025",
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
    problem:
      "Flink's commercial team managed pricing and promotions through a fragmented mix of manual backend configurations and spreadsheets. Each deployment required engineering involvement and took up to 2 days — at a scale of 500K–1M+ promotions per day, this was a serious operational bottleneck. A hardcoded 12-field cap in the original schema made bulk campaigns impossible without direct backend intervention.",
    architectureFlow: [
      { label: "React / Next.js", sublabel: "Internal Backoffice" },
      { label: "tRPC BFF", sublabel: "Type-safe API layer" },
      { label: "Backend Microservices", sublabel: "Pricing & Promotions" },
    ],
    features: [
      {
        name: "Bulk Upload",
        description:
          "CSV-based mass promotion creation, bypassing the 12-field cap via a dedicated upload pipeline.",
      },
      {
        name: "Segment Promotions",
        description:
          "Targeted promotions scoped to specific customer segments. Drove +12% add-to-cart conversion.",
      },
      {
        name: "Segment Pricing",
        description:
          "Dynamic pricing rules per customer segment, enabling personalised offers at scale.",
      },
      {
        name: "Maximum Discount Quantity",
        description:
          "Per-promotion cap on discounted units. Drove +5% AOV by preventing margin abuse.",
      },
      {
        name: "Bulk Actions",
        description:
          "Multi-select operations (activate, pause, delete) across the promotions table.",
      },
      {
        name: "URL State",
        description:
          "Filter and pagination state persisted in the URL — enabling shareable, deep-linkable views.",
      },
      {
        name: "Subscriptions Management",
        description:
          "In-housed subscription tier management, removing dependency on a third-party vendor.",
      },
      {
        name: "Delivery Fees",
        description: "Configurable delivery fee rules per market and customer segment.",
      },
      {
        name: "Event Logs",
        description:
          "Immutable audit trail of all promotion changes — who changed what and when.",
      },
      {
        name: "Role Access Control",
        description:
          "Granular permission system scoping backoffice actions by team and region.",
      },
    ],
    bulkUploadFlow: [
      { label: "CSV Upload" },
      { label: "Validation" },
      { label: "Queue" },
      { label: "Promotions Engine" },
    ],
    challenges: [
      "Schema migration — extending the original 12-field promotion schema without breaking existing promotions or downstream consumers.",
      "Type safety across the BFF boundary — keeping the tRPC contract in sync as the backend team iterated on their APIs.",
      "Bulk upload reliability — CSV imports at 1M+ row scale needed idempotent processing, progress feedback, and graceful failure recovery.",
      "Multi-market edge cases — pricing rules behaved differently across DE, NL, and FR due to tax, currency, and regional campaign policies.",
      "Operational trust — the commercial team needed confidence that a self-serve change wouldn't silently break live promotions at scale.",
    ],
    star: {
      situation:
        "Flink's commercial team was spending up to 2 days per promotion deployment, relying on backend engineers for every configuration change. At 500K–1M+ promotions per day, this was costing real revenue and engineering capacity.",
      task: "I was asked to own the Pricing & Promotions backoffice end-to-end — from architecture to delivery — as the solo frontend lead working closely with backend engineers and the commercial product team.",
      action:
        "I designed a tRPC BFF layer to abstract the backend microservices, built a type-safe self-serve backoffice in React/Next.js, and introduced a bulk upload pipeline that bypassed the original 12-field schema cap. I shipped 10+ features across pricing, promotions, subscriptions, and delivery fee management.",
      result:
        "Deployment time dropped from ~2 days to ~2 hours. The commercial team became fully self-serve, handling 500K–1M+ promotions per day without engineering involvement. Segment Promotions drove +12% add-to-cart and Range Promotions drove +18% AOV.",
    },
  },
  {
    slug: "range-promotions",
    company: "Flink",
    role: "Senior Software Engineer",
    period: "Jan 2024 – Jun 2024",
    initiative: "Range Promotions",
    tagline: "Enabled multi-SKU bundle promotions (e.g. add Pepsi + Red Bull + Fanta, get 20% off) — shipped across DE, NL, and FR, driving +18% average order value.",
    metrics: [
      { value: "+18% AOV", label: "avg order value" },
      { value: "3 markets", label: "DE · NL · FR" },
    ],
    techTags: ["React", "Next.js", "TypeScript", "TanStack Query"],
    problem: "Flink's promotions system only supported single-product discounts. Commercial teams wanted cross-category bundle offers — buy products from different brands, unlock a discount — but the backend schema had no concept of multi-SKU rules. The feature required coordinating across frontend, backend, and the promotions engine with no shared contract.",
  },
  {
    slug: "mdq",
    company: "Flink",
    role: "Senior Software Engineer",
    period: "Sep 2023 – Dec 2023",
    initiative: "Maximum Discounted Quantity (MDQ)",
    tagline: "Introduced a per-item discount cap to stop bulk order abuse — units beyond the limit revert to full price, driving +5% average order value.",
    metrics: [
      { value: "+5% AOV", label: "avg order value" },
      { value: "4-yr-old", label: "cart code refactored" },
    ],
    techTags: ["React", "Next.js", "TypeScript"],
    problem:
      "Flink offers a variety of promotions to boost customer retention. While effective at driving sales, the strategy faced challenges when customers placed large bulk orders of discounted products — straining the promotional budget and daily order management. To mitigate this while maintaining promotional value, we introduced Maximum Discounted Quantity (MDQ): a per-item limit on how many units in a cart are eligible for the promotional discount. Any units beyond the threshold revert to regular price.",
    architectureFlow: [
      { label: "Backoffice", sublabel: "MDQ config per promotion" },
      { label: "Promotions Service", sublabel: "Stores MDQ limits" },
      { label: "Cart Service", sublabel: "Splits item instances" },
      { label: "Client", sublabel: "Shows discounted + full-price" },
    ],
    uiSections: [
      { title: "Backoffice", placeholderCount: 3 },
      { title: "Client", placeholderCount: 2 },
    ],
    challenges: [
      "Defining the customer-facing experience without a dedicated designer — worked with the PM to design MDQ limits that felt intuitive and lightweight, ensuring users understood the cap without introducing entirely new patterns.",
      "Replacing the raw-text MDQ config format (${productSKU}:${MDQvalue}) with a structured tabular interface — pushing back on the initial spec to prevent misconfiguration by non-technical Marketing & Commercial teams.",
      "Critical path with high uncertainty — cart logic hadn't been touched in 4+ years, with little documentation. Even small changes risked ripple effects on core user flows and revenue.",
      "Legacy single-instance cart design — the cart was built to handle one instance per product. MDQ required restructuring to support two instances (discounted + full-price) for the same item while preserving seamless UX.",
      "App-wide impact — all dependent client-side logic (subtotals, product counts, validations) had to be adapted to the new two-instance model.",
      "No QA team, minimal test coverage — proceeded cautiously with extensive manual regression testing at every step.",
      "Cross-domain ownership — as part of the Pricing & Promotions team, stepped into Cart code for the first time to deliver the initiative end-to-end.",
    ],
    star: {
      situation:
        "Flink's promotions had no per-quantity cap — customers were bulk-buying discounted items and eroding margins. The fix required modifying the cart's core data model, a codebase no one on the Pricing & Promotions team had touched in 4+ years, with no QA safety net.",
      task: "Own MDQ end-to-end — design the backoffice configuration interface, implement cart-side enforcement, and coordinate with backend to introduce the MDQ field in the promotions schema.",
      action:
        "I pushed back on the proposed raw-text config format and designed a structured tabular interface for the backoffice. On the cart side, I restructured the product instance model to support discounted + full-price splits, then manually regression tested all downstream logic — subtotals, counts, validations — to avoid revenue-impacting bugs.",
      result:
        "MDQ shipped across DE, NL, and FR with zero regressions on the critical cart path. The feature drove +5% AOV and gave the commercial team precise control over promotional budget exposure.",
    },
  },
  {
    slug: "vendor-analytics-migration",
    company: "Trade Republic",
    role: "Senior Software Engineer",
    period: "2022 – 2023",
    initiative: "Vendor Analytics Migration",
    tagline: "GDPR-compliant analytics migration replacing a €1M/year vendor contract with an org-wide standard SDK.",
    metrics: [
      { value: "€1M/yr", label: "cost saved" },
      { value: "17 markets", label: "migrated" },
    ],
    techTags: ["TypeScript", "Vercel AI SDK", "Node.js"],
    problem: "",
  },
  {
    slug: "micro-frontend-migration",
    company: "Shore",
    role: "Senior Frontend Engineer",
    period: "2021 – 2022",
    initiative: "Micro-Frontend Migration",
    tagline: "Migrated legacy Elm micro-frontends to React/TypeScript, reducing initial load from 5s to 400ms and introducing E2E test coverage.",
    metrics: [
      { value: "5s → 400ms", label: "page load" },
    ],
    techTags: ["React", "TypeScript", "Cypress", "Elm"],
    problem: "",
  },
];
