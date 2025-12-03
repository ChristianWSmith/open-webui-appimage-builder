#!/usr/bin/env bash
set -euo pipefail
DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "${DIR}/common.sh"

"${SCRIPTS_DIR}/install.sh"

pushd "${ROOT_DIR}" > /dev/null
log "Building AppImage..."
npm run dist
popd > /dev/null
