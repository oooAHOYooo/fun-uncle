# CONTROLS & GAMEPAD SPECIFICATION: FUN UNCLE

> **Target Standard:** Modern Dual-Analog Gamepads (Xbox Wireless Controller, PlayStation DualSense, Nintendo Switch Pro, Steam Deck).  
> **Engine Implementation:** Unreal Engine **Enhanced Input System** (`InputMappingContext`, `InputAction`, `InputModifiers`).

---

## 1. Architectural Philosophy: The Three Immutable Anchors

To prevent cognitive overload across 7 genres, the gamepad layout adheres to **Three Universal Rules** that never change across any state:

```
┌────────────────────────────────────────────────────────────────────────┐
│  1. LEFT STICK (`LS`): ALWAYS NAVIGATIONAL MOMENTUM & BODY MASS       │
│  2. RIGHT TRIGGER (`RT`): ALWAYS "GO FAST" (Sprint, Push, Throttle)    │
│  3. LEFT TRIGGER (`LT`): ALWAYS "PRECISION" (Aim, Tuck, Brake, Focus)  │
└────────────────────────────────────────────────────────────────────────┘
```

The **Right Stick (`RS`)** and **Face Buttons (`A, B, X, Y` / `Cross, Circle, Square, Triangle`)** contextually shift their functions based on the avatar's physics state.

---

## 2. Analog Stick Math & Deadzones

To give the board, body, and flight controls the correct "game feel":

### Left Stick (Locomotion & Steering)
* **Deadzone:** Radial Deadzone with inner threshold `0.12`, outer threshold `0.95`.
* **Response Curve:** Cubic Exponential Curve ($f(x) = 0.3x + 0.7x^3$).
  * Fine micro-adjustments near center for balancing on rails or aligning dives.
  * Rapid acceleration near stick edge for sharp carve cuts and jukes.

### Right Stick (Flick-it Board & Hit Stick)
* **Sampling Rate:** 120 Hz tick sampling for gesture recognition.
* **Vector Window:** Buffer window of `150 ms` to detect stick flick gestures:
  * Pull Down ➔ Release / Snap Up = **Ollie**.
  * Pull Down ➔ Diagonal Scoop Up-Left = **Kickflip**.
  * Flick Up from Neutral = **Madden Truck / Stiff-Arm**.
  * Flick Left/Right from Neutral = **Juke / Lateral Cutback**.

---

## 3. State-by-State Gamepad Mappings

### STATE A: On-Foot / Street Level (Madden + GTA Sandbox)
*Active when avatar is walking, sprinting, or in close-quarters sidewalk navigation.*

```
                [LT] Focus / Lock Target       [RT] Sprint / Hustle (Analog)
                [LB] Whistle / Taunt           [RB] Interactive Shove
                         ┌───────────────────┐
      Movement Vector    │     CONTROLLER    │   [Y / △] Mount Board/Bike/Scooter
      [Left Stick] ──────┤      ON-FOOT      ├── [X / □] Dive Tackle / Strip Ball
                         │       STATE       │   [B / ○] Hard Plant & Pivot Stop
     [D-Pad]             └───────────────────┘   [A / ✕] Jump / Vault Low Obstacles
     Up: Thermos Drink
     Down: Drop Board             [Right Stick]
     L/R: Radio Station           • Flick Up: Stiff-Arm / Truck
                                  • Flick Left/Right: Juke / Spin Move
                                  • Click (R3): Center Camera
```

| Physical Button | UE5 Input Action | Description |
| :--- | :--- | :--- |
| **Left Stick** | `IA_Move` | 360-degree locomotion vector. |
| **Right Stick (Flick Up)** | `IA_HitStick_Truck` | Stiff-arms target forward with full physical animation ragdoll impulse. |
| **Right Stick (Flick L/R)**| `IA_HitStick_Juke` | Executes sudden lateral weight shift to evade tackles. |
| **Right Trigger (`RT`)** | `IA_Sprint` | Increases run speed; consumes stamina battery. |
| **Left Trigger (`LT`)** | `IA_FocusTarget` | Camera locks onto nearest threat, sports drone, or pedestrian target. |
| **`A` / `Cross`** | `IA_JumpVault` | Standard jump; contextual vault over low fences/curbs. |
| **`X` / `Square`** | `IA_DiveTackle` | Horizontal flying tackle to strip objects or ground enforcers. |
| **`B` / `Circle`** | `IA_PivotStop` | Instant plant-and-turn stop; creates screeching shoe audio. |
| **`Y` / `Triangle`** | `IA_MountVehicle` | Mounts nearby bike, e-scooter, or horse. (Cars: kicks bumper). |

---

### STATE B: Skateboard & E-Scooter (Skate 4 + Table Tennis Racket)
*Active when riding a skateboard, rental e-scooter, bicycle, or horse.*

```
                [LT] Power-Slide / Foot-Brake  [RT] Foot Push / Scooter Throttle
                [LB] Left Hand Grab            [RB] Right Hand Grab
                         ┌───────────────────┐
      Carve & Lean       │     CONTROLLER    │   [Y / △] Dismount / Kick Deck to Hand
      [Left Stick] ──────┤    BOARD & RACKET ├── [X / □] Backspin Chop (Paddle Parry)
                         │       STATE       │   [B / ○] Sidespin Hook (Paddle Parry)
     [D-Pad]             └───────────────────┘   [A / ✕] Topspin Drive (Paddle Parry)
     Up: Bell Ring (Scooter)
     Down: Bail Out               [Right Stick]
     L/R: Radio Station           • Flick-it Trick Engine (Ollie, Flips, Shuvits)
                                  • Hold Left/Right: Manual & Nosemanual
```

#### The Table Tennis Face-Button Parries (Active while riding or skating):
When enemy projectiles, plasma discs, or stun canisters approach within the **Deflection Radius (3.5 meters)**:
* **`A` (`Cross`) — Topspin Drive:** Flattens projectile trajectory into a downward dip over cover.
* **`X` (`Square`) — Backspin Chop:** Floats projectile back at high arc, biting the air and freezing targets on contact.
* **`B` (`Circle`) — Sidespin Hook:** Curves projectile laterally around environmental obstacles.

---

### STATE C: Airborne / High-Dive & Trampolines (Diving + Trampoline)
*Triggered automatically when feet leave ground from a crane jump, roof leap, or trampoline bounce.*

```
                [LT] Tuck Position (Speed Up)  [RT] Layout / Pike (Slow Rotation)
                [LB] Camera Drone Synchronize  [RB] In-Flight Pose Mod
                         ┌───────────────────┐
      Pitch / Flips      │     CONTROLLER    │   [Y / △] Deploy Glide Fins / Parachute
      (Forward/Gainer) ──┤     AIRBORNE      ├── [X / □] Arm-Spread Swan Pose
      [Left Stick]       │       STATE       │   [B / ○] THE UNCLE CANNONBALL (Slam)
                         └───────────────────┘   [A / ✕] Time Rebound / Rip Entry
     [D-Pad]
     Quick-adjust sunglasses      [Right Stick]
                                  • Yaw / Horizontal Twist (360°/720°/1080°)
```

| Input | Action | Physical Dynamic |
| :--- | :--- | :--- |
| **Left Stick Y-Axis** | `IA_AirPitch` | Pitch forward for front flips; pull back for gainers/backflips. |
| **Right Stick X-Axis**| `IA_AirTwist` | Spins body along longitudinal axis for aerial twists. |
| **Hold `LT` (Left Trigger)** | `IA_AirTuck` | Closes limbs tight to torso. **Multiplies rotational speed by 2.2x**. |
| **Hold `RT` (Right Trigger)**| `IA_AirLayout` | Extends arms and legs straight. **Reduces rotation by 0.4x** for landing prep. |
| **Tap `A` (`Cross`) on Landing** | `IA_TimeRebound` | **Timing Window:** Rebounds with 100% kinetic retention (Trampoline) or scores zero-splash (Water). |
| **Hold `B` (`Circle`) in Mid-air**| `IA_Cannonball` | Curls into high-mass sphere. Triggers ground shockwave on impact. |

---

### STATE D: Open-Cockpit Rocket Glider (6DoF Dogfighting)
*Active when launched into atmospheric / low-orbit dogfights.*

```
                [LT] Air-Brakes / 180° Drift   [RT] Rocket Afterburners (Boost)
                [LB] ECM Flare / Decoy Deploy  [RB] Primary Ballistic Cannons
                         ┌───────────────────┐
      Pitch & Roll       │     CONTROLLER    │   [Y / △] HOLD: PULL EJECTION LEVER
      [Left Stick] ──────┤      GLIDER       ├── [X / □] Target Lock-On Toggle
                         │       STATE       │   [B / ○] Barrel Roll Evade
     [D-Pad]             └───────────────────┘   [A / ✕] Fire Kinetic Interceptor Missile
     Up/Down: Throttle Trim
     L/R: Radio Station           [Right Stick]
                                  • Yaw (Rudder) & Manual Reticle Targeting
```

---

## 4. State Machine Transition Rules

The engine automatically swaps the active **Enhanced Input Mapping Context (IMC)** based on physics tags:

```
                  ┌──────────────────────┐
                  │    IMC_ON_FOOT       │
                  └──────────┬───────────┘
                             │ (Mounts Board / E-Scooter)
                             ▼
                  ┌──────────────────────┐
                  │      IMC_SKATE       │
                  └──────────┬───────────┘
                             │ (Launches off edge / net)
                             ▼
                  ┌──────────────────────┐
                  │    IMC_AIRBORNE      │
                  └──────────┬───────────┘
                             │ (Catapulted to low orbit)
                             ▼
                  ┌──────────────────────┐
                  │     IMC_GLIDER       │
                  └──────────────────────┘
```

* **Immediate Bail-out:** Holding `Y / Triangle` for `0.35s` in any vehicular state immediately transitions the avatar to `IMC_AIRBORNE` or `IMC_ON_FOOT`.

---

## 5. On-Screen HUD & Touch Overlay Styling ("Liquid Glass")

For mobile devices, handheld on-screen prompts, and peripheral HUD button indicators:

* **Material Aesthetic:** High-translucency frosted glassmorphism ("Liquid Glass").
  * **Resting Fill:** `rgba(255, 255, 255, 0.08)` to prevent obscuring high-speed downhill lines and vert camera tracking.
  * **Backdrop Filter:** Real-time dual-pass blur (`16px`) with specular top rim highlight (`inset 0 1px 1px rgba(255, 255, 255, 0.35)`).
  * **Subtle Thin Bezel:** `1px` translucent border (`rgba(255, 255, 255, 0.18)`).
  * **Active Response:** Dynamic neon pulse (Emerald for Topspin, Cyan for Backspin, Amber for Sidespin, Rose for Hit-Stick Truck) that flares on contact and immediately recedes to subtle translucency.

