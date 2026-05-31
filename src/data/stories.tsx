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
    slug: "core-observability",
    company: "Trade Republic",
    role: "Senior Software Engineer",
    period: "Dec 2025 – Mar 2026",
    initiative: "core-observability",
    tagline:
      "RFC to production in a new domain, week one. 3/5 web teams adopted. The LGTM migration RFC built on top of it.",
    metrics: [
      { value: "3 / 5", label: "web teams adopted" },
      { value: "Week 1", label: "assigned at TR" },
    ],
    techTags: ["TypeScript", "Vue 3", "Vite", "Sentry SDK"],
    problem:
      "Trade Republic's web teams each instrumented observability independently — different Sentry configurations, inconsistent tagging, no shared error classification or PII scrubbing standards. Production issues were slow to diagnose, and teams had no reliable way to measure the health impact of new releases. Direct Sentry SDK usage across every repo also created migration risk ahead of a planned LGTM stack transition.",
    architectureFlow: [
      { label: "Web App", sublabel: "Vue 3 or browser" },
      { label: "core-observability", sublabel: "Vendor-agnostic wrapper" },
      { label: "Sentry", sublabel: "Current backend" },
      { label: "LGTM Stack", sublabel: "Future migration target" },
    ],
    features: [
      {
        name: "Core Web Vitals Monitoring",
        description:
          "Automatic performance monitoring across all routes, with manual span tracking for key user journeys via a startSpan API — available in both Vue and browser adapters.",
      },
      {
        name: "PII Scrubbing",
        description:
          "Automatic stripping of sensitive user data before it leaves the browser — a hard requirement for a regulated financial product.",
      },
      {
        name: "Source Map Upload (Vite Plugin)",
        description:
          "Vite plugin that automatically uploads source maps during CI builds, enabling readable stack traces in Sentry without any manual steps from consuming teams.",
      },
      {
        name: "Built-in Error Filtering",
        description:
          "Noise-error filtering internalised into the package after observing Web-Trading's workaround — so all future consumers get this out of the box without extra boilerplate.",
      },
      {
        name: "MCP Server",
        description:
          "A dedicated MCP server shipped alongside the package from day one — giving teams AI-assisted integration guidance rather than static codemod scripts.",
      },
      {
        name: "Sentry Dashboard Template",
        description:
          "A reusable Sentry dashboard template so new projects can skip setup and start monitoring immediately.",
      },
      {
        name: "Migration Guide",
        description:
          "1-to-1 mapping from direct Sentry SDK usage to the new package API, reducing adoption friction for teams already using Sentry directly.",
      },
    ],
    challenges: [
      "Assigned week one with no prior context on how observability was set up across the company — required proactive discovery into existing practices before being able to design a credible solution.",
      "No prior Sentry experience or frontend observability background — required deep self-study into Sentry's APIs, platform capabilities, and frontend-specific best practices before writing RFC-011.",
      "Technology scope decision — collected feedback from POs, TL, and teams to determine which environments to support first. Outcome: Vue 3 and browser (vanilla JS/TS), covering the two primary web surfaces at Trade Republic.",
      "Single-package architecture — designed sub-path exports so host applications only bundle what they import (full tree-shaking), while keeping setup simple with one package regardless of stack.",
      "Managed breaking changes across multiple consumer repos — absorbed the Vue plugin signature fix across both packages and opened migration PRs directly in consumer repos rather than delegating.",
      "When Web-Trading added a noise-error workaround to their integration PR, pulled it natively into the package rather than accepting it as a per-team concern — aligning with all parties that this would also be supported post-LGTM migration.",
    ],
    star: {
      situation:
        "I joined Trade Republic in December 2025 and was assigned a cross-org technical initiative in my first week — in a domain I had no depth in. No Sentry experience, no frontend observability background, and still mapping how the org worked.",
      task: "Author RFC-011 and deliver a production-ready observability package that could become the org-wide standard — covering error tracking, performance monitoring, and PII scrubbing for all Trade Republic web applications.",
      action:
        "I proactively discovered existing observability practices across the company, studied Sentry's platform from scratch, and ran stakeholder conversations with TLs and POs to make defensible scope decisions. I rejected OpenTelemetry in favour of a custom Sentry wrapper after a documented tradeoff analysis, shipped the package with an MCP server, runbook, and dashboard template from day one. When the pilot team (Web-Trading) added a noise-error workaround in their integration PR, I pulled it natively into the package so every future team gets it automatically.",
      result:
        "3 of 5 web teams adopted the package before I left. The LGTM migration RFC — owned by a colleague — was already building on the foundation I laid. Web-Trading, the company's highest-priority web project, used it as their observability standard for their April release.",
    },
  },
  {
    slug: "core-analytics",
    company: "Trade Republic",
    role: "Senior Software Engineer",
    period: "Feb 2026 – Mar 2026",
    initiative: "core-analytics",
    tagline:
      "Replaced a €1M/year vendor contract with a consent-first, GDPR-compliant analytics SDK — adopted across Trade Republic's entire web platform.",
    metrics: [
      { value: "€1M/yr", label: "vendor cost eliminated" },
      { value: "5 projects", label: "audited safe to migrate" },
    ],
    techTags: ["TypeScript", "Vue 3", "Snowplow", "Vite"],
    problem:
      "mParticle's costs became unsustainable following their acquisition by Rokt. A company-wide decision was made to replace the vendor — Mobile Platform led the discovery and selected Snowplow. I was assigned to own the Web side: design, build, and deliver the `core-analytics` package as Trade Republic's new standard for web analytics. With Mobile and Data teams already mid-RFC when I was brought in, I needed to onboard fast enough to contribute meaningfully to cross-platform decisions — not just implement a spec someone else had written.",
    architectureFlow: [
      { label: "Web App", sublabel: "Vue 3 or browser" },
      { label: "core-analytics", sublabel: "Consent-first wrapper" },
      { label: "Snowplow Collector", sublabel: "Event ingestion" },
      { label: "Kafka / Data Pipeline", sublabel: "Analytics processing" },
    ],
    features: [
      {
        name: "Consent-First Design",
        description:
          "No events are enqueued or sent until user consent is granted. Queued events are purged if consent is withdrawn. Runtime consent state updates are supported — covering flows where preferences change after the app has loaded.",
      },
      {
        name: "Automatic PII Scrubbing",
        description:
          "Sensitive user data is automatically redacted before events leave the browser — a non-negotiable requirement for a regulated financial product operating across EU markets.",
      },
      {
        name: "Offline Queuing, Batching & Retry",
        description:
          "Snowplow's built-in offline queuing, event batching, and automatic retry are exposed through the package — ensuring no event loss under intermittent connectivity without custom implementation.",
      },
      {
        name: "Automatic Screenview Tracking",
        description:
          "Vue plugin tracks screenview events out of the box, with support for custom metadata per event — reducing instrumentation boilerplate for every consuming team.",
      },
      {
        name: "Global Identity Context",
        description:
          "Host apps can attach auth_account_id to all events via Snowplow's global context API — user identity is automatically associated with every event without per-call instrumentation.",
      },
      {
        name: "Session Management Parity",
        description:
          "Snowplow session management configured to replicate mParticle's session behaviour — ensuring data continuity and a clean migration with no gaps in session-level attribution.",
      },
      {
        name: "MCP Server",
        description:
          "Dedicated MCP server shipped alongside the package, enabling AI-assisted integration guidance for consuming teams.",
      },
    ],
    challenges: [
      "Joined the initiative with Mobile and Data teams already mid-RFC — reviewed 6–8 Mobile Platform RFCs before drafting RFC-014 to ensure Web aligned with cross-platform decisions rather than designing in isolation.",
      "Consent-first as a hard requirement — no events sent before consent is granted, queued events purged on withdrawal, runtime updates supported. Designed enforcement at the package level so no consuming team can accidentally bypass it.",
      "Validated the full data pipeline before committing to implementation — ran an end-to-end POC verifying Snowplow JS SDK integration with the collector, viewing live events in Kafka UI before writing a line of production code.",
      "Proactively surfaced reliability risks (CORS configuration, batch/payload sizing, event drops) before integration — preventing data loss at scale from becoming a production incident.",
      "Conducted a full mParticle deprecation impact analysis across all 5 web projects — concluded shutdown was safe with no production risk, directly unblocking the org-wide migration without emergency coordination.",
      "Dropped dual-write in favour of a clean cutover — aligned with POs and TLs that continuing mParticle tracking during migration added complexity with no benefit, enabling a direct switch to Snowplow.",
    ],
    star: {
      situation:
        "mParticle's costs became unsustainable after their acquisition by Rokt. A company-wide migration to Snowplow was already in motion — Mobile and Data teams had RFCs and POCs in flight when I was assigned to own the Web platform's side of the migration.",
      task: "Design and deliver `core-analytics` as the Web standard for analytics — RFC authoring, implementation, consent-first GDPR compliance, and cross-platform alignment with Mobile, Backend, and Data teams.",
      action:
        "I reviewed 6–8 Mobile Platform RFCs before writing a line of RFC-014 to avoid designing in isolation. I ran an end-to-end POC verifying the Snowplow pipeline before committing to the implementation. I designed consent enforcement and PII scrubbing at the package level — not left to each team — and conducted a full mParticle deprecation impact analysis across all 5 web projects, concluding that shutdown was safe and unblocking the migration.",
      result:
        "Delivered a production-ready GDPR-compliant analytics SDK replacing a €1M/year vendor contract. 5 web projects confirmed safe to migrate. The package is ready for rollout pending the backend collector endpoint.",
    },
  },
];
