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
- **Cloud Dev Support:** Configured for low-cost cloud development (Paperspace / AirGPU via Parsec) alongside local Mac/Linux git operations.

---

*Repository maintained by oooAHOYooo.*
