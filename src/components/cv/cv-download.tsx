"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { track } from "@/lib/analytics";
import { slugifyCompany } from "@/lib/cv-campaign";

// Download CTA for the public /cv page. Serves a real, pre-rendered file
// (public/cv.pdf, regenerated via `pnpm cv:pdf`) so the click is a TRUE
// download → fires `cv_download`. Separately, a browser Cmd-P fires `cv_print`
// — a distinct, honestly-named "print initiated" signal (the browser can't
// confirm an actual export, so we never call it a download). Hidden in print.
// The document shows the short name ("Antwan Sherif"), but the saved/printed
// file should carry the full formal name. Chrome's Save-as-PDF uses
// document.title as the default filename, so swap it just for the print, then
// restore — the tab/SEO title stays as set in the route metadata.
const PRINT_FILENAME = "Antwan Sherif Labib - Resume";

export function CvDownload() {
  // Company-aware: with ?co=<company>, download the on-demand company-tagged PDF
  // (/api/cv-pdf?co=<slug>) and attach the slug to the cv_download event. Without
  // it, serve the committed generic public/cv.pdf as before.
  const searchParams = useSearchParams();
  const slug = slugifyCompany(searchParams.get("co") ?? "");
  const href = slug ? `/api/cv-pdf?co=${slug}` : "/cv.pdf";

  useEffect(() => {
    let prevTitle = "";
    const onBeforePrint = () => {
      track({ name: "cv_print", props: { content_type: "cv", category: "professional" } });
      prevTitle = document.title;
      document.title = PRINT_FILENAME;
    };
    const onAfterPrint = () => {
      if (prevTitle) document.title = prevTitle;
    };
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  return (
    <a
      href={href}
      download="Antwan Sherif Labib - Resume.pdf"
      data-analytics-skip-outbound
      onClick={() =>
        track({
          name: "cv_download",
          props: { content_type: "cv", category: "professional", ...(slug ? { company: slug } : {}) },
        })
      }
      className="fixed right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-[#2251b2] px-4 py-2 text-[13px] font-semibold text-white shadow-lg ring-1 ring-white/15 transition-colors hover:bg-[#1c459a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white print:hidden"
    >
      <Download size={15} strokeWidth={2.2} />
      Download PDF
    </a>
  );
}
