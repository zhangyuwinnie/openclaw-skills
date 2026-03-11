#!/bin/bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: bash run.sh <input.md> [--style classic] [--author '@Dayu · R2']"
  exit 1
fi

INPUT_MD="$1"
shift || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_HTML="${INPUT_MD%.*}_slides.html"

node "$SCRIPT_DIR/scripts/build-slides.js" "$INPUT_MD" "$OUT_HTML" "$@"
node "$SCRIPT_DIR/scripts/render.js" "$OUT_HTML"

echo "Done. HTML: $OUT_HTML"
