<!-- SHAPED ARTICLE (writing-shape session, body-first). Hook derived last.
     Raw material: research-brief.md + talks-and-community.md + post-2-break-the-same-way.article.md -->

---
title: "The Playbook: Five Moves That Borrow From ADHD Science"
publishedAt: "TBD"
summary: "The tactics strangers rebuilt from scratch — and the ADHD research that explains why they work. Grounded, not proven."
draft: true
series: "adhd-coding-agents"
part: 3
---

The last piece ended with a confession: the goal was never to run *fewer* agents — it's to stop holding what the machine can hold for you.

Here's what surprised me when I went looking for how to do that. I didn't have to invent anything. Scroll deep enough into the pain threads — r/ClaudeCode, r/ClaudeAI, the ADHD-programmer corners of the internet — and you find strangers who never read a paper rebuilding, from scratch, the exact scaffolding the ADHD research would prescribe. One person started a "project manager" agent they could ask *what were we doing.* Another wrote a wrap-up ritual that drops the next step to a file before closing the session. A third broke everything into a task doc and updated it after each agent run.

They invented this independently. They just needed to survive the tool.

That pattern is the whole thesis of this piece. What follows is five moves — the ones I actually use, the community pain they fix, and the named ADHD intervention each one turns out to echo. I'm not going to oversell the evidence. Where a study is small, I'll say so. Where something is practitioner wisdom rather than proven science, I'll say that too. The goal is borrowed rigor, not borrowed authority.

*(Self-identified with ADHD, not clinically diagnosed — that caveat lives fully in [Part 1](./part-1). Here I'll just carry it as the operating lens.)*

---

## Move 1: Externalize the state

The simplest one, and the one that unlocks everything else.

Name your sessions. Write a `CONTEXT.md` — or whatever you want to call it — and have the agent update it at the end of every session: what we built, where we left off, what the next step is. When you come back after lunch, or the next morning, or two context-switches later, you don't ask *what were we doing* into the void. You read the file.

The Reddit thread that crystallized this for me was a post titled *"How do you guys stay on track on the project while Claude Code works?"* — and the comments are a textbook in externalizing state, invented sideways:

> *"ask Claude to break it down into a set of tasks … after each session update the doc with which tasks were completed … make notes on what to do next"* — u/lundren10

> *"I started a project manager agent so I can ask it what we just did and what's next"* — u/groundhoggirl

> *"a simple wrap-up skill that takes what you're doing and next steps and puts it in a file"* — u/JollyCooper473

(Source: https://old.reddit.com/r/ClaudeCode/comments/1txytw1/)

None of them cited literature. They were just trying to not lose their minds.

The research has a name for what they built. <Term id="working-memory">Working memory</Term> — the brain's scratchpad that holds a problem live while you work it — is measurably reduced in ADHD: a meta-analysis of 38 studies found moderate deficits in adults across both phonological and visuospatial domains, and these persist into adulthood (Alderson et al., https://pubmed.ncbi.nlm.nih.gov/23688211/). The core intervention for that deficit is externalizing working memory — pulling state out of your head and into a physical/digital system, so the scratchpad isn't the bottleneck. "Every thought held in working memory costs cognitive energy," as one neurodivergent-focused resource puts it (https://neurodivergentinsights.com/executive-function-helpers/). Consistent external memory systems measurably reduce daily memory failures (https://learntothrivewithadhd.com/the-adhd-brains-whiteboard-practical-strategies-to-strengthen-working-memory/).

Your session notes aren't just "being organized." They're cognitive offloading — an intervention with a research track record, applied to a 2026 agent workflow.

---

## Move 2: Turn walls of text into something you can see

Long agent output is its own attention trap.

A five-hundred-word plan in prose has to be parsed linearly. Every sentence demands a hold on what came before. For a brain already running a smaller scratchpad, that's a stacking cost — by the time you reach the end you've lost the beginning. I noticed I was re-reading the same agent outputs three times without retaining them, then giving up and just saying "go ahead" without actually knowing what I'd agreed to.

The fix is blunt: if it's complex enough to plan, make it visual. A diagram, a numbered checklist, a table with a column per decision. The agent can generate these. The output is the same; the parse load is not.

The research this maps to is less precise — "visual scaffolding" and reduced cognitive load for neurodivergent learners is practitioner-consensus more than it is settled trial science, and I won't claim otherwise. What I *can* point to is that <Term id="executive-function">executive function</Term> deficits make prioritizing and organizing hard without externally imposed structure (B8, https://stackoverflow.blog/2023/06/05/what-developers-with-adhd-want-you-to-know/). A visual layout imposes that structure at a glance instead of requiring you to parse and reconstruct it. That's the mechanism. The evidence is more "this makes intuitive sense given the working-memory picture" than "RCT-tested for ADHD agent users." Call it grounded, not proven.

---

## Move 3: Let the agent body-double

This one felt the most like a trick until I read what it mapped to.

There's a well-known ADHD strategy called <Term id="body-doubling">body doubling</Term>: working in the presence of another person who is simply there, on their own thing, not helping or supervising. The co-presence seems to anchor focus and motivation in a way working alone doesn't. Cleveland Clinic describes it as "external executive functioning" — and likens it to "having an administrative assistant follow you around all day" (https://health.clevelandclinic.org/body-doubling-for-adhd).

The question for our purposes is whether a non-human presence does the same thing.

There's one small study that tried to find out. A VR experiment with n=12 ADHD participants compared working alone versus working alongside a human body double versus working alongside an AI one. Participants finished faster and perceived greater sustained attention with any double present. The efficiency difference between the human double and the AI double: statistically indistinguishable (p=1.000) (arXiv 2509.12153, https://arxiv.org/html/2509.12153v1).

I want to be honest about the ceiling here. N=12. VR bricklaying task, not software development. "Small and suggestive" is the correct characterization, not "settled." The Simply Psychology coverage puts it plainly: direct trial evidence for body doubling is minimal overall — "plausible, cheap, and safe" rather than proven (https://www.simplypsychology.com/articles/body-doubling-adhd). You're not prescribed this on the strength of a single n=12 study.

But the felt experience is real. Having the agent *there*, working the problem with me — not just returning output but actively running — creates something that feels like accountability. One HN commenter reached for language I can't improve:

> *"it's literally the only source of help, however imperfect, which doesn't degrade me for having this affliction. It makes things much less scary and overwhelming, and I honestly don't know where I'd be without it."*
> — u/seertaak (https://news.ycombinator.com/item?id=47171898)

That's not a clinical outcome. It's a person describing what co-presence feels like when the alternative is alone with the blank cursor. The n=12 study is the sliver of evidence pointing in the same direction.

---

## Move 4: One live thread at a time

This one runs against the natural grain of working with agents, which is why it needs to be said explicitly.

[Part 2](./part-2) is about how running N agents in parallel manufactures self-interruption. The <Term id="context-switching-cost">context-switching cost</Term> isn't that you slow down — research on interrupted work shows the opposite. You finish *faster*. The cost is what it does to your stress budget: significantly elevated stress, frustration, and mental workload, with as little as 20 minutes of interrupted work enough to spike it (Mark et al. 2008, https://ics.uci.edu/~gmark/chi08-mark.pdf). For a brain that starts with a smaller scratchpad, the cliff is steeper.

The fix is almost boring: chunk your sessions, time-box them, and resist opening the next agent before the current one has a resolution worth writing down. One thread at a time doesn't mean one agent forever — it means you're the one choosing when to switch, deliberately, rather than being pulled by novelty or escape.

The community version of this showed up in the same r/ClaudeCode thread. The description of the failure mode is almost clinical in its accuracy:

> *"I feel like vibe coding has made my ADHD worse. … I create a spec / I give Claude Code the spec / It spends 20min or so / While its working I switch to some other task / When it's done I forgot what the next step / what I'm working on / and the overall cognitive context of the app. The constant cognitive switching is hurting my productivity."*
> — r/ClaudeCode (https://old.reddit.com/r/ClaudeCode/comments/1txytw1/)

The agent's wait time is a trap door. It feels like a free gap to explore something else. It is, in fact, the moment your stack gets wiped. Sit with it. Read the output when it comes back. Then write the next step down before you do anything else.

---

## Move 5: Guard the crash

This is the one nobody talks about until after it happens.

<Term id="hyperfocus">Hyperfocus</Term> with an agent is intoxicating. The feedback loop is fast. The output is real. You can go twelve hours feeling genuinely productive — and then wake up the next morning to a feature-rich architecture that doesn't ship, a graveyard of half-resolved threads, and a problem you can't remember the shape of.

One Reddit comment named the specific failure mode better than I could:

> *"when do you ship the code? I find myself second guessing that any of it is even REAL because of how easy it is … you end up with a huge feature-rich tech demo"*
> — u/LordMeatbag (https://old.reddit.com/r/ClaudeCode/comments/1pviba5/)

The ADHD dimension here is that the agent removes a lot of the friction that naturally limits how far a session goes. Normally you'd hit a hard part and slow down. With an agent, the hard parts get absorbed — and you keep going. The result can be impressive in scope and disconnected from anything shippable.

The intervention for this isn't willpower — it's structure. A hard session limit you commit to *before* you start. A "does this ship today?" question baked into the wrap-up ritual from Move 1. A definition of done that exists outside your head before the <Term id="hyperfocus">hyperfocus</Term> locks in.

The executive-dysfunction literature is clear that task completion is hard without externally imposed structure (B8). The agent removes the natural friction that was providing that structure. So you have to rebuild it deliberately — which, in practice, means writing the constraint down before you need it.

---

## The honest ceiling

These five moves are grounded in ADHD intervention research, not tested as agent-specific protocols. The working-memory science is solid (38-study meta-analysis, verified). The body-doubling evidence is small and suggestive (n=12, one VR task). The context-switching research is real but comes from knowledge workers in general, not ADHD programmers with agents specifically.

What you have here is established ADHD science applied by analogy to a 2026 workflow. The analogy holds tightly enough that strangers independently reinvented the tactics from scratch — which I find more persuasive than the alternative, where the research and the practice have nothing to say to each other.

Frame them as "here's what I do, here's the science it echoes, and here's honestly how strong that science is." That's what I've tried to do. Use them, adapt them, ignore the ones that don't fit your workflow — just don't hold them as proven protocols. They're not, yet.

The community is running the real experiment. The papers are the map; the threads are the territory.

---

*Part 1: [I ship in bursts](./part-1) · Part 2: [You and the model break the same way](./part-2)*
