# Initiatives Log
**Name:** Antwan Sherif Labib
**Role:** Senior Software Engineer
**Team:** Web Platform Atom — Experience Infrastructure Element
**Company:** Trade Republic
**Last Updated:** March 2026 *(mid-probation self-review submitted; updated with security & tooling contributions)*

---

## How to use this log
- Update after anything significant happens on an initiative
- Re-upload to your Claude Project whenever the log changes
- Use it as the basis for performance review chats

---

## Initiative 1: `core-observability` Web Package

**Goal:** Design and implement a unified, vendor-agnostic observability package for all Trade Republic web applications — covering error tracking, logging, and monitoring — to address fragmented observability across teams, high time-to-diagnose for production issues, a release confidence gap (teams had no reliable way to measure the health impact of new releases), and to reduce future migration risk from direct Sentry SDK usage ahead of the LGTM stack transition.

**My Role:** Owned the initiative end-to-end — from RFC authoring (RFC-011) through implementation, documentation, and cross-team rollout support. Assigned in my first week at the company.

**Team / Stakeholders:** Web Platform team; Web-Trading team (pilot) and other web teams as future consumers. Relevant Jira Epic: PTECH-1162. Acting as the SPOC (Single Point of Contact) from Web Platform in the recurring "Experience Infra/Web Trading Sync" meeting, held 3× per week.

**Status:** 🟢 On Track *(RFC-011: COMPLETE — rollout in progress)*

**Key Wins:**
- Authored and drove RFC-011 (Unified Observability Package for Web Applications) from scratch, establishing the architectural direction for the entire web org
- Delivered a production-ready package with full unit and integration test coverage, a sandbox app for testing and validation, comprehensive documentation (installation guide, usage, best practices, troubleshooting, pitfalls, API docs, and config/options reference), and a dedicated MCP server — enabling teams to integrate faster, more reliably, and leverage AI tooling throughout the process
- Proactively created PRs in consumer repos when introducing breaking changes — removing the burden from other teams and reducing friction at rollout
- Successfully onboarded **Web-Trading** as the pilot team — the company's highest-priority and most anticipated web project, targeting an April release
- **Built production-grade observability features into the package:** automatic performance monitoring for Core Web Vitals across routes (with manual span tracking for key user journeys via a `startSpan` function across both Vue and browser adapters), automatic PII scrubbing to strip sensitive user data before it leaves the browser, a Vite plugin that automatically uploads source maps during CI runs (enabling readable stack traces in Sentry without manual steps), and a migration guide with a 1-to-1 mapping from direct Sentry usage to the new package API to reduce adoption friction.
- **Created a Sentry dashboard template** so that teams can kickstart new projects without spending time on dashboard setup from scratch.
- **Iterated on the package API based on consumer feedback:** after initial release, refined the API in response to real-world usage — for example, normalising `sampleRate` to a standard 0–1 range to match developer expectations and reduce misconfiguration risk.
- **Improved shared monorepo practices:** updated the `web-core` repository README with SonarCloud configuration instructions for new packages — reducing onboarding friction for any engineer adding a package in future, beyond just the observability work.
- **Identified an improvement opportunity from a consumer integration pattern**: when reviewing Web-Trading's first integration PR, noticed they had added a custom wrapper around the package to filter out noise errors. Rather than leaving this as a per-team workaround, proposed and implemented this error filtering logic natively inside `core-observability` — meaning all future host applications get this out of the box, without extra boilerplate, custom logic, or additional testing burden. Aligned with all concerned parties that this will also be supported in the future LGTM stack migration. Currently preparing a follow-up PR to Web-Trading to migrate them to the new built-in functionality.

**Challenges Overcome:**
- Ramped up on a complex, cross-cutting domain within the first week of joining the company — required fast self-onboarding and proactive stakeholder engagement
- **New to the observability domain at Trade Republic:** Joined with no prior context on how observability was set up or used across the company — required proactive discovery into existing practices, Sentry's platform and APIs, and the broader architectural direction before being able to design a credible solution.
- Managed breaking changes across multiple web team repos without blocking their work, by handling migration PRs directly rather than delegating
- **Vue plugin signature breaking change**: a code review by Mohamed on `core-analytics` surfaced that the Vue plugin signature didn't follow the standard Vue plugin authoring convention. Recognised that fixing this in `core-analytics` alone would create inconsistency with `core-observability`. Took the discussion offline to Slack, aligned with the team and tech lead that despite being a breaking change, it was the right call. Implemented the fix in both packages, opened a PR in the Web-Trading repo covering all necessary changes, and aligned with the staff engineer who had done the original integration as well as product owners Max and Christian — ensuring everyone was informed before the change landed.

**Decisions I Made:**
- Chose to evaluate and move away from existing vendor (Sentry) where appropriate, prioritising capability fit and cost efficiency over convenience of the status quo
- Decided to write a detailed runbook alongside the package to improve developer experience and reduce future support burden
- Decided to absorb the Vue plugin signature breaking change proactively across both packages rather than deferring it — reasoning that consistency now is cheaper than divergence later
- Decided to internalise Web-Trading's error filtering workaround into the package itself, improving the integration experience for all future consumers rather than leaving it as a per-team concern
- **Technology scope decision (RFC/Discovery phase):** Collected feedback from the PO, TL, and team to determine which environments to support in the first phase and beyond, cross-referencing with technologies already in use across the company. The outcome was to support both browser (vanilla JS/TS) and Vue 3 — covering the two primary web surfaces at Trade Republic
- **Single-package architecture:** Designed the package to expose Vue plugin, browser functions, and a Vite plugin from a single entry point, using sub-path exports in TypeScript and `package.json`. This ensures host applications only bundle what they actually import (full tree-shaking, smaller bundle sizes), while keeping setup simple — one package to install regardless of the stack. Eliminates version compatibility friction that would arise from managing multiple separate packages
- **Chose MCP server over codemod scripts for migration tooling:** Codemods were considered as an adoption aid during the RFC phase but were ruled out in favour of a dedicated MCP server — offering smarter, context-aware guidance rather than static code transformations.
- **Rejected OpenTelemetry (OTEL) Web SDK in favour of a custom Sentry wrapper:** Evaluated the standard OpenTelemetry Web SDK as an alternative during the RFC phase. Decided against it due to significantly larger bundle size (impacting Core Web Vitals), less mature browser error handling (stack traces, source maps), verbose APIs negatively affecting DX, and complex exporter configuration. A custom wrapper over Sentry was the better fit for the current stage.

**Success Metrics:**
- Package size < 5KB over base Sentry size

**In Progress:**
- Supporting Web-Trading team through to their April release
- Preparing PR to update Web-Trading to use the new built-in error filtering functionality

**Next Steps:**
- Web-Trading release in April — first real-world validation of the package in production

**Links:**
- RFC: RFC-011: Unified Observability Package for Web Applications — https://traderepublic.atlassian.net/wiki/spaces/EI/pages/4764828008/RFC-011+Unified+Observability+Package+for+Web+Applications
- Jira (error filtering implementation): PTECH-27945 — https://traderepublic.atlassian.net/browse/PTECH-27945
- Jira (Web-Trading migration to new logic): PTECH-31545 — https://traderepublic.atlassian.net/browse/PTECH-31545
- Jira: PTECH-1162 — https://traderepublic.atlassian.net/browse/PTECH-1162
- Runbook: Runbook: Using `core-observability` Web Package — https://traderepublic.atlassian.net/wiki/spaces/EI/pages/4893442179/Runbook+Using+core-observability+Web+Package
- Slack Announcement (Web-Trading, first usable release): https://traderepublic.slack.com/archives/C09JYNFGXDG/p1768234899946229
- Sentry Dashboard Template: https://sentry.internal.corp.traderepublic.com/organizations/traderepublic/dashboard/301/?dataset=events&project=412&project=141&project=252&project=139&source=dashboards&statsPeriod=30d

**Impact:**
Designed and delivered the `core-observability` package as the transitive step towards Trade Republic's LGTM migration — providing a vendor-agnostic Sentry wrapper that standardises observability across web applications, eliminating per-team instrumentation overhead. Successfully onboarded Web-Trading as the pilot team, directly supporting their April release, with broader web team adoption to follow.

**IC Framework:**
- **Drives architecture decisions by providing multiple options and tradeoffs** *(IC4)* — RFC-011 evaluated Sentry wrapper vs OpenTelemetry with documented tradeoffs, building on the TL's earlier LGTM discovery (RFC-008)
- **Responsible for the entire lifecycle of the team's code** *(IC4)* — included upfront discovery into Sentry's APIs, platform capabilities, and integration patterns, followed by RFC authoring, implementation, testing, documentation, Sentry dashboard template, and rollout support
- **Takes ownership for team best practices and processes** *(IC4)* — established conventions (PII scrubbing, error classification, tagging standards) for consuming web teams
- **Trusted to always share status with all stakeholders** *(IC4)* — SPOC in cross-team sync 3× per week; proactively managed breaking changes by opening PRs in consumer repos directly
- **Acts as a multiplier** *(IC5)* — runbook, MCP server, dashboard template, and built-in error filtering reduce integration burden for all future consumer teams
- **Drives architectural decisions across teams within the vertical, identifying long-term impact** *(IC5)* — RFC-011 sets the observability direction for the entire web org and serves as the vendor-agnostic transitive layer ahead of the LGTM migration, insulating all web teams from future backend changes without any action required on their part

**Last Updated:** March 2026

---

## Initiative 2: Tracking SDK Web Package (`core-analytics`)

**Goal:** Design and implement a standardised analytics/tracking SDK package for web applications (RFC-014), giving teams a consistent, well-documented way to instrument product analytics across Trade Republic's web surfaces — and migrate away from mParticle following unsustainable cost increases after their acquisition by Rokt.

**My Role:** Owned the initiative end-to-end on the Web side — from RFC authoring (RFC-014) through implementation and documentation — while aligning Mobile Platform, Backend, and Data team representatives throughout. Assigned February 3, 2026.

**Team / Stakeholders:** Cross-functional initiative involving Web, Mobile, Backend, and Data teams. Acting as the SPOC from Web Platform in the recurring "Experience Infra/Web Trading Sync" meeting (3× per week). Also drove continuous alignment across all involved disciplines via a dedicated Slack channel and a weekly sync meeting — answering questions, surfacing open questions, clarifying scope, challenges, and concerns throughout the initiative. Vendor selection (Snowplow to replace mParticle) was driven by the Mobile Platform team, who led the discovery phase. Web followed their recommendation and aligned on the same provider.

**Status:** 🟢 On Track *(RFC-014: COMPLETE — awaiting pilot integration)*

**Key Wins:**
- Delivered a production-ready package with full unit and integration test coverage, sandbox examples (added to the shared web-core sandbox app), comprehensive documentation (installation guide, usage, best practices, troubleshooting, pitfalls, API docs, and config/options reference), and a dedicated MCP server — enabling consuming teams to integrate faster, more reliably, and leverage AI capabilities throughout their workflow
- **Vue plugin with automatic screenview tracking:** The package exposes a Vue plugin that automatically tracks screenview events out of the box, with support for attaching custom metadata to each event when needed — reducing instrumentation boilerplate for consuming teams
- **Ensured consent-first requirement was fully covered in RFC and implementation:** The PRD required that no events are enqueued or sent when user consent is unknown or revoked, and that queued events are purged if consent is withdrawn. Made sure this was reflected in both the RFC design and the implementation, including runtime consent state updates.
- **Validated Snowplow's built-in capabilities against technical requirements:** Confirmed that offline queuing, event batching, and retry are all supported out-of-the-box by Snowplow — de-risking the scope and reducing implementation complexity for the package.
- **Ran an end-to-end POC before building:** verified Snowplow JS SDK integration with the collector endpoint in a throwaway POC, viewing real events in Kafka UI — confirming the data pipeline worked before committing to the implementation.
- **Runtime consent state updates:** beyond the init-time `enabled` flag, implemented the ability for host apps to update tracking consent at runtime — supporting real-world user flows where consent preferences change after the app has already loaded.
- **Global Identity Context:** implemented the ability for host apps to attach `auth_account_id` to all events using Snowplow's global context API — so user identity is automatically associated with every event without requiring per-call instrumentation.
- **Session management parity with mParticle:** configured Snowplow session management to replicate mParticle's session behaviour — ensuring data continuity for the analytics pipeline and a clean migration with no gaps in session-level attribution.
- **Proactively surfaced reliability risks:** identified and raised risks around CORS configuration, batch/payload sizing, and event drops before integration — preventing data loss at scale before it could become a production issue.
- **Prepared test scenarios for the package:** authored a structured set of test scenarios covering the package's key behaviours — giving stakeholders and consuming teams a clear, verifiable reference for what the package does and how it behaves under different conditions (e.g. consent state changes, session handling, event queuing). Ensures confidence in correctness before pilot integration, without requiring stakeholders to read through implementation details.
- **Improved sandbox playground UI for stakeholder demos:** redesigned the sandbox app UI to make the package's behaviour and logic immediately legible to non-engineering stakeholders — enabling interactive walkthroughs of key flows (consent handling, screenview tracking, identity context, event queuing) as a vehicle for discussing the documentation in place and aligning on next steps before pilot integration begins.
- **Led a comprehensive mParticle deprecation impact analysis across all 5 web projects:** to determine whether shutting down mParticle infrastructure could cause production incidents or require emergency migration by other web teams, conducted a code-level analysis across every web project consuming mParticle — `web-trading`, `landing-page-nextgen`, `neon-backoffice`, `people-ops-platform`, and `tr-resolve-core-crm-frontend`. The analysis covered the full event pipeline: SDK initialisation and event collection in the browser, the custom CNAME proxy (`mp.traderepublic.com`), and mParticle's server-side processing — assessing each project's resilience to infrastructure shutdown at each layer. **Conclusion: deprecation is safe across all 5 projects, with no risk of runtime errors or user-facing impact.** This finding directly unblocks the Web Platform team's migration to `@traderepublic/core-analytics` without requiring emergency coordination across web teams. Two projects (`neon-backoffice`, `people-ops-platform`) were flagged for weaker safety patterns — relying on mParticle SDK internals rather than application-level guards — documented as a known risk but not a blocker. Findings were documented across 6 plan files for team reference and communication.

**Challenges Overcome:**
- **Vue plugin signature fix** (shared with core-observability): Mohamed's code review identified a non-standard Vue plugin signature in `core-analytics`. Addressed the fix across both packages in a coordinated way — see Initiative 1 for full detail.
- **Dropped dual-write in favour of a clean Snowplow migration:** The RFC originally included a temporary dual-write to both mParticle and Snowplow for parity validation. After aligning with Web team POs and TLs, determined there was no need to continue mParticle tracking — allowing a direct cutover to Snowplow and avoiding the added complexity of dual-write entirely.
- **New to the analytics domain at Trade Republic:** Joined with no prior context on how analytics and tracking were instrumented across web applications — required upfront discovery into existing practices, mParticle usage patterns, and the company's data pipeline before being able to design and author RFC-014.
- **Cross-platform RFC alignment:** Before drafting RFC-014, reviewed 6–8 Mobile Platform RFCs to ensure the Web solution followed the same structure and patterns as Mobile — requiring significant upfront research to avoid divergence across platforms.

**Decisions I Made:**

**In Progress:**
- Waiting on backend collector endpoint implementation before integration can proceed
- Sandbox playground improvements and test scenarios complete — ready to support stakeholder walkthroughs and documentation review sessions ahead of pilot

**Next Steps:**
- Verify behaviour of event queue purging when `enabled` flag is set to off (consent revoked)
- Identify and onboard the first web project for pilot integration — aligned with PO and TL
- Publish runbook
- Slack announcement to consuming teams

**Links:**
- RFC: RFC-014: Analytics Package for Web Applications — https://traderepublic.atlassian.net/wiki/spaces/EI/pages/4982702096/RFC-014+Analytics+Package+for+Web+Applications
- Jira: PTECH-12542 — https://traderepublic.atlassian.net/browse/PTECH-12542

**Impact:**
Delivered the `core-analytics` package as Trade Republic's standard for web analytics — replacing direct mParticle usage and migrating to Snowplow following mParticle's unsustainable cost increases. The package gives all web teams a single, consent-first integration point for analytics, with automatic screenview tracking and a clean migration path. Test scenarios and an improved sandbox playground UI are now in place to support stakeholder walkthroughs and documentation review. Conducted a full mParticle deprecation impact analysis across all 5 web projects — concluding that shutdown is safe with no production risk, directly unblocking the migration without emergency coordination. Awaiting backend collector endpoint before broader rollout.

**IC Framework:**
- **Responsible for the entire lifecycle of the team's code** *(IC4)* — included discovery into Snowplow's platform and APIs, reviewing 6–8 Mobile Platform RFCs to ensure Web alignment, RFC authoring, implementation, testing, documentation, rollout preparation, and mParticle deprecation impact analysis across all web projects
- **Designs and implements systems addressing privacy and compliance concerns** *(IC4)* — consent-first design enforces the consent contract at the package level (no events sent until consent is granted, queued events purged on withdrawal, runtime updates supported) — each team still evaluates and passes consent state, but the package ensures correct behaviour once they do
- **Trusted to always share status with all stakeholders** *(IC4)* — SPOC in cross-team sync 3× per week; drove continuous alignment across Web, Mobile, Backend, and Data via dedicated Slack channel and weekly sync; improved sandbox UI to enable interactive stakeholder walkthroughs of package behaviour and documentation review
- **Acts as a multiplier** *(IC5)* — MCP server, comprehensive documentation, built-in consent handling, structured test scenarios, improved sandbox playground, and the deprecation impact analysis (documented across 6 plan files) all reduce integration burden and build confidence for all future consumer teams
- **Identifies risks others may miss** *(IC4)* — mParticle deprecation analysis flagged the weaker safety patterns in `neon-backoffice` and `people-ops-platform` (SDK-internal reliance rather than application-level guards) and documented them as known risks before migration proceeds — preventing a potential blind spot from becoming a production incident
- **Drives architectural decisions across teams within the vertical, identifying long-term impact** *(IC5)* — reviewed 6–8 Mobile Platform RFCs before drafting RFC-014 to proactively ensure Web/Mobile architectural alignment, preventing platform divergence before it could arise; deprecation analysis unblocks the migration for the entire web org without requiring emergency coordination

**Last Updated:** March 2026 *(updated — test scenarios, sandbox playground UI improvements, and mParticle deprecation impact analysis added)*

---

## Initiative 3: Team Roadmap Contributions

**Goal:** Shape the Web Platform team's technical direction by originating and championing roadmap proposals — including an Experimentation Platform, standardised i18n/l10n, and AI/LLM usage guidelines.

**My Role:** Originator and proposer. All three roadmap topics were my own ideas, brought forward for team consideration and roadmap inclusion.

**Team / Stakeholders:** Web Platform team (product owner and tech lead currently reviewing proposals); broader engineering org as eventual beneficiaries.

**Key Wins:**
- Originated three substantive roadmap proposals within the first months of joining:
  - **Experimentation Platform** — proposal for a fully-fledged, first-class platform to support A/B and feature experiments across web
  - **i18n/l10n standardisation** — proposal to unify internationalisation and localisation practices across web apps
  - **AI/LLM usage standardisation** — proposal to create templates and guidelines for consistent, safe use of AI/LLMs in web development workflows

**Challenges Overcome:**
- Proposals are pending decision between product owner and tech lead — outside of my direct control at this stage

**Decisions I Made:**

**In Progress:**
- PO and TL actively discussing and evaluating priorities against needs from other teams; roadmap decision pending

**Next Steps:**
- Awaiting roadmap decision; ready to lead or contribute to any that get greenlit

**Links:**
- Figma: Web Platform — Roadmap Session — https://figma.com/board/KQF8SBQDa1JWdTGm1zrhJY/Web-Platform--Roadmap-Session?t=IDOHN44grVFbYbrC-0

**Impact:**
Originated three roadmap proposals within the first months of joining — expanding the team's thinking beyond current delivery into longer-term platform investments. Each proposal identified a real gap (experimentation, i18n/l10n, AI/LLM usage) with a concrete solution direction. Outcome pending roadmap decision.

**IC Framework:**
- **Provides meaningful feedback on the roadmap for their team** *(IC4)* — went beyond feedback by originating proposals independently, not just responding to existing ones
- **Identifies problems that need to be solved and advocates for their prioritization** *(IC4)* — each proposal was grounded in a specific pain point with a rationale for why it matters

**Last Updated:** March 2026

---

## Initiative 4: RFC Reviews — Web Platform

**Goal:** Maintain high technical quality and cross-team alignment on Web Platform architecture decisions by actively reviewing and providing feedback on team RFCs.

**My Role:** Reviewer and technical contributor across multiple RFCs authored by teammates.

**Team / Stakeholders:** Web Platform team; engineering teams affected by each RFC.

**Status:** 🟢 On Track

**Key Wins:**
- Reviewed three significant RFCs, contributing to platform-wide decisions:
  - **RFC-013** — Micro Web Apps Foundations: CLI
  - **RFC-015** — Migration from Sentry to LGTM Stack for Observability *(notably relevant given my ownership of the observability package — brought direct, hands-on context to the review)*
  - **RFC-016** — Feature Flag Package for Web Apps *(the feature flags initiative has since been kicked off, partly informed by this RFC)*
- **Reviewed the `core-feature-flags` implementation PR** (the RFC-016 implementation), contributing substantive feedback across naming, API design, developer experience, risk, and test quality — all adopted:
  - **Package naming:** flagged that `core-feature-flag` (singular) may need renaming if the package expands to cover A/B experiments in future — suggested `core-feature-flags` to avoid future ambiguity. Plural naming adopted.
  - **TTL configuration risk:** identified that exposing both `staleTTL` and `swrTTL` as consumer-configurable fields introduces hard-to-detect footguns — specifically, the risk of leaking in-development features to users if misconfigured when streaming is disabled.
  - **Unnecessary type export:** questioned whether exporting composable return types (`UseFeatureFlagReturn`, `UseFeatureValueReturn`) adds value given TypeScript infers them automatically at the call site. Author agreed and removed the exports.
  - **Boolean flag DX:** proposed adding `on`/`off` named slots to the `FeatureFlag` Vue component — since the majority of flags are boolean, this removes repetitive conditional wrapper logic from every consuming app.
  - **Test quality:** suggested abstracting repeated test setup into a shared helper function, and consolidating a redundant test case with an existing one — both adopted.

**Challenges Overcome:**

**Decisions I Made:**

**In Progress:**
- Ongoing as new RFCs are published

**Next Steps:**

**Impact:**
Contributed technical review and feedback across three significant platform RFCs — CLI tooling, observability migration, and feature flags. Brought direct, hands-on context to RFC-015 given ownership of the observability package. The feature flags initiative (RFC-016) subsequently kicked off, partly informed by this review.

**IC Framework:**
- **Actively participates in code review and ensures best practices are followed** *(IC4)* — provided substantive implementation-level feedback on `core-feature-flags`: naming, API surface, type exports, DX, risk, and test quality — all adopted
- **Drives architecture decisions by providing multiple options and tradeoffs** *(IC4)* — RFC reviews are an active contribution to architectural direction, not passive sign-off; implementation reviews extend this to the code level
- **Contributes to major architectural decisions within their vertical** *(IC4)* — all three RFCs have vertical-wide impact across the web org
- **Identifies risks others may miss** *(IC4)* — flagged the `staleTTL`/`swrTTL` footgun risk in `core-feature-flags`: a misconfiguration that could silently leak in-development features to users if streaming is disabled

**Last Updated:** March 2026

---

## Initiative 5: Experience Infrastructure — Platform Vision Workshop

**Goal:** Define a shared technical vision for the Experience Infrastructure element to accommodate Trade Republic's growth from 11M to 30M customers by end of 2027. The workshop aimed to surface high-impact initiatives and identify current pain points and risks across the element's web and app surfaces.

**My Role:** Active participant and ideas contributor. Proposed 6 initiative ideas and identified 3 current pain points/risks.

**Team / Stakeholders:** All engineers across the Experience Infrastructure element; Bradley (Product Owner / Project Manager for Experience Infrastructure); Max (Engineering Director). Attendees spanned multiple atoms including Web Platform (my team).

**Key Wins:**
- Contributed 6 initiative proposals, each with a defined impact rationale:
  - **Automated E2E Tests CLI** *(Impact: 4/4)* — A CLI tool that auto-generates E2E test scenarios for new code locally, catching regressions as early as PR creation time without treating testing as an afterthought
  - **Self-Service Developer Portal** *(Impact: 3/4)* — An internal marketplace for engineers to discover APIs, package docs, and MCP servers — reducing async communication overhead and making best practices accessible by default
  - **Automated Translations** *(Impact: 4/4)* — Turns localisation from a manual engineering bottleneck into a self-service utility: integrates with Figma, supports versioning and author history, uses AI for context-aware suggestions, scans for hard-coded strings, and enables instant global content updates without a full redeploy — designed for extreme scalability when entering new markets
  - **In-house Replacement for 3rd-party Services (e.g. Growthbook)** *(Impact: 4/4)* — Build a cached mirror or full replacement for unstable 3rd-party dependencies to ensure higher availability and eliminate long-term licensing costs
  - **Technologies & Frameworks Unification** *(Impact: 4/4)* — Standardise on a converged framework stack (Vue vs React, Vite vs Nuxt, routing/fetching/caching libraries, mono-repo vs micro-frontend architecture) to reduce cognitive load and provide a "Golden Path" — estimated to free up 60% more engineering time for business logic over infrastructure
  - **Web Dev Tools** *(Impact: 4/4)* — Tooling to toggle error states, test data, and complex user journeys in staging — accessible to PMs and QA, not just engineers — enabling quality verification much earlier in the release cycle
- Also surfaced 3 current pain points and risks for the element:
  - Dependency on unstable 3rd-party systems (e.g. Growthbook) — affecting all Web and Apps
  - Unhandled API response edge cases (e.g. missing fields from BE bugs or bad A/B experiment values) — affecting all Web and Apps
  - Excessive cognitive load around architecture and framework choices (monorepo vs monolith, Vue vs React, Nuxt vs Vite, state/fetching/caching libraries) — increases friction when engineers switch teams and adds ongoing maintenance burden across web apps

**Challenges Overcome:**

**Decisions I Made:**

**In Progress:**
- Proposals are part of the broader workshop output; roadmap decisions pending

**Next Steps:**

**Links:**
- Figma: Experience Infrastructure — Platform Vision Workshop — https://www.figma.com/board/uBjMHrGwEsWhdKiauV42OQ/Experience-Infrastructure--Platform-Vision-Workshop?node-id=163-1099&t=yjPnamNHH3GEV6q6-0

**Impact:**
Contributed 6 initiative proposals and 3 pain point identifications to the element-wide vision workshop targeting growth from 11M to 30M customers by end of 2027, spanning automated AI-driven E2E test generation via CLI/CI, translations, framework unification, and developer tooling. Proposals are part of the broader workshop output feeding into roadmap decisions.

**IC Framework:**
- **Identifies problems that need to be solved and advocates for their prioritization within their vertical** *(IC4)* — surfaced 3 concrete pain points with cross-team impact, including Growthbook instability and architecture cognitive load
- **Impacts strategy and technology for the entire team and between teams** *(IC4)* — proposals span multiple atoms within the Experience Infrastructure element
- **Lead by example and creates initiatives within their team, even outside their core expertise** *(IC4)* — contributed ideas across testing, translations, tooling, and framework standardisation, well beyond immediate delivery scope
- **Helps define technical roadmaps and vision for long-term projects** *(IC4)* — proposals were shaped around a specific 2-year growth target, not abstract ideas

**Last Updated:** March 2026

---

## Initiative 6: Knowledge Sharing & Community Enablement

**Goal:** Raise the technical bar across web teams by sharing learnings, tooling improvements, and community opportunities — beyond the scope of any single initiative.

**My Role:** Self-initiated contributor. All items below were shared unprompted in the `#experience-infra-web` Slack channel.

**Team / Stakeholders:** Experience Infrastructure web engineers.

**Status:** 🟢 Ongoing

---

### Entry: Git `--update-refs` — Stacked PR Workflow Tip
**Date:** March 10, 2026
Shared Git's `--update-refs` feature as a solution to a stacked PR bottleneck pain point raised at the Vision Workshop. Also surfaced a custom Claude command from the internal `tr-ai-kit` repo (PR #6) that wraps the workflow for faster adoption.

---

### Entry: VueJS Amsterdam Conference — Team Awareness & Group Ticket Coordination
**Date:** March 9, 2026
Flagged an upcoming VueJS Amsterdam conference featuring Evan You and other core Vue/Nuxt team members. Proactively gauged team interest to explore group discounts (5+ attendees).

---

### Entry: Updated `Claude.md` in `core-web` Repo — AI Tooling Best Practices
**Date:** March 6, 2026
Revisited and updated the shared `Claude.md` file governing AI-assisted workflows across all web engineers. Changes based on recent AI research, documented with rationale. Shared in `#experience-infra-web` and cross-linked to `#community-ai-coding`, explicitly inviting feedback from all repo maintainers.

---

**Last Updated:** March 2026

---

## Initiative 7: Security Vulnerability Remediation — `web-core`

**Goal:** Identify and remediate high-severity security vulnerabilities in the `web-core` monorepo flagged by Dependabot — maintaining the security baseline of the shared platform that all web teams depend on.

**My Role:** Self-initiated. Triaged and resolved the vulnerabilities directly, without being assigned.

**Team / Stakeholders:** All web teams consuming `web-core`.

**Status:** 🟢 Complete

**Key Wins:**
- **Resolved 2 high-severity Dependabot vulnerabilities** in `web-core` (PR #862) — directly reducing security exposure across all web applications built on the shared platform

**Decisions I Made:**
- Treated shared platform security as part of platform ownership — didn't wait for the issue to be assigned or escalated

**Links:**
- PR #862 (vulnerability fixes): https://github.com/traderepublic/web-core/pull/862

**Impact:**
Proactively resolved 2 high-severity security vulnerabilities in `web-core` — the shared monorepo underpinning all Trade Republic web applications — without being asked, reducing security exposure across the entire web platform.

---

## Initiative 8: Claude Command — Automated Vulnerability Remediation (`web-core`)

**Goal:** Systematise the process of triaging and fixing Dependabot security vulnerabilities in `web-core` by packaging the remediation workflow into a reusable Claude command — reducing future toil and enabling any engineer to handle vulnerability alerts consistently.

**My Role:** Self-initiated. Designed and contributed the command to the shared `web-core` repo immediately after completing the security fixes in Initiative 7.

**Team / Stakeholders:** All engineers working in the `web-core` monorepo.

**Status:** 🟢 Complete

**Key Wins:**
- **Created a reusable Claude command** that encapsulates the vulnerability triage and fix workflow — so any engineer can address future Dependabot alerts faster and more consistently, without needing to figure out the process from scratch each time
- **Contributed directly to the shared repo** (PR #863), making the command immediately available to the whole team

**Links:**
- PR #863 (Claude command): https://github.com/traderepublic/web-core/pull/863

**Impact:**
Converted a one-off security remediation into a permanent, reusable workflow for the team. Every future Dependabot alert in `web-core` can now be handled faster and more consistently — compounding the value of the original fix across all future incidents.

---

## Performance Review Notes

- Joined Trade Republic in December 2025 and was immediately trusted with a high-visibility, cross-team technical initiative (core-observability) — demonstrating strong onboarding and fast ramp-up
- Consistently shown proactivity in cross-team support: creating PRs in consumer repos rather than leaving migration work to other teams
- Strong documentation culture: authored RFCs, runbooks, and Slack announcements to ensure work is discoverable and adoptable beyond the immediate team
- Participated in the "Experience Infrastructure — Platform Vision Workshop" (2027 vision, 11M → 30M customers target), contributing 6 initiative proposals and 3 pain point/risk identifications.

---

### TR Principles — Self-Assessment (Mid-Probation, March 2026)

**Everyday is day one** *(Above)*
Both core-observability and core-analytics were new domains when I joined. Rather than waiting for context to come to me, I proactively discovered existing practices, reviewed prior RFCs, and ran POCs before committing to any design direction.

**Be an owner** *(Above)*
Ownership means the work isn't done when the code is merged — it's done when the consuming team is unblocked and the outcome is delivered. Absorbed the Vue plugin breaking change across both packages and opened migration PRs directly in consumer repos. Identified Web-Trading's noise-error workaround and internalised it natively into core-observability. SPOC in cross-team sync 3× per week throughout both initiatives.

**Amp it up** *(Above)*
RFC-011 and RFC-014 both shipped with MCP servers, sandbox examples, and comprehensive docs — none were in the brief, all reduce the integration cost for every future consumer. Flagged the TTL misconfiguration footgun in core-feature-flags. Internalised Web-Trading's noise-error workaround natively. Proposed 3 roadmap initiatives and contributed 6 proposals to the platform vision workshop — all self-initiated.
