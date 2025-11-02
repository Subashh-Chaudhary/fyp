#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3001}"
HOST="${HOST:-localhost}"

if [ $# -lt 1 ]; then
  echo "Usage: $0 /path/to/image.jpg [port]" >&2
  echo "       PORT env var or 2nd arg controls port (default: 3001)" >&2
  exit 1
fi

IMAGE_PATH="$1"
if [ ! -f "$IMAGE_PATH" ]; then
  echo "Error: File not found: $IMAGE_PATH" >&2
  exit 1
fi

if [ $# -ge 2 ]; then
  PORT="$2"
fi

URL="http://${HOST}:${PORT}/ai/predict"

echo "→ Posting $IMAGE_PATH to $URL"
curl -sS -X POST \
  -F "image=@${IMAGE_PATH}" \
  "$URL" | sed 's/.*/Response: &/'

echo
echo "Done."
