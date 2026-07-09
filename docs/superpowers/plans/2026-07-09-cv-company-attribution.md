# CV Company Attribution — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax. TDD throughout; integration test is the final task.

**Goal:** Tag the CV's own-property outbound links (portfolio + EncoreShot) with a per-company `utm_campaign`, delivered two ways from one page: the live `/cv?co=<slug>` link and a company-aware "Download PDF" that patches the static PDF's link annotations on the fly (pdf-lib, no Chromium).

**Spec:** `docs/superpowers/specs/2026-07-09-cv-company-attribution-design.md`

**Tech stack:** TypeScript, Next.js 16 (App Router, RSC), React 19, pdf-lib (new), vitest (node env), pnpm.

**Conventions:**
- Single test file: `pnpm exec vitest run <path>`. Whole suite: `pnpm test`.
- Own properties = `antwansherif.com` + `encoreshot.com`. Third-party links never tagged.
- After any CV/PDF change, regenerate `public/cv.pdf` (`pnpm cv:pdf`) and eyeball a crop (per repo CLAUDE.md).
- Do not merge to main without asking (user convention).

**Execution waves (model routing):**
- **Wave 0 (orchestrator):** install `pdf-lib`.
- **Wave 1 (Sonnet):** pure foundation — `cv-campaign.ts` + `encoreshot.ts` builders + unit tests.
- **Wave 2 (Sonnet ×2, parallel, disjoint files):** (2a) rendering wiring + integration test; (2b) `/api/cv-pdf` route + pdf-lib patch + tests.
- **Wave 3 (orchestrator):** regenerate `public/cv.pdf`, Vercel rate-limit note, full-suite + build verification.

---

### Task 0: Install pdf-lib  *(orchestrator, lightweight)*

- [ ] `pnpm add pdf-lib`
- [ ] Confirm it resolves in an edge context (pure JS, no node built-ins used on the hot path).

---

### Task 1: Pure campaign primitives  *(Sonnet — TDD)*

**Files:** create `src/lib/cv-campaign.ts` + `src/lib/cv-campaign.test.ts`

- [ ] **Write failing tests** covering:
  - `slugifyCompany`: `"Trade Republic"` → `"trade-republic"`; strips punctuation; collapses runs; trims edge hyphens; `""`/garbage → `""`.
  - `isOwnPropertyUrl`: true for `https://antwansherif.com/...` and `https://encoreshot.com/...`; false for linkedin/github/haktiv and other hosts.
  - `withCampaign(url, slug)`: appends `utm_campaign=<slug>` **only** when the URL already has `utm_source=cv` and lacks `utm_campaign`; idempotent; leaves non-own / untagged URLs untouched.
- [ ] Run tests → verify red.
- [ ] Implement the three pure functions. `withCampaign` reuses the same guard shape as `stampSurfaceMedium` in `encoreshot.ts`.
- [ ] Run tests → green.

**Notes for implementer:** keep it pure and isomorphic (usable from an edge route and from RSC). Match host by parsed `URL().hostname` (exact host + apex), not substring.

---

### Task 2: Link builders — portfolio + encoreshot campaign  *(Sonnet — TDD)*

**Files:** edit `src/lib/encoreshot.ts`; tests in `src/lib/encoreshot.test.ts` (create if absent). May import from `cv-campaign.ts` (Task 1).

- [ ] **Write failing tests:**
  - New `portfolioUrl({ medium?, campaign? })` → `https://antwansherif.com/?utm_source=cv` (+ medium/campaign when given). Confirms the self-link finally carries UTM.
  - `encoreshotUrl` gains optional `campaign` → adds `utm_campaign` when present.
  - Baseline (no campaign) still yields `utm_source=cv` (+ medium) exactly as today for both.
- [ ] Red → implement → green.

**Notes:** keep `EncoreshotSource`/`EncoreshotMedium` vocab. Prefer one small shared builder if portfolio + encoreshot converge cleanly; otherwise a sibling `portfolioUrl`. Don't break existing `encoreshotUrl`/`stampSurfaceMedium` callers.

---

### Task 3 (Wave 2a): Rendering wiring + data  *(Sonnet — TDD)*

**Files:** `src/components/cv/cv-document.tsx`, `src/app/cv/page.tsx`, `src/data/cv.ts`, `src/components/cv/cv-download.tsx`; integration test `src/components/cv/cv-campaign.integration.test.tsx` (or nearest existing pattern).

- [ ] `CVDocument` gains `campaign?: string`. Own-property hrefs (the EncoreShot project link + any portfolio self-link rendered in-doc) pass through `withCampaign(href, campaign)` when set. `stampSurfaceMedium` still runs first.
- [ ] `src/data/cv.ts`: route the portfolio self-link (`links[0]`, `antwansherif.com`) through `portfolioUrl(...)` so it carries baseline UTM (annotations must exist for the PDF patcher).
- [ ] `src/app/cv/page.tsx`: read `?co=`, `slugifyCompany` it, pass as `campaign` to `CVDocument`. Empty/absent → no campaign.
- [ ] `cv-download.tsx`: read `?co=`. With a slug → `href="/api/cv-pdf?co=<slug>"` and `download` filename unchanged; fire `cv_download` with `company: <slug>`. Without → `href="/cv.pdf"` (today's behavior).
- [ ] **Integration test:** render `/cv` with `co=acme` → own-property hrefs contain `utm_campaign=acme`; LinkedIn/GitHub/haktiv hrefs do **not**; download button points at `/api/cv-pdf?co=acme`.

**Notes:** `cv-download.tsx` and `page.tsx` are client/RSC boundary — read the query param on whichever side already has it; keep the button a plain `<a>`. Depends on Tasks 1–2.

---

### Task 4 (Wave 2b): On-demand PDF route  *(Sonnet — TDD)*

**Files:** create `src/app/api/cv-pdf/route.ts`; test `src/app/api/cv-pdf/route.test.ts`; a tiny fixture PDF under `src/app/api/cv-pdf/__fixtures__/` (or generate one in-test with pdf-lib carrying own + third-party link annotations).

- [ ] **Write failing tests:**
  - Patcher unit: given a PDF with own-property (`utm_source=cv`, no campaign) + third-party link annotations, appends `utm_campaign=<slug>` to own only; third-party untouched; idempotent.
  - Route: empty/garbage `co` (post-slugify) → 400; valid `co` → `application/pdf` bytes (stub the static-PDF fetch with the fixture).
- [ ] Red → implement:
  - `export const runtime = 'edge'`.
  - Parse `co` → `slugifyCompany`; empty → 400.
  - `fetch(new URL('/cv.pdf', request.url))` → bytes → `PDFDocument.load`.
  - Walk each page's annotations; for Link annots with a URI action, apply `isOwnPropertyUrl` + `withCampaign`; write the URI back.
  - Return patched bytes: `content-type: application/pdf`, `content-disposition: attachment; filename="Antwan Sherif Labib - Resume.pdf"`.
  - 502 on fetch failure, 500 on parse/patch failure (terse messages).
- [ ] Green.

**Notes:** pdf-lib annotation URI editing is the fiddly bit — get the `/Annots` array per page, filter `/Subtype /Link` with an `/A` URI action, read/rewrite the `/URI` string. Reuse `isOwnPropertyUrl`/`withCampaign` from Task 1 (don't reinvent the guard). Depends on Task 1 + Task 0.

---

### Task 5 (Wave 3): Regenerate static PDF  *(orchestrator)*

- [ ] With dev server running, `pnpm cv:pdf` → new `public/cv.pdf` carrying baseline own-property UTM.
- [ ] Sanity: confirm the PDF's portfolio + EncoreShot link annotations contain `utm_source=cv` (so the patcher has targets). Eyeball a crop for no visual regression.

---

### Task 6 (Wave 3): Rate-limit + verification  *(orchestrator)*

- [ ] Add a Vercel firewall rate-limit rule for `/api/cv-pdf` (document the value in the spec's Abuse-guard section; the rule itself is dashboard/config).
- [ ] `pnpm test` (whole suite green), `pnpm build` (edge route compiles).
- [ ] Manual smoke: `/cv?co=acme` shows tagged links; Download hits `/api/cv-pdf?co=acme`; open the returned PDF, confirm own-property link annotations carry `utm_campaign=acme` and third-party don't.

---

## Done when

- `/cv?co=acme` renders own-property links tagged with `utm_campaign=acme`; third-party untouched.
- Download PDF from `/cv?co=acme` returns a file whose own-property link annotations carry `utm_campaign=acme`.
- Generic `/cv` + `public/cv.pdf` unchanged for the no-company case (baseline UTM only).
- Full suite + build green. Nothing merged to main without asking.
