#!/usr/bin/env bash
set -euo pipefail
DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pushd "${DIR}" > /dev/null
source "${DIR}/.venv/bin/activate"
export WEBUI_AUTH="False"
export DATA_DIR="${HOME}/.cache/open-webui-desktop"
mkdir -p "${DATA_DIR}"
"${DIR}/.venv/bin/open-webui" serve --port "${1}"
popd > /dev/null
