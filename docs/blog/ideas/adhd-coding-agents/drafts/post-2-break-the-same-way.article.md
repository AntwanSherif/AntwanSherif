<!-- SHAPED ARTICLE (writing-shape session, body-first). Hook derived last.
     Raw material: drafts/post-2-the-moat.md + research-brief.md + talks-and-community.md -->

I'm self-identified with ADHD — not diagnosed, just one of a lot of engineers who saw themselves in the picture long before a clinician ever would. I lead with that because it's the lens for everything that follows.

Here's the strangest thing I've found working with AI coding agents every day: the hard part isn't how *alien* they are. It's how *familiar*. When an agent falls apart, it tends to fall apart in the exact ways I do — and the day that clicked, it rearranged how I work. What follows is the double-edged version of that discovery, because the same feature that makes these tools feel built for a brain like mine is the one that quietly takes it apart.

## The superpower is real

The first week I ran a handful of agents in parallel, it felt like someone had finally built a tool shaped like the inside of my head.

I wasn't alone in that. Scroll the ADHD corners of r/ClaudeAI and you'll find people practically vibrating:

> "Every random whim is suddenly a new session solving something. I can finally juggle 10 things AND keep track of it all!! Playing Claude session like Bobby Fischer playing chess with 20 people."

That's the pitch, and it isn't a lie. For a brain that runs on interest and novelty instead of importance, an agent is a slot machine that pays out in *working code*. Every impulsive idea gets its own terminal. The boring middle — the part where my projects always used to die — gets handed off. Someone on X put the mechanism in five words: *"adhd has trained me for this."* Another writer went further, and it's the sentence that stuck with me: *"AI agents are external working memory. That's not a metaphor. That's literally what they do for me."*

Hold onto that phrase — *external working memory*. It's the hinge the whole piece turns on.

## The crash nobody screenshots

Then, a few days into the assembly line, I hit a wall I couldn't explain.

Not bored — *depleted*. I'd kick off a session, jump to the next, kick off another, and somewhere around the fifth context-switch my brain would just brown out. Too tired to read the replies — which, said out loud, is an absurd thing to be tired of. The thing is *doing the work for you.* And yet there I'd be, staring at a wall of correct, helpful output I could not make myself parse, with no memory of what I'd asked or why I'd wanted it.

That part doesn't make the highlight reel. But it's not just me. Someone on r/ClaudeCode laid out the exact mechanism:

> "While it's working I switch to some other task. When it's done I forgot what the next step / what I'm working on / and the overall cognitive context of the app. The constant cognitive switching is hurting my productivity."

And the morning after, from another dev — the image I haven't been able to un-see:

> "you wake up the next day and see 10 terminals, 5 dead ssh sessions, 3 conversations you dont even remember about."

I've built that graveyard. More than once.

## What the research actually says

Here's the quote I held back a moment ago, because it's the whole science in one breath:

> "Each hop cost me 10-15 minutes just to get back in the zone. Six hops a day and I'm mass-producing nothing. Extremely efficiently."

*Mass-producing nothing, extremely efficiently.* Sit with that line, because it turns out to be almost exactly what the research found.

Gloria Mark spent years measuring how knowledge workers actually spend their attention. Two findings matter here. First, people last only about **eleven minutes** in one task before they switch or get interrupted — that's the baseline churn of an ordinary working day, no agents required. Second — and this is the one that reorganizes everything — when work gets interrupted, people often finish it *faster*, not slower. They compensate: they speed up, they cut corners, they write less. The catch is what it costs them. Interrupted work comes back measurably higher in stress, frustration, and mental load. You still get the output. You just pay for it in your nervous system.

(One footnote you'll thank me for on stage: the famous *"it takes 23 minutes and 15 seconds to refocus"* stat has no traceable source in the actual papers — someone went hunting through five studies and twenty-odd blog posts and never found it printed anywhere. I'm not going to use it, and neither should you. The eleven-minute churn and the faster-but-more-stressful finding are the real, citable ones. Cite those; drop the folklore.)

Now layer ADHD on top. Running a fleet of agents is a machine for **manufacturing your own interruptions** — kick off a session, switch away, come back to a wall of output with your mental stack wiped. It's <Term id="context-switching-cost">context-switching cost</Term>, except you're volunteering for it, all day, on purpose. And an ADHD brain starts with less in the tank: <Term id="working-memory">working memory</Term> — the scratchpad that holds a problem live while you work it — is measurably reduced, a moderate deficit across 38 studies that doesn't fade with age. The faster-but-more-stressful curve is steep for everyone. For us, it's a cliff.

## You and the model break the same way

Here's the idea that reorganized how I work.

When an LLM falls apart, we have exact language for it. It *ran out of context.* It *hallucinated* to paper over a gap. It *drifted* off-task because nothing was holding it to the plan. Read that list slowly. Context loss. Confabulation under memory pressure. Drift without external structure. That's not just how agents fail — that's my Tuesday.

The failure modes rhyme because the underlying constraint is the same: a small window of live memory, and a thing that comes apart when you overflow it. Once you see it you can't unsee it. The agent isn't a bigger, faster brain bolted onto mine. It's a brain with the *same weakness* — the one crucial difference being that this one, I can hand an external memory that never leaks.

I'm not the only one who landed here. On one ADHD thread, a bot auto-summarizing a hundred comments reached for the phrase unprompted: the agent as *"the ultimate external executive function."* And a developer writing about ADHD and AI put the felt version better than I could:

> "It didn't get distracted. It didn't forget. It didn't move on to something more interesting. It just held the thought."

The agent holds the thought I can't. That's the superpower from the top of this piece — *external working memory* — arriving right on schedule. And here's the knot it ties: the superpower and the crash are the *same mechanism.* The thing that holds your thread when your <Term id="executive-function">executive function</Term> drops it is the exact thing that, run five wide, manufactures the interruptions that shatter your attention. One tool. Both edges.

## It's a loaded tool, not a good one or a bad one

So I want to retire the question everyone opens with — is AI-assisted coding *good* for ADHD, or *bad* for it? Wrong question. It's a power tool with the safety off. My favorite description of the whole apparatus comes from a developer on X, and it's the truest thing I've read about agents:

> "AI coding agents are like a very bright and capable junior dev who has raging ADHD and occasionally gets smashed on mushrooms in the middle of a coding session."

You don't fix that junior dev by firing them. You don't fix them by pretending they're a senior, either. You fix them with *structure* — the external kind an ADHD brain needs anyway. Another writer, sitting in the same both-sides truth, put it plainest: the tools "have also made it easier than ever to overdo it. Both of those things are true at the same time."

Both true at the same time. That's the sentence I'd carve over the door of this whole era.

Which leaves the only question worth asking: what does that structure actually look like? Here's the hopeful part — I didn't have to invent it. Scroll far enough into any of those pain threads and you find strangers rebuilding, from scratch, the exact scaffolding the ADHD research would prescribe: notes the agent keeps for them, a "project manager" agent they can ask *what were we doing*, a wrap-up ritual that writes the next step to a file. They never read the papers. They just needed to survive the tool.

That's [Part 3](./part-3): the playbook — every tactic tied to the ADHD science it turns out to echo. The one thing to carry out of here, if you carry nothing else: the goal was never to run *fewer* agents. It's to stop holding what the machine can hold for you.

---

*Part 1: [I ship in bursts](./part-1) · Part 3: [The playbook — grounded](./part-3)*
