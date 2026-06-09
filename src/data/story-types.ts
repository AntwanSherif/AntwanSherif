// Shared story types. Types are not sensitive, so they live in the public repo and are
// imported by both the public card data and the private detail data (in the submodule).

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

// PUBLIC — rendered on the un-gated /stories list cards (and reused in the detail hero).
// Keep this to teaser fields only: impact + brief description, no narrative.
export type StoryCardData = {
  slug: string;
  company: string;
  initiative: string;
  subtitle: string;
  tagline: string;
  metrics: Metric[];
  techTags: string[];
};

// PRIVATE — lives in the stories-private submodule, only rendered on the gated
// /stories/[slug] detail pages. Never import this into the public list page.
export type StoryDetail = {
  role: string;
  period: string;
  problem: string;
  architectureFlow?: FlowStep[];
  uiSections?: UiSection[];
  features?: Feature[];
  bulkUploadFlow?: FlowStep[];
  challenges?: string[];
  star?: StarStory;
};
