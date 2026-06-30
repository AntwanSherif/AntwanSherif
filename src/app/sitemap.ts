import type { MetadataRoute } from "next";
import { DATA } from "@/data/resume";

// Only public, indexable, statically-rendered routes belong here.
// Excluded by design: /stories/[slug] + /stories/unlock (password-gated, noindex),
// /cv/edit + /api/* (dev-only), _blog/* (disabled).
const ROUTES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/cv", priority: 0.8 },
  { path: "/stories", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${DATA.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
