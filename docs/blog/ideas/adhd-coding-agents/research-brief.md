# Research Brief — ADHD × Coding Agents

**Purpose:** Source material for a blog post (or short series) + a conference/meetup talk by an engineer with ADHD who works daily with coding agents.
**Status:** Salvaged from a deep-research run (22 sources fetched, 100 claims extracted). The verification pass was crippled by API rate-limiting mid-run, so most claims are **gathered but not machine-verified** — not refuted, just un-voted. Verify anything load-bearing yourself before it hits a slide (which you were going to do anyway).

## How to read the verification tags

| Tag | Meaning |
|-----|---------|
| ✅ **Verified** | Passed 3-of-3 adversarial skeptic votes against the primary source. Quote with confidence. |
| 🟡 **Gathered** | Extracted from a fetched source with a pulled quote, but verification abstained (rate-limited). Likely fine — re-check the quote at the URL before publishing. |
| ⚠️ **Flag** | Real finding, but with a caveat you must carry (self-report, contested figure, small n). |

Evidence is deliberately lopsided, as expected: **A/B/C/F are solid and citable; D/E are experiential.** The thin E section is the *moat*, not a weakness.

---

## Lens A — Prevalence & Workforce

| # | Claim | Evidence quality | Tag | Source / URL |
|---|-------|------------------|-----|--------------|
| A1 | Persistent adult ADHD (childhood-onset + continuing adult symptoms) had a global prevalence of **2.58%** in 2020 (95% CI 1.51–4.45), ~**139.84M** adults. | Peer-reviewed meta-analysis (primary) | ✅ Verified | Song et al. 2021, *J Global Health* — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7916320/ |
| A2 | Symptomatic adult ADHD (adult symptoms regardless of documented childhood onset) had a global prevalence of **6.76%** in 2020, ~**366.33M** adults. | Peer-reviewed meta-analysis (primary) | ✅ Verified | Song et al. 2021 — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7916320/ |
| A3 | A 2024 Institute of Engineering & Technology survey found **19%** of volunteers identified as definitely or possibly neurodivergent. | Industry survey (secondary) | 🟡 Gathered | via arXiv 2507.06864 — https://arxiv.org/html/2507.06864 |
| A4 | Roughly **15–20%** of the population is considered neurodiverse; ADHD diagnoses rising in adults, with a notable programmer community identifying as ADHD. | Blog synthesis | ⚠️ Flag (soft figure) | https://dev.to/abbeyperini/coding-and-adhd-cant-stop-10mf |
| A5 | ADHD appears **overrepresented among software developers** — but this is practitioner self-report/opinion, **not epidemiological data**. | Practitioner opinion | ⚠️ Flag (not data) | https://talkpython.fm/episodes/show/473/being-a-developer-with-adhd |

> **Honesty note:** There is no clean epidemiological study of "ADHD prevalence among software engineers specifically." A5 is the honest ceiling — a widely-felt belief, not a measured fact. Say it that way.

---

## Lens B — ADHD Cognitive Mechanisms

| # | Claim | Evidence quality | Tag | Source / URL |
|---|-------|------------------|-----|--------------|
| B1 | Meta-analysis of **38 studies**: moderate-magnitude effect sizes for working-memory deficits in adults with ADHD vs controls, across phonological AND visuospatial domains. | Peer-reviewed meta-analysis (primary) | ✅ Verified | https://pubmed.ncbi.nlm.nih.gov/23688211/ |
| B2 | Working-memory deficits in ADHD **persist into adulthood** (not just a childhood phenomenon). | Peer-reviewed meta-analysis (primary) | ✅ Verified | https://pubmed.ncbi.nlm.nih.gov/23688211/ |
| B3 | Meta-analysis of **27 studies (1,620 ADHD participants)** on time perception/estimation differences. | Peer-reviewed meta-analysis (primary) | ✅ Verified | https://pubmed.ncbi.nlm.nih.gov/33302769/ |
| B4 | Children/adolescents with ADHD show a tendency to **overestimate time** vs controls (group-level time-perception distortion). | Peer-reviewed | ⚠️ Flag (child sample; 1 skeptic partial) | https://pubmed.ncbi.nlm.nih.gov/33302769/ |
| B5 | Named ADHD mechanisms relevant to knowledge work: **time blindness, emotional reactivity, disorganized thinking, cognitive fatigue, executive dysfunction** (difficulty prioritizing / organizing / initiating). | Academic (arXiv) | 🟡 Gathered | https://arxiv.org/html/2507.06864 |
| B6 | ADHD reduces working-memory capacity by ~**25–35%** vs neurotypical peers (article cites *J. Attention Disorders*). | Blog citing journal | ⚠️ Flag (verify primary) | https://learntothrivewithadhd.com/the-adhd-brains-whiteboard-practical-strategies-to-strengthen-working-memory/ |
| B7 | ADHD **hyperfocus**: intense, time-distorting concentration — enables deep work but causes loss of track of other obligations. | Practitioner (SO) | 🟡 Gathered | https://stackoverflow.blog/2023/06/05/what-developers-with-adhd-want-you-to-know/ |
| B8 | Executive dysfunction makes task completion hard **without externally imposed structure** (e.g. deadlines). | Practitioner (SO) | 🟡 Gathered | https://stackoverflow.blog/2023/06/05/what-developers-with-adhd-want-you-to-know/ |

> **Bridge note:** B1/B2 (working-memory deficit) + B8 (needs external structure) are the scientific spine under every "externalize the state" workflow tactic. This is where borrowed rigor meets your playbook.

---

## Lens C — Context-Switching / Interruption Cost

**⚠️ Big one: the famous "23 minutes 15 seconds to refocus" figure is shaky. Handle with care — this is a credibility landmine on a conference stage.**

| # | Claim | Evidence quality | Tag | Source / URL |
|---|-------|------------------|-----|--------------|
| C1 | The widely-cited **"23 min 15 sec"** refocus figure has **no traceable primary printed source** — it appears only in interviews with Gloria Mark, not in a peer-reviewed paper. | Investigative blog | ⚠️ Flag (debunk) | https://blog.oberien.de/2023/11/05/23-minutes-15-seconds.html |
| C2 | Mark's actual field study: returning to an interrupted task took an average of **~25 min 26 sec** (same-day resumption) — close to but distinct from the pop figure. | Primary (CHI 2005) | 🟡 Gathered | https://ics.uci.edu/~gmark/CHI2005.pdf |
| C3 | Information workers spend only **~11 min** in a "working sphere" before switching/interruption; **57.1%** of segments were interrupted. | Primary (CHI 2005) | 🟡 Gathered | https://ics.uci.edu/~gmark/CHI2005.pdf |
| C4 | Before resuming an interrupted task, workers attended to an average of **2.26 other working spheres** first — attention scatters before it returns. | Primary (CHI 2005) | 🟡 Gathered | https://ics.uci.edu/~gmark/CHI2005.pdf |
| C5 | **Counterintuitive:** interrupted work was completed **FASTER**, not slower, with no quality loss — people compensate by working faster and writing less. | Primary (CHI 2008) | 🟡 Gathered | https://ics.uci.edu/~gmark/chi08-mark.pdf |
| C6 | The speed-up costs you: interrupted work produced significantly higher **workload, stress, frustration, time pressure, effort** (stress & frustration p<.01). | Primary (CHI 2008) | 🟡 Gathered | https://ics.uci.edu/~gmark/chi08-mark.pdf |
| C7 | Just **20 minutes** of interrupted work is enough to significantly elevate stress/frustration/workload — the cost accrues fast. | Primary (CHI 2008) | 🟡 Gathered | https://ics.uci.edu/~gmark/chi08-mark.pdf |

> **This is the sharpest argument in the whole brief.** C5 + C6 = the entire double-edged sword in two facts: *parallel agents don't make you slower — they make you finish faster while quietly torching your stress budget.* That's the ADHD-with-agents trap, backed by non-ADHD attention science. Lead with this, but cite C2 (the real number), never the folklore 23:15.

---

## Lens D — ADHD in Software Engineering (practitioner voices)

Experiential/community — good for quotes and relatability, thin on rigor. All 🟡/⚠️.

| # | Claim | Tag | Source / URL |
|---|-------|-----|--------------|
| D1 | The tight coding feedback loop (write → run → result) triggers dopamine and is especially engaging for ADHD brains. | 🟡 | https://talkpython.fm/episodes/show/473/being-a-developer-with-adhd |
| D2 | Hyperfocus overrides physical needs (hunger, pain) and derails schedules — "trying to change too much at once and missing meetings." | 🟡 | https://dev.to/abbeyperini/coding-and-adhd-cant-stop-10mf |
| D3 | ADHD brains resist switching focus away from a dopamine-delivering task. | 🟡 | https://dev.to/abbeyperini/coding-and-adhd-cant-stop-10mf |
| D4 | Hyperfocus can *overcome* ADHD negatives — "keep you glued while you go back and find your inattentive mistakes." | 🟡 | https://adapthd.com/topics/coping-strategies/programming-with-adhd-the-good-the-bad-and-the-hyperfocus/ |
| D5 | Practical coping: Pomodoro "religiously," early-morning solo work to minimize distraction. | 🟡 | https://www.ttncoaching.com/blog/adhd-software-engineers |
| D6 | Time-blindness makes deadlines & time-conceptualization harder for ADHD engineers. | 🟡 | https://www.ttncoaching.com/blog/adhd-software-engineers |
| D7 | Additional first-person community accounts of coding-with-ADHD. | 🟡 | https://dev.to/aidiri/coding-with-adhd-how-do-you-do-it-4h9k |

---

## Lens E — ADHD × AI Coding Agents (THE FRONTIER / your moat)

**~18 months old, near-zero peer review. These are curated blog/essay sources.** See the gap note below — the raw Reddit/subreddit/X/HN proof-of-pain you specifically wanted was **not** captured by this run and needs a manual pass.

| # | Claim / quote | Tag | Source / URL |
|---|---------------|-----|--------------|
| E1 | **"an agent can hold eight open threads, my brain holds one ... the output-to-attention tradeoff is real."** Parallel agents amplify ADHD context-switch overwhelm. | 🟡 (blog, first-person) | https://thoughts.jock.pl/p/adhd-ai-agent-personal-experience-2026 |
| E2 | Title itself: *"I Have ADHD. My AI Agent Is the Best and Worst Thing for It."* — the double-edged thesis stated by someone other than you. | 🟡 | https://thoughts.jock.pl/p/adhd-ai-agent-personal-experience-2026 |
| E3 | ADHD-as-edge counter-case: cross-project context held by separate agents framed as a feature, not a bug. **⚠️ CORRECTION: the "~20 agents in parallel" detail is NOT on the kairi dev.to page** (manual re-check) — do not attribute that number to this source. Only E4 is confirmed on that page. | ⚠️ Flag (mis-sourced number) | source uncertain — re-find before use |
| E4 | Executive-dysfunction gap: *"I can think through a problem in full, narrate the solution out loud, and then sit down at my desk and watch the plan evaporate"* — precisely the gap an agent fills by holding+executing the chain. | ✅ Verified (quote confirmed on page) | https://dev.to/kairi_outputs/claude-code-as-executive-function-my-adhd-brain-setup-1412 |
| E5 | **"Structural isomorphism":** ADHD cognition and LLMs share failure modes — context-window/working-memory overflow → context loss, confabulation/hallucination on memory gaps, drift without external structure. **⚠️ Page returns 403 — UNVERIFIED.** Great framing device, but do not quote until you can open it manually. | ⚠️ Flag (403, unverifiable) | https://hackernoon.com/ai-agents-and-adhd-brains-break-in-the-same-ways |
| E6 | General "AI for ADHD" tooling landscape / framing. | 🟡 | https://fiftyfiveandfive.com/resources/ai-for-adhd/ |

> **The moat, distilled:** Nobody has authoritatively written *ADHD × coding agents*. E1/E2 give you the tension, E3 gives you the opposing "it's a superpower" case (essential for an honest piece), E4 gives you the mechanism (agent = externalized executive function), E5 gives you a killer conceptual frame (your brain and the model break the same way). That's a talk spine on its own.

---

## Lens F — Interventions → Workflow Tactics (the bridge)

Where evidence-based ADHD interventions map onto agent workflows. **This is what makes your tactics more than anecdote.**

| # | Intervention (evidence) | Maps to agent tactic | Tag | Source / URL |
|---|-------------------------|----------------------|-----|--------------|
| F1 | **Externalizing working memory** / cognitive offloading is a core EF intervention — "every thought held in working memory costs cognitive energy." | Renaming sessions; agent memory files; written plans = offloading state out of your head | 🟡 | https://neurodivergentinsights.com/executive-function-helpers/ |
| F2 | Consistent external memory systems measurably reduce daily memory failures. | Persistent agent context / CLAUDE.md / notes | 🟡 | https://learntothrivewithadhd.com/the-adhd-brains-whiteboard-practical-strategies-to-strengthen-working-memory/ |
| F3 | **Body doubling** — passive presence of another increases focus, motivation, sustained engagement; an accountability anchor. | Pairing with an agent ≈ digital body double | 🟡 | https://arxiv.org/html/2509.12153v1 |
| F4 | **Direct empirical hit:** VR body-doubling study (n=12) — participants finished faster & perceived greater accuracy/sustained attention vs working alone. | Strongest F-lens evidence, but small n | ⚠️ Flag (n=12) | https://arxiv.org/html/2509.12153v1 |
| F5 | **AI** body double improved ADHD focus/task performance **comparably to a human** one — no significant efficiency difference (p=1.000). | Direct evidence that a non-human agent delivers body-doubling benefit | 🟡 | https://arxiv.org/html/2509.12153v1 |
| F6 | "Digital body doubling" / co-presence AI intervention explicitly bridges the classic ADHD tactic to an AI-agent workflow. | Names the bridge for you | 🟡 | https://arxiv.org/html/2507.06864 |
| F7 | Body doubling = **"external executive functioning"** — an expert likens it to "an administrative assistant following you around all day." | Perfect metaphor for what an agent is | 🟡 | https://health.clevelandclinic.org/body-doubling-for-adhd |
| F8 | Body doubling defined: doing a task in the presence of someone "simply there, working on their own thing, not helping or supervising." | Definitional anchor | 🟡 | https://www.simplypsychology.com/articles/body-doubling-adhd |
| F9 | **Honest caveat:** direct trial evidence for body doubling is minimal — a few small studies + survey + clinician/community consensus. Plausible/cheap/safe, not proven. | Say this out loud | ⚠️ Flag | https://www.simplypsychology.com/articles/body-doubling-adhd |

> **Bridge, distilled:** your instinct tactics have names in the literature. *Rename the sessions* = externalizing working memory (F1/F2, resting on B1/B2). *Visual plans instead of walls of text* = reducing text-parse load / visual scaffolding. *The agent itself* = external executive function / digital body double (F5/F6/F7). This is the un-copyable core: real ADHD science, retrofitted onto a 2026 agent workflow.

---

## Narrative seeds (strongest screenshottable / quotable moments)

Ranked for talk/blog punch. Each is a slide waiting to happen.

1. **"Eight threads, one brain."** (E1) — the output-to-attention mismatch, in one line. → https://thoughts.jock.pl/p/adhd-ai-agent-personal-experience-2026
2. **The 23:15 myth.** (C1/C2) — debunk the number everyone quotes, then give the real one. Instant credibility move. → https://blog.oberien.de/2023/11/05/23-minutes-15-seconds.html
3. **Faster, but on fire.** (C5+C6) — interruption makes you finish quicker *and* quietly spikes your stress. The trap in two facts. → https://ics.uci.edu/~gmark/chi08-mark.pdf
4. **"Watch the plan evaporate."** (E4) — executive dysfunction made visceral; the exact gap the agent fills. → https://dev.to/kairi_outputs/claude-code-as-executive-function-my-adhd-brain-setup-1412
5. **Same failure modes.** (E5) — your brain and the LLM both lose context, confabulate, and drift without structure. Killer framing — **⚠️ but source 403s; verify before quoting.** → https://hackernoon.com/ai-agents-and-adhd-brains-break-in-the-same-ways
6. **The agent as administrative assistant that follows you around.** (F7) — body doubling = external executive function. → https://health.clevelandclinic.org/body-doubling-for-adhd
7. **2.58% / 6.76%.** (A1/A2) — the one hard prevalence stat that survives scrutiny. Open with scale. → https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7916320/
8. **The morning-after graveyard.** (VERIFIED) — *"you wake up the next day and see 10 terminals, 5 dead ssh sessions, 3 conversations you dont even remember about."* The single most screenshottable proof-of-pain found. → https://dev.to/joiskash/the-perfect-agent-orchestration-tool-for-your-friendly-adhd-developer-33jp
9. **"External working memory. Not a metaphor."** (EDGE) — *"AI agents are external working memory. That's not a metaphor. That's literally what they do for me."* → https://fiftyfiveandfive.com/resources/ai-for-adhd/
10. **The non-judgmental helper.** (EDGE, HN-verified) — *"it's literally the only source of help, however imperfect, which doesn't degrade me for having this affliction. It makes things much less scary and overwhelming."* The emotional core of the ADHD-as-edge case. → https://news.ycombinator.com/item?id=47171898

> Seeds 8–10 plus conference-lane analysis live in the companion file **`talks-and-community.md`** (verbatim quotes, HN-API-verified, YouTube + GitNation talks to cite/differentiate against).

---

## Hypothesis check (what the evidence actually supports)

**H1 — "Double-edged sword" (parallelism feels like a superpower but is a cognitive-load trap):**
*Supported, with nuance.* C5+C6+C7 give it real teeth (finish faster, pay in stress, fast onset). E1/E2 are first-person corroboration. **But** E3 is a genuine counter-example — some ADHD devs experience parallel agents as a net unlock, not a trap. So the honest thesis isn't "parallelism is bad," it's **"parallelism is a loaded tool whose default settings punish ADHD attention — the fix is retuning the interface, not doing less."** Stronger and more defensible.

**H2 — "Survival playbook" (concrete tactics to run N agents without shattering):**
*Supported as framing, evidence is bridge-quality not trial-quality.* F1–F8 give your tactics real names and mechanisms; A/B/C give the why. But almost none of it is RCT-grade for *this* use case — it's established ADHD science applied by analogy. Frame tactics as "grounded in ADHD intervention research," not "proven to work with agents."

---

## Gaps & what to chase next (honest)

1. **✅ RESOLVED — community proof-of-pain gathered** in companion file `talks-and-community.md`, including a **logged-in Reddit + X manual pass** (r/ClaudeCode, r/ClaudeAI, r/ADHD_Programmers + X) with verbatim quotes and permalinks. Conference-talk landscape mapped: **the ADHD × AI-agents angle is unoccupied** — closest prior talks (Weber-Tronic 2022, Perini 2024) pre-date the agentic era. Standout finds: the community independently calls Claude "external executive function," and the pain-thread *comments* are effectively the Post-3 playbook (task docs, PM agents, wrap-up skills).
2. **B6 / A4 soft figures** (25–35% WM reduction; 15–20% neurodiverse) cite journals second-hand — chase the primary before stage use.
3. **The whole brief's verification is incomplete** (rate-limit). The 5 ✅ are solid; re-run verification on the 🟡 set when the API isn't throttling, OR just spot-verify the ~8 narrative-seed claims by hand (fastest path, and you wanted the links anyway).
4. **No talk-specific sources yet** (existing ADHD-in-tech conference talks to differentiate against / avoid duplicating). Worth a scan before you pitch.
