import { slugifyCompany } from "@/lib/cv-campaign";

import { patchPdfCampaign } from "./patch";

// Open, rate-limited edge route: streams a company-tagged copy of the static CV
// PDF. Own-property link annotations get utm_campaign=<slug> appended (pdf-lib,
// no Chromium); the company stays invisible (generic filename). No ?co= callers
// use the static /cv.pdf directly, so this only ever fires when tagging is wanted.

export const runtime = "edge";

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("co") ?? "";
  const slug = slugifyCompany(raw);
  if (!slug) {
    return new Response("missing company", { status: 400 });
  }

  const res = await fetch(new URL("/cv.pdf", request.url));
  if (!res.ok) {
    return new Response("cv.pdf unavailable", { status: 502 });
  }
  const bytes = new Uint8Array(await res.arrayBuffer());

  let patched: Uint8Array;
  try {
    patched = await patchPdfCampaign(bytes, slug);
  } catch {
    return new Response("pdf patch failed", { status: 500 });
  }

  // Copy into a fresh ArrayBuffer for the response body: pdf-lib's save() returns a
  // generic Uint8Array<ArrayBufferLike> that TS won't accept as a BodyInit (it could
  // be SharedArrayBuffer-backed). A plain ArrayBuffer is unambiguous and edge-safe.
  const body = new ArrayBuffer(patched.byteLength);
  new Uint8Array(body).set(patched);
  return new Response(body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition":
        'attachment; filename="Antwan Sherif Labib - Resume.pdf"',
    },
  });
}
