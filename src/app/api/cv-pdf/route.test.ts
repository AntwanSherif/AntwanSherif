import { describe, it, expect } from "vitest";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";

import { GET } from "./route";
import { patchPdfCampaign } from "./patch";

const PORTFOLIO = "https://antwansherif.com/?utm_source=cv&utm_medium=pdf";
const ENCORESHOT = "https://encoreshot.com/?utm_source=cv&utm_medium=pdf";
const LINKEDIN = "https://linkedin.com/in/antwansherif";

// Build a one-page PDF carrying three real Link annotations (two own-property,
// one third-party), so patchPdfCampaign runs against genuine pdf-lib objects.
async function buildFixture(uris: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([300, 300]);

  const annotRefs = uris.map((uri) => {
    const annot = doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [0, 0, 100, 20],
      A: { Type: "Action", S: "URI", URI: PDFString.of(uri) },
    });
    return doc.context.register(annot);
  });

  page.node.set(PDFName.of("Annots"), doc.context.obj(annotRefs));
  return doc.save();
}

// Read back every Link annotation URI in the given PDF bytes.
async function readUris(bytes: Uint8Array): Promise<string[]> {
  const doc = await PDFDocument.load(bytes);
  const out: string[] = [];
  for (const page of doc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i++) {
      const dict = doc.context.lookup(annots.get(i));
      // @ts-expect-error runtime lookup of nested dicts for test assertions
      const uri = dict.lookup(PDFName.of("A")).lookup(PDFName.of("URI"));
      out.push(uri.decodeText());
    }
  }
  return out;
}

describe("patchPdfCampaign", () => {
  it("tags own-property URIs and leaves third-party untouched", async () => {
    const bytes = await buildFixture([PORTFOLIO, ENCORESHOT, LINKEDIN]);
    const patched = await patchPdfCampaign(bytes, "acme");
    const uris = await readUris(patched);

    expect(uris[0]).toContain("utm_campaign=acme");
    expect(uris[1]).toContain("utm_campaign=acme");
    expect(uris[2]).toBe(LINKEDIN);
    expect(uris[2]).not.toContain("utm_campaign");
  });

  it("is idempotent (no double utm_campaign)", async () => {
    const bytes = await buildFixture([PORTFOLIO]);
    const once = await patchPdfCampaign(bytes, "acme");
    const twice = await patchPdfCampaign(once, "acme");
    const uris = await readUris(twice);

    expect(uris[0].match(/utm_campaign=acme/g)).toHaveLength(1);
  });
});

describe("GET /api/cv-pdf", () => {
  it("400s on empty co", async () => {
    const res = await GET(new Request("https://x.test/api/cv-pdf?co="));
    expect(res.status).toBe(400);
  });

  it("400s on garbage co that slugifies to empty", async () => {
    const res = await GET(new Request("https://x.test/api/cv-pdf?co=%20%2F%2F"));
    expect(res.status).toBe(400);
  });
});
