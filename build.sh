#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source "${SCRIPT_DIR}/common.sh"

requireTool pipenv

pushd "${OPEN_WEBUI_DIR}" > /dev/null

export PIPENV_VENV_IN_PROJECT=1
pipenv install --skip-lock

popd > /dev/null
