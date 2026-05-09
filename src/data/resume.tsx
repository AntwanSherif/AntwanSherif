import { Icons } from '@/components/icons';
import { HomeIcon, NotebookIcon } from 'lucide-react';
import { ReactLight } from '@/components/ui/svgs/reactLight';
import { NextjsIconDark } from '@/components/ui/svgs/nextjsIconDark';
import { Typescript } from '@/components/ui/svgs/typescript';
import { Nodejs } from '@/components/ui/svgs/nodejs';
import { VueIcon } from '@/components/ui/svgs/vue';
import { NuxtIcon } from '@/components/ui/svgs/nuxt';
import { TrpcIcon } from '@/components/ui/svgs/trpc';
import { TanstackQueryIcon } from '@/components/ui/svgs/tanstackQuery';
import { GraphqlIcon } from '@/components/ui/svgs/graphql';
import { VitestIcon } from '@/components/ui/svgs/vitest';
import { JestIcon } from '@/components/ui/svgs/jest';
import { VercelIcon } from '@/components/ui/svgs/vercel';
import { PlaywrightIcon } from '@/components/ui/svgs/playwright';

export const DATA = {
  name: 'Antwan Sherif Labib',
  initials: 'AS',
  url: 'https://antwan.me',
  location: 'Berlin, Germany',
  locationLink: 'https://www.google.com/maps/place/berlin',
  description: 'Senior Software Engineer · React Subject Matter Expert · AI & Developer Tooling',
  summary:
    'Senior Software Engineer and React Subject Matter Expert with 10+ years of experience building scalable web applications across React, Vue, and TypeScript. Led initiatives delivering **+18% AOV**, **+12% add-to-cart** conversion, and significant performance improvements (**5s → 400ms**), while owning critical user journeys end-to-end across multi-market platforms. Bridges product thinking with engineering craft — scalable frontend architecture, AI tooling, developer experience and mentorship.',
  avatarUrl: '/me.png',
  skills: [
    // Frontend
    { name: 'React', icon: ReactLight },
    { name: 'Next.js', icon: NextjsIconDark },
    { name: 'TypeScript', icon: Typescript },
    { name: 'Vue.js', icon: VueIcon },
    { name: 'Nuxt', icon: NuxtIcon },
    // Backend & APIs
    { name: 'Node.js', icon: Nodejs },
    { name: 'tRPC', icon: TrpcIcon },
    // State & Data
    { name: 'TanStack Query', icon: TanstackQueryIcon },
    { name: 'GraphQL', icon: GraphqlIcon },
    // Testing & Quality
    { name: 'Playwright', icon: PlaywrightIcon },
    { name: 'Vitest', icon: VitestIcon },
    { name: 'Jest', icon: JestIcon },
    // AI & Tooling
    { name: 'Vercel AI SDK', icon: VercelIcon },
    { name: 'MCP Servers', icon: undefined },
    // Architecture
    { name: 'Micro-frontends', icon: undefined },
    { name: 'Monorepos', icon: undefined },
    { name: 'CI/CD', icon: undefined }
  ],
  navbar: [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/blog', icon: NotebookIcon, label: 'Blog' }
  ],
  contact: {
    email: 'antwansherif@gmail.com',
    tel: '+49015207282272',
    social: {
      GitHub: {
        name: 'GitHub',
        url: 'https://github.com/AntwanSherif',
        icon: Icons.github,
        navbar: true
      },
      LinkedIn: {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/antwansherif/',
        icon: Icons.linkedin,
        navbar: true
      },
      email: {
        name: 'Send Email',
        url: 'mailto:antwansherif@gmail.com',
        icon: Icons.email,
        navbar: false
      }
    }
  },

  work: [
    {
      company: 'Trade Republic',
      href: 'https://traderepublic.com/en-de',
      badges: [],
      location: 'Berlin, Germany',
      title: 'Senior Software Engineer (Web Platform)',
      logoUrl: '/logos/trade-republic.png',
      start: 'Dec 2025',
      end: 'Present',
      description: `*Europe's largest savings platform — 11M+ customers across 17 markets*\n\n### Platform SDKs — Cost Reduction & Vendor Abstraction\n- Drove GDPR-compliant analytics vendor migration on the web side, replacing a **€1M/year** mParticle contract\n- Created vendor-agnostic observability SDK adopted as the org-wide standard, standardizing error tracking, monitoring, and developer experience\n\n### AI Tooling & Developer Experience\n- Shipped AI tooling alongside both SDKs: context-aware integration guidance and migration help — reducing onboarding friction\n- Systematized security vulnerability remediation into a reusable Claude command — turning a one-off fix into an automated, repeatable team workflow\n\n### Technical Direction & Architecture\n- Authored **2 RFCs** setting observability and analytics architecture\n- Contributed initiative proposals to Web Platform long-term roadmap`
    },
    {
      company: 'Flink',
      badges: [],
      href: 'https://www.goflink.com/en-DE/',
      location: 'Berlin, Germany',
      title: 'Senior Software Engineer',
      logoUrl: '/logos/flink.png',
      start: 'Apr 2023',
      end: 'Nov 2025',
      description: `*Online grocery delivery service operating in Germany, the Netherlands, and France*\n\n### Growth & Revenue Initiatives\n- Led Range Promotions (**+18% AOV**), Segment-based Promotions (**+12% Add-to-Cart**), and Maximum Discounts Quantity (**+5% AOV**)\n- Owned checkout and auth flows serving **25k+ DAU** across DE/NL/FR\n\n### Business & Operational Enablement\n- Built Pricing & Promotions Backoffice, cutting configuration lead time from **~2 days → ~2 hours**\n- In-housed shipping fees and subscriptions management, reducing costs and 3rd-party dependencies\n\n### Engineering Quality & Culture\n- Introduced E2E testing and improved system observability\n- Mentored **2 engineers** with hands-on, structured growth plans\n- Introduced decision logs capturing rationale, trade-offs, and alternatives, improving knowledge sharing and onboarding`
    },
    {
      company: 'Shore',
      href: 'https://www.shore.com/en',
      badges: [],
      location: 'Remote',
      title: 'Senior Frontend Engineer',
      logoUrl: '/logos/shore.png',
      start: 'Nov 2021',
      end: 'Nov 2022',
      description: `*B2B SaaS startup digitizing local service providers across Europe*\n\n### Performance & Optimization\n- Removed performance bottlenecks, reducing initial page load from **5s → 400ms**, significantly improving retention and engagement\n\n### Modernization & Architecture\n- Migrated legacy micro-frontends (Elm) to React/TypeScript, delivering a more maintainable and scalable architecture\n- Introduced Cypress E2E test coverage, improving release confidence and reducing regressions\n- Standardized frontend tooling and practices, improving DX and delivery speed`
    },
    {
      company: 'Vodafone Intelligent Solutions (VOIS)',
      href: 'https://www.linkedin.com/company/vois',
      badges: [],
      location: 'Cairo, Egypt',
      title: 'Senior Frontend Engineer',
      logoUrl: '/logos/vodafone.svg',
      start: 'Jan 2018',
      end: 'Oct 2021',
      description: `*Vodafone Group's partner of choice for talent, technology, and digital transformation across 28 countries*\n\n### Recognition & Leadership\n- Recognized as React Subject Matter Expert and Top Performer — announced company-wide, driving org-wide consulting on React architecture and best practices\n- Led a full-day React training workshop for **~18 engineers**, including hands-on exercises and curriculum designed from scratch\n\n### Product & Engineering\n- Built the Product Selector — a consumer-facing self-service app rolled out across all Vodafone Turkey retail stores, used by **2M+ customers**, improving Lighthouse scores by **+14%**\n- Migrated Vodafone Kabel Deutschland sales agent tooling from legacy stack to React and TypeScript\n- Modernized the global Vodafone back-office app for device management, used internally by all Vodafone stores worldwide\n\n### Hiring & Team Building\n- Led frontend engineering hiring end-to-end — screened and interviewed **100+ candidates** across headhunting, exercise design, submissions review, and scoring`
    },
    {
      company: 'United Ofoq',
      href: 'https://unitedofoq.com/',
      badges: [],
      location: 'Cairo, Egypt',
      title: 'Frontend Engineer',
      logoUrl: '/logos/united-ofoq.png',
      start: 'Jul 2016',
      end: 'Dec 2017',
      description:
        'Built a zero-code workflow management platform and delivered UI/UX prototypes to accelerate product validation time-to-market.'
    },
    {
      company: 'Information Technology Institute (ITI)',
      href: 'https://iti.gov.eg/home',
      badges: [],
      location: 'Cairo, Egypt',
      title: 'Full-Stack Web Developer Intern',
      logoUrl: '/logos/iti.png',
      start: 'Sep 2015',
      end: 'Jun 2016',
      description:
        'Completed a 9-month intensive full-stack web development program. Built multiple web applications and cross-platform mobile apps as part of the training curriculum.'
    }
  ],
  education: [
    {
      school: 'Minia University — Faculty of Engineering',
      href: '',
      degree: "Bachelor's Degree in Computer Engineering — Very Good with Honors",
      logoUrl: '/logos/minia-university.png',
      start: '2009',
      end: '2014'
    }
  ],
  projects: [
    {
      title: 'HAKTIV',
      href: 'https://haktiv.com',
      dates: 'Okt 2020 - Apr 2021',
      active: false,
      description:
        'First bug bounty platform in the Middle East — connecting tech companies with top security researchers to responsibly disclose vulnerabilities.',
      technologies: ['React.js', 'TypeScript', 'React Query'],
      links: [
        {
          type: 'Website',
          href: 'https://haktiv.com',
          icon: <Icons.globe className='size-3' />
        }
      ],
      image: '',
      video: ''
    },
    {
      title: 'Dinney',
      href: '',
      dates: 'Jun 2020 - Oct 2020',
      active: false,
      description:
        'A Restaurant Reservation mobile app that helps clients and restaurant branch managers to reserve/manage reservations according to the partial re-opening rules set by Egyptian government during Covid-19 pandemic',
      technologies: ['Next.js', 'React', 'React Native', 'React Query', 'Material-UI'],
      links: [],
      image: '',
      video: ''
    },
    {
      title: '12AM Thoughts',
      href: '',
      dates: 'Apr 2020 - Aug 2020',
      active: false,
      description:
        'An anonymous online platform built during COVID-19 lockdown — a safe space for people to express thoughts and feelings without judgment, available around the clock.',
      technologies: ['Next.js', 'React', 'Node', 'PWA', 'React Query', 'Draft.js'],
      links: [],
      image: '',
      video: ''
    },
    {
      title: '21Farmer',
      href: '',
      dates: 'Feb 2020 - Jun 2020',
      active: false,
      description:
        'A cloud-based IoT solution that provides data & analytics to farmers to make informed decisions and to enhance land performance and resource utilization.',
      technologies: ['Next.js', 'React', 'Redux', 'Mapbox', 'Material-UI'],
      links: [],
      image: '',
      video: ''
    },
    {
      title: 'ElMawkaa',
      href: '',
      dates: 'Jun 2018 - Jan 2019',
      active: false,
      description:
        'A marketplace platform connecting all stakeholders in the construction and architecture sector from engineers, investors and suppliers in the MENA region. It provides services such as consulting, materials marketplace, etc.',
      technologies: ['React', 'Redux', 'firebase', 'Material-UI'],
      links: [],
      image: '',
      video: ''
    }
  ],
  talks: [
    {
      title: 'Building Great User Experiences with React Query',
      event: 'React Cairo',
      date: 'Dec 2022',
      location: 'Cairo, Egypt',
      description:
        'A talk on leveraging React Query (TanStack Query) to build fluid, data-driven user experiences — covering caching strategies, optimistic updates, and patterns for keeping UI state in sync with server data.',
      images: [
        { src: '/talks/react-query/IMG_2455-01.jpeg', objectPosition: '35% 70%' },
        { src: '/talks/react-query/IMG_2464-01.jpeg', objectPosition: 'center top' },
        { src: '/talks/react-query/IMG_2469-01.jpeg', objectPosition: '30% 15%' },
        { src: '/talks/react-query/20221221_204955-01.jpeg', objectPosition: 'center top' }
      ],
      links: [
        { label: 'Slides', href: 'https://slides.com/antwansherif/building-great-user-experiences-with-react-query/fullscreen' },
        { label: 'GitHub', href: 'https://github.com/AntwanSherif/ux-with-react-query-talk' },
        { label: 'Demo', href: 'https://ux-with-react-query-talk.vercel.app/' }
      ]
    },
    {
      title: 'Career Advancement in Software Engineering',
      event: 'Minia Techies',
      date: 'Nov 2022',
      location: 'Minia, Egypt',
      description:
        'Panelist discussing career growth strategies for software engineers — navigating the path from junior to senior, building a personal brand, and the value of community involvement in accelerating career progression.',
      images: [
        { src: '/talks/career-advancement/1668957708530.jpeg', objectPosition: 'center top' },
        { src: '/talks/career-advancement/1668957708813.jpeg', objectPosition: '55% 95%' },
        { src: '/talks/career-advancement/1668786345212.jpeg', objectPosition: '72% 15%' }
      ],
      links: [] as { label: string; href: string }[]
    }
  ]
} as const;

