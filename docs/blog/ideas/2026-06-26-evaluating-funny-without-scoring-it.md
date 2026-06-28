# Handoff — Blog post: "You can't score 'funny.' So measure beside it, and steal an answer key."

## Purpose of next session
Turn a design/strategy grilling session — about how to prove a creative-AI idea works before building it — into a **portfolio blog article** about a transferable method: **how to evaluate something subjective rigorously and cheaply.** The setting is the hardest possible case (is a joke funny?), but the article is really about a general engineering move: when the quality you care about can't be scored directly, *don't score it directly* — decompose it into measurable proxies, manufacture a ground-truth answer key by hiding a naturally-occurring correct answer, and blind yourself against your own bias. The spine line to build toward: **"Is this funny?" is unanswerable. "Is this funnier than that — and could you tell it from the real thing?" is a measurement.**

This is a **writing task**, not a code task.

> **Anonymization (Act-1 Builder rule):** keep the project un-named and the relationships vague. Describe it generically as *"a side project to capture a regional dialect's comedic sensibility as a curated dataset"* (the specific dialect — Egyptian Arabic — is fine as texture; don't name comedians, shows, or position it as a branded product). Refer to the sister project only as *"a related project doing per-host AI personas."* The method is the story; the domain is just the proving ground.

## The story in one paragraph
I was pressure-testing an idea: capture a dialect's comedic sense as a dataset good enough that a frontier lab would want it. The whole thing rested on a claim I couldn't measure — "frontier models aren't funny in this dialect." The instinct is to build a generator, eyeball ten outputs, and declare victory. That's the trap: **"is this funny?" has no answer**, so eyeballing just measures your own hope. The unlock wasn't a better model or more data. It was refusing to score funniness at all. Instead: (1) measure two things *beside* funny that you actually can — does it sound authentically like a real speaker (the reliable canary, because models fail it obviously by defaulting to the formal register), and is A *funnier than* B (always comparative, never absolute); (2) manufacture a ground-truth answer key — take real bits, cut the punchline, have the model regenerate it, and blind-compare its punchline against *the comedian's actual one*. That last move turns an unmeasurable creative task into a Turing test **with an answer key**, buildable in a weekend, no training. The whole strategy collapsed from "train a model and hope" into "curate a little, retrieve, and run a blind test."

## The beats (each a section)

1. **"Is this funny?" is a non-question — and most creative-AI evals die on it.** Absolute quality on a subjective axis isn't measurable; ask it directly and you measure the asker. The tell: you're squinting at outputs, cherry-picking the three good ones, calling it a vibe. Every "our AI writes great X" demo that never ships a benchmark is stuck here. Naming this trap is the hook.

2. **Measure *beside* the thing, not the thing.** You can't score funny, but two neighbours are scorable and the model fails them *differently*: **authenticity** (sounds like a real native speaker vs. a stiff textbook translation — the canary, because the failure is obvious and consistent) and **relative funniness** (A vs. B, a preference, never a 1–10). Decomposing an unmeasurable quality into measurable adjacent ones is the core move. Bonus: authenticity is a *gate* — funny is uninterpretable on inauthentic text, so you test it first.

3. **Steal an answer key.** The best trick in the piece: find the version of your creative task that has a *naturally-occurring correct answer*, then hide it and reveal it. Comedy's is setup→punchline — the real punchline already exists; cut it, regenerate, blind-compare. Suddenly you have ground truth for a "creative" task everyone swears can't be graded. The general principle: a lot of subjective tasks contain a hidden supervised problem if you look for the place reality already wrote the answer down.

4. **You are the most biased judge in the room — so blind yourself.** "I'll just convince myself first" smuggles the bias back in: you curated the inputs, you can't unsee which output is yours. The fix isn't more people (though a few help) — it's **blinding**. Shuffle, hide the labels, score, *then* reveal. You can be the sole judge as long as you can't see the source. The discipline is the blindfold, not the headcount.

5. **(Short, technical) The contamination wall bites on day one.** If the thing you're testing the model to produce is sitting in the examples you let it see, you're measuring a lookup, not a capability — a perfect, meaningless score. The fix is a held-out split from the first hour. Small now, but it's the same wall that protects a benchmark later. Good place to land "build the honest habit while it's cheap."

## The reframe to land
When you need to evaluate something subjective — comedy, taste, "good writing," brand voice, "does this feel premium" — **stop trying to score the quality and start engineering around it.** Decompose it into measurable proxies, hunt for the place reality already wrote down a correct answer and turn that into a hidden answer key, and blindfold yourself against your own preference. Funny is just the hardest instance; the method is the same for any "I'll know it when I see it" quality. The punchline-shaped lesson: *you don't make the subjective objective — you build a test the subjective thing can't fake.*

## Possible title options
- "You can't score funny. Build a test it can't fake."
- "How do you benchmark a joke?"
- "Evaluating the unmeasurable: a cheap, honest eval for subjective work"
- "Steal an answer key: grading creative AI without lying to yourself"

## Notes / raw material to mine

Heterogeneous fragments — sentences, claims, and a second-post thread. Mine freely; not all survive.

---

The instinct when you can't measure quality is to look harder at the outputs. That's not measurement, that's hope with a clipboard.

---

Authenticity is the canary, not funniness. A model that isn't funny might still be saved by a better prompt. A model that sounds like a tourist reading a phrasebook has already lost, and it fails *that* test loudly and consistently — so it's the cheap early signal. Funny is the second gate; nobody laughs at something that doesn't even sound real.

---

The setup→punchline trick stated generally: **find the place where reality already wrote down the correct answer, then cover it with your thumb.** Comedy hands you this for free — the real punchline exists, it landed in a real room, and you can hide it. Translation has it (the human translation). A lot of "ungradeable creative" tasks have a supervised problem hiding inside them if you look for where ground truth already lives.

---

> "Convince yourself first."

The most dangerous sentence in a solo project. You're the curator. You picked the inputs, you'll recognize your own outputs, and you will — without meaning to — reward them. The blindfold isn't optional politeness; it's the only thing standing between you and a flattering lie.

---

A benchmark is a thing labs *climb*. If you define the measuring stick for a capability nobody else measures, you don't just have an eval — you have authority, and a number other people now want to move. We found that across an entire field's worth of benchmarks for this language, **not one** measured humor. The whitespace wasn't a model gap; it was a *measurement* gap. Sometimes the moat is the ruler, not the thing being measured.

---

Cheap things that compound are worth doing before they pay off. While hand-correcting machine transcripts, you're already reading every line closely — so tagging the joke's *structure* (misdirection, callback, act-out) and logging each slang word costs almost nothing extra, and later becomes your retrieval index, your benchmark's taxonomy, and a dictionary. Do the near-free thing now that has three future buyers.

---

Premature abstraction in a side project wears a seductive disguise: "this could be its own product!" (For us: a standalone dialect dictionary fell out of the transcription loop, and it was genuinely tempting.) The discipline: *extract* a second product from a working first one; don't *construct* it ahead of need. Don't christen the spin-off before the original makes a single person laugh.

---

The cheapest experiment can pick your strategy *for* you. We couldn't decide whether the product was "we make frontier models good at this" or "we have the best native engine." Instead of arguing, the design resolved it: a 2×2 of {frontier, native-model} × {raw, +our-data}, where the *interaction* cell — which base does our data help more? — literally answers which business we're in. Let the experiment break the tie you can't.

---

Selling a capability-gap dataset is selling rope. The whole value is that frontier models *can't* do the thing; the moment you license the data and they train on it, you've helped close the gap that was your only moat. A one-time data dump is a depreciating annuity — every sale makes the next worth less.

---

The fix for selling rope: sell the river, not the lake. A snapshot of data depreciates; an *ongoing* relationship to fresh material, the taste to curate it, and the benchmark that defines the standard — those renew. (Second-post candidate: "Stock vs. flow: why one-time data deals rot and recurring ones compound.")

---

Cost framing for the reader: the entire rigorous eval here is a weekend — a hundred curated examples, some retrieval, a blind shuffle, three friends. No GPUs, no training, no model. The lesson isn't "evaluating is hard," it's "evaluating honestly is *cheaper* than the self-deluding version, and it's the only version that tells you to stop or keep going."

---

Possible cold open: "I needed to know if a machine was funny. Not 'coherent,' not 'grammatical' — *funny*. There is no funny() function. So I stopped trying to write one."
