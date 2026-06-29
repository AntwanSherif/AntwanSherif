// Pure, isomorphic taxonomy primitives shared by the client (analytics.ts)
// and server (umami-server.ts) channels. No window/server-only references here.

/** Bump when the event schema changes incompatibly. Injected into every event by the send layer. */
export const TAXONOMY_VERSION = 1;

/** The cross-content spine dimension present on every event. */
export type ContentType = "home" | "project" | "story" | "talk" | "blog" | "contact" | "nav" | "cv";

/** Destination class for outbound/contact — powers the audience (engineer vs recruiter) split. */
export type OutboundCategory = "code" | "professional" | "social" | "content" | "other";

/** The homepage's named sections, in DOM order (drives section_view + the churn funnel). */
export type HomeSection =
  | "hero" | "about" | "work" | "education" | "skills" | "talks" | "projects" | "contact";

export const HOME_SECTIONS: HomeSection[] = [
  "hero", "about", "work", "education", "skills", "talks", "projects", "contact",
];
