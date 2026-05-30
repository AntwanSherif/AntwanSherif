import BlurFade from "@/components/magicui/blur-fade";
import { StoryCard } from "@/components/story-card";
import { stories } from "@/data/stories";

const BLUR_FADE_DELAY = 0.04;

export default function StoriesPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] gap-14 py-12">
      <section>
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-section font-semibold tracking-tight text-foreground">
            Stories
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-sm text-muted-foreground mt-2 max-w-prose">
            Initiative deep-dives — the problems I owned, how I approached them,
            and what shipped.
          </p>
        </BlurFade>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((story, i) => (
            <BlurFade key={story.slug} delay={BLUR_FADE_DELAY * (3 + i)}>
              <StoryCard story={story} className="h-full" />
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
