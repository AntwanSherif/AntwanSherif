# Umami Heatmaps — Design Spec

**Date:** 2026-09-05
**Scope:** Evaluate adding Umami's built-in Heatmaps (click/scroll) to the portfolio, and decide
how far to go given the privacy trade-off it introduces relative to the existing analytics ADR.
**Research:** `docs/research/umami-heatmaps.md` (primary-source verification against
`docs.umami.is`, `umami-software/umami` releases and Prisma schema).

---

## Overview

Umami shipped Session Replay in v3.1.0 (Apr 2026) and a first-class Heatmaps report in v3.2.0
(Jun 2026) — a reversal of its 2021 "out of scope" stance. This site's Umami fork is pinned around
v3.1, so getting heatmaps means a real version bump, not a dashboard toggle.

Both features share the same `recorder.js` script and dashboard section ("Replays & Heatmaps").
Heatmaps writes to a `HeatmapEvent` table (per-session `x`/`y`/`scrollPct` rows). Replay writes to
a separate `SessionReplay` table (a raw rrweb DOM-recording blob per session, 30-day retention,
default masking that only redacts form inputs — not page text).

**Correction (superseding an earlier, wrong claim in this document): Heatmaps *is* separable
from Replay at the client level.** An earlier pass at this question, based on release-note
prose ("overlays rendered from captured replay snapshots") and a hasty read of the source,
concluded the two features shared one code path through `beginReplayCapture()`. Reading the
actual function bodies at the `v3.2.0` tag
(`raw.githubusercontent.com/umami-software/umami/v3.2.0/src/recorder/index.js`) shows this was
wrong:

- `beginHeatmapCapture()` (line 503) is a **separate, lightweight function**: a plain
  `click` listener and a 400ms-debounced `scroll` listener, computing page/scroll metrics and
  queuing small JSON events (`{type, x, y, pageX, pageY, scrollPct, ...}`). **No rrweb, no
  `MutationObserver`, no DOM recording.**
- `beginReplayCapture()` (line 432) is the one that imports and calls rrweb's `record()`
  (`import { addCustomEvent, record } from 'rrweb'` at the top of the file).
- Which one(s) run is controlled entirely by the website's server-side config
  (`data.heatmapEnabled` / `data.replayEnabled`, fetched from
  `{host}/api/websites/{id}/recorder` at page load): `startCaptures()` calls
  `beginHeatmapCapture()` only if `shouldRecordHeatmap`, and `beginReplayCapture()` only if
  `shouldRecordReplay` — independently, not one gating the other.

So "Heatmaps only" (server config: `heatmapEnabled: true, replayEnabled: false`) genuinely
does **not** run rrweb's DOM/mutation instrumentation. It matches the lighter `HeatmapEvent`
Prisma table from the original research: coordinates and scroll percentage, no DOM content,
now confirmed at the capture layer too, not just storage. Option B is real. What doesn't
change: the script ships as one bundle with `rrweb` imported at module scope, so the
**download/parse size is the same regardless of which feature is enabled** — only the
*runtime* behavior after config loads differs. See the measured comparison below for what
that actually costs.

The `HeatmapEvent` table matches what the client now confirms: still session-linked, but
coordinates and scroll percentage, not DOM content. `SessionReplay` is a different category of
tool entirely — the same class as FullStory/Hotjar — and does **not** inherit the "cookieless,
no PII" framing the analytics ADR was built on. Heatmaps-only, by contrast, is a small,
bounded increment over what this site already tracks: point coordinates and scroll depth
tied to a session ID, no DOM content, no page text.

## Performance findings (recorder.js, v3.2.0 source)

The stated hard requirement is **no regression to LCP, INP, or other Core Web Vitals**. What
the source shows, now correctly separated by feature:

| Behavior | Source | Applies to |
|---|---|---|
| Waits for `document.readyState === 'complete'`, then polls up to 5s for a session cache before either capture starts | `bootstrap()`/`waitForSession()` | Both — protects **LCP** either way, capture genuinely doesn't compete with initial paint. |
| Plain `click` listener + 400ms-debounced `scroll` listener, computing page metrics and queuing small JSON events | `beginHeatmapCapture()` | **Heatmaps only.** No DOM observation beyond the event target's own bounding rect. |
| `record()` from rrweb: `MutationObserver`, mouse/scroll tracking, DOM snapshot serialization, running for the life of the session | `beginReplayCapture()` | **Replay only.** This is the ongoing, session-length cost the earlier draft of this document wrongly attributed to Heatmaps too. |
| Script ships as one bundle with `rrweb` imported at module scope regardless of which feature is enabled | Top of file, `import { addCustomEvent, record } from 'rrweb'` | Both — **download/parse weight is identical either way**, only *runtime* behavior differs by config. |
| No published benchmark or overhead figure anywhere in Umami's docs, blog, or release notes | `docs/research/umami-heatmaps.md` §6 | Both — official docs give no number for either mode, hence the measured comparison below. |

This site is animation-heavy (Motion/Framer, GPU-accelerated transforms per the project's
`CLAUDE.md`) — more DOM mutation for rrweb's observer to react to than a static content page,
which matters for Replay's cost, not Heatmaps'.

---

## Measured comparison (2026-09-05, `worktree-umami-heatmaps-perf`)

Method: production build (`pnpm build && pnpm start`), traced via chrome-devtools MCP
(`performance_start_trace` → interact → `performance_stop_trace`), per this repo's own
convention against `npx lighthouse` for CWV work. A standalone `recorder.js` was bundled
locally from the `v3.2.0` source with `rrweb@^2.1.1` (Umami pins `^2.0.1`) via esbuild, and
injected into the running page against a local mock config server, this avoided any version
bump, CSP change, or contact with the live `stats.antwansherif.com` deployment. Interaction:
one accordion-expand click on a work-history entry (real client-side state change, not a
pure-scroll anchor link, an earlier attempt at this measurement used an anchor link and
produced no measurable INP — recorded as a mistake, not a result).

**Desktop, 1440×900, no throttling (LCP):**

| Condition | LCP | Notes |
|---|---|---|
| No recorder script | 1187 ms | First baseline run |
| No recorder script (second run) | 1101 ms | Re-run to gauge natural noise — ~90ms/7% variance between two baseline runs with nothing changed, treat any delta smaller than this as noise, not signal |
| With recorder script, config loaded before paint | *not obtained* | The chrome-devtools MCP's `initScript` (needed to inject the recorder before a fresh navigation) does not survive the internal reload `performance_start_trace` triggers — a tooling limitation, not a site finding. Not chased further: the source-level fact that both capture modes gate on `readyState === 'complete'` plus a session-cache poll already gives strong reason to expect ~zero LCP impact from either mode; this just isn't independently confirmed by a trace. |

**Mobile emulated, 390×844×3, 4x CPU throttle, Fast 4G, accordion click during the trace (INP):**

| Condition | INP total | Input delay | Processing | Presentation |
|---|---|---|---|---|
| No recorder script | **110 ms** | 15 ms | 57 ms | 38 ms |
| Heatmaps only (`heatmapEnabled: true, replayEnabled: false`) | **172 ms** | 65 ms | 73 ms | 34 ms |
| Full Replay (`replayEnabled: true`) | **173 ms** | 20 ms | 112 ms | 42 ms |

Both stayed in the "Good" INP bucket (<200ms), but both showed a real increase over baseline,
roughly +55-60% in this single-sample test. The **composition** differs in the direction the
source code predicts: Replay's extra cost concentrates in **processing duration** (112ms vs.
73ms for heatmaps-only, vs. 57ms baseline) — consistent with rrweb's `MutationObserver`/DOM
work running synchronously inside the interaction, whereas Heatmaps-only's increase leaned
more on input delay (65ms), which is more consistent with general script-presence/scheduling
overhead than a capture-specific cost.

**Caveats, stated plainly rather than glossed over:**

- **Single sample per condition.** Given the ~90ms/7% noise floor measured between two
  identical baseline runs, a one-click difference of ~60ms is a real signal but the exact
  numbers shouldn't be treated as precise — repeat runs would tighten this if a production
  decision hinged on the precise figure.
- **Not the production Umami build.** This is a local esbuild bundle of the same source with
  a close-but-not-identical `rrweb` patch version and different bundler flags than Umami's own
  build pipeline. Directionally representative, not a substitute for testing the real deployed
  script.
- **Both conditions loaded the recorder script live, not pre-warmed at parse time**, matching
  real-world behavior (the script tag is genuinely a second, separate load), but the exact
  timing relative to the interaction wasn't controlled beyond "script present before the
  click."

---

## Options

| | What ships | Privacy delta vs. today | Measured client cost | Effort |
|---|---|---|---|---|
| **A. Heatmaps + Replay** | Click/scroll overlays + full session playback | Real — DOM text (names, IDs, anything not a form field) captured verbatim at default `moderate` masking. Needs its own privacy review, independent of the existing ADR's guarantee. | INP 110→173ms (mobile, one interaction); LCP impact not isolated but structurally expected to be near-zero | Version bump (v3.2.0+, Node 22, Next 16.2.6, Prisma 7.8.0 on the Umami project) + CSP change on this site (`frame-ancestors`, drop `X-Frame-Options`) + set `strict` masking + block-selector list. |
| **B. Heatmaps only, Replay off** | Click/scroll overlays, no playback surface | Small — coordinates + scroll percentage, no DOM content, confirmed separable from Replay at the source level (see above, correcting this document's earlier claim) | INP 110→172ms (mobile, one interaction); LCP impact not isolated but structurally expected to be near-zero | Same version bump + CSP change as A, no migration/config difference in effort, only in what gets stored. |
| **C. Skip the built-in feature** | Manual `data-umami-event` click tagging (already documented in `src/components/analytics/AGENTS.md`) + Funnels (already shipped in v3.1) | None | Zero measured or structural client cost — same tracker script already running | Zero — no version bump, no CSP change, code-only instrumentation of specific elements you care about. |

**Superseded 2026-09-05: Decision is now Option B, accepted knowingly.** The site's Umami fork
was separately upgraded to v3.3.1 (see `docs/analytics-operations.md`), which reopened this
question. The user confirmed the "no regression" bar has moved to "stay comfortably inside
Good" — the measured ~55% INP increase (110ms → 172ms, mobile, one interaction) is accepted as
a known, real cost, not rediscovered as a surprise later. Checked before accepting: no Umami
release through v3.3.1 and no GitHub issue/PR addresses deferring the recorder's synchronous
click/scroll work off the input thread — this is a live, unfixed cost, not a stale finding.

**What shipped:**

- `src/components/analytics/analytics-scripts.tsx` — added a second `<Script>` loading
  `${host}/recorder.js` alongside the existing tracker. Not renamed (unlike the tracker/collect
  endpoints), since heatmap sampling losing some ad-blocked visitors is a directional-signal
  tool, not the ad-block-critical path the ADR treats pageview counting as.
- `next.config.mjs` — replaced site-wide `X-Frame-Options: DENY` with
  `Content-Security-Policy: frame-ancestors 'self' https://stats.antwansherif.com`, the two
  can't coexist (`X-Frame-Options` can override `frame-ancestors` in some browsers), and the
  Heatmaps dashboard needs to iframe-embed live pages for its overlay preview. Security
  posture is roughly equivalent, framing is still blocked from everywhere except this site and
  the Umami dashboard itself, not opened up generally.

**What still needs a human, not code:**

1. **Enable Heatmaps in the dashboard.** Website → Edit → *Replays & Heatmaps* section →
   toggle **Heatmaps** on, leave **Replay** off. Set **Heatmap Sample Rate** above the 0.15
   default given this site's low traffic (~10 visits/month per the identity ADR) — otherwise
   data accumulates too slowly to be useful.
2. **Deploy this worktree's changes** — commit, land, push. Not done as part of this change;
   pushing to a remote is always a separate, fresh ask per this repo's own convention.
3. **Re-verify the real cost once live**, ideally against the actual deployed `recorder.js`
   rather than the local esbuild reproduction this document's numbers came from — the
   reproduction was directionally representative, not a substitute for the real script.

---

## Gotchas (confirmed from primary sources, see research doc for citations)

- **Not retroactive.** Only sessions started after the toggle flips get captured — no backfill.
- **Extra script + request.** `recorder.js` loads alongside the existing tracker (`u.js`) — a
  second collection pipeline on top of the typed `track()` wrapper this site already runs.
- **CSP change on this site itself.** The dashboard renders heatmap overlays via an iframe embed
  of your live page. Requires adding the Umami origin to `frame-ancestors` in `src/proxy.ts` (or
  wherever CSP headers live) and removing any `X-Frame-Options` header, since it can override
  `frame-ancestors` in some browsers. That's a real change to this site's security headers, not an
  Umami-side setting.
- **Screen-width segmentation only.** No device/browser split beyond width buckets — coarser than
  you might expect from a heatmap tool.
- **Sample rate defaults to 15%.** Configurable 0–1; low sample rate means slow accumulation on a
  low-traffic portfolio site.
- **Version bump is real, not cosmetic.** v3.1 → v3.2.0+ requires a Prisma schema migration
  (`heatmap_event` table doesn't exist pre-3.2), plus Node 22 / Next.js 16.2.6 / Prisma 7.8.0 on
  the **Umami Vercel project** (separate from this portfolio's own Next.js version — no conflict
  with the portfolio app itself). If the fork carries local patches over upstream Umami, reconcile
  those against the v3.1→v3.2 diff before bumping.
- **Unverified, worth testing directly rather than assuming:** SPA/hydration behavior on Next.js
  client-side route changes, any rage-click detection (none documented). Recorder script overhead
  now has a measured, if single-sample, figure for both modes (see "Measured comparison" above) —
  no longer purely unbounded, but not a rigorous benchmark either.

---

## Superseded: original Option C decision (2026-09-05, same day)

Kept for the record, not current. The first pass at this decision landed on Option C
(skip the built-in feature entirely, manual `data-umami-event` tagging instead), on the
reasoning that even Heatmaps-only wasn't free at 172ms measured INP against a 110ms baseline.
That reasoning wasn't wrong, it's the same number in the "Measured comparison" section above,
but the user later reopened the question with fuller context (the Umami fork was separately
upgraded to v3.3.1, and after confirming no upstream fix or open issue addresses the
underlying cost) and explicitly accepted the tradeoff. **The "Superseded 2026-09-05" section
above is the current decision** — Option B, shipped. This section exists only so the reasoning
that was briefly the decision isn't lost, not as a second, conflicting answer.
