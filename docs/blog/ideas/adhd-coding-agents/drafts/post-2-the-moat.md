<!--
DRAFT — Post 2 of 3 (the moat). Not yet in content/.
Frontmatter below is the content-collections shape, filled at publish time.
<Term id="...">...</Term> markers wrap glossary terms; the MDX <Term> component
renders the dashed-underline + hover/click definition. Cross-links to Post 1 and
Post 3 are placeholders until slugs are final (blog-wide cross-reference rule).
Voice/disclosure per decision record 2026-07-01-01: full first-person,
self-identified (not clinically diagnosed), stated early and transparently.
-->

---
title: "Your Brain and the Agent Break the Same Way"
publishedAt: "TBD"
summary: "Coding agents handed my ADHD brain a superpower and a trap in the same box. Here's the double-edged sword nobody warns you about — and why the fix isn't doing less."
draft: true
---

I should tell you upfront: I've never had a formal ADHD diagnosis. Like a lot of engineers, I recognized myself in the picture long before any clinician would have — the time that evaporates, the ten browser tabs that are somehow all "the current task," the plan I can narrate perfectly and then watch dissolve the second I sit down to start. So when I say *my ADHD brain*, read it as self-identified, not a doctor's note. I think that's worth saying out loud, because a huge share of the people this is about are exactly like me: undiagnosed, self-aware, and quietly building coping machinery in the dark.

This is Part 2. In [Part 1](./part-1) I made the case that ADHD and engineering have always had a complicated marriage. This part is about the thing that recently barged into that marriage and started rearranging the furniture: **coding agents.**

## The superpower, first — because it's real

The first week I ran multiple agents in parallel, it felt like someone had finally built a tool shaped like the inside of my head.

I wasn't the only one. Scroll r/ClaudeAI and you'll find an ADHD dev practically vibrating:

> "Every random whim is suddenly a new session solving something. I can finally juggle 10 things AND keep track of it all!! Playing Claude session like Bobby Fischer playing chess with 20 people."

That's the pitch, and it's not a lie. For a brain that runs on interest and novelty rather than importance, an agent is a slot machine that pays out in *working code*. Every impulsive idea gets a terminal. The boring parts — the ones where my projects always went to die — get handed off. One person on X put the mechanism perfectly: *"adhd has trained me for this."* Another: agents removed the blocker that had wrecked every side project he'd ever started, because <Term id="executive-function">executive function</Term>, the "just start" machinery that's unreliable in ADHD, was suddenly something I could borrow.

Hold onto that word — *borrow*. It's the whole story.

## The crash nobody screenshots

Here's the part that doesn't make it into the excited posts. A few days into the assembly line, I'd hit a wall I couldn't explain. Not bored — *depleted*. Too tired to even read the agent's replies, which is an absurd sentence when you say it aloud: too tired to read the thing that's doing the work for you.

Someone on r/ClaudeCode described the exact shape of it, better than I could:

> "While it's working I switch to some other task. When it's done I forgot what the next step / what I'm working on / and the overall cognitive context of the app. The constant cognitive switching is hurting my productivity."

And the morning-after, from another dev:

> "you wake up the next day and see 10 terminals, 5 dead ssh sessions, 3 conversations you dont even remember about."

I know that graveyard. I've built it more than once.

What's happening there has a name, and — this matters — it has *evidence* that isn't about ADHD at all. Gloria Mark's field research on how information workers actually spend attention found people last only about **eleven minutes** in one task before switching or being interrupted. And here's the twist that turns this from a productivity gripe into the crux of the whole piece: in her interruption studies, interrupted work often got finished *faster*, not slower — but at a measurable cost in stress, frustration, and mental load. People compensate by sprinting and cutting corners, and they pay for it in their nervous system.

*(One honest footnote, because I'd rather you trust me than be impressed: the famous "it takes 23 minutes to refocus" stat you've seen on a hundred slides has no traceable source in the actual papers. I'm not going to use it, and neither should you. The eleven-minute figure and the faster-but-more-stressful finding are the real, citable ones.)*

Now layer ADHD on top. Running N agents in parallel is a machine for **manufacturing your own interruptions** — you kick off a session, context-switch away, come back to a wall of output with your mental stack wiped. It's <Term id="context-switching-cost">context-switching cost</Term>, except you're paying it *voluntarily*, all day, on purpose. And an ADHD brain, already carrying measurable <Term id="working-memory">working-memory</Term> deficits — that's not a stereotype, it's a meta-analysis of 38 studies showing the gap persists into adulthood — starts the day with less in the tank to spend on it.

The faster-but-more-stressful curve is steep for everyone. For us, it's a cliff.

## The reframe: you and the model break the same way

Here's the idea I keep coming back to, the one that reorganized how I work.

When an LLM loses the thread, we have precise words for it: it *ran out of context*, it *hallucinated* to fill a gap, it *drifted* off-task without structure to hold it. Read that list again. Context loss. Confabulation under memory pressure. Drift without external scaffolding. That's not just how agents fail — **that's my Tuesday.** The failure modes rhyme because the constraint is the same: a small window of live memory, and a thing that falls apart when you overflow it.

Which flips the intuitive move. The instinct is to treat the agent as a bigger, faster brain bolted onto yours. But it's more useful to treat it as a brain with the *same weakness* — one you happen to be able to give an external memory that never leaks. A Reddit mod-bot, of all things, summarizing a hundred comments on an ADHD thread, landed on the phrase independently: the agent as *"the ultimate external executive function."* The crowd got there on its own. So did Chris Wright, writing about ADHD and AI:

> "It didn't get distracted. It didn't forget. It didn't move on to something more interesting. It just held the thought."

The agent holds the thought I can't. That's the superpower. And the superpower and the trap are *the same mechanism* — which is why the same tool does both. Wright again, in the line that is quietly the thesis of this entire series:

> "They've also made it easier than ever to overdo it. Both of those things are true at the same time."

## It's a loaded tool, not a good or bad one

So I want to kill the framing where you have to pick — is AI-assisted coding *good for ADHD* or *bad for it?* Wrong question. It's a power tool with the safety off. The same parallelism that lets me finally ship the boring middle of a project is the parallelism that leaves me staring at ten terminals with a fried nervous system and no memory of why. My favorite description of the whole apparatus is from a developer on X, and it's the truest thing I've read about agents:

> "AI coding agents are like a very bright and capable junior dev who has raging ADHD and occasionally gets smashed on mushrooms in the middle of a coding session."

You don't fix that junior dev by firing them. You fix it with *structure* — the kind an ADHD brain needs anyway, made cheap and external.

That's Part 3. Because here's the thing I found in the wild that gave me hope: the community isn't just describing the pain, they're independently reinventing the fixes. Buried in the comments of that "I forgot what I'm working on" thread, strangers were trading the exact tactics ADHD intervention research would prescribe — task docs the agent updates, a "project manager agent" you can ask *what did we just do and what's next*, a wrap-up ritual that writes your next step to a file so future-you doesn't have to hold it. They didn't read the papers. They just needed to survive the tool, and they rebuilt the science from scratch.

In [Part 3](./part-3), I'll name those tactics, tie each one to the actual ADHD research it echoes, and lay out the workflow I use to keep the superpower without the crash.

The short version, though, is this: the goal was never to run fewer agents. It's to stop holding what the machine could hold for me.

---

*Part 1: [ADHD in engineering, honestly](./part-1) · Part 3: [The playbook — grounded](./part-3)*
