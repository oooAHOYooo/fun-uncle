// web/js/animation.js - Procedural Skeletal Animation & State Machine Engine
import * as THREE from 'three';

export class CharacterAnimator {
  constructor(charData) {
    this.char = charData;
    this.joints = charData.joints;
    this.currentAnim = 'idle';
    this.animTime = 0;
    this.animSpeed = 1.0;
    this.transitionTime = 0;
    this.transitionDuration = 0.15;
    this.isActionLocked = false;
    this.actionCallback = null;
    this.hitFrameFired = false;

    // Hitbox anchor points for combat
    this.activeHitbox = null; // { bone: 'rightHand'|'leftHand'|'rightKnee'|'rightFoot', radius: 0.35, damage: 15, impulse: 3000, type: 'punch' }
    
    // Procedural overrides (ragdoll blend / procedural lean)
    this.proceduralLean = new THREE.Vector3();
    this.impactRecoil = new THREE.Vector3();
    this.ragdollBlend = 0; // 0 to 1

    // Store base pose
    this.resetJoints();
  }

  resetJoints() {
    for (const key in this.joints) {
      const j = this.joints[key];
      j.rotation.set(0, 0, 0);
    }
    this.joints.hips.position.y = 1.05;
    this.joints.hips.position.x = 0;
    this.joints.hips.position.z = 0;
  }

  playAction(animName, speed = 1.0, onHit = null, onComplete = null) {
    this.currentAnim = animName;
    this.animTime = 0;
    this.animSpeed = speed;
    this.isActionLocked = true;
    this.actionCallback = onComplete;
    this.hitCallback = onHit;
    this.hitFrameFired = false;
  }

  setState(stateName, speed = 1.0) {
    if (this.isActionLocked) return;
    if (this.currentAnim !== stateName) {
      this.currentAnim = stateName;
      this.animTime = 0;
      this.animSpeed = speed;
    }
  }

  update(dt) {
    const scaledDt = dt * this.animSpeed;
    this.animTime += scaledDt;

    // Decay recoil
    this.impactRecoil.lerp(new THREE.Vector3(), 0.15);

    // Apply animation frame
    this.evaluateAnimation(this.currentAnim, this.animTime);

    // Apply procedural impact recoil to chest / head
    this.joints.chest.rotation.x += this.impactRecoil.z;
    this.joints.chest.rotation.z += this.impactRecoil.x;
    this.joints.head.rotation.x += this.impactRecoil.z * 1.5;
    this.joints.head.rotation.y += this.impactRecoil.y;
  }

  evaluateAnimation(name, time) {
    const j = this.joints;

    switch (name) {
      case 'idle': {
        const breathe = Math.sin(time * 2.5);
        j.hips.position.y = 1.05 + breathe * 0.02;
        j.chest.rotation.x = 0.05 + breathe * 0.03;
        
        // Boxer / athletic guard stance
        j.leftShoulder.rotation.x = 0.7 + breathe * 0.04;
        j.leftShoulder.rotation.z = 0.3;
        j.leftForearm.rotation.x = -1.4;
        j.leftHand.rotation.y = 0.4;

        j.rightShoulder.rotation.x = 0.8 + breathe * 0.03;
        j.rightShoulder.rotation.z = -0.35;
        j.rightForearm.rotation.x = -1.5;
        j.rightHand.rotation.y = -0.3;

        j.leftHip.rotation.x = -0.05;
        j.rightHip.rotation.x = 0.05;
        j.leftKnee.rotation.x = 0.1;
        j.rightKnee.rotation.x = 0.1;
        this.activeHitbox = null;
        break;
      }

      case 'walk': {
        const t = time * 6.0;
        const legSwing = Math.sin(t);
        const bob = Math.abs(Math.sin(t)) * 0.06;

        j.hips.position.y = 1.05 - bob;
        j.hips.rotation.y = legSwing * 0.1;

        // Legs
        j.leftHip.rotation.x = legSwing * 0.6;
        j.rightHip.rotation.x = -legSwing * 0.6;
        j.leftKnee.rotation.x = Math.max(0, -legSwing * 0.7);
        j.rightKnee.rotation.x = Math.max(0, legSwing * 0.7);

        // Arms swing counter
        j.leftShoulder.rotation.x = -legSwing * 0.5 + 0.3;
        j.rightShoulder.rotation.x = legSwing * 0.5 + 0.3;
        j.leftForearm.rotation.x = -0.6;
        j.rightForearm.rotation.x = -0.6;

        j.chest.rotation.x = 0.1;
        this.activeHitbox = null;
        break;
      }

      case 'sprint': {
        const t = time * 12.0;
        const legSwing = Math.sin(t);
        const bob = Math.abs(Math.sin(t)) * 0.09;

        // Heavy forward athletic tilt (Mass x Velocity)
        j.hips.position.y = 0.98 - bob;
        j.hips.rotation.y = legSwing * 0.18;
        j.chest.rotation.x = 0.35; // aggressive sprint lean

        // Hard pumping legs
        j.leftHip.rotation.x = legSwing * 0.95;
        j.rightHip.rotation.x = -legSwing * 0.95;
        j.leftKnee.rotation.x = Math.max(0, -legSwing * 1.3);
        j.rightKnee.rotation.x = Math.max(0, legSwing * 1.3);

        // Dynamic pumping arms
        j.leftShoulder.rotation.x = -legSwing * 1.1;
        j.rightShoulder.rotation.x = legSwing * 1.1;
        j.leftForearm.rotation.x = -1.2;
        j.rightForearm.rotation.x = -1.2;
        this.activeHitbox = null;
        break;
      }

      case 'skate_idle': {
        // Sideways surf carve stance
        j.hips.position.y = 1.00;
        j.hips.rotation.y = 0.75; // 45-degree angle
        j.chest.rotation.y = -0.6; // head/shoulders looking forward
        j.chest.rotation.x = 0.15;

        // Slight crouch
        j.leftHip.rotation.x = 0.35;
        j.rightHip.rotation.x = -0.25;
        j.leftKnee.rotation.x = 0.45;
        j.rightKnee.rotation.x = 0.35;

        // Outstretched balancing arms
        j.leftShoulder.rotation.set(0.2, 0, 0.7);
        j.leftForearm.rotation.set(-0.3, 0, 0);
        j.rightShoulder.rotation.set(-0.2, 0, -0.65);
        j.rightForearm.rotation.set(-0.3, 0, 0);
        this.activeHitbox = null;
        break;
      }

      case 'skate_push': {
        const duration = 0.55;
        const progress = Math.min(time / duration, 1.0);
        j.hips.position.y = 0.98;
        j.hips.rotation.y = 0.3;

        // Left foot stays on board, right foot kicks ground
        j.leftHip.rotation.x = 0.2;
        j.leftKnee.rotation.x = 0.4;

        if (progress < 0.5) {
          // Push forward
          const p = progress / 0.5;
          j.rightHip.rotation.x = -0.6 * (1 - p) + 0.4 * p;
          j.rightKnee.rotation.x = 0.6 * (1 - p);
        } else {
          // Sweep leg back
          const p = (progress - 0.5) / 0.5;
          j.rightHip.rotation.x = 0.4 * (1 - p) - 0.8 * p;
          j.rightKnee.rotation.x = 0.3 * p;
        }

        if (progress >= 1.0) {
          this.isActionLocked = false;
          this.currentAnim = 'skate_idle';
        }
        break;
      }

      // UFC STRIKE 1: Snappy Left Jab
      case 'jab': {
        const duration = 0.28;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.4) {
          // Extension
          const p = progress / 0.4;
          j.chest.rotation.y = 0.45 * p;
          j.leftShoulder.rotation.set(1.45 * p, 0, 0.1);
          j.leftForearm.rotation.x = -1.4 * (1 - p) - 0.1 * p;
          j.leftHand.position.set(0, 0, 0.45 * p);

          // Check hit frame
          if (progress > 0.28 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.leftHand,
              radius: 0.45,
              damage: 14,
              impulse: 2200,
              type: 'jab',
              sound: 'punch'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          // Retract
          const p = (progress - 0.4) / 0.6;
          j.chest.rotation.y = 0.45 * (1 - p);
          j.leftShoulder.rotation.set(1.45 * (1 - p) + 0.7 * p, 0, 0.3 * p);
          j.leftForearm.rotation.x = -0.1 * (1 - p) - 1.4 * p;
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // UFC STRIKE 2: Heavy Right Cross / Straight
      case 'cross': {
        const duration = 0.38;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.45) {
          const p = progress / 0.45;
          // Deep hip and torso rotation into the punch
          j.hips.rotation.y = -0.55 * p;
          j.chest.rotation.y = -0.65 * p;
          j.chest.rotation.x = 0.15 * p;

          // Back foot pivots
          j.rightHip.rotation.y = 0.4 * p;

          // Right arm delivers straight power
          j.rightShoulder.rotation.set(1.5 * p, 0, -0.15);
          j.rightForearm.rotation.x = -1.5 * (1 - p) - 0.05 * p;

          if (progress > 0.32 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.rightHand,
              radius: 0.5,
              damage: 26,
              impulse: 4400,
              type: 'cross',
              sound: 'punch_heavy'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          const p = (progress - 0.45) / 0.55;
          j.hips.rotation.y = -0.55 * (1 - p);
          j.chest.rotation.y = -0.65 * (1 - p);
          j.rightShoulder.rotation.set(1.5 * (1 - p) + 0.8 * p, 0, -0.35 * p);
          j.rightForearm.rotation.x = -0.05 * (1 - p) - 1.5 * p;
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // UFC STRIKE 3: Sweeping Lead Left Hook
      case 'hook': {
        const duration = 0.42;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.42) {
          const p = progress / 0.42;
          // Wind up then explosive horizontal arc
          j.chest.rotation.y = -0.3 * (1 - p) + 0.85 * p;
          j.leftShoulder.rotation.set(1.1, 0, 0.9 * p);
          j.leftForearm.rotation.set(-1.4, 0, -0.8 * p);

          if (progress > 0.28 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.leftHand,
              radius: 0.55,
              damage: 32,
              impulse: 5200,
              type: 'hook',
              sound: 'punch_heavy'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          const p = (progress - 0.42) / 0.58;
          j.chest.rotation.y = 0.85 * (1 - p);
          j.leftShoulder.rotation.set(1.1 * (1 - p) + 0.7 * p, 0, 0.9 * (1 - p) + 0.3 * p);
          j.leftForearm.rotation.set(-1.4, 0, -0.8 * (1 - p));
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // UFC STRIKE 4: High Roundhouse Leg/Body Kick
      case 'roundhouse': {
        const duration = 0.52;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.45) {
          const p = progress / 0.45;
          // Torso turns over, standing leg posts
          j.hips.rotation.y = -0.9 * p;
          j.chest.rotation.y = -0.7 * p;
          j.chest.rotation.z = -0.35 * p; // lean back for leverage

          // Whipping right leg up
          j.rightHip.rotation.x = 1.35 * p;
          j.rightHip.rotation.z = 0.75 * p;
          j.rightKnee.rotation.x = 0.9 * (1 - p) + 0.1 * p;

          if (progress > 0.32 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.rightFoot,
              radius: 0.6,
              damage: 38,
              impulse: 6500,
              type: 'roundhouse',
              sound: 'kick_heavy'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          const p = (progress - 0.45) / 0.55;
          j.hips.rotation.y = -0.9 * (1 - p);
          j.chest.rotation.y = -0.7 * (1 - p);
          j.chest.rotation.z = -0.35 * (1 - p);
          j.rightHip.rotation.x = 1.35 * (1 - p);
          j.rightHip.rotation.z = 0.75 * (1 - p);
          j.rightKnee.rotation.x = 0.1 * (1 - p);
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // UFC STRIKE 5: Clinch & Destructive Knee Strike
      case 'knee': {
        const duration = 0.46;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.4) {
          const p = progress / 0.4;
          // Reach out and pull downward (clinch)
          j.leftShoulder.rotation.set(1.3 * p, 0, 0.2);
          j.rightShoulder.rotation.set(1.3 * p, 0, -0.2);
          j.chest.rotation.x = 0.25 * p;

          // Explode right knee upward
          j.rightHip.rotation.x = 1.6 * p;
          j.rightKnee.rotation.x = 1.8 * p;

          if (progress > 0.28 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.rightKnee,
              radius: 0.5,
              damage: 42,
              impulse: 7000,
              type: 'knee',
              sound: 'knee'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          const p = (progress - 0.4) / 0.6;
          j.leftShoulder.rotation.set(1.3 * (1 - p) + 0.7 * p, 0, 0.2);
          j.rightShoulder.rotation.set(1.3 * (1 - p) + 0.8 * p, 0, -0.2);
          j.rightHip.rotation.x = 1.6 * (1 - p);
          j.rightKnee.rotation.x = 1.8 * (1 - p);
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // UFC GRAPPLING: Double-Leg Takedown Shoot & Slam
      case 'takedown': {
        const duration = 0.85;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.3) {
          // Level change & explosive shoot
          const p = progress / 0.3;
          j.hips.position.y = 1.05 - 0.45 * p;
          j.chest.rotation.x = 0.75 * p;
          j.leftShoulder.rotation.set(1.1 * p, 0, 0.4 * p);
          j.rightShoulder.rotation.set(1.1 * p, 0, -0.4 * p);
          j.leftHip.rotation.x = 0.8 * p;
          j.rightHip.rotation.x = -0.5 * p;
        } else if (progress < 0.65) {
          // Drive through opponent's hips
          const p = (progress - 0.3) / 0.35;
          j.hips.position.y = 0.60;
          j.chest.rotation.x = 0.55;

          if (!this.hitFrameFired && progress > 0.38) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.chest,
              radius: 0.8,
              damage: 30,
              impulse: 7500,
              type: 'takedown',
              sound: 'slam'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          // Follow down to mat
          const p = (progress - 0.65) / 0.35;
          j.hips.position.y = 0.60 * (1 - p) + 1.05 * p;
          j.chest.rotation.x = 0.55 * (1 - p);
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // MADDEN STIFF-ARM / TRUCK CHARGE
      case 'stiff_arm': {
        const duration = 0.55;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.45) {
          const p = progress / 0.45;
          // Lower shoulder, thrust lead stiff-arm out like iron bar
          j.chest.rotation.x = 0.45 * p;
          j.chest.rotation.y = -0.4 * p;
          j.leftShoulder.rotation.set(1.5 * p, 0, 0.1);
          j.leftForearm.rotation.set(-0.1, 0, 0);

          if (progress > 0.25 && !this.hitFrameFired) {
            this.hitFrameFired = true;
            this.activeHitbox = {
              source: this.char,
              bone: j.leftHand,
              radius: 0.65,
              damage: 35,
              impulse: 8200, // Big Madden bowling impulse!
              type: 'stiff_arm',
              sound: 'truck'
            };
            if (this.hitCallback) this.hitCallback(this.activeHitbox);
          }
        } else {
          const p = (progress - 0.45) / 0.55;
          j.chest.rotation.x = 0.45 * (1 - p);
          j.chest.rotation.y = -0.4 * (1 - p);
          j.leftShoulder.rotation.set(1.5 * (1 - p) + 0.7 * p, 0, 0.3 * p);
          this.activeHitbox = null;
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // JUKE / LATERAL EVASION
      case 'juke_left':
      case 'juke_right': {
        const isLeft = name === 'juke_left';
        const sign = isLeft ? -1 : 1;
        const duration = 0.32;
        const progress = Math.min(time / duration, 1.0);

        j.hips.position.x = Math.sin(progress * Math.PI) * 0.45 * sign;
        j.hips.rotation.z = -Math.sin(progress * Math.PI) * 0.35 * sign;
        j.chest.rotation.z = Math.sin(progress * Math.PI) * 0.3 * sign;

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // REACTION 1: Head Snapback
      case 'hit_head': {
        const duration = 0.35;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.3) {
          const p = progress / 0.3;
          j.head.rotation.x = -0.75 * p;
          j.chest.rotation.x = -0.4 * p;
          j.hips.position.z = -0.2 * p;
        } else {
          const p = (progress - 0.3) / 0.7;
          j.head.rotation.x = -0.75 * (1 - p);
          j.chest.rotation.x = -0.4 * (1 - p);
          j.hips.position.z = -0.2 * (1 - p);
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // REACTION 2: Body Fold Recoil
      case 'hit_body': {
        const duration = 0.42;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.35) {
          const p = progress / 0.35;
          j.chest.rotation.x = 0.7 * p;
          j.hips.position.y = 1.05 - 0.15 * p;
          j.head.rotation.x = 0.4 * p;
        } else {
          const p = (progress - 0.35) / 0.65;
          j.chest.rotation.x = 0.7 * (1 - p);
          j.hips.position.y = 1.05 - 0.15 * (1 - p);
          j.head.rotation.x = 0.4 * (1 - p);
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // REACTION 3: Knockdown / Takedown Fall to Mat
      case 'knockdown': {
        const duration = 1.2;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.35) {
          // Collapse backward
          const p = progress / 0.35;
          j.hips.position.y = 1.05 * (1 - p) + 0.22 * p;
          j.hips.position.z = -0.6 * p;
          j.hips.rotation.x = -1.45 * p;
          j.chest.rotation.x = 0.2 * p;
          j.leftHip.rotation.x = -0.4 * p;
          j.rightHip.rotation.x = -0.3 * p;
        } else if (progress < 0.75) {
          // On mat
          j.hips.position.y = 0.22;
          j.hips.rotation.x = -1.55;
          j.head.rotation.x = -0.3;
        } else {
          // Get up recovery
          const p = (progress - 0.75) / 0.25;
          j.hips.position.y = 0.22 * (1 - p) + 1.05 * p;
          j.hips.rotation.x = -1.55 * (1 - p);
          j.hips.position.z = -0.6 * (1 - p);
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      // REACTION 4: KO Ragdoll / Defeated
      case 'ko': {
        // Flat on canvas, limbs sprawled
        j.hips.position.y = 0.20;
        j.hips.rotation.x = -1.57; // Flat on back
        j.leftShoulder.rotation.set(0, 0, 1.3);
        j.rightShoulder.rotation.set(0, 0, -1.3);
        j.leftHip.rotation.set(0.2, 0, 0.4);
        j.rightHip.rotation.set(0.1, 0, -0.4);
        break;
      }

      // Trampoline launch tuck / stretch
      case 'trampoline_bounce': {
        const duration = 0.6;
        const progress = Math.min(time / duration, 1.0);

        if (progress < 0.5) {
          // Cannonball tuck
          const p = progress / 0.5;
          j.hips.position.y = 1.05 + Math.sin(p * Math.PI) * 1.5;
          j.chest.rotation.x = 1.2 * p;
          j.leftHip.rotation.x = 1.5 * p;
          j.rightHip.rotation.x = 1.5 * p;
          j.leftKnee.rotation.x = 1.8 * p;
          j.rightKnee.rotation.x = 1.8 * p;
        } else {
          // Stretch layout
          const p = (progress - 0.5) / 0.5;
          j.hips.position.y = 2.55 * (1 - p) + 1.05 * p;
          j.chest.rotation.x = 1.2 * (1 - p);
          j.leftHip.rotation.x = 1.5 * (1 - p);
          j.rightHip.rotation.x = 1.5 * (1 - p);
          j.leftKnee.rotation.x = 1.8 * (1 - p);
          j.rightKnee.rotation.x = 1.8 * (1 - p);
        }

        if (progress >= 1.0) {
          this.finishAction();
        }
        break;
      }

      default:
        this.evaluateAnimation('idle', time);
    }
  }

  finishAction() {
    this.isActionLocked = false;
    this.activeHitbox = null;
    this.hitFrameFired = false;
    if (this.actionCallback) {
      const cb = this.actionCallback;
      this.actionCallback = null;
      cb();
    } else {
      this.currentAnim = 'idle';
      this.animTime = 0;
    }
  }

  applyRecoil(directionVec) {
    this.impactRecoil.copy(directionVec);
  }
}
