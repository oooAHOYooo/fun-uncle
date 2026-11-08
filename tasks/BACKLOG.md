# PROJECT TASK BACKLOG: FUN UNCLE

> **Priority Levels:** P0 (Blocker / Core Loop) | P1 (Feature Essential) | P2 (Polish / Content)

---

## EPIC 1: Core Character Locomotion & Physics [P0]
*Objective: Build the grounded athletic movement, speed caps, and analog dual-stick skate engine.*

### `TASK-101`: Master Character State Machine & Enhanced Input Setup
- **Role:** `agent-physics`
- **Priority:** P0
- **Description:** Implement `AFunUncleCharacter` with state enum `EFunUnclePhysicsState`. Set up Enhanced Input Mapping Contexts (`IMC_OnFoot`, `IMC_Skate`, `IMC_Airborne`, `IMC_Glider`).
- **Acceptance Criteria:**
  - [ ] Character transitions cleanly between grounded foot locomotion and skate physics based on state tag.
  - [ ] Left stick implements cubic radial deadzone curve.
  - [ ] Holding `Y / Triangle` forces immediate dismount back to `OnFoot`.

### `TASK-102`: Skate Carving, Downhill Acceleration & Speed Cap
- **Role:** `agent-physics`
- **Priority:** P0
- **Description:** Implement custom movement substepping in `UFunUncleMovementComponent` for skateboarding.
- **Acceptance Criteria:**
  - [ ] Downhill slope translates into forward velocity proportional to Uncle's 108 kg mass.
  - [ ] Hard ground speed cap is clamped at `40.0 MPH` (1788 cm/s) as defined in `data/character_physics.json`.
  - [ ] Right stick flick gestures trigger Ollie and Kickflip states using 150 ms sample window.

### `TASK-103`: Madden Stiff-Arm & Trucking Physics Blend
- **Role:** `agent-physics`
- **Priority:** P1
- **Description:** Implement upper-body physical animation ragdoll blending when `Right Stick Up` is flicked.
- **Acceptance Criteria:**
  - [ ] Running legs continue locomotion while torso/shoulder blends 80% physical animation.
  - [ ] Target enforcers take linear impulse proportional to Uncle's current velocity.

---

## EPIC 2: Vertical Air Engine (Trampolines & Diving) [P0]
*Objective: Implement vertical momentum conversion, aerial rotations, and water entry scoring.*

### `TASK-201`: High-Restitution Trampoline Surface Actor
- **Role:** `agent-physics`
- **Priority:** P0
- **Description:** Create `ATrampolineSurface` actor with customizable restitution multipliers.
- **Acceptance Criteria:**
  - [ ] Converts downward kinetic energy into vertical launch vector.
  - [ ] Tapping `A / Cross` within 100 ms of touchdown triggers "Double Bounce" (+100% height boost).
  - [ ] Triggers screen-shake and acoustic boom on bounce.

### `TASK-202`: Olympic Diving Attitude Controller & "Uncle Cannonball"
- **Role:** `agent-physics`
- **Priority:** P0
- **Description:** Implement in-air pitch and twist controls during `Airborne_Diving` state.
- **Acceptance Criteria:**
  - [ ] Left stick controls pitch (forward flip / backflip gainer); Right stick controls yaw twist.
  - [ ] Holding `LT` tucks body, multiplying angular velocity by 2.2x.
  - [ ] Holding `B / Circle` enters Cannonball state, triggering ground shockwave upon landing.
  - [ ] Water body collision checks entry angle; zero-splash award if entry pitch is within ±5 degrees of vertical.

---

## EPIC 3: Kinetic Combat Engine (Table Tennis Parries) [P0]
*Objective: Build projectile parrying and spin deflection.*

### `TASK-301`: Hardlight Paddle Deflector Component
- **Role:** `agent-combat`
- **Priority:** P0
- **Description:** Create `UPaddleDeflectorComponent` attached to character's lead arm socket.
- **Acceptance Criteria:**
  - [ ] Overlap sphere detects incoming enemy projectiles within 3.5 m radius.
  - [ ] Maps Face Buttons to spin types: `A` (Topspin), `X` (Backspin), `B` (Sidespin).
  - [ ] Applies Magnus force curve to redirected projectile trajectory.

### `TASK-302`: Target Lock & Camera Tracking
- **Role:** `agent-combat`
- **Priority:** P1
- **Description:** Left trigger (`LT`) lock-on rotates character focus toward nearest projectile threat or enemy drone.

---

## EPIC 4: Ground Mounts, Vehicles, & The Train [P1]
*Objective: Implement bicycle, rental e-scooter, horse, and conductor train interactions.*

### `TASK-401`: Rental E-Scooter & Bicycle Physics
- **Role:** `agent-systems`
- **Priority:** P1
- **Description:** Create lightweight two-wheel vehicle pawns adhering to 30 MPH speed cap.
- **Acceptance Criteria:**
  - [ ] Bunny-hop ability on jump button.
  - [ ] Power-slide on `LT`.
  - [ ] Dedicated bell ring on D-Pad Up.

### `TASK-402`: The Train Hijacking (Conductor's Favor)
- **Role:** `agent-systems`
- **Priority:** P1
- **Description:** Create interactive `ATrainLocomotive` actor on city rail circuit.
- **Acceptance Criteria:**
  - [ ] Uncle can board cab door; triggers Frankie dialogue ("Take the wheel, Ray!").
  - [ ] Grants full throttle control of train along predetermined rail switchyard.

---

## EPIC 5: Glider & Sub-Orbital Dogfighting [P1]
*Objective: Catapult launch, 6DoF atmospheric combat, and high-altitude bailout.*

### `TASK-501`: 6DoF Glider Pawn & Catapult Launch
- **Role:** `agent-systems`
- **Priority:** P1
- **Description:** Implement `AGliderPawn` with twin-stick flight controls and rocket booster trigger.
- **Acceptance Criteria:**
  - [ ] Catapult trigger accelerates pawn to orbital altitude.
  - [ ] 6DoF pitch, roll, yaw with inertia dampening.

### `TASK-502`: Manual Ejection & Skydiving Transition
- **Role:** `agent-systems`
- **Priority:** P1
- **Description:** Holding `Y / Triangle` ejects canopy, launches Uncle into high-altitude freefall, transitioning instantly to `Airborne_Diving` state.

---

## EPIC 6: Mockumentary Camera & Reactive Audio [P1]
*Objective: In-game camera drone AI, Vance Sterling voice triggers, and Aunt Brenda calls.*

### `TASK-601`: Autonomous Camera Drone Follow Rig
- **Role:** `agent-narrative`
- **Priority:** P1
- **Description:** SpringArm and Cinemachine camera rig representing "Chloe’s Drone."
- **Acceptance Criteria:**
  - [ ] Dynamically adjusts field-of-view during high-speed dives and grinds.
  - [ ] Triggers camera lens wipe / static glitch if Uncle crashes near the camera.

### `TASK-602`: Dynamic Dialogue Manager & Talking-Head Cutaways
- **Role:** `agent-narrative`
- **Priority:** P1
- **Description:** Audio event listener triggering Vance's literary voiceover, Brenda's phone calls, and 4-second lawn chair confessionals.

---

## EPIC 7: Arcade Missions & Game Mode Loop [P0]
*Objective: Stage 01 mission flow, timer, score counter, and SSS letter rank.*

### `TASK-701`: Arcade Score & Combo Multiplier System
- **Role:** `agent-narrative`
- **Priority:** P0
- **Description:** Implement combo chain calculator: Stiff-Arm ➔ Trampoline ➔ 720 Gainer ➔ Paddle Smash.
- **Acceptance Criteria:**
  - [ ] Multiplier increases with style variety.
  - [ ] Stage clear screen tallies time, property damage, style points, and awards Rank D to SSS.

### `TASK-702`: Stage 01 "Downtown Breakout" Level Recipe
- **Role:** `agent-narrative`
- **Priority:** P1
- **Description:** Construct the YAML mission objective sequence defined in `missions/stage01_downtown_breakout.yaml`.
