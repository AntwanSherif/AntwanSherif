export type Metric = { value: string; label: string };
export type FlowStep = { label: string; sublabel?: string };
export type Feature = { name: string; description: string };
export type StarStory = {
  situation: string;
  task: string;
  action: string;
  result: string;
};

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
  architectureFlow: FlowStep[];
  features: Feature[];
  bulkUploadFlow: FlowStep[];
  challenges: string[];
  star: StarStory;
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
];
