// web/js/input.js - Dual-Analog Gamepad & Keyboard/Mouse Input Controller
// Adheres strictly to docs/CONTROLS_SPECIFICATION.md

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.mouse = { left: false, right: false, dx: 0, dy: 0 };
    this.gamepadIndex = null;

    // Movement vector
    this.moveVector = { x: 0, y: 0 };
    this.sprint = false;
    this.focusLock = false;

    // Event listeners
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('gamepadconnected', (e) => {
      console.log('Gamepad connected at index %d: %s.', e.gamepad.index, e.gamepad.id);
      this.gamepadIndex = e.gamepad.index;
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadIndex = null;
      }
    });

    // Flick gesture tracking for Right Stick (150ms window)
    this.rsHistory = [];
  }

  onKeyDown(e) {
    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  onMouseDown(e) {
    if (e.button === 0) this.mouse.left = true;
    if (e.button === 2) this.mouse.right = true;
  }

  onMouseUp(e) {
    if (e.button === 0) this.mouse.left = false;
    if (e.button === 2) this.mouse.right = false;
  }

  // Cubic response curve from CONTROLS_SPECIFICATION.md: f(x) = 0.3x + 0.7x^3
  applyCubicCurve(val) {
    const sign = Math.sign(val);
    const absVal = Math.abs(val);
    return sign * (0.3 * absVal + 0.7 * Math.pow(absVal, 3));
  }

  update() {
    this.moveVector.x = 0;
    this.moveVector.y = 0;
    this.sprint = false;

    // 1. Keyboard checks
    if (this.keys['KeyW'] || this.keys['ArrowUp']) this.moveVector.y += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) this.moveVector.y -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) this.moveVector.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) this.moveVector.x += 1;
    if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) this.sprint = true;

    // Normalize keyboard vector
    const len = Math.hypot(this.moveVector.x, this.moveVector.y);
    if (len > 0) {
      this.moveVector.x /= len;
      this.moveVector.y /= len;
    }

    // 2. Gamepad poll
    if (this.gamepadIndex !== null) {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[this.gamepadIndex];
      if (gp) {
        // Left stick locomotion
        let lx = gp.axes[0];
        let ly = -gp.axes[1]; // invert so up is positive
        const radialDist = Math.hypot(lx, ly);

        // Deadzone check (inner 0.12, outer 0.95)
        if (radialDist > 0.12) {
          const normFactor = Math.min(1.0, (radialDist - 0.12) / (0.95 - 0.12));
          const angle = Math.atan2(ly, lx);
          const curvedSpeed = this.applyCubicCurve(normFactor);
          this.moveVector.x = Math.cos(angle) * curvedSpeed;
          this.moveVector.y = Math.sin(angle) * curvedSpeed;
        }

        // RT Sprint
        if (gp.buttons[7] && gp.buttons[7].pressed) {
          this.sprint = true;
        }

        // LT Focus
        this.focusLock = gp.buttons[6] && gp.buttons[6].pressed;
      }
    }
  }

  isKeyPressed(code) {
    return !!this.keys[code];
  }

  consumeKey(code) {
    if (this.keys[code]) {
      this.keys[code] = false;
      return true;
    }
    return false;
  }

  consumeLeftClick() {
    if (this.mouse.left) {
      this.mouse.left = false;
      return true;
    }
    return false;
  }

  consumeRightClick() {
    if (this.mouse.right) {
      this.mouse.right = false;
      return true;
    }
    return false;
  }

  // Check Gamepad face buttons
  getGamepadButton(buttonIndex) {
    if (this.gamepadIndex === null) return false;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[this.gamepadIndex];
    return gp && gp.buttons[buttonIndex] && gp.buttons[buttonIndex].pressed;
  }
}
