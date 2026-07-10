---
status: accepted
decided: 2026-06-30
updated: 2026-06-30
area: infra/email
tags: [dns, cloudflare, email, email-routing, deliverability]
---

# Forward-only email on antwansherif.com via Cloudflare Email Routing

## Context

Antwan needs a professional, deliverable email address on his own domain to register for
professional hackathons. Between jobs, he has no work email, and many hackathon forms
reject free webmail (gmail) or ask for a "work email." An address on the canonical domain
`antwansherif.com` — already on Cloudflare DNS, site on Vercel — clears that bar and is, if
anything, *more* verifiable than a corporate address, since the domain visibly resolves to
his portfolio.

The immediate, must-have capability is **receiving** (getting the confirmation / verification
link). **Sending** ("reply so the recipient sees `antwan@antwansherif.com` in From") is a
nice-to-have that nothing yet forces.

Hard constraints:

- **Free** — no paid mailbox.
- **Receive now** — unblock hackathon sign-ups today.
- **Stay on Cloudflare** — domain DNS already lives there; don't add a new vendor.
- **No website disruption** — mail records must not touch the records serving the site.

## Decision

Enable **Cloudflare Email Routing** on the `antwansherif.com` zone as a **forward-only**
setup:

- Custom address `antwan@antwansherif.com` → forwards to `antwansherif@gmail.com`.
- **Catch-all** → same destination, so any improvised local-part (`jobs@`, `hi@`, typos)
  still reaches the inbox.
- Cloudflare auto-provisions the 3 MX records (`route1/2/3.mx.cloudflare.net`) and the SPF
  TXT (`v=spf1 include:_spf.mx.cloudflare.net ~all`). These are independent of the A/CNAME
  records serving the site, so the website is unaffected.
- A **DMARC** record `_dmarc` = `v=DMARC1; p=reject; rua=mailto:antwan@antwansherif.com` is
  added. `p=reject` is safe *because* we don't send yet — it blocks domain spoofing and
  builds sender reputation at zero risk to legitimate outbound (there is none).

**Sending is deliberately deferred.** No SMTP relay, no DKIM, no Gmail "Send mail as" — until
a hackathon actually requires emailing them back from the domain. Cloudflare Email Routing
*cannot send mail* (it is a router, not a mailbox), so adding send later means bolting on a
transactional relay; that work is scoped but not done.

The portfolio is **not** changed: `src/data/resume.tsx` keeps showing `antwansherif@gmail.com`.
Publishing the forwarding address on the public site would invite scraped spam into the real
inbox for no current benefit — the address only needs to exist on registration forms.

## Alternatives considered

| Option | Verdict |
| --- | --- |
| **Cloudflare Email Routing (forward-only)** | **Chosen** — free, ~10 min, stays on existing vendor, satisfies the must-have (receive). Can't send — accepted, deferred. |
| **Zoho Mail (free tier)** | Real send+receive mailbox on a custom domain, free for 1 user. Rejected for now — a second vendor + separate inbox to check; send isn't needed yet. Strong phase-2 candidate if a full mailbox becomes worth it. |
| **Google Workspace** | Full mailbox, sends cleanly, integrates with the existing gmail habit. Rejected — paid (~$7/user/mo) for a capability not yet required. |
| **Migadu** | Excellent custom-domain mailbox host. Rejected — paid; overkill for current need. |
| **SMTP relay + Gmail "Send mail as"** (SMTP2GO/Brevo/Resend) | The send path itself, layered on top of routing. Deferred to phase 2 — needs DKIM + DMARC alignment; no current trigger. |

## Consequences

**Positive**
- Working professional inbox at $0, on the vendor already in use, in minutes.
- Catch-all means no form can stump us on the address.
- `p=reject` DMARC hardens the domain against spoofing from day one.
- Website untouched (MX is orthogonal to the web records).

**Negative / accepted**
- **Cannot send** as `antwan@antwansherif.com` — replies go out as gmail, which leaks the
  personal address. Accepted until a hackathon forces a reply-from-domain.
- **Catch-all** is a marginally larger spam surface over years (bots hit any local-part).
  Negligible on a fresh domain; revisit if it ever floods.
- **Destination verification is manual** — Cloudflare requires clicking a link delivered to
  the gmail inbox; can't be fully automated.

## Future direction (phase 2 — send-as, not built)

Trigger: a hackathon requires emailing organizers *from* the domain. Then:

1. Pick an SMTP relay with a free tier (SMTP2GO / Brevo / Resend).
2. Add the relay's DKIM CNAME(s); extend SPF to include the relay's sender.
3. Gmail → Settings → Accounts → **"Send mail as"** `antwan@antwansherif.com` via the relay's
   SMTP creds.
4. Re-confirm **DMARC alignment** so outbound passes `p=reject`.

If a full mailbox (not just send-as) becomes worthwhile, **Zoho Mail free** is the cheapest
path to send+receive without a relay; swapping to it means repointing MX off Cloudflare.
