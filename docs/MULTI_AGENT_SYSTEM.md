# MULTI-AGENT DEVELOPMENT PROTOCOL: FUN UNCLE

> **Purpose:** Defines the orchestration protocol, role taxonomy, locking mechanisms, and handoff standards for autonomous AI coding agents collaborating on this repository.

---

## 1. Multi-Agent Team Taxonomy

To maintain modularity and avoid git merge conflicts, agents specialize into one of five functional roles:

```
                      ┌───────────────────────────────┐
                      │      AGENT-ORCHESTRATOR       │
                      │  (Task assignment, QA & Sync) │
                      └──────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
 ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
 │ AGENT-PHYSICS │           │ AGENT-COMBAT  │           │AGENT-NARRATIVE│
 │(Movement,     │           │(Deflection,   │           │(Dialogue,     │
 │ Input, Air)   │           │ Projectiles)  │           │ Missions, Cam)│
 └───────────────┘           └───────────────┘           └───────────────┘
                                     │
                             ┌───────┴───────┐
                             │ AGENT-SYSTEMS │
                             │(Mounts, Train,│
                             │ Data, Python) │
                             └───────────────┘
```

| Agent Role | Primary Ownership Domain | Boundary Restrictions |
| :--- | :--- | :--- |
| **`agent-orchestrator`** | `tasks/`, `.github/`, Reviewing PRs, High-level architecture. | Does not write low-level C++ unless fixing merge stubs. |
| **`agent-physics`** | `Source/FunUncle/Movement/`, `data/character_physics.json`, `docs/CONTROLS_SPECIFICATION.md`. | Does not touch narrative scripts or weapon deflection code. |
| **`agent-combat`** | `Source/FunUncle/Combat/`, `data/paddle_combat.json`. | Does not modify general character movement or camera booms. |
| **`agent-systems`** | `Source/FunUncle/Vehicles/`, `data/vehicles_and_mounts.json`, `Scripts/`. | Does not modify character jumping or tuck-spin calculations. |
| **`agent-narrative`** | `missions/`, `docs/NARRATIVE_AND_AUDIO.md`, `data/arcade_scoring.json`. | Does not write C++ physics code. |

---

## 2. The Task Locking Protocol

To prevent two agents from modifying the same files simultaneously:

1. **Check Availability:** Agent inspects [`tasks/CURRENT_SPRINT.md`](../tasks/CURRENT_SPRINT.md).
2. **Claim Lock:** Agent writes its identifier and timestamp to the task row:
   ```markdown
   | TASK-102 | Trampoline Restitution Component | `IN_PROGRESS [agent-physics-1]` | 2026-11-08 |
   ```
3. **Commit Lock:** Agent commits this single change to ensure exclusive lease.
4. **Execution:** Agent creates feature branch `feature/TASK-102-trampoline-restitution` and executes code.
5. **Release & Report:** On verification, agent merges to main or opens PR, sets status to `COMPLETED [Commit SHA]`, and deposits an agent report.

---

## 3. Standardized Agent Report Template

Upon finishing any task, the agent MUST write a report to `tasks/AGENT_REPORTS/YYYY-MM-DD_TASK-ID_brief-title.md` using this exact markdown schema:

```markdown
# Agent Execution Report: [TASK-ID] [Brief Title]

- **Date:** YYYY-MM-DD
- **Agent Role:** [e.g. agent-physics]
- **Target Task:** [TASK-ID from BACKLOG.md]
- **Commit SHA:** [git commit hash]

## 1. Summary of Changes
- Implemented ...
- Tuned parameter ... in data/...

## 2. Files Modified / Created
- `Source/FunUncle/...`
- `data/...`

## 3. Verification & Testing Performed
- [x] Syntax checked / compiled clean.
- [x] Data schema validated against JSON specification.
- [x] Verified adherence to core rules (e.g. speed cap <= 40 MPH).

## 4. Handoff Notes for Next Agent
- Next dependency is TASK-XXX.
- Be aware that parameter Y in config Z is now scaled by factor W.
```

---

## 4. Automated Verification Standards

Every agent must run these checks before completing any task:
1. **JSON Validation:** Ensure all modified files in `data/` parse without syntax errors.
2. **Naming Conventions:** All UE5 types must strictly use Epic prefix standards (`A`, `U`, `F`, `E`, `T`).
3. **No Magic Numbers:** All gameplay multipliers must reference values loaded from `data/` JSON or exposed `UPROPERTY` structs.
