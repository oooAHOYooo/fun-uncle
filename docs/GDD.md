# GAME DESIGN DOCUMENT: FUN UNCLE (Working Title)

> **Document Version:** 1.0.0  
> **Status:** Active Reference Bible  
> **Target Engine:** Unreal Engine 5 (UE 5.4+ / 5.5)  
> **Target Platforms:** PC (Steam, Itch.io), Mac (Apple Silicon), Steam Deck, Xbox Series X/S  
> **Target Audience:** Fans of *Tony Hawk*, *Skate*, *GTA*, *Crazy Taxi*, *NFL Blitz*, and character-driven indie comedies (*Untitled Goose Game*, *Goat Simulator*, *Lethal Company*)

---

## 1. Executive Summary

**Fun Uncle** is a third-person, momentum-driven open-world action-sports arcade comedy. Players step into the dad sneakers of a deceptively explosive, slightly chubby suburban uncle who spent the last fifteen years taking an epic couch nap—only to wake up in a vertical megacity run by a pretentious cybernetic sports-entertainment syndicate.

When his brilliant teenage niece Maya is snatched by the syndicate to build rigged anti-gravity gear, our hero doesn't call the police. Armed with vintage athletic gear, an insulated thermos, and an analog sports mindset, he sets out across the megacity to get her back. The catch? His wife told him to be home with drywall anchors and a gallon of 2% milk by 5:45 PM—and a neurotic literary author and documentary camera crew are filming his every move.

---

## 2. Core Design Pillars

### I. Pure Athletic Momentum ("Mass × Velocity")
The protagonist has genuine heft. Running downhill builds unstoppable inertia; stiff-arms hit with freight-train impact; trampoline belly-flops trigger concussive shockwaves. Traversal is fluid, physical, and analog—never floaty or superheroic.

### II. The Analog Hero in a Digital World
While corporate cyborgs use neural chips and servo motors, Fun Uncle relies on pure tendon elasticity, muscle memory, and relaxed rec-room technique. He treats high-tech weaponry like errant ping-pong balls and orbital starfighters like lawnmowers with boosters.

### III. The Mockumentary Diegesis
The in-game third-person camera is an actual camera drone operated by a stressed-out crew. Stunts, crashes, and narrow escapes trigger documentary cutaways, pretentious literary voiceovers, and talking-head interview confessionals.

### IV. The "Good Old Game" Contract
- **Zero microtransactions, zero battle passes, zero online DRM lockouts.**
- One complete, polished, accessible game ($4.99–$9.99).
- Secret unlockable outfits, retro skateboards, and cheat codes unlocked solely through gameplay and exploration.

---

## 3. Character Profiles

### The Protagonist ("The Fun Uncle")
* **Archetype:** The "Rip Van Winkle" suburban sports legend. A little thick around the waist, heavy calves, effortless balance. He groans when standing up from a lawn chair, but moves like water on a board.
* **Signature Attire:** Open-collar vintage neon bowling shirt, ribbed tank, cargo shorts, polarized amber wrap-around sports shades, retro cross-trainers with retractable magnetic grind plates.
* **Philosophy:** "You're gripping too tight, kid. It's all in the hips and the wrist."

### Aunt Brenda (The Looming Deadline)
* Fun Uncle’s beloved but relentlessly organized wife.
* While he is dodging orbital missiles and grinding monorail lines, she calls him over the comms checking on the hardware store errands.
* Her checklist acts as the ticking game clock.

### Vance Sterling (The Neurotic Biographer)
* A high-strung, tweed-jacketed literary author convinced he is writing "The Great American Myth."
* Delivers melodramatic audio-commentary during high-speed action, constantly bewildered when the uncle's wild playground stories turn out to be completely true.

### The Camera Crew
* **Gus (Lead Cam Op):** Veteran steady-cam operator trying to survive the action.
* **Chloe (Drone Pilot):** Controls the in-game chase camera drone. Swears over the radio when the uncle pulls sudden 90-degree skate cuts.
* **Toby (Boom Mic Operator):** Constantly gets the mic clipped by skateboards, deflected table-tennis balls, and trampoline nets.

### Frankie the Conductor
* Veteran municipal train driver who owes the uncle an ancient favor from 1991. The uncle can "hijack" the high-speed transit train anytime by simply tapping on the cab door and asking politely.

---

## 4. The 7 Integrated Gameplay Disciplines

```
                      [ LOW-ORBIT DOGFIGHTING ]
                                 ▲
                   (Eject & Sky-Dive / Gainer)
                                 ▼
              [ HIGH-DIVE CRANES & TRAMPOLINE NETS ]
                                 ▲
                     (Skate Vert & Wall Ramps)
                                 ▼
             [ STREET LEVEL: MADDEN JUKES & VEHICLES ]
                                 ▲
                    (TABLE TENNIS PARRIES)
```

### 1. Skateboarding (The Fluid Traversal Foundation)
* **Control Feel:** Analog flick-it board control (inspired by *EA Skate*). Left stick steers body mass; right stick directs board pop, flips, and manuals.
* **Mechanics:** Carve downhill streets, power-slide around corners, grind highway barriers, ollie over traffic.
* **Ground Speed Cap:** Top skate speed is capped at 35–40 MPH, keeping navigation intimate, dense, and tactile.

### 2. Contact Agility (Madden Football Engine)
* **The "Hit Stick" (Right Stick Up):** Plant a massive stiff-arm or shoulder charge into syndicate enforcers or riot bots. The uncle’s mass flattens enemies into ragdolls.
* **Jukes & Spin Moves (Right Stick Left/Right):** Analog cutbacks break the ankles of pursuing drones and officers.
* **Dive Tackles (Face Button):** Airborne low tackles to strip data canisters or intercept flying objectives.

### 3. Reflex Deflection (Rockstar Table Tennis Engine)
* **The Weapon:** A wrist-mounted hardlight kinetic paddle.
* **Combat Philosophy:** The uncle doesn't shoot guns. When syndicate enforcers fire high-velocity plasma or stun balls, he parries them.
* **Spin Modifiers:**
  * **Topspin (A / Cross):** Dips deflected shots aggressively over cover to strike crouching enemies.
  * **Backspin / Slice (X / Square):** Floats shots with extreme bite, holding projectiles in mid-air.
  * **Sidespin (B / Circle):** Curves deflected shots around pillars and street corners.

### 4. Aerial Acrobatics (Olympic Diving Engine)
* **Rotational Pitch & Twist:** While airborne after jumping off cranes, bridges, or rooftops, the controls transition to Olympic diving physics.
* **Tuck & Pike Modifiers:** Left Trigger (`LT`) tucks the body for accelerated flip rotation; Right Trigger (`RT`) layouts the body to stall rotation.
* **Water Entry Rating:** Hitting fountains, harbor docks, or luxury pools calculates entry angle. A clean, zero-splash "rip entry" awards massive style bonuses.

### 5. Vertical Launchers (Trampoline Physics)
* **Bouncing Surfaces:** Tension nets, solar awnings, and construction safety nets act as high-restitution trampolines.
* **Momentum Stacking:** Tapping the jump button upon touchdown times a "double-bounce," converting forward skate speed into 30-story vertical air launches.
* **The Uncle Cannonball:** Mid-air tuck button press converts a dive into an acoustic shockwave slam upon impact.

### 6. Sub-Orbital Dogfighting (Glider Interceptors)
* **The Vehicle:** An analog, open-cockpit rocket glider launched from municipal catapult tubes.
* **Flight Model:** 6-Degrees-of-Freedom (6DoF) atmospheric flight transitioning into low-orbit zero-g skirmishes.
* **The Ejection Dismount:** Players never "land" the glider. They pull the manual ejection lever at high altitude, sky-dive through the clouds, and stick a trampoline landing back on the city streets.

### 7. Open-World Ground Vehicles & Mounts
* **The Car Ban:** The protagonist refuses to drive modern cars on principle ("Too many damn touchscreens").
* **Permitted Ground Transport:**
  * **Bicycles (10-Speed & Beach Cruisers):** High agility, curb-hopping, bell-ringing.
  * **Rental E-Scooters:** Maxed out at 30 MPH, bunny-hop over obstacles, whip into guard shins.
  * **Horses:** Park ranger mounts; can stiff-arm and paddle-parry while galloping.
  * **The City Train:** Accessible via personal conductor favors for high-speed transit.

---

## 5. Narrative & Mission Structure

The game alternates between **Open-World Exploration** and **Arcade Stages**:

```
[ OPEN SANDBOX PLAY ]
       │  • Cruise neighborhoods, practice dives, play rec table tennis
       ▼
[ "UNCLE REMEMBERS" ]
       │  • Organic skill recovery: unlocks elite tricks, heavier hits, wicked spin
       ▼
[ ARCADE STORY STAGES ]
       │  • High-energy, timed missions with SSS rank scorecards
       ▼
[ TALKING-HEAD CONFESSIONALS ]
          • Quick 4-second mockumentary cutaways to the uncle on a lawn chair
```

### Mission Progression Example (Stage 01: "Downtown Breakout")
1. **The Heist:** Grab Maya's encrypted drive from the top floor of a downtown hotel.
2. **The Escape:** Stiff-arm two security guards through a banquet table, dive through the window into a 500-foot freefall.
3. **The Rebound:** Hit a construction net 40 stories down, double-bounce onto a monorail line, deploy the skateboard.
4. **The Rally:** Engage in a 120-MPH table tennis deflection rally with pursuing attack drones.
5. **The Objective:** Swing by the local convenience store to grab 2% milk before the stage timer runs out.

---

## 6. Progression: "Uncle Remembers"

No abstract XP trees. Uncle already possesses world-class muscle memory; he just needs to shake off 15 years of rust:

| Activity | Mastery Effect |
| :--- | :--- |
| **Grinding & Flatland Skate** | Unlocks late-shuvits, wall-rides, and friction-less rail balance. |
| **Rec-Room Table Tennis** | Unlocks "The Basement Slice" (unreturnable curve) and lightning smash parries. |
| **High Crane Dives** | Unlocks 1080 gainers, iron-cross layouts, and zero-splash entries. |
| **Sidewalk Trucking** | Increases stiff-arm impulse force and multi-target bowling knockdowns. |

---

## 7. Monetization & Release Strategy

* **Model:** Premium Complete Indie Game.
* **Price:** **$4.99–$9.99** (Targeting impulsive, zero-hesitation purchase).
* **No In-Game Purchases:** All cosmetics, boards, paddles, and cheat codes unlocked through in-game feats.
* **Distribution Rollout:**
  1. **Phase 1:** Free playable web/browser vertical slice (instant link, zero-install).
  2. **Phase 2:** Steam & Itch.io PC/Mac/Steam Deck release.
  3. **Phase 3:** Xbox Series X/S (Dev Mode testing leading to ID@Xbox release), Nintendo Switch, and PlayStation.
