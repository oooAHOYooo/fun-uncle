// web/js/world.js - Minimalist Developer Testing Arena, UFC Ring, Trampoline & Props
import * as THREE from 'three';

export function setupWorld(scene) {
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Soft Studio Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333344, 0.7);
  hemiLight.position.set(0, 50, 0);
  worldGroup.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(12, 22, 14);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 60;
  const d = 16;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  worldGroup.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.35);
  fillLight.position.set(-14, 10, -12);
  worldGroup.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xff2a85, 0.3);
  rimLight.position.set(0, 8, -18);
  worldGroup.add(rimLight);

  // 1. BASE INFINITE DEVELOPER GRID FLOOR
  const gridHelper = new THREE.GridHelper(100, 100, 0x00d4ff, 0x223344);
  gridHelper.position.y = 0.002;
  worldGroup.add(gridHelper);

  const floorGeo = new THREE.PlaneGeometry(160, 160);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    roughness: 0.85,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  worldGroup.add(floor);

  // 2. UFC OCTAGON RING
  const octagonGroup = new THREE.Group();
  octagonGroup.name = 'UfcOctagon';
  worldGroup.add(octagonGroup);

  const ringRadius = 7.5;
  const matGeo = new THREE.CylinderGeometry(ringRadius, ringRadius, 0.4, 8);
  const matMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f232b,
    roughness: 0.7
  });
  const canvasMat = new THREE.Mesh(matGeo, matMaterial);
  canvasMat.position.y = 0.2;
  canvasMat.receiveShadow = true;
  octagonGroup.add(canvasMat);

  // Canvas center logo circle
  const logoGeo = new THREE.RingGeometry(1.2, 2.2, 32);
  const logoMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, side: THREE.DoubleSide });
  const logo = new THREE.Mesh(logoGeo, logoMat);
  logo.rotation.x = -Math.PI / 2;
  logo.position.y = 0.41;
  octagonGroup.add(logo);

  // Corner Posts & Padded Rails
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
  const redPostMat = new THREE.MeshStandardMaterial({ color: 0xff2a85, roughness: 0.3 });
  const bluePostMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.3 });

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const px = Math.cos(angle) * ringRadius;
    const pz = Math.sin(angle) * ringRadius;

    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 12);
    let pMat = postMaterial;
    if (i === 0) pMat = bluePostMat;
    if (i === 4) pMat = redPostMat;

    const post = new THREE.Mesh(postGeo, pMat);
    post.position.set(px, 1.3, pz);
    post.castShadow = true;
    octagonGroup.add(post);

    // Ropes / tension wires between posts
    const nextAngle = ((i + 1) * Math.PI * 2) / 8;
    const npx = Math.cos(nextAngle) * ringRadius;
    const npz = Math.sin(nextAngle) * ringRadius;

    [0.8, 1.3, 1.8].forEach(ry => {
      const ropeDir = new THREE.Vector3(npx - px, 0, npz - pz);
      const ropeLen = ropeDir.length();
      const ropeGeo = new THREE.CylinderGeometry(0.025, 0.025, ropeLen, 8);
      const rope = new THREE.Mesh(ropeGeo, postMaterial);

      const midX = (px + npx) / 2;
      const midZ = (pz + npz) / 2;
      rope.position.set(midX, ry, midZ);
      rope.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ropeDir.normalize());
      octagonGroup.add(rope);
    });
  }

  // 3. HIGH-RESTITUTION TRAMPOLINE (GDD TASK-201)
  const trampolineGroup = new THREE.Group();
  trampolineGroup.name = 'TrampolinePad';
  trampolineGroup.position.set(12, 0, 0);
  worldGroup.add(trampolineGroup);

  const trampFrameGeo = new THREE.TorusGeometry(2.4, 0.09, 12, 32);
  const trampFrameMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7 });
  const trampFrame = new THREE.Mesh(trampFrameGeo, trampFrameMat);
  trampFrame.rotation.x = Math.PI / 2;
  trampFrame.position.y = 0.6;
  trampFrame.castShadow = true;
  trampolineGroup.add(trampFrame);

  // Trampoline Mat
  const trampMatGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.05, 32);
  const trampMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.3 });
  const trampMesh = new THREE.Mesh(trampMatGeo, trampMat);
  trampMesh.position.y = 0.6;
  trampolineGroup.add(trampMesh);

  // Trampoline legs
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4;
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
    const leg = new THREE.Mesh(legGeo, trampFrameMat);
    leg.position.set(Math.cos(angle) * 2.2, 0.3, Math.sin(angle) * 2.2);
    leg.castShadow = true;
    trampolineGroup.add(leg);
  }

  // 4. SKATE VERT RAMP & GRIND RAIL (GDD TASK-102)
  const skateGroup = new THREE.Group();
  skateGroup.name = 'SkateRamp';
  skateGroup.position.set(-13, 0, 0);
  worldGroup.add(skateGroup);

  // Quarter pipe ramp
  const rampGeo = new THREE.BoxGeometry(6.0, 1.8, 5.0);
  const rampMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
  const ramp = new THREE.Mesh(rampGeo, rampMat);
  ramp.position.set(0, 0.9, 0);
  ramp.rotation.x = 0.35;
  skateGroup.add(ramp);

  // Grind rail
  const railGeo = new THREE.CylinderGeometry(0.06, 0.06, 8.0, 12);
  railGeo.rotateZ(Math.PI / 2);
  const railMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.2 });
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.position.set(0, 0.8, -4.5);
  rail.castShadow = true;
  skateGroup.add(rail);

  return {
    worldGroup,
    octagonGroup,
    trampolineGroup,
    skateGroup,
    trampolinePos: trampolineGroup.position,
    trampolineRadius: 2.4
  };
}
