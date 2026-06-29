"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";
import { track } from "@/lib/analytics";

// Download CTA for the public /cv page. Serves a real, pre-rendered file
// (public/cv.pdf, regenerated via `pnpm cv:pdf`) so the click is a TRUE
// download → fires `cv_download`. Separately, a browser Cmd-P fires `cv_print`
// — a distinct, honestly-named "print initiated" signal (the browser can't
// confirm an actual export, so we never call it a download). Hidden in print.
export function CvDownload() {
  useEffect(() => {
    const onBeforePrint = () =>
      track({ name: "cv_print", props: { content_type: "cv", category: "professional" } });
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  return (
    <a
      href="/cv.pdf"
      download="Antwan-Sherif-Labib-CV.pdf"
      data-analytics-skip-outbound
      onClick={() =>
        track({ name: "cv_download", props: { content_type: "cv", category: "professional" } })
      }
      className="fixed right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-[#2251b2] px-4 py-2 text-[13px] font-semibold text-white shadow-lg ring-1 ring-white/15 transition-colors hover:bg-[#1c459a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white print:hidden"
    >
      <Download size={15} strokeWidth={2.2} />
      Download PDF
    </a>
  );
}
