// web/js/main.js - UFC 5 Style Perspective & Minimalist Fighting Loop
import * as THREE from 'three';
import { createCharacter } from './character.js';
import { CharacterAnimator } from './animation.js';
import { setupWorld } from './world.js';
import { CombatManager } from './combat.js';
import { InputManager } from './input.js';

// Setup Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06080c);
scene.fog = new THREE.FogExp2(0x06080c, 0.022);

// UFC 5 style 48-degree FOV for cinematic sports depth
const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 120);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Setup World & Octagon
const world = setupWorld(scene);

// Create Characters & Initial UFC Ring Placements
const uncleData = createCharacter('uncle');
uncleData.root.position.set(-1.6, 0, 0); // Red corner side
scene.add(uncleData.root);

const neighborData = createCharacter('neighbor');
neighborData.root.position.set(1.6, 0, 0); // Blue corner side
neighborData.root.rotation.y = -Math.PI / 2;
scene.add(neighborData.root);

// Animators
const uncleAnim = new CharacterAnimator(uncleData);
const neighborAnim = new CharacterAnimator(neighborData);

// Input Manager
const input = new InputManager(renderer.domElement);

// UI Elements (minimalist top bar)
const uncleHpBar = document.getElementById('uncle-hp-bar');
const neighborHpBar = document.getElementById('neighbor-hp-bar');
const koOverlay = document.getElementById('ko-overlay');
const koTitle = document.getElementById('ko-title');
const koSubtitle = document.getElementById('ko-subtitle');
const camToggleBtn = document.getElementById('cam-toggle-btn');

// Combat Manager
const combat = new CombatManager(
  uncleData, uncleAnim,
  neighborData, neighborAnim,
  (stats) => updateUI(stats)
);

function updateUI(stats) {
  if (uncleHpBar) uncleHpBar.style.width = `${Math.max(0, stats.uncleHP)}%`;
  if (neighborHpBar) neighborHpBar.style.width = `${Math.max(0, stats.neighborHP)}%`;

  if (koOverlay) {
    if (stats.fightState === 'ko_neighbor') {
      koOverlay.classList.add('visible');
      if (koTitle) koTitle.textContent = "KNOCKOUT!";
      if (koSubtitle) koSubtitle.textContent = "RAY WINS BY KO • SUBURBAN CHAMPION";
    } else if (stats.fightState === 'ko_uncle') {
      koOverlay.classList.add('visible');
      if (koTitle) koTitle.textContent = "KNOCKOUT!";
      if (koSubtitle) koSubtitle.textContent = "NED WINS BY KO • HOA CITATION ISSUED";
    } else {
      koOverlay.classList.remove('visible');
    }
  }
}

window.resetMatch = () => {
  combat.resetMatch();
  uncleData.root.position.set(-1.6, 0, 0);
  uncleData.root.rotation.set(0, Math.PI / 2, 0);
  neighborData.root.position.set(1.6, 0, 0);
  neighborData.root.rotation.set(0, -Math.PI / 2, 0);
};

// CAMERA MODES: 'broadcast' (UFC 5 classic side broadcast) vs 'tight' (UFC 5 over-the-shoulder)
let camMode = 'broadcast';

window.toggleCamMode = () => {
  camMode = camMode === 'broadcast' ? 'tight' : 'broadcast';
  if (camToggleBtn) {
    camToggleBtn.innerHTML = `<kbd>V</kbd> Cam: ${camMode === 'broadcast' ? 'Broadcast' : 'Over-Shoulder'}`;
  }
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyV') {
    window.toggleCamMode();
  }
});

// Camera positioning targets
const targetCamPos = new THREE.Vector3(0, 1.45, 4.2);
const currentLookAt = new THREE.Vector3(0, 1.25, 0);

// Initial camera position
camera.position.set(0, 1.45, 4.5);
camera.lookAt(currentLookAt);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main Animation Loop
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  input.update();

  handlePlayerActions(dt);
  combat.update(dt, false);
  updateUFC5Camera(dt);

  renderer.render(scene, camera);
}

function handlePlayerActions(dt) {
  const unclePos = uncleData.root.position;
  const neighborPos = neighborData.root.position;

  // Face the opponent dynamically
  const dirToOpponent = new THREE.Vector3().subVectors(neighborPos, unclePos);
  dirToOpponent.y = 0;
  if (dirToOpponent.length() > 0.1) {
    const targetAngle = Math.atan2(dirToOpponent.x, dirToOpponent.z);
    uncleData.root.rotation.y = THREE.MathUtils.lerp(uncleData.root.rotation.y, targetAngle, 0.15);
  }

  // UFC Strikes & Grappling Actions
  if (!uncleAnim.isActionLocked && combat.fightState === 'fighting') {
    if (input.consumeLeftClick() || input.consumeKey('KeyJ') || input.getGamepadButton(0)) {
      uncleAnim.playAction('jab', 1.0);
    } else if (input.consumeRightClick() || input.consumeKey('KeyK') || input.getGamepadButton(2)) {
      uncleAnim.playAction('cross', 1.0);
    } else if (input.consumeKey('KeyQ')) {
      uncleAnim.playAction('hook', 1.0);
    } else if (input.consumeKey('KeyC') || input.getGamepadButton(1)) {
      uncleAnim.playAction('roundhouse', 1.0);
    } else if (input.consumeKey('KeyE')) {
      uncleAnim.playAction('knee', 1.0);
    } else if (input.consumeKey('KeyR')) {
      uncleAnim.playAction('takedown', 1.0);
    } else if (input.consumeKey('KeyF') || (input.gamepadIndex !== null && input.getGamepadButton(5))) {
      uncleAnim.playAction('stiff_arm', 1.0);
    }
  }

  // Footwork & Movement relative to camera / opponent
  const mx = input.moveVector.x;
  const my = input.moveVector.y;
  const isMoving = Math.hypot(mx, my) > 0.05;

  if (isMoving && !uncleAnim.isActionLocked) {
    const moveSpeed = input.sprint ? 5.0 : 3.2; // m/s
    
    // Relative movement along and perpendicular to camera view
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new THREE.Vector3(-camForward.z, 0, camForward.x).normalize();

    const moveDir = new THREE.Vector3()
      .addScaledVector(camRight, mx)
      .addScaledVector(camForward, my)
      .normalize();

    unclePos.addScaledVector(moveDir, moveSpeed * dt);
    uncleAnim.setState(input.sprint ? 'sprint' : 'walk', 1.0);
  } else if (!uncleAnim.isActionLocked) {
    uncleAnim.setState('idle');
  }

  // Octagon cage boundary clamping
  const arenaDist = unclePos.length();
  if (arenaDist > 6.8) {
    unclePos.setLength(6.8);
  }

  // Update skeletal animators
  uncleAnim.update(dt);
  neighborAnim.update(dt);
}

// EA SPORTS UFC 5 CAMERA SYSTEM
function updateUFC5Camera(dt) {
  const unclePos = uncleData.root.position;
  const neighborPos = neighborData.root.position;

  // Midpoint between the two fighters
  const mid = new THREE.Vector3().addVectors(unclePos, neighborPos).multiplyScalar(0.5);

  // Vector connecting the two fighters
  const diff = new THREE.Vector3().subVectors(neighborPos, unclePos);
  const dist = THREE.MathUtils.clamp(diff.length(), 1.4, 8.0);

  if (camMode === 'broadcast') {
    // UFC 5 BROADCAST CAMERA:
    // Positions camera perpendicular to the fighting line, looking across the canvas at eye/chest level
    const perp = new THREE.Vector3(-diff.z, 0, diff.x).normalize();

    // Smooth dolly zoom based on distance between fighters
    const camDist = THREE.MathUtils.clamp(dist * 0.95 + 1.8, 3.2, 5.2);
    
    // Smooth camera elevation (eye-level around 1.35m - 1.55m)
    const camHeight = 1.35 + dist * 0.04;

    targetCamPos.set(
      mid.x + perp.x * camDist,
      camHeight,
      mid.z + perp.z * camDist
    );

    // Look at the chest level of the action midpoint
    const targetLook = new THREE.Vector3(mid.x, 1.25, mid.z);
    currentLookAt.lerp(targetLook, 0.12);
  } else {
    // UFC 5 OVER-THE-SHOULDER / TIGHT CAM:
    // Sits directly behind Fun Uncle, slightly offset to right shoulder
    const dirToOpponent = new THREE.Vector3().subVectors(neighborPos, unclePos).normalize();
    const rightShoulder = new THREE.Vector3(-dirToOpponent.z, 0, dirToOpponent.x).multiplyScalar(0.42);

    targetCamPos.set(
      unclePos.x - dirToOpponent.x * 2.2 + rightShoulder.x,
      1.48,
      unclePos.z - dirToOpponent.z * 2.2 + rightShoulder.z
    );

    const targetLook = new THREE.Vector3(neighborPos.x, 1.30, neighborPos.z);
    currentLookAt.lerp(targetLook, 0.14);
  }

  // Smooth cinematic camera lag
  camera.position.lerp(targetCamPos, 0.09);
  camera.lookAt(currentLookAt);
}

// Start loop
animate();
