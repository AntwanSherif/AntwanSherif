import type { Metadata } from "next";
import { CV } from "@/data/cv";
import CVDocument from "@/components/cv/cv-document";
import { PUBLISHED_CONFIG } from "@/data/cv-config";

export const metadata: Metadata = {
  title: "Antwan Sherif — CV",
  description: "Curriculum vitae of Antwan Sherif, Senior Software Engineer.",
};

// Public CV page: the chosen design, pinned. Tune the look in the private
// /cv/edit lab and hit "Save to cv.ts" — that writes both the content (cv.ts)
// and the design (cv-config.ts → PUBLISHED_CONFIG), so this page reflects it.

export default function CVPage() {
  return (
    <div className="cv-stage flex min-h-screen items-start justify-center px-4 pt-10 pb-28 sm:pt-14 print:bg-white print:p-0">
      <CVDocument data={CV} config={PUBLISHED_CONFIG} />
    </div>
  );
}
