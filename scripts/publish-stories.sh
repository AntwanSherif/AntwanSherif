#!/usr/bin/env bash
# Publish story content from the private submodule to both repos, in the correct order.
#
#   pnpm stories:publish "edit: tightened the Prism narrative"
#
# Does the two-step submodule dance safely:
#   1. commit + push the content INSIDE src/data/stories-private  (-> private repo)
#   2. bump the pinned pointer in the parent and push             (-> public repo)
# Order matters: pushing the submodule first guarantees the parent never points at a
# commit that doesn't exist on the remote (which would break fresh clones and Vercel).
set -euo pipefail

SUB="src/data/stories-private"
MSG="${1:-}"

# Run from repo root regardless of where the script is invoked from.
cd "$(git rev-parse --show-toplevel)"

if [ ! -e "$SUB/.git" ]; then
  echo "✗ Submodule not initialized at $SUB. Run: git submodule update --init" >&2
  exit 1
fi

if [ -z "$MSG" ]; then
  echo "✗ Commit message required." >&2
  echo "  Usage: pnpm stories:publish \"edit: what changed\"" >&2
  exit 1
fi

# --- Step 1: content -> private repo ---
if [ -n "$(git -C "$SUB" status --porcelain)" ]; then
  echo "→ Committing & pushing content in $SUB (private repo)…"
  git -C "$SUB" add -A
  git -C "$SUB" commit -m "$MSG"
  git -C "$SUB" push
else
  echo "ℹ No uncommitted content changes in $SUB."
  # Still make sure any local submodule commits are pushed before we pin them.
  git -C "$SUB" push 2>/dev/null || true
fi

# --- Step 2: pointer -> public repo ---
if [ -n "$(git status --porcelain -- "$SUB")" ]; then
  echo "→ Bumping submodule pointer in the public repo…"
  git add "$SUB"
  git commit -m "chore: bump stories submodule"
  git push
  echo "✓ Done. Private content pushed and public pointer bumped."
else
  echo "✓ Nothing to publish — pointer already matches the submodule's pushed commit."
fi
