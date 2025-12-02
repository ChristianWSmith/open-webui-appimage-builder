#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

log "Checking for required tools..."
requireTool pipenv
requireTool npm

pushd "${SCRIPT_DIR}" > /dev/null
log "Locking pipenv..."
pipenv lock
popd > /dev/null

pushd "${ROOT_DIR}" > /dev/null
log "Locking node modules..."
npm install --package-lock-only
popd > /dev/null
