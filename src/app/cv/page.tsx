import type { Metadata } from "next";
import { CV } from "@/data/cv";
import CVDocument, { DEFAULT_CONFIG } from "@/components/cv/cv-document";
import "./cv.css";

export const metadata: Metadata = {
  title: "Antwan Sherif — CV",
  description: "Curriculum vitae of Antwan Sherif, Senior Software Engineer.",
};

// Public CV page: the chosen design, pinned. Tune the look (header direction,
// tech rendering, link style, column widths) in the private /cv/edit lab, then
// bake the winning values into PUBLISHED_CONFIG here.
const PUBLISHED_CONFIG = DEFAULT_CONFIG;

export default function CVPage() {
  return (
    <div className="cv-stage min-h-screen bg-neutral-200/60 px-4 py-8 print:bg-white print:p-0">
      <CVDocument data={CV} config={PUBLISHED_CONFIG} />
    </div>
  );
}
