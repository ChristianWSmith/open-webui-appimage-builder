#!/usr/bin/env bash
set -euo pipefail
DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "${DIR}/common.sh"

log "Checking for required tools..."
requireTool pipenv
requireTool pyenv
requireTool npm

pushd "${OPEN_WEBUI_DIR}" > /dev/null
log "Locking pipenv..."
pipenv lock
popd > /dev/null

pushd "${ROOT_DIR}" > /dev/null
log "Locking node modules..."
npm install --package-lock-only
popd > /dev/null
