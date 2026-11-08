# AGENTS.md — Multi-Agent Engineering & Development Rules

> **MANDATORY INSTRUCTIONS FOR ALL AI CODING AGENTS WORKING IN THIS REPOSITORY.**

---

## 1. Golden Rules of Engagement

1. **Working Title Awareness:** The current working title is **Fun Uncle** (`FunUncle`). Do not hardcode any permanent protagonist name in C++ class names, file names, or namespace signatures. Use parameterized naming (`FunUncleCharacter`, `PlayableUncle`, or configuration-driven identifiers).
2. **Read Before Implementing:**
   - Always read [`docs/GDD.md`](docs/GDD.md) for game design intent.
   - Always read [`docs/CONTROLS_SPECIFICATION.md`](docs/CONTROLS_SPECIFICATION.md) before touching input actions, stick calculations, or state transitions.
   - Always read [`tasks/CURRENT_SPRINT.md`](tasks/CURRENT_SPRINT.md) to see what tasks are currently in progress or locked.
3. **Task-Oriented Workflow:**
   - Every piece of work must correspond to an active task in [`tasks/CURRENT_SPRINT.md`](tasks/CURRENT_SPRINT.md) or a sub-task in [`tasks/BACKLOG.md`](tasks/BACKLOG.md).
   - Before starting, mark the task as `IN_PROGRESS [Agent-ID]`.
   - On completion, write an agent report in `tasks/AGENT_REPORTS/` and update the status to `COMPLETED [Commit SHA]`.
4. **Data-Driven Priority:**
   - Do not hardcode physics constants, movement speeds, spin multipliers, or dialogue lines directly into C++ classes.
   - All tunables MUST be exposed through the JSON schemas in [`data/`](data/) or Unreal Engine `DataTables` / `UPROPERTY(EditDefaultsOnly, Category = "...")`.
5. **Preserve Observer-First Operations:**
   - Never commit API keys, personal credentials, private SSH keys, or cloud platform secrets into the repository.
   - Commit messages must follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `tune:`).

---

## 2. Architecture & Engine Conventions

- **Target Engine:** Unreal Engine 5.4 / 5.5 C++.
- **Module Name:** `FunUncle` (`AFunUncleCharacter`, `UFunUncleMovementComponent`).
- **Input Architecture:** Unreal Engine **Enhanced Input System** only.
  - Contextual Mapping Contexts: `IMC_OnFoot`, `IMC_Skate`, `IMC_Airborne`, `IMC_Glider`.
  - Stick deadzones and response curves must conform to [`docs/CONTROLS_SPECIFICATION.md`](docs/CONTROLS_SPECIFICATION.md).
- **Physics Layer:** Chaos Physics Engine with physical animation ragdoll blending for Madden contact hits.
- **Python Automation:** All editor utility tools and level assembly scripts must live in `Scripts/` and use the native `unreal` Python module.

---

## 3. Agent Task Execution Lifecycle

```
┌─────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│  Pick Task from │ ──► │  Lock Task in        │ ──► │  Implement Changes in  │
│  BACKLOG.md     │     │  CURRENT_SPRINT.md   │     │  Docs / Data / Code    │
└─────────────────┘     └──────────────────────┘     └───────────┬────────────┘
                                                                 │
                                                                 ▼
┌─────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│ Update Task     │ ◄── │ Commit with Hash     │ ◄── │  Write Agent Report in │
│ to COMPLETED    │     │ & Push to Branch/Main│     │  AGENT_REPORTS/        │
└─────────────────┘     └──────────────────────┘     └────────────────────────┘
```

---

## 4. Agent Roles & Specializations

When invoking subagents or operating within a team, identify with one of the standardized roles defined in [`docs/MULTI_AGENT_SYSTEM.md`](docs/MULTI_AGENT_SYSTEM.md):
- **Role A: Physics & Character Engineer (`agent-physics`):** Focuses on stick responsiveness, board curves, dive rotations, trampoline restitution, and collision envelopes.
- **Role B: World & Systems Engineer (`agent-systems`):** Focuses on mounts, vehicles, train interactions, level spawning, and streaming.
- **Role C: Combat & Deflection Engineer (`agent-combat`):** Focuses on table tennis deflection colliders, Magnus effect spin math, and enemy projectile behavior.
- **Role D: Narrative & Audio Designer (`agent-narrative`):** Focuses on Vance's literary biography triggers, Aunt Brenda's calls, mockumentary camera drone AI, and mission scripts.
- **Role E: QA & Task Orchestrator (`agent-orchestrator`):** Manages task assignments, validates PRs/commits against acceptance criteria, and maintains the backlog.

---

## 5. Verification Checklist Before Handoff

Before marking any task complete:
- [ ] Code follows UE5 naming standards (`A` for Actors, `U` for Components/Objects, `F` for Structs, `E` for Enums).
- [ ] All new variables are commented and categorized.
- [ ] Relevant JSON data schemas in `data/` are updated and validated.
- [ ] Changes adhere to the core gameplay constraints (No cars, 40 MPH ground speed limit, analog dual-stick mappings).
- [ ] Summary report is logged in `tasks/AGENT_REPORTS/YYYY-MM-DD_<task-name>.md`.
