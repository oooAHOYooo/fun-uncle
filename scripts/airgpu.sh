#!/usr/bin/env bash
# ==============================================================================
# FUN UNCLE: AirGPU Remote Management & Agent Orchestration CLI
# Simplifies connecting, syncing, running remote agents, and stopping billing.
# ==============================================================================

set -e

CONFIG_FILE="$(dirname "$0")/.airgpu.conf"

# Defaults (can be overridden by .airgpu.conf)
AIRGPU_HOST="${AIRGPU_HOST:-c2331cca64.my.airgpu.com}"
AIRGPU_USER="${AIRGPU_USER:-Administrator}"
AIRGPU_SSH_PORT="${AIRGPU_SSH_PORT:-22}"

if [ -f "$CONFIG_FILE" ]; then
    # shellcheck disable=SC1090
    source "$CONFIG_FILE"
fi

show_help() {
    echo "=========================================================="
    echo "  FUN UNCLE: AirGPU Control CLI"
    echo "  Target Host: $AIRGPU_USER@$AIRGPU_HOST:$AIRGPU_SSH_PORT"
    echo "=========================================================="
    echo "Usage: ./scripts/airgpu.sh <command>"
    echo ""
    echo "Commands:"
    echo "  status       Check if AirGPU instance is online and reachable"
    echo "  ssh          Open direct interactive SSH shell into the cloud VM"
    echo "  agent        Launch Antigravity CLI (agy) remotely on the AirGPU"
    echo "  sync         Push local git commits and pull them on AirGPU"
    echo "  shutdown     Gracefully shutdown the cloud VM immediately to stop billing"
    echo "  bootstrap    Print the 1-line PowerShell bootstrap setup command"
    echo "  configure    Interactively set custom AirGPU Host / User"
    echo ""
}

cmd_status() {
    echo "Checking reachability of $AIRGPU_HOST:$AIRGPU_SSH_PORT..."
    python3 -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(2.5)
try:
    s.connect(('$AIRGPU_HOST', int('$AIRGPU_SSH_PORT')))
    print('✅ AirGPU is ONLINE! (SSH port $AIRGPU_SSH_PORT open)')
    s.close()
except Exception as e:
    print('⏳ AirGPU is OFFLINE or unreachable (reason: %s)' % e)
    print('   -> Ensure machine is turned ON in the AirGPU dashboard.')
"
}

cmd_ssh() {
    echo "Connecting to $AIRGPU_USER@$AIRGPU_HOST:$AIRGPU_SSH_PORT..."
    ssh -p "$AIRGPU_SSH_PORT" "$AIRGPU_USER@$AIRGPU_HOST"
}

cmd_agent() {
    echo "Launching Antigravity agent on $AIRGPU_HOST in fun-uncle workspace..."
    ssh -t -p "$AIRGPU_SSH_PORT" "$AIRGPU_USER@$AIRGPU_HOST" "powershell -NoExit -Command \"cd Projects\fun-uncle; agy\""
}

cmd_sync() {
    echo "1. Checking local git status..."
    git push origin main || true

    echo "2. Triggering remote git pull on AirGPU..."
    ssh -p "$AIRGPU_SSH_PORT" "$AIRGPU_USER@$AIRGPU_HOST" "git -C Projects\fun-uncle pull origin main"
    echo "✅ Sync complete. Cloud workspace is up to date with origin/main."
}

cmd_shutdown() {
    echo "Sending shutdown command to AirGPU ($AIRGPU_HOST) to halt hourly billing..."
    ssh -p "$AIRGPU_SSH_PORT" "$AIRGPU_USER@$AIRGPU_HOST" "shutdown /s /t 0"
    echo "✅ Shutdown signal sent. AirGPU instance will power down."
}

cmd_bootstrap() {
    echo "Run this command inside Windows PowerShell (as Admin) on the AirGPU instance:"
    echo ""
    echo "irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex"
    echo ""
}

cmd_configure() {
    read -rp "Enter AirGPU Host [$AIRGPU_HOST]: " input_host
    read -rp "Enter AirGPU SSH User [$AIRGPU_USER]: " input_user
    read -rp "Enter AirGPU SSH Port [$AIRGPU_SSH_PORT]: " input_port

    AIRGPU_HOST="${input_host:-$AIRGPU_HOST}"
    AIRGPU_USER="${input_user:-$AIRGPU_USER}"
    AIRGPU_SSH_PORT="${input_port:-$AIRGPU_SSH_PORT}"

    cat <<EOF > "$CONFIG_FILE"
AIRGPU_HOST="$AIRGPU_HOST"
AIRGPU_USER="$AIRGPU_USER"
AIRGPU_SSH_PORT="$AIRGPU_SSH_PORT"
EOF
    echo "Saved configuration to $CONFIG_FILE"
}

case "$1" in
    status) cmd_status ;;
    ssh) cmd_ssh ;;
    agent) cmd_agent ;;
    sync) cmd_sync ;;
    shutdown) cmd_shutdown ;;
    bootstrap) cmd_bootstrap ;;
    configure) cmd_configure ;;
    *) show_help ;;
esac
