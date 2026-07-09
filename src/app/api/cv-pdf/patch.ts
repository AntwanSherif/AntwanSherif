import {
  PDFDocument,
  PDFName,
  PDFString,
  PDFHexString,
  PDFDict,
} from "pdf-lib";

import { isOwnPropertyUrl, withCampaign } from "@/lib/cv-campaign";

// Rewrite every own-property Link annotation URI in a PDF, appending
// utm_campaign=<slug> (via withCampaign). Third-party URIs are left untouched.
// Pure over bytes so it's testable without a live server; no node built-ins.
export async function patchPdfCampaign(
  bytes: Uint8Array,
  slug: string,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(bytes);

  for (const page of pdfDoc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;

    for (let i = 0; i < annots.size(); i++) {
      let annotDict: PDFDict;
      try {
        annotDict = pdfDoc.context.lookup(annots.get(i), PDFDict);
      } catch {
        continue;
      }

      const subtype = annotDict.get(PDFName.of("Subtype"));
      if (!(subtype instanceof PDFName) || subtype.asString() !== "/Link") continue;

      let actionDict: PDFDict;
      try {
        actionDict = pdfDoc.context.lookup(annotDict.get(PDFName.of("A")), PDFDict);
      } catch {
        continue;
      }

      const uriObj = actionDict.get(PDFName.of("URI"));
      if (!(uriObj instanceof PDFString) && !(uriObj instanceof PDFHexString)) continue;

      const uri = uriObj.decodeText();
      if (!isOwnPropertyUrl(uri)) continue;

      const next = withCampaign(uri, slug);
      if (next !== uri) actionDict.set(PDFName.of("URI"), PDFString.of(next));
    }
  }

  return pdfDoc.save();
}
