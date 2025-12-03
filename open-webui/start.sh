#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pushd "${SCRIPT_DIR}" > /dev/null

source "${SCRIPT_DIR}/.venv/bin/activate"
export WEBUI_AUTH="False"
open-webui serve --port "${1}"

popd > /dev/null
