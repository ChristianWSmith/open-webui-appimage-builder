#!/usr/bin/env bash
set -euo pipefail

export GREEN="\033[1;32m"
export RESET="\033[0m"

log() {
    echo -e "${GREEN}[open-webui-appimage-builder]${RESET} $*"
}

requireTool() {
    if ! command -v "$1" >/dev/null 2>&1; then
        log "Missing required tool: $1"
        exit 1
    fi
}


export ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
export OPEN_WEBUI_DIR="${ROOT_DIR}/open-webui"
export PIPENV_VENV_IN_PROJECT=1

