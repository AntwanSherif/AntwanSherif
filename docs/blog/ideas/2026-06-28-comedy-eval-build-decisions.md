# Handoff — Blog post: "Decide against the world as it is this week, not as your model remembers it."

## Purpose of next session
Turn a single build session — designing and shipping an evaluation harness for an AI side project — into a **portfolio blog article** about a discipline, not a tech stack: in fast-moving AI, the most expensive bug is a *stale assumption*, so the cheapest habit is re-verifying the perishable facts before each load-bearing decision. The session's plan got rebuilt twice, not from indecision but because every time I checked the current world against my priors, the world had moved: dialect ASR had gotten better, specialized models I assumed didn't exist were one `ollama pull` away, and the "obvious" language choice flipped once I noticed the real constraint. The spine to build toward: **your training data is a snapshot; your decisions ship into the present — so price them at today's exchange rate.**

This is a **writing task**, not a code task.

> **Anonymization (Act-1 Builder rule):** keep the project generic — *"a side project building an evaluation harness for a hard, low-resource dialect of AI-generated comedy."* The dialect (Egyptian Arabic) is fine as texture; don't name comedians or frame it as a branded product. The sister project is *"a related per-host AI-persona project."* Public tools (Ollama, whisper.cpp, Ghostty, the open models) keep their names — they're the setting, not the secret.

## The story in one paragraph
I sat down to plan a small eval harness and ended up rewriting the plan to a different programming language halfway through, because of a question I almost didn't ask: *is "Python is better for ML" still true for what I'm actually doing?* It wasn't — not because Python changed, but because I wasn't loading models in-process anymore; I was calling them as local HTTP services, which any language can do. That one re-examined assumption flipped the whole stack into the ecosystem I actually live in. The same thing kept happening: the "models are bad at this dialect" premise I was building on turned out to be *unmeasured* rather than *proven* (nobody had built the benchmark — which was the opportunity); the "transcription is hopeless" premise had quietly improved by a third; and the specialized models I assumed were research-paper vapor were sitting in a public registry, runnable on my laptop for free. Every decision got *better* the moment I checked it against this week instead of against my gut. The capstone was the cheapest one: I'd written `ANTHROPIC_API_KEY` into the prereqs out of habit, then realized I didn't have API access and didn't need it — the entire thing ran locally, for free, and produced its first real output in the target dialect ten minutes later.

## The beats (each a section)

1. **The most expensive line in any AI plan is an unstated "obviously."** "Obviously Python." "Obviously the models are bad at this." "Obviously you need an API key." Each one is a price quoted from memory. The discipline isn't genius, it's *invoicing*: before a decision rests on a fact, re-fetch the fact. I treat any capability, cost, or "X is better than Y" claim older than ~6 months as suspect, not fact.

2. **The stack choice that flipped on one question.** I had a complete plan in language A. Then: *what's the actual operation?* Not "load a model," but "send text to a model that's already running and get text back." Once local models are **services behind an HTTP port**, the language ecosystem stops mattering and you should optimize for the world you're fluent in. Rewriting the plan cost an hour; shipping in the wrong ecosystem would have cost every future hour. (Generalizable: the right abstraction boundary turns a religious war into a config value.)

3. **"They're bad at it" vs. "nobody's measured it."** My whole premise was a capability gap. Checking it, the gap was real but *mis-stated*: the models weren't proven bad, they were **unevaluated** — there was no benchmark for the thing at all. That's a stronger position than I started with: you don't fight a measured deficiency, you get to *define the measurement*. The reframe changed the product, not just the plan.

4. **The asset was one `pull` away, and free.** I'd budgeted for paid frontier APIs and assumed the specialized open models were academic. Both wrong: a specialized model was in the public registry, a one-line install, running on the laptop with no key. The lesson isn't "local is always better" — it's that the build-vs-buy-vs-already-exists question has a third box people forget to check, and it moves monthly.

5. **(Short, human) The bug that wasn't mine.** First real run, the output looked like garbage in the terminal — letters in the wrong order. Easy to assume my pipeline mangled the text. It hadn't: the data was perfect (the spreadsheet proved it); the *terminal* didn't support right-to-left rendering yet. Worth a beat because it's the same lesson pointed inward: before you debug your own code, check whether the layer *displaying* it is lying to you. (Bonus: the missing feature is a fun open-source PR waiting to happen.)

## The reframe to land
Most "indecision" in a fast-moving field is actually **stale confidence** — decisions made fast against a model of the world that was true at training time and isn't now. The fix is unglamorous and cheap: keep a short list of the perishable facts a decision depends on (capability, cost, what-exists, what's-better-than-what), and re-verify them at decision time, not from memory. Plans that get *rebuilt* because you checked aren't a sign of poor planning; they're the sound of a plan staying solvent. **Decide against the world as it is this week.**

## Possible title options
- "Decide against this week, not your training data."
- "The most expensive word in an AI plan is 'obviously.'"
- "Re-verify the perishables: planning in a field that moves monthly."
- "I rewrote the plan twice. That was the plan working."

## Notes / raw material to mine

Heterogeneous fragments. Mine freely.

---

A decision is a price quote. In a stable domain you can quote from memory. In AI the exchange rate moves weekly, so quoting from memory is how you overpay.

---

The stack debate dissolved the moment I named the real operation. "Python vs the-language-I-like" sounds like a values clash. "Do I load the model in-process, or call it over a port?" is a factual question with a boring answer — and the boring answer made the values clash evaporate. Most framework wars are an abstraction boundary drawn in the wrong place.

---

> "Obviously you need an API key."

I wrote it into the prereqs by reflex, then discovered I didn't have one, then discovered I didn't need one. The whole thing ran locally and free. The reflex was three years of muscle memory pricing something that had since dropped to zero.

---

There's a special kind of good news in "nobody has measured this." It means the gap you're chasing isn't a wall to climb — it's a ruler nobody's printed yet. Building the ruler is a better business than beating the wall.

---

The third box. Everyone runs build-vs-buy. The forgotten third box is *already-exists-and-is-free* — and in open-weight AI it refills every month. Not checking it is how you spend a budget on a thing that was one install away.

---

Cheapest debugging instinct I relearned: when output looks wrong, suspect the *display* before the *data*. The data was right; the terminal just couldn't render right-to-left. I almost "fixed" a pipeline that wasn't broken.

---

A plan that never gets rewritten in a fast field is suspicious — it means you stopped checking. Rewrites aren't waste; they're the receipts of re-verification. The waste is shipping the first draft because rewriting felt like admitting error.

---

Possible cold open: "Halfway through planning, I threw out the language I'd chosen — not because I changed my mind, but because I'd finally asked whether the reason was still true. It wasn't. It had quietly stopped being true while I wasn't looking."

---

Meta-fragment (maybe the kicker): the model writing your plan with you has the same bug — it's quoting a world frozen at its training cutoff. The human's job isn't to out-know it; it's to make it *go check*.
