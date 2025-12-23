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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // GPU Container creation
    const containers: THREE.Group[] = [];
    const containerPositions = [
      { x: -2, z: -2 },
      { x: 2, z: -2 },
      { x: -2, z: 2 },
      { x: 2, z: 2 },
    ];

    const createGPUContainer = () => {
      const group = new THREE.Group();

      // Main body - dark metallic
      const bodyGeometry = new THREE.BoxGeometry(3, 2, 3);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        shininess: 80,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      group.add(body);

      // Top accent stripe - primary color
      const stripeGeometry = new THREE.BoxGeometry(3.02, 0.1, 3.02);
      const stripeMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5b800,
        emissive: 0xf5b800,
        emissiveIntensity: 0.3,
      });
      const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripe.position.y = 0.9;
      group.add(stripe);

      // Front vents
      for (let i = 0; i < 3; i++) {
        const ventGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.05);
        const ventMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const vent = new THREE.Mesh(ventGeometry, ventMaterial);
        vent.position.set(-0.8 + i * 0.8, 0, 1.51);
        group.add(vent);
      }

      // Status LED
      const ledGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const ledMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.8,
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(1.2, 0.5, 1.51);
      group.add(led);

      return group;
    };

    // Animation state
    let phase = 'containers'; // 'containers' | 'finetuning'
    let containerIndex = 0;
    let animationProgress = 0;
    const particles: THREE.Points[] = [];

    // Create particle system for fine-tuning visualization
    const createParticleFlow = () => {
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = Math.random() * 6 + 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        // Gold/primary color particles
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0,
      });

      return new THREE.Points(geometry, material);
    };

    const particleSystem = createParticleFlow();
    scene.add(particleSystem);

    // Connection lines between containers
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf5b800,
      transparent: true,
      opacity: 0,
    });
    const connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionLines);

    // Animation timing
    const containerDropDuration = 800;
    const containerDelay = 400;
    const finetuningDuration = 4000;
    let startTime = Date.now();

    const easeOutBounce = (x: number): number => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (x < 1 / d1) return n1 * x * x;
      else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
      else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
      else return n1 * (x -= 2.625 / d1) * x + 0.984375;
    };

    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (phase === 'containers') {
        // Add containers one by one
        const totalContainerTime = containerDropDuration + containerDelay * 3;
        
        for (let i = 0; i < 4; i++) {
          const containerStartTime = i * containerDelay;
          const containerElapsed = elapsed - containerStartTime;

          if (containerElapsed > 0 && !containers[i]) {
            const container = createGPUContainer();
            container.position.set(containerPositions[i].x, 15, containerPositions[i].z);
            containers[i] = container;
            scene.add(container);
          }

          if (containers[i]) {
            const progress = Math.min(1, containerElapsed / containerDropDuration);
            const easedProgress = easeOutBounce(progress);
            const targetY = 0;
            containers[i].position.y = 15 - (15 - targetY) * easedProgress;
          }
        }

        // Transition to fine-tuning phase
        if (elapsed > totalContainerTime + 500) {
          phase = 'finetuning';
          startTime = Date.now();

          // Create connection lines
          const linePositions: number[] = [];
          containerPositions.forEach((pos1, i) => {
            containerPositions.forEach((pos2, j) => {
              if (i < j) {
                linePositions.push(pos1.x, 1.2, pos1.z);
                linePositions.push(pos2.x, 1.2, pos2.z);
              }
            });
          });
          lineGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
          );
        }
      } else if (phase === 'finetuning') {
        const progress = Math.min(1, elapsed / finetuningDuration);

        // Fade in connection lines
        lineMaterial.opacity = Math.min(0.6, progress * 2);

        // Animate particles
        const particleMaterial = particleSystem.material as THREE.PointsMaterial;
        particleMaterial.opacity = Math.min(0.8, progress * 2);

        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          // Particles flow downward toward containers
          positions[i * 3 + 1] -= 0.03;
          
          // Reset particles that go too low
          if (positions[i * 3 + 1] < 1.5) {
            positions[i * 3 + 1] = 8;
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
          }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Subtle container glow pulse
        containers.forEach((container, i) => {
          const pulse = Math.sin(elapsed * 0.003 + i * 0.5) * 0.1 + 0.3;
          const stripeMesh = container.children[1] as THREE.Mesh;
          const stripeMaterial = stripeMesh.material as THREE.MeshPhongMaterial;
          stripeMaterial.emissiveIntensity = pulse;
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
      const aspect = w / h;
      
      camera.left = -d * aspect;
      camera.right = d * aspect;
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
