#!/bin/bash
set -e

npm run build

TEMP_DIR=$(mktemp -d)

cp -a dist/. "$TEMP_DIR/"

CURRENT_BRANCH=$(git branch --show-current)

git checkout gh-pages

git rm -rf .

cp -a "$TEMP_DIR"/. .

git add -A
git commit -m "Deploy frontend"

git push origin gh-pages

git checkout "$CURRENT_BRANCH"

rm -rf "$TEMP_DIR"
