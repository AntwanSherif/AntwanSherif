<!--
DRAFT — Post 1 of 3 (the on-ramp). Not yet in content/.
Publish order #1, so this post carries the CANONICAL, fuller disclosure.
Post 2 should trim its opening disclosure to a one-line callback + link here
(flagged for cross-post dedup).
<Term id="...">...</Term> markers wrap glossary terms. Cross-links to Part 2/3
are placeholders. Voice/disclosure per decision record 2026-07-01-01.
-->

---
title: "I Ship in Bursts: ADHD and the Job That Both Fits and Fights My Brain"
publishedAt: "TBD"
summary: "Engineering is a strange home for an ADHD brain — the one place my hyperfocus is a superpower and my executive function is a liability, often in the same afternoon. Part 1 of a series on ADHD, coding, and the agents that changed the math."
draft: true
---

Here's a pattern I've lived my whole career: nothing, nothing, nothing — then everything at once.

Weeks where I circle a project like it's electrified, unable to start, knowing exactly what needs doing and physically unable to begin. Then a switch flips, and I'll disappear into it for fourteen hours, forget to eat, ship more in a night than I did the previous month, and surface blinking, a little proud, a little wrecked. My best work has almost always arrived this way — in a flood after a drought.

For a long time I thought that was just my personality. Then I learned it had a name.

I should say this plainly, because it shapes everything that follows: **I'm self-identified with ADHD, not clinically diagnosed.** Like a lot of engineers, I recognized myself in the picture long before any doctor would have signed off on it — and, statistically, I'm not unusual. Adult ADHD is heavily under-diagnosed; the [best global estimate](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7916320/) puts persistent adult ADHD around 2.58% and symptomatic adult ADHD near 6.76%, which is tens of millions of people, most of them undiagnosed, quietly building coping machinery in the dark. So when I say *my ADHD brain*, read it as self-knowledge, not a diagnosis. I think that honesty matters more than a certificate would.

This is Part 1 of a short series. Before I get to the thing that recently upended how I work — coding agents, which is [Part 2](./part-2) — I want to be honest about the terrain: what it's actually like to build software with this brain. Because the story isn't "ADHD is a superpower" and it isn't "ADHD is a disorder to overcome." It's stranger than either. Engineering is the rare job that hands my brain a superpower and a liability *in the same afternoon.*

## Why the job fits

Start with the good, because it's real and it's why so many of us end up here.

Code has the tightest feedback loop of almost any craft: write, run, see a result, adjust. For a brain wired to chase interest and novelty over importance, that loop is a slot machine that pays out in *working things*. Every fix is a tiny hit. Every green test is a little dopamine. Compilers don't care about my calendar; they care whether the thing runs, and that's a game I can actually stay inside.

And then there's <Term id="hyperfocus">hyperfocus</Term> — the flip side of the "can't start" coin. When the interest catches, the world narrows to the problem and time stops existing. It's the state where I do my deepest work, catch my own subtle bugs, hold an entire system in my head at once. Developers with ADHD talk about this constantly; as one put it in a [Stack Overflow piece](https://stackoverflow.blog/2023/06/05/what-developers-with-adhd-want-you-to-know/), hyperfocus is the thing that lets you "go back and find your inattentive mistakes." It's not a myth. It's the best tool I have.

The catch is that I don't get to choose when it shows up.

## Why the job fights

Now the other half, the part that doesn't make it into the LinkedIn posts.

The same brain that hyperfocuses also runs on an unreliable "just start" mechanism. There's a description of ADHD I've never been able to improve on, from a developer writing about exactly this: *"your brain's 'just do it' mechanism is broken. You can want something, know it's important, and still be physically unable to start. Not laziness, more like a disconnection between intention and action."* That's <Term id="executive-function">executive function</Term>, and mine is spiky. I can architect the whole solution in my head, narrate it out loud, feel it clearly — and then watch the plan evaporate the moment I sit down to type it.

Add the quieter taxes. <Term id="working-memory">Working memory</Term> — the mental scratchpad that holds a problem "live" while you work it — is measurably reduced in ADHD; a [meta-analysis of 38 studies](https://pubmed.ncbi.nlm.nih.gov/23688211/) found the deficit is moderate, real, and persists into adulthood. So the mental model of the codebase I'm juggling leaks faster than my colleagues'. Time slips too — deadlines and estimates are genuinely harder when your internal clock runs loose. And my projects have a signature failure mode: they die exactly where the interesting part ends and the boring, finishing part begins.

None of this is character. It's wiring. But wiring has consequences, and shipping software is full of the exact things this wiring is worst at: sustained attention across boring stretches, accurate estimation, remembering the twelve things in flight, finishing.

## The coping machinery

So you build scaffolding. Everyone with this brain does, whether they name it or not. Mine has been an ever-shifting pile of timers, lists, rituals, and tricks — most of it fragile, some of it embarrassing, occasionally brilliant. It works until it doesn't, and then you rebuild.

I'm not the first engineer to write about this, and I want to credit the people who did — because the "ADHD in tech" conversation is real and worth reading. Lenz Weber-Tronic gave a talk called ["Dealing with ADHD as a Developer"](https://gitnation.com/contents/dealing-with-adhd-as-a-developer) about his late diagnosis. Abbey Perini has spoken on ["Cognitive Load and Your Development Environment"](https://gitnation.com/contents/cognitive-load-and-your-development-environment). There's a whole community here, and it's generous.

But here's the thing I noticed, and the reason for this series: **all of that predates the agentic era.** Every one of those talks was written for a world where you wrote the code yourself, with autocomplete at most. That world is gone.

## What changed

About eighteen months ago, coding agents showed up and quietly rewrote the terms of my particular deal with software. Suddenly the "just start" barrier could be outsourced. The boring finishing work could be handed off. The plan that evaporates could be held — by something outside my head that never forgets, never gets bored, never wanders off to a shinier idea.

The first week, it felt like someone had finally built a tool shaped like the inside of my head.

And then it started breaking me in a completely new way.

That's [Part 2](./part-2): the double-edged sword nobody warned me about — how the very thing that felt like an ADHD superpower turned into a cognitive-load trap, why my brain and the model turn out to fail in exactly the same ways, and what the research on interruption actually predicts. [Part 3](./part-3) is the payoff: the workflow I rebuilt, tactic by tactic, each one tied to the actual ADHD science it turns out to echo.

The short version, if you only take one thing from Part 1: if you build software and you've always shipped in bursts, forgotten what you were doing the second you got interrupted, and watched your side projects die at the 80% mark — you're not broken, and you're definitely not alone. You've just been running demanding software on unusual hardware. The interesting question, the one this whole series is about, is what happens when that hardware finally gets a co-processor.

---

*Part 2: [Your brain and the agent break the same way](./part-2) · Part 3: [The playbook — grounded](./part-3)*
