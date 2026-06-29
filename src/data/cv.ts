// Single source of truth for the /cv page. All 8 visual variants consume this
// data — never hardcode CV content inside a variant component.
//
// Content is locked (reviewed line-by-line with the candidate). Edits here
// propagate to every variant. Tuned for AI / Product Engineer roles, with the
// summary's closing paragraph aimed at customer-facing / forward-deployed work.

export type CVLink = {
  label: string;
  href: string;
  // short display value (e.g. "antwansherif.com" without the protocol)
  display: string;
};

export type CVBulletGroup = {
  // optional sub-heading within a role (e.g. "Growth & Revenue")
  heading?: string;
  bullets: string[];
};

export type CVExperience = {
  company: string;
  role: string;
  start: string; // display string, e.g. "Dec 2025"
  end: string; // display string, e.g. "Apr 2026" or "Present"
  // one-line context about the company
  context: string;
  // optional status badge next to the company (e.g. "Acquired ’24")
  tag?: string;
  tagTone?: "neutral" | "success" | "amber";
  groups: CVBulletGroup[];
};

export type CVSkillGroup = {
  category: string;
  items: string[];
};

export type CVProject = {
  name: string;
  // e.g. "Solo Founder" or "Freelance"
  role?: string;
  href?: string;
  // short status badge shown next to the title (e.g. "In development",
  // "Acquired ’24"). tagTone selects the badge color.
  tag?: string;
  tagTone?: "neutral" | "success" | "amber";
  description: string;
  tech: string[];
};

export type CVEntry = {
  // generic list entry used for recognition, leadership, training
  title: string;
  detail?: string;
};

export type CVLanguage = {
  language: string;
  level: string;
};

// Section headings live in data (not hardcoded) so they're editable in the
// in-place editor and travel with the "Copy data JSON" export.
export type CVLabels = {
  summary: string;
  experience: string;
  projects: string;
  skills: string;
  recognition: string;
  leadership: string;
  training: string;
  languages: string;
  education: string;
};

// One education credential (degree, diploma, program). Rendered in list order.
export type CVEducationEntry = {
  title: string;
  detail: string;
};

export type CVData = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  links: CVLink[];
  labels: CVLabels;
  summary: string[];
  experience: CVExperience[];
  skills: CVSkillGroup[];
  projects: CVProject[];
  recognition: CVEntry[];
  leadership: CVEntry[];
  training: CVEntry[];
  languages: CVLanguage[];
  // Ordered list of credentials (most recent first).
  education: CVEducationEntry[];
};

// === CV-DATA-START (the block below is regenerated when you click
// "Save to cv.ts" in /cv/edit — keep these sentinel comments intact) ===
export const CV: CVData = {
  "name": "Antwan Sherif Labib",
  "title": "Senior Software Engineer · AI & Product",
  "location": "Berlin, Germany",
  "email": "antwansherif@gmail.com",
  "phone": "(+49) 015207282272",
  "links": [
    {
      "label": "Portfolio",
      "href": "https://antwansherif.com",
      "display": "antwansherif.com"
    },
    {
      "label": "LinkedIn",
      "href": "https://linkedin.com/in/antwansherif",
      "display": "antwansherif"
    },
    {
      "label": "GitHub",
      "href": "https://github.com/AntwanSherif",
      "display": "AntwanSherif"
    }
  ],
  "labels": {
    "summary": "Summary",
    "experience": "Work Experience",
    "projects": "Side Projects",
    "skills": "Skills",
    "recognition": "Recognition",
    "leadership": "Leadership",
    "training": "Training",
    "languages": "Languages",
    "education": "Education"
  },
  "summary": [
    "Senior engineer and React Subject Matter Expert with 10+ years building revenue-critical, user-facing systems and developer tooling across multi-market platforms — shipping monetization features (**+18% AOV**, **+12% add-to-cart**) at *Flink* and platform SDKs adopted across the web org at *Trade Republic* (**11M customers**).",
    "AI-native by practice: builds MCP servers, custom Claude commands and skills, and eval-driven AI tooling — shipping AI products end-to-end with the *Vercel Agent Stack*.",
    "Bridges product thinking with engineering craft — scalable frontend architecture, AI tooling, developer experience, mentorship, and translating technical decisions into business outcomes."
  ],
  "experience": [
    {
      "company": "Trade Republic",
      "role": "Senior Software Engineer (Web Platform)",
      "start": "Dec 2025",
      "end": "Apr 2026",
      "context": "Europe's largest savings & investing platform · 11M+ customers across 18 markets",
      "groups": [
        {
          "heading": "Platform SDKs — Vendor Abstraction & Cost Reduction",
          "bullets": [
            "Designed and built a GDPR-compliant *Analytics SDK* to replace an unsustainable **€1M/year** vendor contract; conducted a full deprecation impact analysis across all 5 web projects confirming zero production risk, directly unblocking the migration.",
            "Designed and delivered a vendor-agnostic *Observability SDK* setting the standard for the entire web org — with PII scrubbing, Core Web Vitals monitoring, automated source map uploads, and a dedicated MCP server; piloted with Web-Trading (the highest-priority web project) as proof of concept, then adopted across the web org."
          ]
        },
        {
          "heading": "AI Tooling & Developer Experience",
          "bullets": [
            "Packaged the Dependabot vulnerability remediation workflow into a reusable Claude slash command — adopted across all Web teams, turning a multi-step manual remediation into a **<3-minute, one-command fix**.",
            "Built MCP servers for both *Observability* & *Analytics* SDKs, enabling engineers to integrate without reading docs — collapsing a docs-heavy setup into same-day integration."
          ]
        }
      ]
    },
    {
      "company": "Flink SE",
      "role": "Senior Software Engineer",
      "start": "Apr 2023",
      "end": "Nov 2025",
      "context": "On-demand grocery delivery across Germany, the Netherlands & France",
      "groups": [
        {
          "heading": "Growth & Revenue",
          "bullets": [
            "Led frontend architecture and rollout of key monetization initiatives, including Range Promotions (**+18% AOV**, **+12% add-to-cart**), Max Discount Quantity (**+5% AOV**), and Next Day Delivery (**+9% AOV**).",
            "Owned checkout and auth flows end-to-end (**25k+ web DAU**) — delivering multiple UX improvements with zero production regressions."
          ]
        },
        {
          "heading": "Business & Operational Enablement",
          "bullets": [
            "Owned and scaled *PRISM* (Pricing & Promotions Backoffice platform), cutting configuration time (**~2 days → ~2 hours**), enabling faster experimentation and in-housing key CommerceTools features."
          ]
        },
        {
          "heading": "Mentorship & Culture",
          "bullets": [
            "Mentored 2 engineers — improving their debugging skills and enabling independent feature ownership."
          ]
        }
      ]
    },
    {
      "company": "Shore GmbH",
      "role": "Senior Frontend Engineer",
      "start": "Nov 2021",
      "end": "Nov 2022",
      "context": "B2B SaaS digitizing local service businesses across Europe · acquired by group.one (2024)",
      "groups": [
        {
          "heading": "Performance & Optimization",
          "bullets": [
            "Led cross-functional root-cause analysis and implemented progressive loading — reducing initial page load (**5s → 400ms**), significantly improving perceived performance and scalability."
          ]
        },
        {
          "heading": "Modernization & Architecture",
          "bullets": [
            "Migrated legacy Elm micro-frontends to React/TypeScript with the frontend team — having learned Elm from scratch in 5 days to build the take-home that landed the role.",
            "Introduced Cypress E2E coverage, improving release confidence and reducing regressions."
          ]
        }
      ]
    },
    {
      "company": "Vodafone Intelligent Solutions (VOIS)",
      "role": "Senior Frontend Engineer",
      "start": "Jan 2018",
      "end": "Oct 2021",
      "context": "Vodafone Group's technology & digital-transformation arm · 28 countries",
      "groups": [
        {
          "heading": "Product & Engineering",
          "bullets": [
            "Built the *Product Selector* — a consumer self-service app used by **2M+ customers** across all Vodafone Turkey retail stores.",
            "Modernized the legacy Vodafone Kabel DE sales-agent app to React/TypeScript.",
            "Modernized Vodafone's global device-management app to React Native — used internally across all Vodafone markets."
          ]
        },
        {
          "heading": "Mentorship & Enablement",
          "bullets": [
            "Mentored 2 engineers and ran a full-day React training workshop for 18 engineers plus an Automated Testing knowledge-sharing session — curriculum built from scratch."
          ]
        },
        {
          "heading": "Hiring & Team Building",
          "bullets": [
            "Led frontend engineering hiring end-to-end — screened and interviewed 100+ candidates across headhunting, take-home exercise design and scoring."
          ]
        }
      ]
    },
    {
      "company": "United Ofoq",
      "role": "Frontend Engineer",
      "start": "Jul 2016",
      "end": "Dec 2017",
      "context": "",
      "groups": [
        {
          "bullets": [
            "Built a zero-code workflow automation platform — an early take on what tools like n8n later popularized — plus a shared component library; delivered UI/UX prototypes to speed product validation."
          ]
        }
      ]
    }
  ],
  "skills": [
    {
      "category": "Frontend",
      "items": [
        "React",
        "Next.js",
        "Vue.js",
        "Nuxt",
        "TypeScript",
        "React Native",
        "Design Systems",
        "TanStack Query"
      ]
    },
    {
      "category": "AI & Developer Tooling",
      "items": [
        "Vercel AI SDK",
        "AI Gateway",
        "MCP servers",
        "Claude",
        "Cursor"
      ]
    },
    {
      "category": "Product & Experimentation",
      "items": [
        "Product analytics",
        "Feature flagging",
        "A/B testing"
      ]
    },
    {
      "category": "Automated Testing",
      "items": [
        "Playwright",
        "Jest",
        "Vitest",
        "Testing Library"
      ]
    },
    {
      "category": "Architecture & Infrastructure",
      "items": [
        "Micro-frontends",
        "Monorepos",
        "CI/CD",
        "NPM package authoring",
        "Performance optimization",
        "Sentry/Datadog"
      ]
    },
    {
      "category": "Backend & APIs",
      "items": [
        "Node.js",
        "Bun",
        "Express",
        "Hono",
        "REST",
        "tRPC",
        "GraphQL"
      ]
    }
  ],
  "projects": [
    {
      "name": "[EncoreShot](http://encoreshot.com/)",
      "role": "Solo Founder",
      "tag": "In development",
      "tagTone": "amber",
      "description": "AI SaaS that scores and culls concert photos & video. Multi-provider vision pipeline (cloud + on-device) with a pre-filter that cuts video inference cost **40–60%**, plus an A/B eval harness that compares prompt and model changes head-to-head before promoting winners.",
      "tech": [
        "React",
        "Bun",
        "Vercel AI SDK",
        "AI Gateway"
      ]
    },
    {
      "name": "HAKTIV",
      "role": "Freelancer",
      "href": "https://haktiv.com",
      "description": "The first bug bounty and crowdsourced pentesting platform in MENA. Since pivoted to AI-powered GRC compliance, backed by Microsoft, Misk, and Plug and Play.",
      "tech": [
        "Next.js",
        "React",
        "TypeScript",
        "TanStack Query"
      ]
    },
    {
      "name": "El Mawkaa",
      "role": "Freelancer",
      "tag": "Acquired ’24",
      "tagTone": "success",
      "description": "B2B construction materials marketplace — 65K downloads, 1,300+ suppliers; a [seven-figure SAR exit](https://www.wamda.com/2024/10/ayen-acquires-elmawkaa-seven-figure-deal).",
      "tech": [
        "React",
        "Firebase",
        "Redux"
      ]
    }
  ],
  "recognition": [
    {
      "title": "React Subject Matter Expert",
      "detail": "Vodafone"
    },
    {
      "title": "Top Performer Employee",
      "detail": "Vodafone"
    }
  ],
  "leadership": [
    {
      "title": "Instructor at #CodeLikeAGirl",
      "detail": "programming for female students aged 14–18"
    },
    {
      "title": "Speaker at [React Cairo](https://antwansherif.com/#talks)",
      "detail": "“Building Great User Experiences with React Query”"
    },
    {
      "title": "Panelist at [Minia Techies](https://antwansherif.com/#talks)",
      "detail": "Career advancement in software engineering"
    },
    {
      "title": "TEDxMinia Organizer"
    }
  ],
  "training": [
    {
      "title": "[AI SDK & AI Engineering](https://www.aihero.dev/cohorts/build-your-own-ai-personal-assistant-in-typescript)",
      "detail": "Matt Pocock"
    },
    {
      "title": "[Epic React](https://www.epicreact.dev/)",
      "detail": "Kent C. Dodds"
    }
  ],
  "languages": [
    {
      "language": "English",
      "level": "Professional"
    },
    {
      "language": "German",
      "level": "A2"
    },
    {
      "language": "Arabic",
      "level": "Native"
    }
  ],
  "education": [
    {
      "title": "Full-Stack Web Development — Information Technology Institute (ITI)",
      "detail": "Post-grad 9-month Program · 2015–2016"
    },
    {
      "title": "Bachelor's Degree in Computer Engineering",
      "detail": "Class 2014 · Very Good with Honors"
    }
  ]
};
// === CV-DATA-END ===
