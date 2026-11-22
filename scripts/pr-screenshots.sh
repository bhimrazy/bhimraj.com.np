#!/usr/bin/env bash
# Uploads images for a PR description to refs/screenshots/pr-<number> (a ref, not a branch, so it
# stays out of the branch list) and prints <img> tags that link each image by commit SHA. Running it
# again for the same PR adds to that ref. The repository is public: upload nothing private.
#
#   scripts/pr-screenshots.sh 128 course-dark.jpg course-light.jpg
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "usage: $0 <pr-number> <image>..." >&2
  exit 2
fi
pr=$1
shift
case $pr in *[!0-9]* | '') echo "PR number must be digits: $pr" >&2 && exit 2 ;; esac

ref="refs/screenshots/pr-$pr"
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
# A private index, so the working tree and staged changes are untouched.
export GIT_INDEX_FILE=$tmp/index

parent=$(git ls-remote origin "$ref" | cut -f1)
if [ -n "$parent" ]; then
  git fetch -q origin "$ref"
  git read-tree "$parent"
else
  git read-tree --empty
fi

for file in "$@"; do
  case $file in *.png | *.jpg | *.jpeg | *.gif | *.webp) ;; *) echo "not an image: $file" >&2 && exit 2 ;; esac
  blob=$(git hash-object -w "$file")
  git update-index --add --cacheinfo "100644,$blob,pr-$pr/$(basename "$file")"
done

tree=$(git write-tree)
commit=$(echo "Screenshots for #$pr" | git commit-tree "$tree" ${parent:+-p "$parent"})
git push -q origin "$commit:$ref"

for file in "$@"; do
  name=$(basename "$file")
  echo "<img src=\"https://raw.githubusercontent.com/$repo/$commit/pr-$pr/$name\" width=\"300\" alt=\"${name%.*}\" />"
done
