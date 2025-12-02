#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

requireTool pipenv
requireTool npm

pushd "${SCRIPT_DIR}" > /dev/null
pipenv lock
popd > /dev/null

pushd "${ROOT_DIR}" > /dev/null
npm install --package-lock-only
popd > /dev/null
