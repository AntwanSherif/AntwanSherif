import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

// Dev-only endpoint: writes the edited CV data back into src/data/cv.ts,
// replacing the block between the CV-DATA-START / CV-DATA-END sentinels. Used by
// the /cv/edit lab's "Save to cv.ts" button so in-place edits land in source.
// Never available in production (the editor route 404s there too).

export const runtime = "nodejs";

const START = "// === CV-DATA-START";
const END = "// === CV-DATA-END ===";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const file = path.join(process.cwd(), "src", "data", "cv.ts");
  let src: string;
  try {
    src = await fs.readFile(file, "utf8");
  } catch {
    return NextResponse.json({ ok: false, error: "cv.ts not found" }, { status: 500 });
  }

  const startIdx = src.indexOf(START);
  const endIdx = src.indexOf(END);
  if (startIdx === -1 || endIdx === -1) {
    return NextResponse.json(
      { ok: false, error: "sentinels missing in cv.ts" },
      { status: 500 },
    );
  }

  const before = src.slice(0, startIdx);
  const after = src.slice(endIdx + END.length);
  const literal =
    `${START} (the block below is regenerated when you click\n` +
    `// "Save to cv.ts" in /cv/edit — keep these sentinel comments intact) ===\n` +
    `export const CV: CVData = ${JSON.stringify(data, null, 2)};\n` +
    `${END}`;

  try {
    await fs.writeFile(file, before + literal + after, "utf8");
  } catch {
    return NextResponse.json({ ok: false, error: "write failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
