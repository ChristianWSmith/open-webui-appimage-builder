#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "${SCRIPT_DIR}/common.sh"

log "Checking for required tools..."
requireTool pipenv
requireTool npm
requireTool wget

pushd "${OPEN_WEBUI_DIR}" > /dev/null
log "Installing pipenv..."
pipenv install --skip-lock
log "Downloading icon..."
wget https://raw.githubusercontent.com/open-webui/open-webui/refs/heads/main/static/favicon.png -O icon.png
popd > /dev/null

pushd "${ROOT_DIR}" > /dev/null
log "Installing node modules..."
npm ci
log "Building AppImage..."
npm run dist
popd > /dev/null
