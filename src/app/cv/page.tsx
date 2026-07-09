import type { Metadata } from "next";
import { CV } from "@/data/cv";
import CVDocument from "@/components/cv/cv-document";
import { CvDownload } from "@/components/cv/cv-download";
import { PUBLISHED_CONFIG } from "@/data/cv-config";
import { slugifyCompany } from "@/lib/cv-campaign";

export const metadata: Metadata = {
  title: "Antwan Sherif — CV",
  description: "Curriculum vitae of Antwan Sherif, Senior Software Engineer.",
};

// Public CV page: the chosen design, pinned. Tune the look in the private
// /cv/edit lab and hit "Save to cv.ts" — that writes both the content (cv.ts)
// and the design (cv-config.ts → PUBLISHED_CONFIG), so this page reflects it.

// `?surface=pdf` (used only by the Puppeteer PDF export) stamps utm_medium=pdf on the
// EncoreShot link so the downloaded résumé is attributable apart from the live page (web).
// `?co=<company>` slugifies to utm_campaign=<slug> on own-property links (see cv-campaign),
// so a company-tagged CV/PDF is attributable per outreach. Empty/absent → no campaign.
export default async function CVPage({
  searchParams,
}: {
  searchParams: Promise<{ surface?: string; co?: string }>;
}) {
  const { surface, co } = await searchParams;
  const campaign = co ? slugifyCompany(co) || undefined : undefined;
  return (
    <div className="cv-stage flex min-h-screen items-start justify-center px-4 pt-10 pb-28 sm:pt-14 print:bg-white print:p-0">
      <CvDownload />
      <CVDocument
        data={CV}
        config={PUBLISHED_CONFIG}
        surface={surface === "pdf" ? "pdf" : "web"}
        campaign={campaign}
      />
    </div>
  );
}
