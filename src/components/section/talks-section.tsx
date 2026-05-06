import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BLUR_FADE_DELAY = 0.04;

export default function TalksSection() {
  return (
    <div className="flex min-h-0 flex-col gap-y-8">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
          <div className="border bg-primary z-10 rounded-xl px-4 py-1">
            <span className="text-background text-sm font-medium">Talks</span>
          </div>
          <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
        </div>
        <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
          Conference talks and community events I&apos;ve spoken at.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {DATA.talks.map((talk, id) => (
          <BlurFade key={talk.title} delay={BLUR_FADE_DELAY * 14 + id * 0.05}>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Scrollable photo strip */}
              {talk.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto p-3 scrollbar-none">
                  {talk.images.map((image, i) => (
                    <div
                      key={i}
                      className="relative flex-none h-44 w-72 rounded-xl overflow-hidden"
                    >
                      <Image
                        src={image.src}
                        alt={`${talk.title} — photo ${i + 1}`}
                        fill
                        className="object-cover"
                        style={{ objectPosition: image.objectPosition }}
                        sizes="288px"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Talk info */}
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-base leading-snug">{talk.title}</h3>
                    <span className="text-xs font-medium text-[var(--accent-2)] uppercase tracking-wide">
                      {talk.event}
                    </span>
                  </div>
                  {talk.links[0] && (
                    <Link
                      href={talk.links[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-none flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-[var(--accent-2)] transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      Slides
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {talk.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {talk.location}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {talk.description}
                </p>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
