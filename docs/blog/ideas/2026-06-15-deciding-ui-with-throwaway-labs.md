# Handoff — Blog post: "Stop describing the UI. Build a lab and flip between options."

## Purpose of next session
Turn a multi-session design exploration into a **portfolio blog article** about a working method: when a decision is *visual*, stop arguing about it in prose with your AI pair and instead build the **cheapest interactive thing** that renders the options side by side, lets you flip between them with a tweak panel, and — the punchline — lets you judge them **on real data**. The reframe that makes it click: *prose comparison of visual choices is lossy — you end up debating adjectives instead of looking at the thing.* Build toward that line; it's the spine.

This is a **writing task**, not a code task.

> **Anonymization (Act-1 Builder rule):** keep the product un-named. Describe it generically as
> "a tool that uses AI to cull concert photos and clips down to the keepers." The method is the
> story; the product is just the setting.

## The story in one paragraph
I was reimagining the core "review" screen with an AI design partner. We did three rounds of AI-generated divergent directions — they mapped the space but produced no winner; every direction was a strong concept wearing usability costs, and I kept feeling "I'm not pulled to any of these." The unlock wasn't a fourth round. It was changing medium: instead of the AI *describing* options and me *imagining* them, it started building small self-contained HTML mockups with a live tweak/notes panel — a playable blueprint, then focused "labs" for copy, for motion, for colour. Suddenly decisions that had been circular for days collapsed in seconds, because they were finally **rendered and comparable**. The capstone: a colour clash I'd flagged but couldn't resolve in the abstract became obvious — and got decided — the moment a busy grid of *real concert photos* recoloured live under each palette.

## The three beats (each a section)

1. **Divergence maps the space; it doesn't pick the point.** The AI-generated direction rounds were genuinely useful — they surfaced a dozen great micro-ideas and taught us the constraints (a metaphor that's gorgeous in the chrome can wreck the work surface). But asking for "3 more directions" again and again is a tell that you're using divergence to avoid a decision. The job after divergence is *convergence*, and convergence wants a different tool.

2. **A tweak panel beats a paragraph.** The shift that mattered: every contested choice became A/B/C-able *in context*. Reject-card treatment? Render dim, grayscale, red-bar, strike, tint, shrink — and then, because the real answer was a blend, give it **sliders** (how much dim × how much grayscale) and **stackable modifiers**. Drawer width, score position, copy register, transition easing, the whole micro-interaction layer — each became "flip the toggle, watch it happen" instead of "imagine what I mean." Cost: a few hundred lines of throwaway HTML per lab. Payoff: decisions in seconds, and a record of *why*, because the picks export themselves.

3. **The real-data test is the one that actually decides.** I'd intellectually known the electric-green accent fought the green "keep" / red "reject" semantics — but I kept the chartreuse anyway, because on grey placeholder boxes it looked fine. Then we loaded ~17 real concert frames (mixed colours, mixed aspect ratios) into the same grid and flipped palettes live. On *actual* magenta-and-strobe photography the clash was undeniable in one glance, and the warm-amber pivot decided itself in about a minute. The lesson: placeholder mockups flatter every choice equally; real, messy data is the only honest judge. Build the lab so it can eat real assets.

## The reframe to land
When a decision is visual, don't debate it — **build the cheapest interactive thing that lets you flip between options on real data, and decide with your eyes.** An AI pair is great at *generating* those options and wiring the toggles fast; it's bad at *deciding* for you, and you shouldn't want it to. The division of labour that worked: the model builds the instrument, I read the dial.

## Possible title options
- "Stop describing the UI. Build a lab."
- "Decide with your eyes: throwaway labs for design choices"
- "The tweak panel beats the paragraph"

## Notes / raw material to mine
- The labs were single self-contained HTML files (no build step), each with a right-rail of live toggles + a notes box + a "copy my picks" button — so a design session produced a paste-able decision log for free.
- Composability mattered more than presets: "grayscale vs dim" was a false binary; the answer was a *mix*, which only a slider could find.
- Anti-pattern to name: using the AI's eagerness to generate more options as a way to *postpone* deciding.
- Cost framing for the reader: this is cheaper than a Figma file and faster than a prose thread — it's the minimum viable decision instrument.
