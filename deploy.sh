#!/bin/bash
set -euo pipefail

# Find the repository root and work from there
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Build the frontend
npm run build

# Create a temporary location for the gh-pages worktree
TEMP_DIR=$(mktemp -d)
DEPLOY_DIR="$TEMP_DIR/gh-pages"

# Always clean up, even if deployment fails
cleanup() {
    git worktree remove --force "$DEPLOY_DIR" 2>/dev/null || true
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Create a separate working directory for gh-pages
git worktree add "$DEPLOY_DIR" gh-pages

# Remove the previous deployment files, preserving Git metadata
find "$DEPLOY_DIR" -mindepth 1 -maxdepth 1 \
    ! -name ".git" -exec rm -rf -- {} +

# Copy the new build into the deployment directory
cp -a dist/. "$DEPLOY_DIR/"

# Commit and push the deployment
git -C "$DEPLOY_DIR" add -A

if git -C "$DEPLOY_DIR" diff --cached --quiet; then
    echo "No deployment changes detected."
else
    git -C "$DEPLOY_DIR" commit -m "Deploy frontend"
    git -C "$DEPLOY_DIR" push origin gh-pages
fi

echo "Deployment complete!"

