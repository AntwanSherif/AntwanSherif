// Private story detail content lives in a submodule (src/data/stories-private).
// This wrapper keeps the import path "@/data/story-details" stable. ONLY the gated
// /stories/[slug] page should import this — never the public /stories list page.
export * from "./stories-private/details";
