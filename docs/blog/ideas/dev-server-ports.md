# [WORKING TITLE — draft] The Third Door: how I stopped my AI agents from killing each other's dev servers

> **Draft status:** raw shape, title + angle deferred. Three candidate framings parked for later:
> - **A — The false dilemma.** Kill vs. stop-and-ask are both wrong for the same reason; auto-increment is the third door. (Sharpest idea, most transferable.)
> - **B — The agentic-era failure mode.** Parallel agents exposed an old sloppiness ("everything runs on 3000"). (Best hook for reach.)
> - **C — Ports are identity.** Reframe collision as an identity problem. (Most elegant, slowest burn.)
>
> Current lean: open with B's pain, pivot to A's frame. Decide when the body is settled.

---

## The problem nobody designs for until it bites

For years, "everything runs on port 3000" was a harmless little lie. You run one project at a time, the port is free, life is fine. The default works because you never stress it.

Then I started running multiple AI coding agents across multiple projects at once — and the lie collapsed in a way that was almost funny. Every agent reached for 3000. Every project's dev server wanted it. And when an agent found 3000 occupied, it did the most agentic thing imaginable: it killed whatever was holding the port so it could have it.

So agent A boots my portfolio on 3000. Agent B, working on a different project, wants 3000, runs `kill $(lsof -ti:3000)`, and murders agent A's server. Agent A, mid-task, notices its server is gone and restarts it — on 3000 — killing agent B's. My "parallel" workflow spent half its wall-clock time serializing itself around a single contested number. The multi-agent setup didn't *create* this problem. It just turned a paper cut into a severed artery.

## The false dilemma

Here's the trap. When two servers want the same port, an agent has two instincts:

1. **Kill** whatever's holding it.
2. **Stop and ask** the human which one to keep.

Both feel reasonable. Both are wrong — and they're wrong for the *same* reason. Killing needs you to *notice the carnage* after the fact. Stopping needs you to *answer a prompt* before continuing. Each one drags a human back into a loop you were specifically trying to run unattended. They look like opposites — destructive vs. cautious — but they share the fatal property: **neither one parallelizes.** A workflow that stops to ask is just a workflow that runs one agent at a time with extra steps.

Once I saw that, the fix stopped being "pick the less-bad option" and became "find the door neither instinct reached for."

## The third door

The third door is **auto-increment**: when a server's preferred port is taken, it walks up to the next free one and just keeps going. No human, no killing, no blocking. N agents, N servers, zero collisions, zero prompts.

But auto-increment has an obvious objection, and it's the same objection that made me want fixed ports in the first place: **if the port can drift, which `localhost` am I actually looking at?** An agent that assumed `:3000` is now talking to the wrong server, or to nothing. Drifting ports are how you end up with two copies of an app running and no idea which tab is which.

The resolution is the part that makes the whole thing work: **don't kill the server, kill the *assumption*.** The agent should never *assume* a port — it should *read* the actually-bound port after the server boots. So every server, on startup, writes the port it actually grabbed to a known file:

```
.dev/port          # one number — the port this server actually bound
.dev/ports.json     # { "web": 3120, "api": 3125 } for multi-surface repos
```

Now the contract is dead simple, and it's the same in every repo: **the live port is in `.dev/port`. Always. No exceptions.** Solve discovery and auto-increment becomes strictly better than kill-or-ask. Skip discovery and auto-increment is just chaos with extra steps. The discovery file is the keystone — everything else is plumbing around it.

## The design, decision by decision

Once the principle was clear, the rest fell out as a series of forks. Each one had a real trade-off, so they're worth walking through.

### Pinned ports, declared in the repo

Each project pins a *preferred* port, declared inside its own config — not in a central registry. A registry is one more shared, mutable, drift-prone file that every project secretly depends on. Self-describing repos have no such coupling: the agent learns the port from the same place it learns everything else.

### Contiguous slots, not scattered numbers

I assign each project a **contiguous block of 10** — `insta` owns `3120–3129`, the portfolio owns `3130–3139`. Within a slot, surfaces take fixed offsets (web at base+0, admin at +1, API at +5). The alternative was grouping by *stack* — all frontends in one range, all APIs in another. But the thing you actually do twenty times a day is reason about *one project at a time* ("which ports does insta use?"), not enumerate every API across projects. Locality serves the frequent operation. A passive markdown ledger records who owns which slot — read by humans when claiming a new project, never touched at runtime.

### Reserved ports: turn the bad default into a sandbox

A few numbers get carved out of the assignable space entirely:

- **`3000` is never pinned to a real project.** It becomes the sacrificial scratch pad — when an agent grabs it out of habit, it lands on a port that's *supposed* to be transient, and nothing real dies.
- **`4000` belongs to the VSCode Vite extension** — a tool-imposed default, so I cede it rather than fight it.
- **`8000–8999` is the throwaway band** — prototypes and companion-mode experiments grab any free port here, unledgered, never colliding with a real pin.

### Leaves float; hubs hold still

This is the wrinkle that the clean "auto-increment everything" story doesn't survive contact with — and it's the most useful idea in the post.

Not all servers are equal. Some are **leaves**: only a human's browser points at them. Nothing in code addresses them by URL, so they can float freely — increment all you like. Others are **hubs**: other code addresses them by a fixed URL. In my `insta-super-edit` project, the two frontends proxy `/api` to the backend, and the backend's CORS policy names the frontends' origins. The API is a hub.

The moment a hub auto-increments off its expected port, every consumer that hardcoded its URL breaks. So the rule splits:

- **Leaves auto-increment** — worst case is a browser tab on a slightly different port, which the discovery file resolves anyway.
- **Hubs fail-fast** — if the API's pinned port is occupied, it refuses to move and surfaces a clear error, because a *silently relocated* hub is worse than a loud one. A collision on a hub means something is already wrong (a stale server you forgot about), and that deserves your eyes.

The principle generalizes well beyond ports: *things other code addresses by name can't move; things only humans look at can.*

### Enforcement: make the destructive path impossible

A convention is a *please*. Agents, mid-task, are very good at rationalizing past a please. So the design layers three levels of enforcement, each catching a different failure:

1. **Intent** — a global instruction: never assume a port, read `.dev/port`, never kill to free one.
2. **Construction** — dev scripts pin their port and refuse to wander, so honest collisions surface as clean errors instead of silent relocations.
3. **A hard guardrail** — a `PreToolUse` hook that pattern-matches the destructive idioms (`kill $(lsof -ti:PORT)`, `lsof | xargs kill`, `fuser -k`, `npx kill-port`) and *blocks the command before it runs*, returning a message that points the agent back at `.dev/port`.

Only the third level is *mechanically* incapable of being rationalized past, because the agent never gets to execute the command. The first two are a gentleman's agreement; the hook is the lock on the door. (The interesting part of writing the hook was tuning it to require `lsof` **and** a kill token **and** a pipe or command-substitution together — so a commit message that happens to say "lsof then kill" sails through, while the real idioms get caught.)

## What it looks like now

Each project ships a tiny `bin/dev` wrapper wired into its `dev` script. On boot it tries the pin, walks up the slot to the first free port (skipping live siblings), spills into the `8000s` only if the whole slot is full, writes the result to `.dev/port`, and execs the real framework — Vite, Next, a Bun server, whatever the repo uses. The wrapper is per-repo, so each one speaks its own stack's language while honoring the same contract.

The proof showed up for free the first time I tested it. The admin app's pinned port happened to be occupied by something already running. The old behavior would have been a kill or a prompt. The new behavior: it floated up one port, wrote the new number to disk, and kept going. I didn't have to know, and I didn't have to care. That's the whole point — the collision became a non-event.

## The takeaway

The specific scheme — slots, leaves vs. hubs, discovery files — is portable, but the transferable idea is smaller and sharper than any of it:

**When two options both feel forced, check whether they share a hidden cost.** Kill and stop-and-ask looked like opposites, but both spent the one resource I couldn't afford: my attention. The good solution wasn't between them. It was the move that refused to spend that resource at all — and then did the unglamorous work (a discovery file, an enforcement hook) to make that refusal safe.

---

<!-- RAW MATERIAL / GAPS TO FILL LATER
- Could add the actual bin/dev script as an appendix code block if the post wants a "show me the code" payoff.
- The ledger format (reserved section + project table) could be a screenshot or code block.
- Real numbers: how many projects/agents in parallel — quantify the "half the wall-clock" claim if I can.
- Consider whether the CORS/proxy coupling deserves its own short code example to make "hub" concrete.
-->
