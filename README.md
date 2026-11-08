# FUN UNCLE (Working Title)

> **"A high-momentum extreme-sports action comedy where an athletic, deceptively explosive suburban uncle embarks on an open-world arcade quest—tracked every step of the way by a neurotic biographer and a documentary camera crew."**

---

## 🎯 Executive Pitch

**Fun Uncle** blends the open-world sandbox freedom of *Grand Theft Auto*, the physics-driven analog board feel of *Skate*, the bone-crunching contact physics of *Madden*, the razor-sharp spin duels of *Rockstar Table Tennis*, high-altitude *Olympic Diving & Trampoline* acrobatics, and 6DoF atmospheric *Dogfighting*—grounded by a relatable, hilarious protagonist.

The game is designed with a **"Good Old Game"** philosophy:
- **No microtransactions, no battle passes, no FOMO.**
- Complete unlockables (Hawaiian shirts, vintage windbreakers, gold paddles) earned through exploration, challenges, and cheat codes.
- An impulse-buy, accessible arcade experience targeted at universal play across PC, Mac, Steam Deck, and consoles.

---

## ⚡ Quick Copy-Paste: Cloud GPU Automation (AirGPU)

> **Goal:** Run fast unattended batch jobs and shut down automatically so you never burn hourly GPU money ($1–$2/hr).

### 1️⃣ First-Time Cloud Setup (Run inside Windows PowerShell as Admin)
```powershell
irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex
```
*(Installs Git, Node.js, Python, Antigravity `agy` agent, VS 2022 C++, OpenSSH, Idle Watchdog, desktop shortcuts, and clones the repo).*

### 2️⃣ Auto-Batch Sync & Build (Inside PowerShell or double-click Desktop shortcut)
```powershell
# Pull latest code & build:
powershell -ExecutionPolicy Bypass -File .\scripts\run_batch.ps1

# Pull latest code, build, and AUTO-SHUTDOWN when done (Zero wasted minutes):
powershell -ExecutionPolicy Bypass -File .\scripts\run_batch.ps1 -ShutdownOnFinish
```

### 3️⃣ Control from your Mac Terminal (No Remote Desktop needed)
```bash
./scripts/airgpu.sh status              # Check if cloud machine is online
./scripts/airgpu.sh batch --shutdown    # Push local code, build remotely & auto-poweroff
./scripts/airgpu.sh agent               # Run autonomous Antigravity agent on cloud
./scripts/airgpu.sh shutdown            # Turn off machine immediately to stop billing
```

---

## 📚 Project Documentation & Specifications

All core design, architectural, and agent-orchestration documentation lives in [`docs/`](docs/):

| Document | Purpose |
| :--- | :--- |
| **[`docs/GDD.md`](docs/GDD.md)** | **Master Game Design Document:** Core premise, character profile, mechanics, level flow, and world design. |
| **[`docs/CONTROLS_SPECIFICATION.md`](docs/CONTROLS_SPECIFICATION.md)** | **Exhaustive Input & Gamepad Manual:** State-driven analog stick curves, button matrices, and historical control lineage. |
| **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** | **Engine Architecture Blueprint:** UE5 C++ class hierarchy, Enhanced Input, Chaos physics, and Data-Driven schemas. |
| **[`docs/NARRATIVE_AND_AUDIO.md`](docs/NARRATIVE_AND_AUDIO.md)** | **Mockumentary & Audio Bible:** Vance Sterling's biography narration, Aunt Brenda comms, and reactive dialogue tags. |
| **[`docs/MULTI_AGENT_SYSTEM.md`](docs/MULTI_AGENT_SYSTEM.md)** | **Agent Orchestration Framework:** Multi-agent role definitions, task locking, verification protocols, and handoffs. |

---

## 🤖 Multi-Agent Development Workflow

This repository is built from the ground up for **Agentic Development** (AI agents writing code, generating levels, balancing physics, and reporting progress):

1. **For Agents:** Always read **[`AGENTS.md`](AGENTS.md)** before touching any files.
2. **Task Backlog:** See **[`tasks/BACKLOG.md`](tasks/BACKLOG.md)** for prioritized epics, tasks, and acceptance criteria.
3. **Current Sprint & Locking:** Check **[`tasks/CURRENT_SPRINT.md`](tasks/CURRENT_SPRINT.md)** to claim a task and avoid conflicts.
4. **Handoff Reports:** Log completed work in **[`tasks/AGENT_REPORTS/`](tasks/AGENT_REPORTS/)**.

---

## 🎮 Core Traversal & Vehicle Rules

1. **No Cars:** The protagonist refuses to drive modern cars on principle ("Too many damn touchscreens").
2. **Speed Cap:** Ground speed is strictly capped to skateboards, rental e-scooters, and bicycles (30–40 MPH). 
3. **Alternative Mounts:** Horses (park mounts) and city trains (hijacked politely because the conductor owes a personal favor).
4. **Sub-Orbital Dogfighting:** Launched via municipal orbital cargo catapult in an open-cockpit atmospheric glider; dismounts by high-altitude ejection into a skydiving dive/trampoline landing.

---

## 🛠️ Tech Stack & Target Platforms

- **Engine:** Unreal Engine 5 (UE 5.4+ / 5.5) using Enhanced Input, Chaos Physics, and World Partition.
- **Workflow:** GitOps data-driven design (JSON/YAML game balance, missions, and dialogue).
- **Target Platforms:** PC (Steam / Itch.io), Mac (Apple Silicon), Steam Deck, Xbox Series X/S (Dev Mode / ID@Xbox).
- **Cloud Dev Support:** Configured for low-cost cloud development (AirGPU / Paperspace via Moonlight & Parsec) alongside local Linux/Mac git operations.

---

## ☁️ Cloud Workstation Setup (AirGPU & Moonlight)

> **Last Updated:** 2026-11-08T11:58:00-05:00  
> **Target Cloud Host:** Windows Server 2025 / Windows 11 with NVIDIA GPU (Nvidia L4 24GB or A10G)  
> **Streaming Client:** Moonlight 6.2.0+ (1080p 60 FPS, 15 Mbps, <26ms ping)

### 🚀 Instant Bootstrap (Inside Remote VM)
To provision a brand-new cloud machine with all dependencies, open **PowerShell as Administrator** on the remote Windows desktop and run:

```powershell
irm https://raw.githubusercontent.com/oooAHOYooo/fun-uncle/main/scripts/setup_airgpu.ps1 | iex
```

This automated script ([`scripts/setup_airgpu.ps1`](scripts/setup_airgpu.ps1)) will:
1. Install **Git**, **GitHub CLI**, **Node.js LTS**, and **Python 3.11**.
2. Install **Antigravity CLI** (`agy`) for unattended autonomous agent workflows.
3. Install **Epic Games Launcher**.
4. Install **Visual Studio 2022 Community** with the *"Game development with C++"* workload.
5. Enable and start **OpenSSH Server** for direct CLI control from your Mac.
6. Install **VS Code** with remote tunnel support (`code tunnel`).
7. Install an **Idle Watchdog** ([`scripts/watchdog_idle_shutdown.ps1`](scripts/watchdog_idle_shutdown.ps1)) to auto-shutdown if idle for 20 minutes (saves $1-$2/hr).
8. Clone this repository directly into `%USERPROFILE%\Projects\fun-uncle`.

### 🕹️ Frictionless Local Control (`scripts/airgpu.sh`)
Manage the cloud instance directly from your local Mac terminal:
- `./scripts/airgpu.sh status` — Check if instance is online
- `./scripts/airgpu.sh ssh` — Instant SSH terminal into Windows
- `./scripts/airgpu.sh agent` — Run remote `agy` agent directly on the GPU instance
- `./scripts/airgpu.sh sync` — Push local changes and trigger git pull on cloud
- `./scripts/airgpu.sh shutdown` — Stop the VM immediately to halt hourly billing

For full architectural details on the decoupled workflow, see [`docs/CLOUD_PIPELINE.md`](docs/CLOUD_PIPELINE.md).

### 🎮 Connecting to the Stream
1. Start the machine in the cloud dashboard (check *"Use spare server capacity"* for ~$1.10/hr).
2. Open **Moonlight** locally.
3. Select your cloud host (e.g., `c2331cca64.my.airgpu.com`) and stream at **1080p 60 FPS**.

---

*Repository maintained by oooAHOYooo.*
