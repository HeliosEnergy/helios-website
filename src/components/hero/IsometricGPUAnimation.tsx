import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const IsometricGPUAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Isometric camera
    const aspect = width / height;
    const d = 8;
    const camera = new THREE.OrthographicCamera(
      -d * aspect, d * aspect, d, -d, 1, 1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // GPU Container creation - WHITE theme
    const containers: THREE.Group[] = [];
    const containerPositions = [
      { x: -2, z: -2 },
      { x: 2, z: -2 },
      { x: -2, z: 2 },
      { x: 2, z: 2 },
    ];

    const createGPUContainer = () => {
      const group = new THREE.Group();

      // Main body - white/light gray
      const bodyGeometry = new THREE.BoxGeometry(3, 2, 3);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5f5f5,
        shininess: 60,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);

      // Edge lines for definition
      const edges = new THREE.EdgesGeometry(bodyGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframe);

      // Top accent stripe - primary color
      const stripeGeometry = new THREE.BoxGeometry(3.02, 0.08, 3.02);
      const stripeMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5b800,
        emissive: 0xf5b800,
        emissiveIntensity: 0.2,
      });
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.y = 0.96;
      group.add(stripe);

      // Status LED
      const ledGeometry = new THREE.SphereGeometry(0.06, 16, 16);
      const ledMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.6,
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(1.2, 0.5, 1.51);
      group.add(led);

      return group;
    };

    // Text sprite creation
    const createTextSprite = (text: string, size: number = 1) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 512;
      canvas.height = 128;
      
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = 'bold 48px system-ui, -apple-system, sans-serif';
      context.fillStyle = '#1a1a1a';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        opacity: 0,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(size * 6, size * 1.5, 1);
      
      return sprite;
    };

    // Smoke particle system for text dissolution
    const createSmokeParticles = (position: THREE.Vector3) => {
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      const velocities: THREE.Vector3[] = [];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x + (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 0.5;
        positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 2;
        
        velocities.push(new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.03 + 0.01,
          (Math.random() - 0.5) * 0.02
        ));
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x888888,
        transparent: true,
        opacity: 0,
      });

      const particles = new THREE.Points(geometry, material);
      (particles as any).velocities = velocities;
      
      return particles;
    };

    // 3D Maxima surface
    const createMaximaSurface = () => {
      const size = 40;
      const geometry = new THREE.PlaneGeometry(8, 8, size, size);
      const positions = geometry.attributes.position.array as Float32Array;
      
      const material = new THREE.MeshPhongMaterial({
        color: 0xf5b800,
        wireframe: true,
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0;
      
      return { mesh, geometry, positions, size };
    };

    // Inference dots grid
    const createInferenceGrid = () => {
      const gridSize = 8;
      const spacing = 0.8;
      const group = new THREE.Group();
      const dots: THREE.Mesh[] = [];

      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          const geometry = new THREE.SphereGeometry(0.1, 8, 8);
          const material = new THREE.MeshPhongMaterial({
            color: 0xf5b800,
            emissive: 0xf5b800,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0,
          });
          const dot = new THREE.Mesh(geometry, material);
          dot.position.set(
            (x - gridSize / 2 + 0.5) * spacing,
            0,
            (z - gridSize / 2 + 0.5) * spacing
          );
          dots.push(dot);
          group.add(dot);
        }
      }

      return { group, dots };
    };

    // Create all elements
    const textScale = createTextSprite('Scale as you need', 1);
    textScale.position.set(0, 4, 0);
    scene.add(textScale);

    const smokeParticles = createSmokeParticles(new THREE.Vector3(0, 4, 0));
    scene.add(smokeParticles);

    const textFinetune = createTextSprite('Fine-tune at scale', 1);
    textFinetune.position.set(0, 5, 0);
    scene.add(textFinetune);

    const { mesh: maximaSurface, geometry: maximaGeometry, positions: maximaPositions, size: maximaSize } = createMaximaSurface();
    scene.add(maximaSurface);

    const textInference = createTextSprite('Inference at scale', 1);
    textInference.position.set(0, 5, 0);
    scene.add(textInference);

    const { group: inferenceGrid, dots: inferenceDots } = createInferenceGrid();
    scene.add(inferenceGrid);

    // Animation phases and timing
    type Phase = 'containers-drop' | 'containers-hold' | 'containers-fall' | 'scale-text' | 'maxima' | 'inference';
    let phase: Phase = 'containers-drop';
    let phaseStartTime = Date.now();

    const TIMINGS = {
      'containers-drop': 2000,
      'containers-hold': 8000,
      'containers-fall': 2000,
      'scale-text': 2500,
      'maxima': 5000,
      'inference': 6000,
    };

    const easeOutBounce = (x: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (x < 1 / d1) return n1 * x * x;
      else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
      else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
      else return n1 * (x -= 2.625 / d1) * x + 0.984375;
    };

    const easeInCubic = (x: number): number => x * x * x;
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    let maximaTime = 0;
    let initialCameraD = d;

    const animate = () => {
      const now = Date.now();
      const phaseElapsed = now - phaseStartTime;
      const phaseDuration = TIMINGS[phase];
      const phaseProgress = Math.min(1, phaseElapsed / phaseDuration);

      // Phase: Drop containers
      if (phase === 'containers-drop') {
        for (let i = 0; i < 4; i++) {
          const containerStartTime = i * 400;
          const containerElapsed = phaseElapsed - containerStartTime;

          if (containerElapsed > 0 && !containers[i]) {
            const container = createGPUContainer();
            container.position.set(containerPositions[i].x, 15, containerPositions[i].z);
            containers[i] = container;
            scene.add(container);
          }

          if (containers[i]) {
            const progress = Math.min(1, containerElapsed / 800);
            containers[i].position.y = 15 - 15 * easeOutBounce(progress);
          }
        }

        if (phaseProgress >= 1) {
          phase = 'containers-hold';
          phaseStartTime = now;
        }
      }

      // Phase: Hold containers
      else if (phase === 'containers-hold') {
        // Subtle pulse on containers
        containers.forEach((container, i) => {
          const pulse = Math.sin(phaseElapsed * 0.002 + i * 0.5) * 0.02;
          container.position.y = pulse;
        });

        if (phaseProgress >= 1) {
          phase = 'containers-fall';
          phaseStartTime = now;
        }
      }

      // Phase: Containers fall off
      else if (phase === 'containers-fall') {
        containers.forEach((container, i) => {
          const delay = i * 100;
          const fallProgress = Math.max(0, (phaseElapsed - delay) / 1500);
          const easedFall = easeInCubic(Math.min(1, fallProgress));
          
          container.position.y = -easedFall * 20;
          container.rotation.x = easedFall * (Math.random() - 0.5) * 2;
          container.rotation.z = easedFall * (Math.random() - 0.5) * 2;
        });

        if (phaseProgress >= 1) {
          containers.forEach(c => scene.remove(c));
          containers.length = 0;
          phase = 'scale-text';
          phaseStartTime = now;
        }
      }

      // Phase: Scale text with smoke dissolution
      else if (phase === 'scale-text') {
        const textMaterial = textScale.material as THREE.SpriteMaterial;
        const smokeMaterial = smokeParticles.material as THREE.PointsMaterial;
        const smokePositions = smokeParticles.geometry.attributes.position.array as Float32Array;
        const velocities = (smokeParticles as any).velocities as THREE.Vector3[];

        if (phaseProgress < 0.4) {
          // Fade in text
          textMaterial.opacity = easeOutCubic(phaseProgress / 0.4);
        } else if (phaseProgress < 0.7) {
          // Hold
          textMaterial.opacity = 1;
        } else {
          // Dissolve into smoke
          const dissolveProgress = (phaseProgress - 0.7) / 0.3;
          textMaterial.opacity = 1 - dissolveProgress;
          smokeMaterial.opacity = Math.sin(dissolveProgress * Math.PI) * 0.6;

          // Animate smoke particles upward
          for (let i = 0; i < smokePositions.length / 3; i++) {
            smokePositions[i * 3] += velocities[i].x;
            smokePositions[i * 3 + 1] += velocities[i].y;
            smokePositions[i * 3 + 2] += velocities[i].z;
          }
          smokeParticles.geometry.attributes.position.needsUpdate = true;
        }

        if (phaseProgress >= 1) {
          textMaterial.opacity = 0;
          smokeMaterial.opacity = 0;
          phase = 'maxima';
          phaseStartTime = now;
        }
      }

      // Phase: 3D Maxima surface
      else if (phase === 'maxima') {
        const surfaceMaterial = maximaSurface.material as THREE.MeshPhongMaterial;
        const textMaterial = textFinetune.material as THREE.SpriteMaterial;

        // Fade in surface and text
        if (phaseProgress < 0.2) {
          surfaceMaterial.opacity = easeOutCubic(phaseProgress / 0.2) * 0.8;
          textMaterial.opacity = easeOutCubic(phaseProgress / 0.2);
        } else if (phaseProgress > 0.8) {
          const fadeOut = (phaseProgress - 0.8) / 0.2;
          surfaceMaterial.opacity = (1 - fadeOut) * 0.8;
          textMaterial.opacity = 1 - fadeOut;
        }

        // Animate the maxima surface
        maximaTime += 0.03;
        const posAttr = maximaGeometry.attributes.position;
        for (let i = 0; i <= maximaSize; i++) {
          for (let j = 0; j <= maximaSize; j++) {
            const idx = i * (maximaSize + 1) + j;
            const x = (i / maximaSize - 0.5) * 4;
            const z = (j / maximaSize - 0.5) * 4;
            
            // Dynamic maxima function
            const y = Math.sin(x * 1.5 + maximaTime) * Math.cos(z * 1.5 + maximaTime * 0.7) * 1.5
                    + Math.sin(x * 2 - maximaTime * 0.5) * 0.5
                    + Math.cos(z * 2.5 + maximaTime * 0.8) * 0.5;
            
            posAttr.setZ(idx, y);
          }
        }
        posAttr.needsUpdate = true;

        if (phaseProgress >= 1) {
          surfaceMaterial.opacity = 0;
          textMaterial.opacity = 0;
          phase = 'inference';
          phaseStartTime = now;
        }
      }

      // Phase: Inference grid with zoom out
      else if (phase === 'inference') {
        const textMaterial = textInference.material as THREE.SpriteMaterial;

        // Fade in dots progressively
        inferenceDots.forEach((dot, i) => {
          const dotDelay = (i / inferenceDots.length) * 0.3;
          const dotProgress = Math.max(0, (phaseProgress - dotDelay) / 0.2);
          (dot.material as THREE.MeshPhongMaterial).opacity = Math.min(1, dotProgress);
        });

        // Fade in text
        if (phaseProgress < 0.3) {
          textMaterial.opacity = easeOutCubic(phaseProgress / 0.3);
        } else {
          textMaterial.opacity = 1;
        }

        // Zoom out camera
        if (phaseProgress > 0.3) {
          const zoomProgress = (phaseProgress - 0.3) / 0.7;
          const newD = initialCameraD + zoomProgress * 4;
          camera.left = -newD * aspect;
          camera.right = newD * aspect;
          camera.top = newD;
          camera.bottom = -newD;
          camera.updateProjectionMatrix();

          // Expand the grid
          const expandFactor = 1 + zoomProgress * 0.5;
          inferenceGrid.scale.set(expandFactor, 1, expandFactor);
        }

        // Pulse dots
        inferenceDots.forEach((dot, i) => {
          const pulse = Math.sin(phaseElapsed * 0.005 + i * 0.1) * 0.02 + 0.1;
          dot.scale.setScalar(1 + pulse);
        });
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const newAspect = w / h;
      
      camera.left = -d * newAspect;
      camera.right = d * newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] lg:min-h-[500px]"
      style={{ background: 'transparent' }}
    />
  );
};
