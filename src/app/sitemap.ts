import type { MetadataRoute } from "next";
import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";

// Only public, indexable, statically-rendered routes belong here.
// Excluded by design: /stories/[slug] + /stories/unlock (password-gated, noindex),
// /cv/edit + /api/* (dev-only).
const ROUTES: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/cv", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
  { path: "/stories", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = ROUTES.map(({ path, priority }) => ({
    url: `${DATA.url}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const postRoutes = allPosts.map((post) => ({
    url: `${DATA.url}/blog/${post._meta.path.replace(/\.mdx$/, "")}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
