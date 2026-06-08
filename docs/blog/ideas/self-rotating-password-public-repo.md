---
title: "A self-rotating password for a public repo (no backend, no cron, no database)"
status: draft
created: 2026-06-08
tags: [nextjs, security, git, vercel, edge]
---

> **Draft / idea.** Captured from the session where I actually built this. Needs a
> tighter intro, maybe a diagram, and a final read for voice before publishing.

## The setup

My portfolio is a public GitHub repo — it doubles as my profile README, so it *has* to
stay public. But I wanted to put my real work stories behind a gate: the detailed
narratives of what I built at past companies, written for hiring managers, not for the
open internet.

Two problems fall out of that one sentence:

1. **The content can't sit in a public repo.** Anyone could read `stories.tsx` on GitHub.
2. **The gate's password shouldn't live forever, or be guessable** — and I refuse to stand
   up a backend, a database, or a cron job for a portfolio.

Here's how I solved both with nothing but a private git submodule and a hash function.

## Part 1 — hiding content in a public repo with a private submodule

A git **submodule** is a repo nested inside another repo, where the parent doesn't store
the nested files — it stores a *pointer to one specific commit* of them. Think of it as a
bookmark. My public repo now contains a note that says "at `src/data/stories-private`,
check out commit `abc1234` of this *private* repo." The files themselves live in the
private repo; the public repo just references them.

```
AntwanSherif/                      (public — the profile repo)
└── src/data/
    ├── stories.tsx                 ← 3-line re-export wrapper (public)
    └── stories-private/            ← submodule → AntwanSherif-stories (PRIVATE)
        └── stories.tsx             ← the real content
```

The wrapper is the trick that keeps the blast radius at zero:

```ts
// src/data/stories.tsx (public)
export * from "./stories-private/stories";
```

Every consumer keeps importing `@/data/stories`. They have no idea the content moved.

The part that trips everyone up: the parent pins a *frozen commit*, not "latest." Editing
the private repo doesn't change the public build until you bump the pointer. That's two
commits for one change — annoying at first, but it means the public build is always
reproducible. Vercel handles private submodules natively; you just add a deploy key so its
build can clone the private repo.

## Part 2 — the password, and the rabbit hole I went down

The naive version is a static password in an env var. It works, but it never expires, and
if it leaks it's leaked forever. So I started pulling the "auto-rotate it" thread — and
the thread taught me three things.

### Lesson 1: generation is trivial, distribution is the whole cost

My first instinct was a scheduled job that generates a random password and updates the env
var. But a *random* auto-rotating password locks out the recruiter I shared it with — and
locks out *me*, because now I don't know it either. The hard part of rotation was never
making a new password. It's getting the new one to the people who should have it.

(My escape hatch, it turned out, was realizing I don't *need* distribution: a hiring
process wraps in about a month, so a password that quietly dies a month after I share it is
exactly right. Access expiring on its own is a feature, not a bug.)

### Lesson 2: "predictable rotation" is not rotation

The tempting cheap trick is a password like `acme-2026-06` — company name plus the month.
It rotates! But it's *predictable*: see one month's password and you can compute every
future one. That defeats the entire point.

### Lesson 3: derive the password, don't store it

The fix is to make the password a **function of a secret and the current time**, via HMAC:

```
password = Company-<code>
code     = base62( HMAC-SHA256(SECRET_SEED, "company|2026-06") )[:10]
```

This is the whole idea, and it's quietly powerful:

- **Unpredictable.** Without `SECRET_SEED` you can't forge a code, and June's code tells
  you nothing about July's. (Contrast `acme-2026-06`.)
- **Self-rotating with zero infrastructure.** The password changes every month purely
  because the clock moved. No cron, no API call, no redeploy — *the env var never changes.*
  That was the unlock: I was trying to rotate the secret, when I should have been deriving
  the password from a static secret.
- **Self-describing, so multiple companies need no database.** The company name *is* the
  prefix. To validate, the server splits off the name, recomputes the HMAC for that name in
  the current (and previous, for grace) month, and checks for a match. There is no list of
  companies stored anywhere — onboarding a company is just running a generator with its
  name.

### The counterintuitive bit: the algorithm is public on purpose

The validation code lives in `proxy.ts` — in my *public* repo. Anyone can read exactly how
the gate works. That's fine, and it's the point: security rests on the secret seed, not on
hiding the method (Kerckhoffs's principle). The only thing that must stay secret is one
high-entropy `SECRET_SEED` env var, which never enters either repo. The password
*generator* lives in the private submodule — not because it's a vulnerability if seen, but
to keep my list of companies and the backstage tooling out of the public eye.

## What it cost

About twenty lines of edge-safe Web Crypto, a re-export wrapper, and a private CLI. No
backend, no database, no cron, no redeploy-on-rotation. Passwords that are unguessable,
rotate themselves monthly, expire on their own, scale to any number of companies, and leak
nothing even though the whole mechanism is open source.

## Open threads for the final draft

- A diagram of the submodule pointer + the HMAC derivation would carry a lot here.
- Worth a sentence on the cookie: it stores the validated password and is re-checked every
  request, so access lapses automatically when the password rotates out.
- Maybe a short "things I rejected and why" box (Vercel cron, TOTP, random+notify).
