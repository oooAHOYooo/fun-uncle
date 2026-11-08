# SYSTEM ARCHITECTURE: FUN UNCLE

> **Target Engine:** Unreal Engine 5.4+ / 5.5  
> **Core Language:** Modern C++ (C++20 standard) & Native UE Python API  
> **Philosophy:** Data-Driven Gameplay with Deterministic Physics Core

---

## 1. Class Hierarchy & Core Modules

The game code is organized under the primary game module `FunUncle`:

```
UObject
└── UActorComponent
    ├── UFunUncleMovementComponent  (Custom physics substepping, skate carving, jukes)
    ├── UPaddleDeflectorComponent   (Deflection sphere collision & Magnus spin calculations)
    └── UDocumentaryTargetComponent (Registers actor as a cinematic point of interest for camera drone)

AActor
├── APawn
│   └── ACharacter
│       └── AFunUncleCharacter      (Master avatar actor; owns state machine and input context)
│   └── AGliderPawn                 (6DoF sub-orbital flight pawn with ejection mechanics)
├── ATrampolineSurface              (High-restitution tension net actor with impulse modifiers)
└── ATrainLocomotive                (Municipal train actor with conductor interaction dialogue)
```

---

## 2. Character State Machine (`EFunUnclePhysicsState`)

`AFunUncleCharacter` maintains a strict, authoritative physics state machine:

```cpp
UENUM(BlueprintType)
enum class EFunUnclePhysicsState : uint8
{
    OnFoot_Grounded   UMETA(DisplayName = "On Foot (Grounded)"),
    OnFoot_Sprinting  UMETA(DisplayName = "On Foot (Sprinting)"),
    Skating_Cruising  UMETA(DisplayName = "Skating / Scooting"),
    Skating_Grinding  UMETA(DisplayName = "Skating (Grinding Rail)"),
    Airborne_Diving   UMETA(DisplayName = "Airborne (Diving / Stunt)"),
    Airborne_Ragdoll  UMETA(DisplayName = "Airborne (Ragdoll / Bail)"),
    Glider_Piloting   UMETA(DisplayName = "Piloting Glider")
};
```

### Contextual Input Swapping:
When `CurrentState` changes, the character controller calls:
```cpp
void AFunUncleCharacter::SetPhysicsState(EFunUnclePhysicsState NewState)
{
    // 1. Remove previous Input Mapping Context (IMC)
    // 2. Add NewState corresponding IMC (Priority: 1)
    // 3. Update Animation Blueprint state tags
    // 4. Adjust camera boom distance and pitch damping
}
```

---

## 3. The Table Tennis Deflection Engine (`UPaddleDeflectorComponent`)

The deflection system does not use traditional hitscan or melee slashing. It implements **restitution and spin physics**:

```
                  Incoming Projectile (Vector V_in)
                              │
                              ▼
                     [ DEFLECTION SPHERE ]
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
      Face Button Input                 Magnus Curve
   (A: Topspin / X: Backspin)     F_magnus = S x (V_out x SpinAxis)
             │                                 │
             └────────────────┬────────────────┘
                              ▼
                   Outgoing Velocity (V_out)
```

* **Calculation:**
  $$\vec{V}_{\text{out}} = -(\vec{V}_{\text{in}} \cdot \hat{n})\hat{n} \cdot R + \vec{V}_{\text{paddle}} + \vec{V}_{\text{spin\_curve}}$$
* **Spin Types:**
  * **Topspin:** Downward Magnus acceleration; increases post-bounce skip velocity.
  * **Backspin:** Upward float Magnus force; reduces horizontal post-bounce speed by 60%.
  * **Sidespin:** Lateral Magnus curve around vertical obstacles.

---

## 4. Physical Animation & Madden Ragdoll Blending

To achieve the "heft" of Uncle Ray without floaty canned animations:
1. Skeletal Mesh uses **Physics Control Component** and **Physical Animation Component**.
2. When executing a **Stiff-Arm** or **Truck**:
   * Legs remain keyed to the running animation state machine.
   * Torso, shoulder, and lead arm blend 80% into full physics simulation.
   * Target enforcer bones receive an impulse vector:
     $$\vec{I}_{\text{hit}} = M_{\text{uncle}} \cdot \vec{V}_{\text{uncle}} \cdot 1.5$$

---

## 5. Data-Driven Architecture (JSON / DataTables)

All gameplay constants are completely decoupled from C++ compilation. They reside in the [`data/`](../data/) directory and are imported as `UDataTable` assets:

* `character_physics.json` ➔ Maps directly to `FCharacterPhysicsConfig` struct.
* `paddle_combat.json` ➔ Maps to `FPaddleCombatConfig` struct.
* `vehicles_and_mounts.json` ➔ Maps to `FVehicleHandlingConfig` struct.
* `arcade_scoring.json` ➔ Maps to `FArcadeScoringRules` struct.

---

## 6. Remote Control & Python Automation Hooks

The engine is configured to expose internal parameters over HTTP via the **Remote Control Plugin** on port `30010`:

```bash
# Example REST call an agent or script can send to tune Uncle Ray live in editor:
curl -X POST http://localhost:30010/remote/object/property \
  -H "Content-Type: application/json" \
  -d '{
    "objectPath": "/Game/Maps/TestGym.TestGym:PersistentLevel.FunUncle_1",
    "propertyName": "TopSkateSpeed",
    "access": "WRITE",
    "propertyValue": 1800.0
  }'
```

All batch editor automation tasks are stored in `Scripts/` using the native `unreal` Python module.
