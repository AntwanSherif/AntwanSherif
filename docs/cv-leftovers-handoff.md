# CV — Leftovers Handoff (Tailwind migration · mobile · deploy)

Self-contained handoff for the work **not** done in the print-first CV build.
The CV is feature-complete and committed; this doc covers the remaining threads,
with the reasoning behind earlier decisions so they aren't re-argued.

**Latest: a full visual + print polish pass (2026-06-30)** — documented in its
own section below, plus new open questions. The CV now sits in **7 local commits,
all unpushed**; CV-relevant ones, top of branch:

```
f354906 feat(cv): polish the print CV — real emblem, timeline rail, full-height sidebar
ccbc923 chore(cv): pre-push guard to keep public/cv.pdf in sync
e26f21a feat(cv): downloadable PDF + distinct download/print analytics
413a431 feat(nav): add CV link to navbar with view tracking
e9f52a1 feat(cv): print-first 2-page CV with live design lab
3ae578d feat(cv): add /cv page — in-place editor, print support, reviewed content
```

(The earlier `2b5f22e` + `f7d8883` were squashed into `f354906`.)

---

## Polish pass — 2026-06-30 (latest, all in the top polish commit)

A long visual + print refinement pass. What changed, and the **new mechanisms
that are now load-bearing for print** (treat with the same care as the running
header):

**Identity / content**
- Display name → **"Antwan Sherif Labib"** (3-line stacked nameplate; `w-min` puts
  one word per line). Title → **"Senior Software Engineer · AI Product Engineer"**.
- Saved/printed **file name** → "Antwan Sherif Labib - Resume": the `download`
  attr **plus** a `beforeprint` `document.title` swap in `cv-download.tsx` (tab
  title restored on `afterprint`, so SEO/tab title is unaffected).
- **Summary rewritten** (by the candidate): React-SME depth + business outcomes.

**Header**
- Eyebrow lifted to its **own full-width line** — a long title wrapped (stranding
  "ENGINEER") when boxed in the narrow name column.
- **Real emblem**: `public/emblem.png` is the candidate's actual orbital mark,
  lifted from the original CV PDF at 400dpi and **colour-keyed blue→transparent**
  (white-on-transparent), rendered via `next/image` (`priority unoptimized`).
  Replaces the earlier hand-built SVG. (Canva MCP export was blocked by team
  policy, so it was pulled from the PDF instead.)

**Timeline rail (print is delicate)**
- Screen: one continuous dotted spine — `.cv-rail::before` — starting at the
  first node's centre.
- Print: drawn **per `.cv-exp`** as a `border-left`, with `margin: 0 !important`
  (Tailwind v4 lays the `space-y` gap as the *logical* `margin-block-end`, so a
  physical `margin-top` override silently misses it) + `padding-top` so segments
  butt into one connected line. Stops at each page's last entry; never crosses a
  page boundary or the running header.
- Page-start entries begin at the node centre via `:first-child` **and
  `:nth-child(3)`** — nth-child(3) is the first entry on page 2 (entries 1–2 fill
  page 1). ⚠️ **Tied to the current pagination**: if the break moves, update the index.

**Full-height sidebar (print)**
- A **print-only `position: fixed` `.cv-colbg`** paints `white | hairline | tint`
  edge-to-edge and **repeats on every page**, so the sidebar reads full-height
  even past where its cards stop, and the tint starts right under the running bar
  (the opaque bar covers the top). `.cv-sheet` goes `background: transparent` in
  print so it shows through; `.cv-doc` sits above it via `z-index`.
- `.cv-aside` uses `border-left: transparent` + `background-clip: padding-box` in
  print so the **single fixed hairline** is the divider everywhere (its own bg
  would otherwise hide it). `--cv-split` CSS var carries `colSplit` to the gradient.
- ✅ Verified the fixed colbg renders in **puppeteer / real Chrome** (the committed
  `cv.pdf`), not just gstack — so the `position: fixed` caveat below does **not**
  bite the real export. Re-verify here if you touch it.

**Type & colour**
- Section titles → muted `#94a3b8` kickers (were brand-blue, which fought the
  links); body text → `INK` near-black; **all links unified** to `#2251b2`
  (incl. `renderInline` in `edit-context.tsx`); **violet** "In development" badge
  (new `violet` `tagTone` in both `cv.ts` types and `ProjectBadge`); skill pills
  9px; sidebar card padding bumped (`px-4 py-4` / `print:px-3.5 print:py-3`).
- Screen-only **`zoom: 1.12`** on `.cv-sheet` (print untouched).

**Fit**
- `headerPad` = **0.7**. The 3-line name + full-width eyebrow grew the header;
  **0.8 is the 2-page ceiling**, so 0.7 leaves ~one notch. Any content/dial growth
  risks a 3rd page → always `pnpm cv:pdf` + page-count check after edits.

> **Working rule added to project `CLAUDE.md` this pass:** verify every visual/
> print change against a **zoomed screenshot of the changed region** before
> claiming done — full-page thumbnails and the diff hide rail stubs, divider gaps,
> page-break trailing, and page-count regressions.

## Open questions (from the polish pass)

1. **ATS single-column version** *(candidate asked to be reminded — not started)*.
   The 2-column print **interleaves** in text extraction: the name parses fine
   (the running-header bar puts "Antwan Sherif Labib · …" as the *first* extracted
   line), but section order scrambles for strict parsers. Keyword-match ATS still
   scores (all keywords present); structured parsers (Workday/Taleo/iCIMS) may
   jumble. Plan: a **separate single-column plain variant** for those portals;
   keep the designed 2-column version for humans/recruiters/portfolio.
2. **Summary para 2** leans on EncoreShot specifics ("multimodal AI systems with
   evaluation pipelines and cost-optimized inference") — the candidate earlier
   said *don't lead too hard on EncoreShot (yet)*. Flagged; their call.
3. **Emblem is raster** (colour-keyed PNG). If the candidate exports the real
   **SVG** from Canva (Share → Download → SVG of the element), swap
   `public/emblem.png` for crisp vector.
4. **Stray Canva copy** — a design "Antwan Sherif Labib - Resume" (`DAHOAMnqA_M`)
   was created in the candidate's Canva drive during emblem extraction; delete it.
5. **headerPad has ~no buffer** (0.7 of a 0.8 ceiling). Re-check page count after
   any CV edit.

---

## What exists (orientation)

`/cv` is a **print-first 2-page A4 document**; `/cv/edit` is a **dev-only** design
lab (calls `notFound()` in prod) with live sliders that publish to the page.

| File | Purpose |
|---|---|
| `src/app/cv/page.tsx` | Public page. Renders `<CVDocument data={CV} config={PUBLISHED_CONFIG}/>` + `<CvDownload/>`. |
| `src/app/cv/edit/page.tsx` | Dev-only editor route. |
| `src/app/cv/layout.tsx` | Chrome-free layout (imports `cv.css`); `/cv` sits **outside** the `(site)` route group so it gets none of the navbar/clamp chrome — only the global shell + plasma. |
| `src/app/cv/cv.css` | `.cv-sheet` sizing (210mm), `@page`, all `@media print` rules, the **running-header table** rules. **Primary file for the print logic.** |
| `src/components/cv/cv-document.tsx` | The canonical component. Header (right-side link cols + brand glyphs), 2-col grid, sections, the **CSS-var text/line scaling**, the **`<table>`/`<thead>` running header**, inline-hex palette. |
| `src/components/cv/cv-editor.tsx` | The lab: Columns/Name/Header-H/Text/Line sliders + Flow/Cards + **Save** (→ `/api/cv-save`). |
| `src/components/cv/cv-download.tsx` | "Download PDF" button (→ `cv_download`) + `beforeprint` listener (→ `cv_print`). `print:hidden`. |
| `src/components/cv/_shared.tsx` | `Stagger`/`FadeItem` Motion primitives (reduced-motion safe). |
| `src/components/cv/edit-context.tsx` | `Ed` (contentEditable wrapper), `renderInline` (markdown→React), `serializeEditable`, `setByPath`. |
| `src/data/cv.ts` | CV **content** (between `CV-DATA` sentinels; regenerated by Save). |
| `src/data/cv-config.ts` | `PUBLISHED_CONFIG` — the **design dials** (also written by Save). |
| `src/app/api/cv-save/route.ts` | Dev-only POST; writes `cv.ts` (content) **and** `cv-config.ts` (design). |
| `scripts/generate-cv-pdf.mjs` · `public/cv.pdf` | `pnpm cv:pdf` renders `/cv`→PDF via real Chrome (puppeteer-core). |
| `.githooks/pre-push` | Guard: blocks a push that changes CV source without refreshing `public/cv.pdf`. |

**Run/verify:** `pnpm dev` (port in `.dev/port`, ~`3130`) · `pnpm exec tsc --noEmit`
· `pnpm exec eslint src/components/cv src/app/cv` · `pnpm test` · `pnpm cv:pdf`.

**Inspect the PDF:** `B="$HOME/.claude/skills/gstack/browse/dist/browse"; P=$(cat .dev/port); "$B" goto "http://localhost:$P/cv"; "$B" wait .cv-sheet; "$B" pdf /tmp/cv.pdf; pdftoppm -png -r 130 /tmp/cv.pdf /tmp/cv` → Read the PNGs.

> ⚠️ **Print-engine caveat (bit us once):** gstack's `pdf` ≠ real Chrome `Cmd-P`
> for some print features (notably `position: fixed`, which is why the running
> header uses a repeating `<thead>` instead). **For any change to print/page-2
> behavior, verify in real Chrome `Cmd-P`, not just gstack.** `<thead>` repeating
> rendered correctly in both, so it's trustworthy.

---

## TASK 1 — Tailwind v4 migration (the original "deferred to last" ask)

**Goal:** move the CV off bespoke CSS classes + inline hex onto Tailwind v4
where it's a genuine win — *without* breaking the tuned print layout or the
editor dials.

**Scope decided earlier (three piles):**
1. **Print-break hooks** — `.cv-exp` / `.cv-side` / `.cv-proj` / `.cv-h` exist
   only as targets for `break-inside: avoid` / `break-after: avoid` in
   `cv.css @media print`. **Migrate fully** → put `print:break-inside-avoid` /
   `print:break-after-avoid` directly on the elements in `cv-document.tsx`,
   delete the class rules. Clear win. *(Keep the class names only if something
   else still selects them — e.g. the animation-neutralizing rule keys off
   `.cv-sheet`, not these.)*
2. **Structural classes** — `.cv-sheet` (210mm, shadow, `print-color-adjust`),
   `.cv-stage`. Migratable to arbitrary utilities (`w-[210mm]`,
   `[print-color-adjust:exact]`, `shadow-[…]`) **except `@page`** — an at-rule
   with **no Tailwind equivalent**, so a thin `cv.css` must survive for `@page`
   (and the `html/body` print reset).
3. **Inline-hex palette** (`BLUE`/`INK`/`GRAY` constants, gradients, the
   per-node `style={{color:…}}`). **Recommendation: mostly leave it**, or lift
   only the ~3 repeated colors to `@theme` tokens. Converting every inline hex
   to `text-[#…]` arbitrary values is churn with little benefit and risks the
   editor's contentEditable paths. Confirm scope with the user before doing pile 3.

**Recommended order:** pile 1 → pile 2 (keep `@page` + print resets in CSS) →
ask about pile 3.

**Do NOT migrate / handle with care:**
- **`@page { … }`, `@page :first`** — must stay in `cv.css` (no Tailwind form).
- **The running-header print rules** (`.cv-runhead`, `.cv-doc`, the `<thead>`
  `display: table-header-group`, the page-1 cover `.cv-doc tbody td > header {
  margin-top: -14mm }`, the `padding-bottom: 5mm` gap). This is **delicate print
  logic** verified in real Chrome — leave it in `cv.css`. Migrating it to
  utilities risks reintroducing the page-2 header bug.
- **The CSS-var text/line scaling** — `text-[calc(12px*var(--cv-text))]` /
  `leading-[calc(1.375*var(--cv-line))]` are **already Tailwind arbitrary
  values**; the `--cv-text`/`--cv-line` vars are set inline on the grid (and
  defaulted on `.cv-sheet`). Don't disturb this or the **Text/Line editor
  sliders break**.
- **The animation-neutralizing print rule** (`.cv-sheet [style*="opacity"] {…}`)
  keeps a mid-animation `Cmd-P` from printing half-faded — keep it.

**After ANY change here:** `pnpm cv:pdf` + commit `public/cv.pdf`, and re-verify
**2 pages, no company split, page-2 running bar** in real Chrome. The pre-push
guard will remind you, but do it proactively.

**Verification:** `tsc` + `eslint` clean; `pnpm test`; screen `/cv` unchanged;
PDF still 2 pages with the running header; `/cv/edit` sliders still work (esp.
Text/Line). Confirm the published design (`cv-config.ts` values) still renders
identically.

---

## TASK 2 — Mobile `/cv` rendering (parked: "tackle the phone later")

**Decisions already locked (don't re-litigate):**
- **The PDF is the primary artifact; the web page is a preview.** So the sheet
  is a **fixed A4 (210mm)** — *not* widened, *not* reflowed. (Reflowing would
  diverge from the PDF, which is the deliverable.)
- The lean was a **faithful scaled preview on mobile** (scale the whole A4 sheet
  to fit the viewport — `transform: scale()` / CSS `zoom`, pinch-zoom enabled)
  **+ a prominent Download-PDF affordance** — *not* a single-column reflow.

**Current state on a phone:** the `.cv-sheet` is a hard `210mm`; on a 375px
screen it overflows / squishes (`max-width:100%` shrinks the box but the 2-col
grid + fixed px fonts cram). The `CvDownload` button is `fixed right-5 top-5`
(may need a mobile-friendly position). The nav dock floats bottom.

**Plan:**
- On screen only (keep print at hard `210mm`), make the sheet **scale to fit**
  small viewports — e.g. wrap the sheet and apply a transform so the full A4
  layout shrinks proportionally (a true mini-preview), or use container/zoom so
  it never overflows. Keep the plasma backdrop.
- Make the **Download-PDF** button reachable on mobile (it's the real CTA there
  — recruiters on a phone want the file, not a tiny preview).
- Sanity-check the nav dock + Download button don't collide on small screens.

**Verify:** gstack `viewport 390x844` screenshots; the sheet readable/scaled,
button tappable, no horizontal overflow. Print output **must stay identical**
(screen-only changes).

---

## TASK 3 — Push & deploy

- **7 commits ahead of `origin/main`, unpushed.** Pushing → Vercel deploys.
  The pre-push guard runs; `public/cv.pdf` is currently in sync, so it passes.
- **Before first deploy** (pre-existing, per root `CLAUDE.md`): the Vercel
  **Install Command** override + `STORIES_REPO_TOKEN` for the private stories
  submodule is **not yet configured** — required or the build fails on the
  submodule. Unrelated to the CV, but it gates deploying.
- **`public/cv.pdf` is a committed artifact.** It's served statically and is the
  "Download PDF" file. Regenerate (`pnpm cv:pdf`) whenever the CV changes —
  enforced by `.githooks/pre-push` (auto-enabled via the `postinstall` that sets
  `core.hooksPath`); escape hatch `git push --no-verify` for non-visual changes.

---

## Gotchas worth knowing

- **Editor staleness:** `/cv/edit` loads design from `localStorage` (`cv-edit-config`)
  merged over `DEFAULT_CONFIG`; old keys can mask new code defaults. Hard-refresh
  + **Reset** clears it. Content always loads fresh from `cv.ts`.
- **Repo hook blocks `Write` on existing files** → use `Edit`, or `rm` then `Write`.
- **Two-step save:** `/cv/edit` "Save" POSTs `{data, config}` → writes `cv.ts`
  (content) and `cv-config.ts` (`PUBLISHED_CONFIG`), so the public page reflects
  the lab. Legacy config keys are stripped on save.
- **Analytics:** `cv_view{source}` (navbar click, `content_type: nav`),
  `cv_download` + `cv_print` (both `content_type: cv`) are wired. Read
  `src/components/analytics/AGENTS.md` before touching tracking; events get the
  TDD + taxonomy-catalog treatment.
- **Copy accuracy rule the candidate holds:** never claim results not personally
  owned/observed (e.g. El Mawkaa's seven-figure exit stays a *company* fact in
  the project, not a personal claim in the summary).

## Quick start for the next session

```bash
cd ~/files/side-projects/portfolio/AntwanSherif
pnpm dev                              # bin/dev; read .dev/port
# open http://localhost:<port>/cv         (public)  /cv/edit  (dev-only lab)
pnpm exec tsc --noEmit && pnpm exec eslint src/components/cv src/app/cv && pnpm test
pnpm cv:pdf                           # after any CV render change → commit public/cv.pdf
```

Start with **Task 1 (Tailwind)** or **Task 2 (mobile)** — independent of each
other. Task 3 is a release step, do it last.
