import type { StoryCardData } from './story-types';

// PUBLIC teaser data for the /stories list cards — impact + brief description only.
// The private narrative for each story lives in the submodule (see story-details.tsx).
export const storyCards: StoryCardData[] = [
  {
    slug: 'prism',
    company: 'Flink',
    initiative: 'PRISM',
    subtitle: 'Pricing & Promotions Backoffice',
    tagline: 'Replaced a 2-day ops cycle with a 2-hour self-serve workflow handling 500K–1M+ promotions per day.',
    metrics: [
      { value: '2d → ~2hr', label: 'deploy time' },
      { value: '500K–1M+', label: 'promotions/day' },
      { value: '12-field cap', label: 'bypassed via bulk upload' }
    ],
    techTags: ['React', 'Next.js', 'tRPC', 'TypeScript', 'Playwright']
  },
  {
    slug: 'mdq',
    company: 'Flink',
    initiative: 'MDQ',
    subtitle: 'Maximum Discounted Quantity',
    tagline:
      'Introduced a per-item discount cap to stop bulk order abuse — units beyond the limit revert to full price, driving +5% average order value.',
    metrics: [
      { value: '+5% AOV', label: 'avg order value' },
      { value: '4-yr-old', label: 'cart code refactored' }
    ],
    techTags: ['React', 'Next.js', 'Vue', 'TDD', 'TypeScript']
  },
  {
    slug: 'range-promotions',
    company: 'Flink',
    initiative: 'Range Promotions',
    subtitle: 'Multi-SKU bundle discounts',
    tagline:
      'Enabled multi-SKU bundle promotions (e.g. add Pepsi + Red Bull + Fanta, get 20% off) — shipped across DE, NL, and FR, driving +18% average order value.',
    metrics: [
      { value: '+18% AOV', label: 'avg order value' },
      { value: '3 markets', label: 'DE · NL · FR' }
    ],
    techTags: ['React', 'Next.js', 'Vue', 'TypeScript']
  },
  {
    slug: 'core-observability',
    company: 'Trade Republic',
    initiative: 'Observability Web SDK',
    subtitle: 'Error & performance monitoring',
    tagline:
      'RFC to production in a new domain, week one. 3/5 web teams adopted. The LGTM-stack migration RFC built on top of it.',
    metrics: [
      { value: '3 / 5', label: 'web teams adopted' },
      { value: 'Week 1', label: 'assigned at TR' }
    ],
    techTags: ['Vue', 'TypeScript', 'MCP Server', 'Vite', 'Sentry SDK']
  },
  {
    slug: 'core-analytics',
    company: 'Trade Republic',
    initiative: 'Analytics Web SDK',
    subtitle: 'Consent-first, GDPR-compliant',
    tagline:
      "Replaced a €1M/year vendor contract with a consent-first, GDPR-compliant analytics SDK — adopted across Trade Republic's entire web platform.",
    metrics: [
      { value: '€1M/yr', label: 'vendor cost eliminated' },
      { value: '5 projects', label: 'audited safe to migrate' }
    ],
    techTags: ['Vue', 'TypeScript', 'MCP Server', 'Vite', 'Snowplow']
  }
];

