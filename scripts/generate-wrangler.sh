#!/usr/bin/env bash
# Generate wrangler.toml from template + environment variables.
# Supports: .env file, exported env vars, or CI/CD environment variables.
# If wrangler.toml already exists and no env vars are set, skip generation.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE="$PROJECT_ROOT/wrangler.toml.template"
OUTPUT="$PROJECT_ROOT/wrangler.toml"
ENV_FILE="$PROJECT_ROOT/.env"

# Load .env if exists
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
fi

# If wrangler.toml exists and no env vars set, use existing file
if [ -f "$OUTPUT" ] && [ -z "${REDIRECTS_KV_ID:-}" ] && [ -z "${ANALYTICS_DB_ID:-}" ]; then
  echo "Using existing wrangler.toml (no env vars detected)"
  exit 0
fi

# Validate required env vars
missing=()
[ -z "${REDIRECTS_KV_ID:-}" ] && missing+=("REDIRECTS_KV_ID")
[ -z "${ANALYTICS_DB_ID:-}" ] && missing+=("ANALYTICS_DB_ID")

if [ ${#missing[@]} -gt 0 ]; then
  echo "Error: Missing required environment variables: ${missing[*]}"
  echo "Set them in .env file or export them before running this script."
  echo "See .env.example for reference."
  exit 1
fi

# Apply defaults
export REDIRECTS_KV_ID
export ANALYTICS_DB_NAME="${ANALYTICS_DB_NAME:-redirect-analytics}"
export ANALYTICS_DB_ID
export ACCESS_AUD="${ACCESS_AUD:-}"
export ACCESS_TEAM="${ACCESS_TEAM:-}"

VARS='${REDIRECTS_KV_ID} ${ANALYTICS_DB_NAME} ${ANALYTICS_DB_ID} ${ACCESS_AUD} ${ACCESS_TEAM}'

# Generate wrangler.toml using envsubst
if command -v envsubst &> /dev/null; then
  envsubst "$VARS" < "$TEMPLATE" > "$OUTPUT"
else
  # Fallback: single-pass sed substitution
  sed \
    -e "s|\${REDIRECTS_KV_ID}|$REDIRECTS_KV_ID|g" \
    -e "s|\${ANALYTICS_DB_NAME}|$ANALYTICS_DB_NAME|g" \
    -e "s|\${ANALYTICS_DB_ID}|$ANALYTICS_DB_ID|g" \
    -e "s|\${ACCESS_AUD}|$ACCESS_AUD|g" \
    -e "s|\${ACCESS_TEAM}|$ACCESS_TEAM|g" \
    "$TEMPLATE" > "$OUTPUT"
fi

echo "Generated wrangler.toml successfully"
