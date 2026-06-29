// Build-time export of /cv → public/cv.pdf, rendered by real Chrome so the file
// matches the page's print design exactly. The public page links to this file
// for a true (trackable) download, distinct from a browser Cmd-P.
//
// Usage: start the app (`pnpm dev`, or `pnpm build && pnpm start`), then:
//   pnpm cv:pdf                       # reads the live port from .dev/port
//   CV_URL=http://localhost:3000/cv pnpm cv:pdf
//   CHROME_PATH="/path/to/chrome" pnpm cv:pdf
import { readFileSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function devPort() {
  if (process.env.CV_PORT) return process.env.CV_PORT;
  try {
    return readFileSync(join(process.cwd(), ".dev", "port"), "utf8").trim();
  } catch {
    return "3130";
  }
}

const url = process.env.CV_URL || `http://localhost:${devPort()}/cv`;
const out = join(process.cwd(), "public", "cv.pdf");

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector(".cv-sheet");
  // Print CSS forces full opacity, so the entry animation can't affect the file.
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`✓ wrote ${out}\n  from ${url}`);
} finally {
  await browser.close();
}
