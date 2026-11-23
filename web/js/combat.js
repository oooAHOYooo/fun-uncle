// web/js/combat.js - UFC Neighbor Combat System & AI
import * as THREE from 'three';
import { soundFX } from './audio.js';

export class CombatManager {
  constructor(uncleChar, uncleAnim, neighborChar, neighborAnim, onUIUpdate) {
    this.uncle = uncleChar;
    this.uncleAnim = uncleAnim;
    this.neighbor = neighborChar;
    this.neighborAnim = neighborAnim;
    this.onUIUpdate = onUIUpdate;

    // Combat Stats
    this.uncleHP = 100;
    this.uncleStamina = 100;
    this.neighborHP = 100;
    this.neighborStun = 0; // 0 to 100
    this.comboCounter = 0;
    this.comboTimer = 0;
    this.fightState = 'fighting'; // 'fighting', 'ko_uncle', 'ko_neighbor'

    // AI State
    this.aiState = 'circle'; // 'circle', 'advance', 'attack', 'block', 'retreat', 'stunned'
    this.aiTimer = 1.0;
    this.aiTrashTalkTimer = 2.5;

    // Neighbor trash talk lines
    this.trashTalkLines = [
      "Get off my Bermuda grass, Ray!",
      "I'm reporting this directly to the HOA!",
      "I wrestled varsity in '94, buddy!",
      "Is that your skateboard on my driveway?!",
      "Don't make me bring out the weedwhacker!",
      "My wife said your grill smoke is blowing into our pool!",
      "Oof! Watch the hip, my sciatica!",
      "You haven't boxed since the Bush administration!"
    ];
    this.currentTrashTalk = "";
    this.trashTalkDisplayTimer = 0;

    // Visual sparks & popups
    this.sparks = [];
    this.damagePopups = [];

    // Connect animation hit callbacks
    this.uncleAnim.hitCallback = (hitbox) => this.handleHit(this.uncle, this.neighbor, this.neighborAnim, hitbox);
    this.neighborAnim.hitCallback = (hitbox) => this.handleHit(this.neighbor, this.uncle, this.uncleAnim, hitbox);
  }

  resetMatch() {
    this.uncleHP = 100;
    this.uncleStamina = 100;
    this.neighborHP = 100;
    this.neighborStun = 0;
    this.comboCounter = 0;
    this.fightState = 'fighting';
    this.aiState = 'circle';
    this.aiTimer = 1.0;
    this.currentTrashTalk = "Ready for Round 2, Ray?!";
    this.trashTalkDisplayTimer = 2.0;

    // Reset positions
    this.uncle.root.position.set(0, 0, 3.5);
    this.uncle.root.rotation.set(0, 0, 0);
    this.neighbor.root.position.set(0, 0, -3.5);
    this.neighbor.root.rotation.set(0, Math.PI, 0);

    this.uncleAnim.resetJoints();
    this.uncleAnim.isActionLocked = false;
    this.uncleAnim.setState('idle');

    this.neighborAnim.resetJoints();
    this.neighborAnim.isActionLocked = false;
    this.neighborAnim.setState('idle');

    soundFX.playFightBell();
    this.notifyUI();
  }

  update(dt, isPlaytestMode = false) {
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCounter = 0;
        this.notifyUI();
      }
    }

    if (this.trashTalkDisplayTimer > 0) {
      this.trashTalkDisplayTimer -= dt;
      if (this.trashTalkDisplayTimer <= 0) {
        this.currentTrashTalk = "";
        this.notifyUI();
      }
    }

    // Stamina regen
    if (this.uncleStamina < 100) {
      this.uncleStamina = Math.min(100, this.uncleStamina + dt * 18);
      this.notifyUI();
    }

    // Stun decay
    if (this.neighborStun > 0) {
      this.neighborStun = Math.max(0, this.neighborStun - dt * 12);
      this.notifyUI();
    }

    // Update AI if not in freeform test
    if (this.fightState === 'fighting' && !isPlaytestMode) {
      this.updateNeighborAI(dt);
    }
  }

  updateNeighborAI(dt) {
    if (this.neighborAnim.isActionLocked) return;

    this.aiTimer -= dt;
    this.aiTrashTalkTimer -= dt;

    if (this.aiTrashTalkTimer <= 0) {
      this.currentTrashTalk = this.trashTalkLines[Math.floor(Math.random() * this.trashTalkLines.length)];
      this.trashTalkDisplayTimer = 2.5;
      this.aiTrashTalkTimer = 4.5 + Math.random() * 3.0;
      this.notifyUI();
    }

    const unclePos = this.uncle.root.position;
    const neighborPos = this.neighbor.root.position;
    const toUncle = new THREE.Vector3().subVectors(unclePos, neighborPos);
    toUncle.y = 0;
    const dist = toUncle.length();

    // Turn to face Uncle
    const targetAngle = Math.atan2(toUncle.x, toUncle.z);
    this.neighbor.root.rotation.y = THREE.MathUtils.lerp(this.neighbor.root.rotation.y, targetAngle, 0.1);

    if (this.aiTimer <= 0) {
      // Pick next AI decision
      if (dist > 3.0) {
        this.aiState = Math.random() < 0.75 ? 'advance' : 'circle';
        this.aiTimer = 1.0 + Math.random() * 1.5;
      } else if (dist < 1.6) {
        const r = Math.random();
        if (r < 0.4) {
          this.aiState = 'attack_jab';
        } else if (r < 0.7) {
          this.aiState = 'attack_cross';
        } else if (r < 0.85) {
          this.aiState = 'attack_kick';
        } else {
          this.aiState = 'retreat';
        }
        this.aiTimer = 0.5 + Math.random() * 0.5;
      } else {
        this.aiState = Math.random() < 0.5 ? 'circle' : 'advance';
        this.aiTimer = 0.8 + Math.random() * 1.0;
      }
    }

    // Execute AI behavior
    switch (this.aiState) {
      case 'advance': {
        this.neighborAnim.setState('walk', 1.0);
        const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.neighbor.root.rotation.y);
        neighborPos.addScaledVector(forward, 2.2 * dt);
        break;
      }
      case 'circle': {
        this.neighborAnim.setState('walk', 0.9);
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.neighbor.root.rotation.y);
        neighborPos.addScaledVector(right, 1.5 * dt);
        break;
      }
      case 'retreat': {
        this.neighborAnim.setState('walk', 0.8);
        const backward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.neighbor.root.rotation.y);
        neighborPos.addScaledVector(backward, 1.8 * dt);
        break;
      }
      case 'attack_jab':
        soundFX.playWhoosh(0.9);
        this.neighborAnim.playAction('jab', 1.0);
        this.aiTimer = 0.6;
        break;
      case 'attack_cross':
        soundFX.playWhoosh(1.1);
        this.neighborAnim.playAction('cross', 0.95);
        this.aiTimer = 0.7;
        break;
      case 'attack_kick':
        soundFX.playWhoosh(1.3);
        this.neighborAnim.playAction('roundhouse', 0.9);
        this.aiTimer = 0.8;
        break;
      default:
        this.neighborAnim.setState('idle');
    }

    // Keep in arena bounds
    const arenaDist = neighborPos.length();
    if (arenaDist > 8.0) {
      neighborPos.setLength(8.0);
    }
  }

  handleHit(attacker, victim, victimAnim, hitbox) {
    if (this.fightState !== 'fighting') return;

    // Check distance between hitbox bone and victim chest / head
    const hitWorldPos = new THREE.Vector3();
    hitbox.bone.getWorldPosition(hitWorldPos);

    const victimChestPos = new THREE.Vector3();
    victim.joints.chest.getWorldPosition(victimChestPos);

    const dist = hitWorldPos.distanceTo(victimChestPos);

    // Hit connected!
    if (dist <= hitbox.radius + 0.8) {
      const isAttackerUncle = attacker === this.uncle;
      const isHeavy = hitbox.damage >= 25;
      const isCritical = isHeavy && Math.random() < 0.3;

      // Play impact audio
      soundFX.playPunchImpact(isHeavy, isCritical);
      soundFX.playGrunt(isAttackerUncle ? 0.9 : 1.1);

      // Compute damage & stats
      if (isAttackerUncle) {
        this.comboCounter++;
        this.comboTimer = 2.0;

        const comboBonus = Math.min(2.0, 1.0 + this.comboCounter * 0.1);
        const finalDamage = Math.round(hitbox.damage * comboBonus);

        this.neighborHP = Math.max(0, this.neighborHP - finalDamage);
        this.neighborStun = Math.min(100, this.neighborStun + finalDamage * 1.5);

        // Knockback vector
        const pushDir = new THREE.Vector3().subVectors(victim.root.position, attacker.root.position).normalize();
        pushDir.y = 0;
        victim.root.position.addScaledVector(pushDir, hitbox.impulse / 10000);

        // Victim reaction animation
        if (this.neighborHP <= 0) {
          this.triggerKO('neighbor');
        } else if (hitbox.type === 'takedown' || hitbox.type === 'stiff_arm' || this.neighborStun >= 100) {
          this.neighborAnim.playAction('knockdown', 1.0);
          this.neighborStun = 20;
          soundFX.playTakedownSlam();
        } else if (isHeavy) {
          this.neighborAnim.playAction('hit_body', 1.1);
        } else {
          this.neighborAnim.playAction('hit_head', 1.2);
        }

        // Camera recoil & damage popup
        this.createHitFX(hitWorldPos, finalDamage, isHeavy);
      } else {
        // Neighbor hit Uncle
        this.uncleHP = Math.max(0, this.uncleHP - hitbox.damage);
        const pushDir = new THREE.Vector3().subVectors(victim.root.position, attacker.root.position).normalize();
        pushDir.y = 0;
        victim.root.position.addScaledVector(pushDir, hitbox.impulse / 12000);

        if (this.uncleHP <= 0) {
          this.triggerKO('uncle');
        } else if (isHeavy) {
          this.uncleAnim.playAction('hit_body', 1.1);
        } else {
          this.uncleAnim.playAction('hit_head', 1.2);
        }

        this.createHitFX(hitWorldPos, hitbox.damage, isHeavy);
      }

      this.notifyUI();
    }
  }

  triggerKO(loser) {
    this.fightState = loser === 'neighbor' ? 'ko_neighbor' : 'ko_uncle';
    soundFX.playKOShockwave();
    soundFX.playFightBell();

    if (loser === 'neighbor') {
      this.neighborAnim.playAction('ko');
      this.currentTrashTalk = "Agh... my lawn...!";
      this.trashTalkDisplayTimer = 4.0;
    } else {
      this.uncleAnim.playAction('ko');
      this.currentTrashTalk = "Told you, Ray! Don't mess with an HOA treasurer!";
      this.trashTalkDisplayTimer = 4.0;
    }

    this.notifyUI();
  }

  createHitFX(pos, damage, isHeavy) {
    // Generate flash data for rendering
    this.sparks.push({
      pos: pos.clone(),
      life: 0.25,
      color: isHeavy ? 0xff2a85 : 0x00d4ff,
      size: isHeavy ? 1.4 : 0.8
    });

    this.damagePopups.push({
      pos: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.6, 0)),
      text: `-${damage}${isHeavy ? '!' : ''}`,
      life: 0.8,
      color: isHeavy ? '#ff2a85' : '#00d4ff'
    });
  }

  notifyUI() {
    if (this.onUIUpdate) {
      this.onUIUpdate({
        uncleHP: this.uncleHP,
        uncleStamina: this.uncleStamina,
        neighborHP: this.neighborHP,
        neighborStun: this.neighborStun,
        comboCounter: this.comboCounter,
        fightState: this.fightState,
        trashTalk: this.currentTrashTalk
      });
    }
  }
}
