# CLOUD & LOCAL HYBRID DEVELOPMENT PIPELINE

> **Objective:** Zero-friction, high-velocity Unreal Engine 5 development without burning cloud GPU money ($1.10 – $2.00/hr) on coding, idling, or reading documentation.

---

## 1. The Cost-Optimal Strategy: "Decoupled Dev"

Game development in Unreal Engine 5 traditionally requires heavy GPU resources. However, 85% of active development is **code design, JSON balance curves, state machines, math, and dialogue scripting**.

| Activity | Optimal Machine | Hourly Cost | Rationale |
| :--- | :--- | :--- | :--- |
| **C++ Coding & Physics Math** | Local Mac / Laptop | **$0.00 / hr** | Instant response, full AI pair-programming with Antigravity, no streaming lag. |
| **Data Balancing (`data/*.json`)** | Local Mac / Laptop | **$0.00 / hr** | Schema validation, speed caps, and dialogue trees are pure text/JSON. |
| **Git Operations & Task Tracking** | Local Mac / Laptop | **$0.00 / hr** | Manage sprint backlog and commit records with no GPU overhead. |
| **Engine Asset Baking / PIE Playtest** | AirGPU (Nvidia L4 / A10G) | **~$1.10 – $2.00 / hr** | Heavy rendering, World Partition streaming, Chaos physics validation. |
| **Controller Feel & Input Verification**| AirGPU via Moonlight | **~$1.10 – $2.00 / hr** | 1080p 60 FPS ultra-low latency (<26ms) gamepad testing. |

---

## 2. Remote Machine Automation (`setup_airgpu.ps1`)

The cloud provisioning script [`scripts/setup_airgpu.ps1`](../scripts/setup_airgpu.ps1) automates the entire Windows environment setup with a single command in administrative PowerShell:

```powershell
irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex
```

### What It Provisions Automatically:
1. **Developer Toolchain:** Git, GitHub CLI (`gh`), Node.js LTS, Python 3.11.
2. **Autonomous Agent (`agy`):** Installs the Antigravity CLI directly on the cloud VM (`irm https://antigravity.google/cli/install.ps1 | iex`). This enables autonomous agents to perform builds and engine tasks unattended.
3. **Game Development Workloads:** Visual Studio 2022 Community with the C++ Native Game Development workload and Windows SDKs.
4. **Remote Access:** OpenSSH Server running as an automatic Windows service (Port 22) and VS Code CLI (`code tunnel`).
5. **Idle Watchdog Service:** Installs [`scripts/watchdog_idle_shutdown.ps1`](../scripts/watchdog_idle_shutdown.ps1) as a startup task to automatically shut down the VM if it sits idle for 20 minutes without an active Moonlight stream or SSH session.

---

## 3. The Mac Control CLI (`scripts/airgpu.sh`)

You never need to open remote desktop or browser consoles just to manage the instance. From your local Mac terminal:

```bash
# Check if the cloud VM is booted and listening on SSH
./scripts/airgpu.sh status

# Direct 1-second SSH shell into Windows
./scripts/airgpu.sh ssh

# Launch an autonomous Antigravity agent on the cloud VM
./scripts/airgpu.sh agent

# Push local commits to origin and pull them onto AirGPU in one step
./scripts/airgpu.sh sync

# Shut down the cloud instance immediately to stop billing
./scripts/airgpu.sh shutdown
```

---

## 4. The "Don't Have to Think" Daily Workflow

```
┌────────────────────────────────────────┐
│ 1. Local Iteration ($0/hr)             │
│    • Author C++ classes & physics math │
│    • Tune data/physics_presets.json    │
│    • Commit changes to Git             │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ 2. Boot Cloud Machine                  │
│    • Click 'Start' on AirGPU dashboard │
│    • Run: ./scripts/airgpu.sh status   │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ 3. Automated Sync & Build              │
│    • Run: ./scripts/airgpu.sh sync     │
│    • Cloud pulls latest code & builds  │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ 4. Moonlight 60 FPS Playtest           │
│    • Open Moonlight on Mac             │
│    • Pick up gamepad & test feel       │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ 5. Safe Shutdown                       │
│    • Run: ./scripts/airgpu.sh shutdown │
│    • (Auto-watchdog protects if idle)  │
└────────────────────────────────────────┘
```
