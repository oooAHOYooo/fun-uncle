// web/js/character.js - Procedural Humanoid Skeleton & Mesh Factory for Fun Uncle & Neighbor
import * as THREE from 'three';

export function createCharacter(type = 'uncle') {
  const root = new THREE.Group();
  root.name = type === 'uncle' ? 'FunUncle' : 'NeighborNed';

  // Base materials
  const isUncle = type === 'uncle';

  // Skin tone
  const skinMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0xf0b892 : 0xecb18a,
    roughness: 0.6,
  });

  // Clothes materials
  const shirtMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0x00d4ff : 0x2e6f40, // Uncle: Neon Cyan bowling shirt; Neighbor: Suburban Forest Green polo
    roughness: 0.5,
  });
  const accentShirtMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0xff2a85 : 0xffffff, // Uncle: Hot Pink bowling stripe; Neighbor: White polo collar
    roughness: 0.5,
  });
  const shortsMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0x937c58 : 0xceb68c, // Uncle: Rugged Cargo shorts; Neighbor: Beige khakis
    roughness: 0.8,
  });
  const shoesMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0x222222 : 0xffffff, // Uncle: Retro cross-trainers; Neighbor: White dad tennis shoes
    roughness: 0.5,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: isUncle ? 0x3d271d : 0x555555, // Uncle: Brown scruff; Neighbor: Graying suburban hairline
    roughness: 0.9,
  });
  const glassesMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00, // Amber polarized shades
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });

  // SKELETON HIERARCHY
  // Pelvis / Hips (Root of body physics)
  const hips = new THREE.Group();
  hips.name = 'hips';
  hips.position.y = 1.05;
  root.add(hips);

  // Pelvis mesh
  const hipsGeo = new THREE.CylinderGeometry(isUncle ? 0.28 : 0.24, isUncle ? 0.26 : 0.22, 0.26, 12);
  const hipsMesh = new THREE.Mesh(hipsGeo, shortsMat);
  hipsMesh.castShadow = true;
  hips.add(hipsMesh);

  // Spine / Chest
  const chest = new THREE.Group();
  chest.name = 'chest';
  chest.position.y = 0.22;
  hips.add(chest);

  // Uncle has a heavier, thicker athletic barrel chest (108kg mass)
  const chestGeo = new THREE.CylinderGeometry(
    isUncle ? 0.34 : 0.27, 
    isUncle ? 0.30 : 0.25, 
    0.46, 
    14
  );
  const chestMesh = new THREE.Mesh(chestGeo, shirtMat);
  chestMesh.castShadow = true;
  chest.add(chestMesh);

  // Bowling stripe or polo buttons
  const stripeGeo = new THREE.BoxGeometry(0.12, 0.44, 0.08);
  const stripeMesh = new THREE.Mesh(stripeGeo, accentShirtMat);
  stripeMesh.position.set(0, 0, isUncle ? 0.28 : 0.24);
  chest.add(stripeMesh);

  // Head and Neck
  const neck = new THREE.Group();
  neck.name = 'neck';
  neck.position.y = 0.30;
  chest.add(neck);

  const head = new THREE.Group();
  head.name = 'head';
  head.position.y = 0.18;
  neck.add(head);

  const headGeo = new THREE.SphereGeometry(isUncle ? 0.18 : 0.16, 14, 12);
  headGeo.scale(1, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Hair & Facial features
  if (isUncle) {
    // Mustache & Hair
    const stacheGeo = new THREE.BoxGeometry(0.14, 0.04, 0.05);
    const stache = new THREE.Mesh(stacheGeo, hairMat);
    stache.position.set(0, -0.05, 0.18);
    head.add(stache);

    // Hair cap
    const hairGeo = new THREE.SphereGeometry(0.185, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.03;
    head.add(hair);

    // Signature Amber Polarized Wrap-around Sunglasses
    const glassesGeo = new THREE.BoxGeometry(0.26, 0.06, 0.12);
    const glasses = new THREE.Mesh(glassesGeo, glassesMat);
    glasses.position.set(0, 0.05, 0.14);
    head.add(glasses);
  } else {
    // Neighbor balding fringe
    const hairGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12, 1, true, Math.PI * 0.4, Math.PI * 1.2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.04;
    head.add(hair);

    // Mustache / Grumpy mouth
    const frownGeo = new THREE.BoxGeometry(0.11, 0.025, 0.04);
    const frown = new THREE.Mesh(frownGeo, hairMat);
    frown.position.set(0, -0.06, 0.16);
    head.add(frown);
  }

  // Helper for limbs
  function buildArm(side) {
    const isLeft = side === -1;
    const shoulder = new THREE.Group();
    shoulder.name = isLeft ? 'leftShoulder' : 'rightShoulder';
    shoulder.position.set(side * (isUncle ? 0.36 : 0.30), 0.16, 0);
    chest.add(shoulder);

    // Upper arm
    const upperArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.28, 10);
    upperArmGeo.translate(0, -0.14, 0);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, shirtMat);
    upperArmMesh.castShadow = true;
    shoulder.add(upperArmMesh);

    // Forearm
    const forearm = new THREE.Group();
    forearm.name = isLeft ? 'leftForearm' : 'rightForearm';
    forearm.position.y = -0.28;
    shoulder.add(forearm);

    const forearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.26, 10);
    forearmGeo.translate(0, -0.13, 0);
    const forearmMesh = new THREE.Mesh(forearmGeo, skinMat);
    forearmMesh.castShadow = true;
    forearm.add(forearmMesh);

    // Hand / Glove
    const hand = new THREE.Group();
    hand.name = isLeft ? 'leftHand' : 'rightHand';
    hand.position.y = -0.26;
    forearm.add(hand);

    // Boxing tape / MMA glove
    const gloveMat = new THREE.MeshStandardMaterial({
      color: isUncle ? (isLeft ? 0x111111 : 0xff3b30) : 0x333333,
      roughness: 0.4
    });
    const handGeo = new THREE.SphereGeometry(0.085, 10, 8);
    handGeo.scale(1, 1.2, 0.85);
    const handMesh = new THREE.Mesh(handGeo, gloveMat);
    handMesh.castShadow = true;
    hand.add(handMesh);

    return { shoulder, forearm, hand };
  }

  function buildLeg(side) {
    const isLeft = side === -1;
    const hipJoint = new THREE.Group();
    hipJoint.name = isLeft ? 'leftHip' : 'rightHip';
    hipJoint.position.set(side * (isUncle ? 0.16 : 0.13), -0.13, 0);
    hips.add(hipJoint);

    // Thigh
    const thighGeo = new THREE.CylinderGeometry(0.12, 0.10, 0.36, 10);
    thighGeo.translate(0, -0.18, 0);
    const thighMesh = new THREE.Mesh(thighGeo, shortsMat);
    thighMesh.castShadow = true;
    hipJoint.add(thighMesh);

    // Knee / Shin
    const knee = new THREE.Group();
    knee.name = isLeft ? 'leftKnee' : 'rightKnee';
    knee.position.y = -0.36;
    hipJoint.add(knee);

    const shinGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.38, 10);
    shinGeo.translate(0, -0.19, 0);
    const shinMesh = new THREE.Mesh(shinGeo, skinMat);
    shinMesh.castShadow = true;
    knee.add(shinMesh);

    // Foot / Shoe
    const foot = new THREE.Group();
    foot.name = isLeft ? 'leftFoot' : 'rightFoot';
    foot.position.y = -0.38;
    knee.add(foot);

    const shoeGeo = new THREE.BoxGeometry(0.13, 0.10, 0.28);
    shoeGeo.translate(0, -0.05, 0.08);
    const shoeMesh = new THREE.Mesh(shoeGeo, shoesMat);
    shoeMesh.castShadow = true;
    foot.add(shoeMesh);

    return { hipJoint, knee, foot };
  }

  const leftArm = buildArm(-1);
  const rightArm = buildArm(1);
  const leftLeg = buildLeg(-1);
  const rightLeg = buildLeg(1);

  // Skateboard accessory (for Uncle)
  let skateboard = null;
  if (isUncle) {
    skateboard = new THREE.Group();
    skateboard.name = 'skateboard';
    
    // Wooden deck with neon grip tape
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const deckGeo = new THREE.BoxGeometry(0.32, 0.03, 0.95);
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.castShadow = true;
    skateboard.add(deck);

    // Retro neon underside graphic
    const graphicMat = new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.3 });
    const graphicGeo = new THREE.BoxGeometry(0.30, 0.01, 0.88);
    const graphic = new THREE.Mesh(graphicGeo, graphicMat);
    graphic.position.y = -0.02;
    skateboard.add(graphic);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.2 });
    const wheelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12);
    wheelGeo.rotateZ(Math.PI / 2);

    [[-0.14, -0.32], [0.14, -0.32], [-0.14, 0.32], [0.14, 0.32]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, -0.05, wz);
      skateboard.add(wheel);
    });

    skateboard.visible = false;
    root.add(skateboard);
  }

  return {
    root,
    type,
    joints: {
      hips,
      chest,
      neck,
      head,
      leftShoulder: leftArm.shoulder,
      leftForearm: leftArm.forearm,
      leftHand: leftArm.hand,
      rightShoulder: rightArm.shoulder,
      rightForearm: rightArm.forearm,
      rightHand: rightArm.hand,
      leftHip: leftLeg.hipJoint,
      leftKnee: leftLeg.knee,
      leftFoot: leftLeg.foot,
      rightHip: rightLeg.hipJoint,
      rightKnee: rightLeg.knee,
      rightFoot: rightLeg.foot,
    },
    skateboard
  };
}
