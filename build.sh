#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "${SCRIPT_DIR}/common.sh"

requireTool pipenv
requireTool npm

pushd "${OPEN_WEBUI_DIR}" > /dev/null
pipenv install --skip-lock
popd > /dev/null

pushd "${ROOT_DIR}" > /dev/null
npm ci
popd > /dev/null
