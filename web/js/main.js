// web/js/main.js - Fun Uncle Web Prototype Core Loop & Playtest Controller
import * as THREE from 'three';
import { createCharacter } from './character.js';
import { CharacterAnimator } from './animation.js';
import { setupWorld } from './world.js';
import { CombatManager } from './combat.js';
import { InputManager } from './input.js';
import { soundFX } from './audio.js';

// Setup Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0c10);
scene.fog = new THREE.FogExp2(0x0a0c10, 0.025);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 150);
camera.position.set(0, 3.5, 8.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Setup World & Arenas
const world = setupWorld(scene);

// Create Characters
const uncleData = createCharacter('uncle');
uncleData.root.position.set(0, 0, 3.0);
scene.add(uncleData.root);

const neighborData = createCharacter('neighbor');
neighborData.root.position.set(0, 0, -3.0);
neighborData.root.rotation.y = Math.PI;
scene.add(neighborData.root);

// Animators
const uncleAnim = new CharacterAnimator(uncleData);
const neighborAnim = new CharacterAnimator(neighborData);

// Input
const input = new InputManager(renderer.domElement);

// UI elements
const uncleHpBar = document.getElementById('uncle-hp-bar');
const uncleStaminaBar = document.getElementById('uncle-stamina-bar');
const neighborHpBar = document.getElementById('neighbor-hp-bar');
const neighborStunBar = document.getElementById('neighbor-stun-bar');
const comboBanner = document.getElementById('combo-banner');
const comboCountText = document.getElementById('combo-count');
const trashTalkBubble = document.getElementById('trash-talk-bubble');
const trashTalkText = document.getElementById('trash-talk-text');
const speedIndicator = document.getElementById('speed-mph');
const stateIndicator = document.getElementById('state-tag');
const koOverlay = document.getElementById('ko-overlay');
const koText = document.getElementById('ko-title');
const koSubtitle = document.getElementById('ko-subtitle');

// Combat Manager
const combat = new CombatManager(
  uncleData, uncleAnim,
  neighborData, neighborAnim,
  (stats) => updateUIStats(stats)
);

function updateUIStats(stats) {
  if (uncleHpBar) uncleHpBar.style.width = `${Math.max(0, stats.uncleHP)}%`;
  if (uncleStaminaBar) uncleStaminaBar.style.width = `${Math.max(0, stats.uncleStamina)}%`;
  if (neighborHpBar) neighborHpBar.style.width = `${Math.max(0, stats.neighborHP)}%`;
  if (neighborStunBar) neighborStunBar.style.width = `${Math.max(0, stats.neighborStun)}%`;

  if (comboBanner) {
    if (stats.comboCounter > 1) {
      comboBanner.classList.add('visible');
      if (comboCountText) comboCountText.textContent = `${stats.comboCounter}x COMBO`;
    } else {
      comboBanner.classList.remove('visible');
    }
  }

  if (trashTalkBubble) {
    if (stats.trashTalk && stats.trashTalk.length > 0) {
      trashTalkBubble.classList.add('visible');
      if (trashTalkText) trashTalkText.textContent = stats.trashTalk;
    } else {
      trashTalkBubble.classList.remove('visible');
    }
  }

  if (koOverlay) {
    if (stats.fightState === 'ko_neighbor') {
      koOverlay.classList.add('visible');
      if (koText) koText.textContent = "NED DOWN!";
      if (koSubtitle) koSubtitle.textContent = "RAY WINS BY KO • SUBURBAN SUPREMACY";
    } else if (stats.fightState === 'ko_uncle') {
      koOverlay.classList.add('visible');
      if (koText) koText.textContent = "UNCLE DOWN!";
      if (koSubtitle) koSubtitle.textContent = "NED WINS • HOA CITATION ISSUED";
    } else {
      koOverlay.classList.remove('visible');
    }
  }
}

// Play Mode: 'ufc_fight' | 'free_roam' | 'anim_lab'
let playMode = 'ufc_fight';
let isSkating = false;
let currentMPH = 0;
let uncleVelocity = new THREE.Vector3();
let isAirborne = false;
let verticalVelocity = 0;
let doubleBounceWindow = 0;

// Camera Drone Settings (Chloe's Camera Drone)
let cameraOffset = new THREE.Vector3(0, 2.8, 5.8);
let cameraLookTarget = new THREE.Vector3();
let screenShake = 0;

// Animation Workbench controls
window.setPlayMode = (mode) => {
  playMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`mode-${mode}`);
  if (btn) btn.classList.add('active');

  const labPanel = document.getElementById('anim-lab-panel');
  if (labPanel) {
    labPanel.style.display = mode === 'anim_lab' ? 'block' : 'none';
  }

  if (mode === 'ufc_fight') {
    world.octagonGroup.visible = true;
    combat.resetMatch();
  } else if (mode === 'free_roam') {
    world.octagonGroup.visible = true;
  } else if (mode === 'anim_lab') {
    uncleData.root.position.set(0, 0, 0);
    uncleAnim.setState('idle');
  }
};

window.playLabAnimation = (animName) => {
  uncleAnim.playAction(animName, labAnimSpeed);
  soundFX.playWhoosh(1.0);
  if (stateIndicator) stateIndicator.textContent = `ANIM: ${animName.toUpperCase()}`;
};

window.resetMatch = () => {
  combat.resetMatch();
};

let labAnimSpeed = 1.0;
window.setAnimSpeed = (speed) => {
  labAnimSpeed = speed;
  uncleAnim.animSpeed = speed;
  const speedDisplay = document.getElementById('speed-val-display');
  if (speedDisplay) speedDisplay.textContent = `${speed.toFixed(2)}x`;
};

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main Loop
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  input.update();

  // Mode-specific handling
  if (playMode === 'anim_lab') {
    uncleAnim.update(dt);
  } else {
    handleGameplay(dt);
  }

  // Update Combat
  combat.update(dt, playMode === 'anim_lab');

  // Update Chloe's Camera Drone
  updateCamera(dt);

  // Render 3D Scene
  renderer.render(scene, camera);
}

function handleGameplay(dt) {
  const unclePos = uncleData.root.position;

  // Toggle Skate Mode (Tab or Gamepad Y)
  if (input.consumeKey('Tab') || input.getGamepadButton(3)) {
    isSkating = !isSkating;
    uncleData.skateboard.visible = isSkating;
    soundFX.playWhoosh(0.8);
    if (isSkating) {
      uncleAnim.setState('skate_idle');
    } else {
      uncleAnim.setState('idle');
      soundFX.setSkateRoll(false);
    }
  }

  // Combat Attack Triggers (UFC Actions)
  if (!uncleAnim.isActionLocked) {
    if (input.consumeLeftClick() || input.consumeKey('KeyJ') || input.getGamepadButton(0)) {
      // Left Jab
      soundFX.playWhoosh(1.0);
      uncleAnim.playAction('jab', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: UFC JAB';
    } else if (input.consumeRightClick() || input.consumeKey('KeyK') || input.getGamepadButton(2)) {
      // Right Cross
      soundFX.playWhoosh(1.2);
      uncleAnim.playAction('cross', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: UFC CROSS';
    } else if (input.consumeKey('KeyQ')) {
      // Sweeping Left Hook
      soundFX.playWhoosh(1.3);
      uncleAnim.playAction('hook', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: UFC HOOK';
    } else if (input.consumeKey('KeyC') || input.getGamepadButton(1)) {
      // Roundhouse Kick
      soundFX.playWhoosh(1.4);
      uncleAnim.playAction('roundhouse', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: ROUNDHOUSE KICK';
    } else if (input.consumeKey('KeyV')) {
      // Clinch Knee
      soundFX.playWhoosh(1.2);
      uncleAnim.playAction('knee', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: CLINCH KNEE';
    } else if (input.consumeKey('KeyR')) {
      // Double-Leg Takedown
      soundFX.playWhoosh(1.5);
      uncleAnim.playAction('takedown', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: TAKEDOWN SHOOT';
    } else if (input.consumeKey('KeyF') || (input.gamepadIndex !== null && input.getGamepadButton(5))) {
      // Madden Stiff-Arm Truck Charge
      soundFX.playWhoosh(1.6);
      uncleAnim.playAction('stiff_arm', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: MADDEN STIFF-ARM';
    } else if (input.consumeKey('KeyE')) {
      // Juke
      soundFX.playWhoosh(0.8);
      uncleAnim.playAction('juke_right', 1.0);
      if (stateIndicator) stateIndicator.textContent = 'STATE: MADDEN JUKE';
    }
  }

  // Locomotion & Physics (Mass x Velocity, 108 kg heft)
  const mx = input.moveVector.x;
  const my = input.moveVector.y;
  const isMoving = Math.hypot(mx, my) > 0.05;

  let maxSpeedCMPS = isSkating ? 1788 : (input.sprint ? 750 : 400); // 40 MPH on skate, 7.5 m/s sprint
  let targetSpeedMPS = maxSpeedCMPS / 100;

  if (isMoving) {
    const moveAngle = Math.atan2(mx, my);
    uncleData.root.rotation.y = THREE.MathUtils.lerp(uncleData.root.rotation.y, moveAngle, 0.15);

    const forward = new THREE.Vector3(Math.sin(moveAngle), 0, Math.cos(moveAngle));
    uncleVelocity.lerp(forward.multiplyScalar(targetSpeedMPS), 0.12);

    if (!uncleAnim.isActionLocked) {
      if (isSkating) {
        uncleAnim.setState('skate_push', 1.1);
        soundFX.setSkateRoll(true, uncleVelocity.length() / targetSpeedMPS);
      } else if (input.sprint) {
        uncleAnim.setState('sprint', 1.15);
        if (stateIndicator) stateIndicator.textContent = 'STATE: SPRINT (40 MPH CAP)';
      } else {
        uncleAnim.setState('walk', 1.0);
        if (stateIndicator) stateIndicator.textContent = 'STATE: ON-FOOT LOCOMOTION';
      }
    }
  } else {
    uncleVelocity.lerp(new THREE.Vector3(), 0.18);
    if (!uncleAnim.isActionLocked) {
      if (isSkating) {
        uncleAnim.setState('skate_idle');
        soundFX.setSkateRoll(false);
      } else {
        uncleAnim.setState('idle');
      }
    }
  }

  // Ground position update
  unclePos.addScaledVector(uncleVelocity, dt);

  // Trampoline interaction (GDD TASK-201)
  const toTramp = new THREE.Vector2(unclePos.x - world.trampolinePos.x, unclePos.z - world.trampolinePos.z);
  if (toTramp.length() < world.trampolineRadius && unclePos.y <= 0.65) {
    const isDoubleBounce = doubleBounceWindow > 0;
    verticalVelocity = isDoubleBounce ? 22 : 12; // massive vertical boost!
    isAirborne = true;
    uncleAnim.playAction('trampoline_bounce', 1.0);
    soundFX.playTrampolineBounce(isDoubleBounce);
    screenShake = 0.4;
    doubleBounceWindow = 0;
    if (stateIndicator) stateIndicator.textContent = isDoubleBounce ? 'DOUBLE BOUNCE!! (+100% BOOST)' : 'TRAMPOLINE BOUNCE';
  }

  // Jump input
  if (input.consumeKey('Space') || input.getGamepadButton(0)) {
    if (!isAirborne) {
      verticalVelocity = 7.5;
      isAirborne = true;
      doubleBounceWindow = 0.25;
      soundFX.playWhoosh(1.2);
    } else if (doubleBounceWindow > 0) {
      // Rebound timing window tap
      doubleBounceWindow = 0.35;
    }
  }

  if (doubleBounceWindow > 0) {
    doubleBounceWindow -= dt;
  }

  // Airborne gravity
  if (isAirborne) {
    verticalVelocity -= 22 * dt; // gravity
    unclePos.y += verticalVelocity * dt;

    if (unclePos.y <= 0) {
      unclePos.y = 0;
      isAirborne = false;
      verticalVelocity = 0;
    }
  }

  // Update speed display (convert m/s to MPH: 1 m/s = 2.23694 MPH)
  currentMPH = Math.round(uncleVelocity.length() * 2.23694);
  if (speedIndicator) speedIndicator.textContent = `${currentMPH} MPH`;

  // Arena bounds check
  if (playMode === 'ufc_fight') {
    const d = unclePos.length();
    if (d > 7.2) {
      unclePos.setLength(7.2);
    }
  }

  // Update animations
  uncleAnim.update(dt);
  neighborAnim.update(dt);
}

function updateCamera(dt) {
  const unclePos = uncleData.root.position;

  // Target camera position
  const targetCamPos = new THREE.Vector3().copy(unclePos).add(cameraOffset);

  // Apply subtle screenshake on heavy hits / bounces
  if (screenShake > 0) {
    targetCamPos.x += (Math.random() - 0.5) * screenShake * 0.8;
    targetCamPos.y += (Math.random() - 0.5) * screenShake * 0.8;
    screenShake = Math.max(0, screenShake - dt * 2.5);
  }

  camera.position.lerp(targetCamPos, 0.08);

  // Camera look target tracks midway between Uncle and Neighbor during fight
  if (playMode === 'ufc_fight' && combat.fightState === 'fighting') {
    const midPoint = new THREE.Vector3().addVectors(unclePos, neighborData.root.position).multiplyScalar(0.5);
    midPoint.y = 1.35;
    cameraLookTarget.lerp(midPoint, 0.1);
  } else {
    cameraLookTarget.lerp(new THREE.Vector3(unclePos.x, unclePos.y + 1.25, unclePos.z), 0.1);
  }

  camera.lookAt(cameraLookTarget);
}

// Start loop
animate();
