#!/bin/bash
# Chạy sync ở local thay cho GitHub Actions.
# Yêu cầu: file .env ở cùng folder gốc (github-sync/.env), Node 18+.
# Sau khi chạy, file data/*.json sẽ được generate. Tự git add/commit/push.

set -e

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
    echo "Missing .env file. Copy .env.example to .env and fill in values."
    exit 1
fi

# Load .env
set -a
source .env
set +a

node scripts/sync.js

# Commit + push nếu có thay đổi
if [[ -n $(git status --porcelain data/) ]]; then
    git add data/
    git commit -m "chore: sync sheets (local)"
    git push
    echo "Pushed updates."
else
    echo "No changes."
fi
