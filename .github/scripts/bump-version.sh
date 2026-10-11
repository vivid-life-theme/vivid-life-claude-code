#!/usr/bin/env bash
# Computes a semver bump from Conventional Commits (gitmoji prefix tolerated)
# since the last vX.Y.Z tag, bumps package.json, regenerates the plugin
# manifest, and creates a local commit + annotated tag. Does not push; the
# caller workflow does that after checking the `bump` output.
#
#   type(scope)!: ... or "BREAKING CHANGE:" in body -> major
#   feat                                            -> minor
#   fix, perf                                       -> patch
#   anything else                                   -> no release
# Claude Code only updates a plugin when its manifest version changes, so a
# release-worthy commit must always end up as a new plugin.json version.

set -euo pipefail

write_output() {
  [[ -n "${GITHUB_OUTPUT:-}" ]] && echo "$1=$2" >> "$GITHUB_OUTPUT"
  return 0
}

classify() {
  local subject body="$2" stripped
  [[ "$1" =~ ^[^a-zA-Z]*([a-zA-Z].*)$ ]] && stripped="${BASH_REMATCH[1]}" || stripped="$1"
  if [[ "$stripped" =~ ^[a-zA-Z]+(\([^\)]*\))?!: || "$body" == *"BREAKING CHANGE:"* ]]; then
    echo major
  elif [[ "$stripped" =~ ^feat(\([^\)]*\))?:[[:space:]] ]]; then
    echo minor
  elif [[ "$stripped" =~ ^(fix|perf)(\([^\)]*\))?:[[:space:]] ]]; then
    echo patch
  else
    echo none
  fi
}

if ! last_tag="$(git describe --tags --abbrev=0 --match 'v[0-9]*' 2>/dev/null)"; then
  echo "No baseline tag found; skipping until the bootstrap tag exists."
  write_output bump none
  exit 0
fi

bump=none
while IFS= read -r hash; do
  level="$(classify "$(git show -s --format=%s "$hash")" "$(git show -s --format=%B "$hash")")"
  case "$level" in
    major) bump=major ;;
    minor) [[ "$bump" != major ]] && bump=minor ;;
    patch) [[ "$bump" == none ]] && bump=patch ;;
  esac
done < <(git log "${last_tag}..HEAD" --format=%H)

if [[ "$bump" == none ]]; then
  echo "No release-worthy commits since ${last_tag}."
  write_output bump none
  exit 0
fi

new_version="$(npm version "$bump" --no-git-tag-version | sed 's/^v//')"
npm run build
git add package.json package-lock.json .claude-plugin/plugin.json
git commit -m "🔖 chore(release): v${new_version}"
git tag -a "v${new_version}" -m "v${new_version}"

echo "Bumped to ${new_version} (${bump})"
write_output bump "$bump"
write_output new_version "$new_version"
