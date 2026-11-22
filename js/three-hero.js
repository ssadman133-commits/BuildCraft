/**
 * BUILDCRAFT - 3D Architectural Visualization Hero Engine
 * Built with Three.js
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Falling back to CSS atmosphere.');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c10, 0.018);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(22, 14, 26);
  camera.lookAt(0, 4, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Group for the entire architectural complex
  const architectureGroup = new THREE.Group();
  scene.add(architectureGroup);

  // Materials Palette
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x181d26,
    roughness: 0.85,
    metalness: 0.1
  });

  const bronzeSteelMat = new THREE.MeshStandardMaterial({
    color: 0x8c5e43,
    roughness: 0.35,
    metalness: 0.8
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xc59b74,
    roughness: 0.3,
    metalness: 0.9,
    emissive: 0x4a321d,
    emissiveIntensity: 0.3
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x223548,
    transparent: true,
    opacity: 0.65,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.6,
    ior: 1.5
  });

  const glowingInteriorMat = new THREE.MeshBasicMaterial({
    color: 0xffdfb8,
    transparent: true,
    opacity: 0.85
  });

  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0xc59b74,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });

  let isWireframeMode = false;
  const meshCatalog = [];

  function registerMesh(mesh) {
    meshCatalog.push({
      mesh,
      originalMaterial: mesh.material
    });
    return mesh;
  }

  // --- BUILD THE ARCHITECTURAL PAVILION / TOWER ---

  // 1. Foundation Podium
  const podiumGeo = new THREE.BoxGeometry(22, 0.8, 22);
  const podium = new THREE.Mesh(podiumGeo, concreteMat);
  podium.position.y = -0.4;
  architectureGroup.add(registerMesh(podium));

  // Secondary offset terrace
  const stepGeo = new THREE.BoxGeometry(16, 0.4, 16);
  const step = new THREE.Mesh(stepGeo, concreteMat);
  step.position.set(1.5, 0.2, 1.5);
  architectureGroup.add(registerMesh(step));

  // Pool / Water reflection feature
  const poolGeo = new THREE.PlaneGeometry(7, 12);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0f2a3f,
    roughness: 0.05,
    metalness: 0.95
  });
  const pool = new THREE.Mesh(poolGeo, waterMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(-6, 0.42, 1);
  architectureGroup.add(registerMesh(pool));

  // 2. Multi-tiered Modernist Slabs (Cantilevered Floors)
  const floorLevels = [
    { y: 0.5, w: 10, h: 0.4, d: 11, x: 0, z: 0 },
    { y: 3.5, w: 12, h: 0.4, d: 10, x: -0.5, z: 0.5 },
    { y: 6.5, w: 11, h: 0.4, d: 9, x: 0.8, z: -0.5 },
    { y: 9.5, w: 9, h: 0.4, d: 8, x: -0.4, z: 0.2 },
    { y: 12.5, w: 8, h: 0.35, d: 7, x: 0.2, z: -0.2 },
    { y: 15.0, w: 6, h: 0.3, d: 5, x: 0.5, z: 0 }
  ];

  floorLevels.forEach((fl, idx) => {
    // Concrete floor slab
    const slabGeo = new THREE.BoxGeometry(fl.w, fl.h, fl.d);
    const slab = new THREE.Mesh(slabGeo, concreteMat);
    slab.position.set(fl.x, fl.y, fl.z);
    architectureGroup.add(registerMesh(slab));

    // Under-slab gold trim edge
    const trimGeo = new THREE.BoxGeometry(fl.w + 0.1, 0.06, fl.d + 0.1);
    const trim = new THREE.Mesh(trimGeo, goldAccentMat);
    trim.position.set(fl.x, fl.y - (fl.h / 2), fl.z);
    architectureGroup.add(registerMesh(trim));

    // Glass Curtain Wall Enclosures between floors
    if (idx < floorLevels.length - 1) {
      const nextFl = floorLevels[idx + 1];
      const storyHeight = nextFl.y - fl.y - fl.h;
      const glassW = Math.min(fl.w, nextFl.w) * 0.85;
      const glassD = Math.min(fl.d, nextFl.d) * 0.85;

      const glassGeo = new THREE.BoxGeometry(glassW, storyHeight, glassD);
      const glassVolume = new THREE.Mesh(glassGeo, glassMat);
      glassVolume.position.set(
        (fl.x + nextFl.x) / 2,
        fl.y + fl.h / 2 + storyHeight / 2,
        (fl.z + nextFl.z) / 2
      );
      architectureGroup.add(registerMesh(glassVolume));

      // Interior Warm Light Core
      const coreGeo = new THREE.BoxGeometry(glassW * 0.45, storyHeight * 0.75, glassD * 0.45);
      const coreMesh = new THREE.Mesh(coreGeo, glowingInteriorMat);
      coreMesh.position.copy(glassVolume.position);
      architectureGroup.add(registerMesh(coreMesh));

      // Vertical Bronze Mullions / Architectural Slats
      for (let m = -glassW / 2 + 0.5; m <= glassW / 2 - 0.5; m += 1.8) {
        const mullionGeo = new THREE.BoxGeometry(0.08, storyHeight, 0.12);
        const mullion = new THREE.Mesh(mullionGeo, bronzeSteelMat);
        mullion.position.set(glassVolume.position.x + m, glassVolume.position.y, glassVolume.position.z + glassD / 2);
        architectureGroup.add(registerMesh(mullion));
      }
    }
  });

  // 3. Iconic Cantilevered Feature Frame & Vertical Tower Spine
  const spineGeo = new THREE.BoxGeometry(2.5, 18, 3.5);
  const spine = new THREE.Mesh(spineGeo, bronzeSteelMat);
  spine.position.set(4.5, 8.5, 2.5);
  architectureGroup.add(registerMesh(spine));

  // Rooftop Minimalist Pergola
  const pergolaGroup = new THREE.Group();
  for (let b = 0; b < 6; b++) {
    const beamGeo = new THREE.BoxGeometry(6.5, 0.12, 0.2);
    const beam = new THREE.Mesh(beamGeo, goldAccentMat);
    beam.position.set(0.5, 15.5, -2 + b * 0.8);
    pergolaGroup.add(registerMesh(beam));
  }
  architectureGroup.add(pergolaGroup);

  // 4. Architectural Grid Floor
  const gridHelper = new THREE.GridHelper(60, 40, 0xc59b74, 0x1e2430);
  gridHelper.position.y = -0.8;
  scene.add(gridHelper);

  // 5. Floating Ambient Atmosphere Particles
  const particleCount = 220;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 45;
    particlePositions[i + 1] = Math.random() * 22;
    particlePositions[i + 2] = (Math.random() - 0.5) * 45;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xc59b74,
    size: 0.18,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // --- LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Main directional light (Sun / Exterior Studio Key)
  const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.8);
  sunLight.position.set(30, 40, 20);
  scene.add(sunLight);

  // Warm architectural spot (underneath uplight)
  const warmUpLight = new THREE.PointLight(0xffaa55, 3.5, 30);
  warmUpLight.position.set(0, 1, 0);
  scene.add(warmUpLight);

  // Cool rim backlight (gives edge definition to dark materials)
  const rimLight = new THREE.DirectionalLight(0x5c88b0, 1.2);
  rimLight.position.set(-25, 20, -25);
  scene.add(rimLight);

  // --- INTERACTION & ANIMATION CONTROLS ---
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationY = 0;
  let targetRotationX = 0;
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;

  // Window resize handler
  function onWindowResize() {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onWindowResize, false);

  // Mouse move parallax
  function onMouseMove(e) {
    if (isDragging) {
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      architectureGroup.rotation.y += deltaX * 0.006;
      targetRotationX += deltaY * 0.002;
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX));
      architectureGroup.rotation.x = targetRotationX;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    } else {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.3;
      mouseY = y * 0.2;
    }
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', onMouseMove);

  // Touch Support
  let touchStartX = 0;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const diff = touchX - touchStartX;
      architectureGroup.rotation.y += diff * 0.005;
      touchStartX = touchX;
    }
  }, { passive: true });

  // Mode Toggles & Buttons
  const wireframeToggleBtn = document.getElementById('btn-toggle-wireframe');
  if (wireframeToggleBtn) {
    wireframeToggleBtn.addEventListener('click', () => {
      isWireframeMode = !isWireframeMode;
      meshCatalog.forEach(({ mesh, originalMaterial }) => {
        mesh.material = isWireframeMode ? wireframeMat : originalMaterial;
      });
      wireframeToggleBtn.textContent = isWireframeMode ? 'Render Mode' : 'Wireframe';
    });
  }

  const resetViewBtn = document.getElementById('btn-reset-3d');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      targetRotationX = 0;
      architectureGroup.rotation.x = 0;
      architectureGroup.rotation.y = 0;
    });
  }

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Idle slow architectural rotation when user is not actively dragging
    if (!isDragging) {
      architectureGroup.rotation.y += 0.0018;
      
      // Smooth camera subtle drift based on mouse
      camera.position.x += (22 + mouseX * 8 - camera.position.x) * 0.04;
      camera.position.y += (14 + mouseY * 5 - camera.position.y) * 0.04;
      camera.lookAt(0, 4.5, 0);
    }

    // Particles slow ambient rise & swirl
    particleSystem.rotation.y = elapsedTime * 0.03;
    const positions = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      positions[i] += 0.012;
      if (positions[i] > 22) {
        positions[i] = 0;
      }
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Subtle pulsing warmth of the interior light
    warmUpLight.intensity = 3.2 + Math.sin(elapsedTime * 2.0) * 0.5;

    renderer.render(scene, camera);
  }

  animate();
})();
