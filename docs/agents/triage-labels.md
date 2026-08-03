# Triage Labels

The skills speak in canonical role names. This file maps them to the actual label strings used in this repo's issue tracker.

**State roles** — every triaged item carries exactly one:

| Canonical role             | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

**Category roles** — every triaged item carries exactly one of these too:

| Canonical role | Label in our tracker | Meaning                        |
| -------------- | -------------------- | ------------------------------ |
| `bug`          | `bug`                | Something is broken            |
| `enhancement`  | `enhancement`        | New feature or improvement     |

When a skill names a role, use the corresponding label string from these tables — e.g. "apply `ready-for-agent`".

Edit the right-hand column to match whatever vocabulary you actually use.
