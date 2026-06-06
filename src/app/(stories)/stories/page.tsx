import BlurFade from "@/components/magicui/blur-fade";
import { StoryCard } from "@/components/story-card";
import { stories } from "@/data/stories";

const BLUR_FADE_DELAY = 0.04;

export default function StoriesPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] gap-12 py-12 px-4 max-w-2xl mx-auto">
      <section className="flex flex-col gap-2">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stories</h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-sm text-muted-foreground max-w-prose">
            Not a list of technologies. A few of the initiatives I owned — the ones worth telling properly. Real problems, real decisions, real outcomes.
          </p>
        </BlurFade>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((story, i) => (
            <BlurFade key={story.slug} delay={BLUR_FADE_DELAY * (3 + i)} className="h-full">
              <StoryCard story={story} />
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
