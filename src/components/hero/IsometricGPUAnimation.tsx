import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export type AnimationPhase = 'containers-drop' | 'containers-hold' | 'containers-fall' | 'maxima' | 'inference';

interface IsometricGPUAnimationProps {
  onPhaseChange?: (phase: AnimationPhase) => void;
}

export const IsometricGPUAnimation = ({ onPhaseChange }: IsometricGPUAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const currentPhaseRef = useRef<AnimationPhase>('containers-drop');

  const notifyPhaseChange = useCallback((newPhase: AnimationPhase) => {
    if (currentPhaseRef.current !== newPhase) {
      currentPhaseRef.current = newPhase;
      onPhaseChange?.(newPhase);
    }
  }, [onPhaseChange]);

  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const scene = new THREE.Scene();
    scene.background = null;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const aspect = width / height;
    const d = 8;

    // Isometric camera (will switch for inference phase)
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Shipping container outline with corrugated sides
    const createShippingContainer = () => {
      const group = new THREE.Group();
      const w = 3, h = 2.2, depth = 3;
      const lineColor = 0x1a1a1a;
      const accentColor = 0xf5b800;

      // Main box edges
      const boxGeometry = new THREE.BoxGeometry(w, h, depth);
      const edges = new THREE.EdgesGeometry(boxGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframe);

      // Corrugated lines on sides (vertical ridges)
      const ridgeCount = 8;
      const ridgeMaterial = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.5 });
      
      // Front and back corrugation
      for (let i = 1; i < ridgeCount; i++) {
        const x = -w/2 + (w / ridgeCount) * i;
        const frontPoints = [new THREE.Vector3(x, -h/2, depth/2), new THREE.Vector3(x, h/2, depth/2)];
        const backPoints = [new THREE.Vector3(x, -h/2, -depth/2), new THREE.Vector3(x, h/2, -depth/2)];
        
        const frontGeom = new THREE.BufferGeometry().setFromPoints(frontPoints);
        const backGeom = new THREE.BufferGeometry().setFromPoints(backPoints);
        group.add(new THREE.Line(frontGeom, ridgeMaterial));
        group.add(new THREE.Line(backGeom, ridgeMaterial));
      }

      // Left and right corrugation
      for (let i = 1; i < ridgeCount; i++) {
        const z = -depth/2 + (depth / ridgeCount) * i;
        const leftPoints = [new THREE.Vector3(-w/2, -h/2, z), new THREE.Vector3(-w/2, h/2, z)];
        const rightPoints = [new THREE.Vector3(w/2, -h/2, z), new THREE.Vector3(w/2, h/2, z)];
        
        const leftGeom = new THREE.BufferGeometry().setFromPoints(leftPoints);
        const rightGeom = new THREE.BufferGeometry().setFromPoints(rightPoints);
        group.add(new THREE.Line(leftGeom, ridgeMaterial));
        group.add(new THREE.Line(rightGeom, ridgeMaterial));
      }

      // Top accent stripe
      const stripePoints = [
        new THREE.Vector3(-w/2, h/2 + 0.05, -depth/2),
        new THREE.Vector3(w/2, h/2 + 0.05, -depth/2),
        new THREE.Vector3(w/2, h/2 + 0.05, depth/2),
        new THREE.Vector3(-w/2, h/2 + 0.05, depth/2),
        new THREE.Vector3(-w/2, h/2 + 0.05, -depth/2),
      ];
      const stripeGeom = new THREE.BufferGeometry().setFromPoints(stripePoints);
      const stripeMaterial = new THREE.LineBasicMaterial({ color: accentColor, linewidth: 2 });
      group.add(new THREE.Line(stripeGeom, stripeMaterial));

      return group;
    };

    // Container setup
    const containers: THREE.Group[] = [];
    const containerPositions = [
      { x: -2, z: -2 }, { x: 2, z: -2 },
      { x: -2, z: 2 }, { x: 2, z: 2 },
    ];

    // 3D Maxima surface
    const createMaximaSurface = () => {
      const size = 40;
      const geometry = new THREE.PlaneGeometry(8, 8, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: 0xf5b800,
        wireframe: true,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      return { mesh, geometry, size };
    };

    const { mesh: maximaSurface, geometry: maximaGeometry, size: maximaSize } = createMaximaSurface();
    scene.add(maximaSurface);

    // Inference grid (non-isometric, top-down)
    const inferenceGroup = new THREE.Group();
    const inferenceDots: THREE.Mesh[] = [];
    const traces: THREE.Line[] = [];
    
    const createInferenceGrid = () => {
      const gridSize = 12;
      const spacing = 0.6;
      
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          const geometry = new THREE.CircleGeometry(0.08, 16);
          const material = new THREE.MeshBasicMaterial({
            color: 0xf5b800,
            transparent: true,
            opacity: 0,
          });
          const dot = new THREE.Mesh(geometry, material);
          dot.rotation.x = -Math.PI / 2;
          dot.position.set(
            (x - gridSize / 2 + 0.5) * spacing,
            0,
            (z - gridSize / 2 + 0.5) * spacing
          );
          inferenceDots.push(dot);
          inferenceGroup.add(dot);
        }
      }

      // Create sparse random traces between dots
      const traceCount = 20;
      const traceMaterial = new THREE.LineBasicMaterial({ 
        color: 0xf5b800, 
        transparent: true, 
        opacity: 0 
      });

      for (let i = 0; i < traceCount; i++) {
        const startIdx = Math.floor(Math.random() * inferenceDots.length);
        const endIdx = Math.floor(Math.random() * inferenceDots.length);
        if (startIdx === endIdx) continue;

        const start = inferenceDots[startIdx].position;
        const end = inferenceDots[endIdx].position;
        
        const points = [start.clone(), end.clone()];
        points[0].y = 0.01;
        points[1].y = 0.01;
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const trace = new THREE.Line(geometry, traceMaterial.clone());
        traces.push(trace);
        inferenceGroup.add(trace);
      }

      inferenceGroup.visible = false;
      return inferenceGroup;
    };

    createInferenceGrid();
    scene.add(inferenceGroup);

    // Animation state
    type Phase = 'containers-drop' | 'containers-hold' | 'containers-fall' | 'maxima' | 'inference';
    let phase: Phase = 'containers-drop';
    let phaseStartTime = Date.now();
    notifyPhaseChange(phase);

    const TIMINGS = {
      'containers-drop': 2000,
      'containers-hold': 8000,
      'containers-fall': 2000,
      'maxima': 5000,
      'inference': 8000,
    };

    const easeOutBounce = (x: number): number => {
      const n1 = 7.5625, d1 = 2.75;
      if (x < 1 / d1) return n1 * x * x;
      else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
      else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
      else return n1 * (x -= 2.625 / d1) * x + 0.984375;
    };

    const easeInCubic = (x: number): number => x * x * x;
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    let maximaTime = 0;
    let traceAnimProgress: number[] = traces.map(() => Math.random() * 2); // staggered start

    const animate = () => {
      const now = Date.now();
      const phaseElapsed = now - phaseStartTime;
      const phaseDuration = TIMINGS[phase];
      const phaseProgress = Math.min(1, phaseElapsed / phaseDuration);

      if (phase === 'containers-drop') {
        for (let i = 0; i < 4; i++) {
          const containerStartTime = i * 400;
          const containerElapsed = phaseElapsed - containerStartTime;

          if (containerElapsed > 0 && !containers[i]) {
            const container = createShippingContainer();
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
          notifyPhaseChange(phase);
        }
      }

      else if (phase === 'containers-hold') {
        containers.forEach((container, i) => {
          const pulse = Math.sin(phaseElapsed * 0.002 + i * 0.5) * 0.02;
          container.position.y = pulse;
        });

        if (phaseProgress >= 1) {
          phase = 'containers-fall';
          phaseStartTime = now;
          notifyPhaseChange(phase);
        }
      }

      else if (phase === 'containers-fall') {
        containers.forEach((container, i) => {
          const delay = i * 100;
          const fallProgress = Math.max(0, (phaseElapsed - delay) / 1500);
          const easedFall = easeInCubic(Math.min(1, fallProgress));
          
          container.position.y = -easedFall * 20;
          container.rotation.x = easedFall * (Math.random() - 0.5) * 0.5;
          container.rotation.z = easedFall * (Math.random() - 0.5) * 0.5;
        });

        if (phaseProgress >= 1) {
          containers.forEach(c => scene.remove(c));
          containers.length = 0;
          phase = 'maxima';
          phaseStartTime = now;
          notifyPhaseChange(phase);
        }
      }

      else if (phase === 'maxima') {
        const surfaceMaterial = maximaSurface.material as THREE.MeshBasicMaterial;

        if (phaseProgress < 0.15) {
          surfaceMaterial.opacity = easeOutCubic(phaseProgress / 0.15) * 0.8;
        } else if (phaseProgress > 0.85) {
          const fadeOut = (phaseProgress - 0.85) / 0.15;
          surfaceMaterial.opacity = (1 - fadeOut) * 0.8;
        }

        maximaTime += 0.03;
        const posAttr = maximaGeometry.attributes.position;
        for (let i = 0; i <= maximaSize; i++) {
          for (let j = 0; j <= maximaSize; j++) {
            const idx = i * (maximaSize + 1) + j;
            const x = (i / maximaSize - 0.5) * 4;
            const z = (j / maximaSize - 0.5) * 4;
            const y = Math.sin(x * 1.5 + maximaTime) * Math.cos(z * 1.5 + maximaTime * 0.7) * 1.5
                    + Math.sin(x * 2 - maximaTime * 0.5) * 0.5;
            posAttr.setZ(idx, y);
          }
        }
        posAttr.needsUpdate = true;

        if (phaseProgress >= 1) {
          surfaceMaterial.opacity = 0;
          phase = 'inference';
          phaseStartTime = now;
          notifyPhaseChange(phase);
          
          // Switch to top-down view
          inferenceGroup.visible = true;
          camera.position.set(0, 15, 0);
          camera.lookAt(0, 0, 0);
        }
      }

      else if (phase === 'inference') {
        // Zoom from close to far (zoom in to zoom out)
        const zoomStart = 3;
        const zoomEnd = 12;
        const currentZoom = zoomStart + (zoomEnd - zoomStart) * easeOutCubic(phaseProgress);
        
        camera.left = -currentZoom * aspect;
        camera.right = currentZoom * aspect;
        camera.top = currentZoom;
        camera.bottom = -currentZoom;
        camera.updateProjectionMatrix();

        // Fade in dots progressively
        inferenceDots.forEach((dot, i) => {
          const dotDelay = (i / inferenceDots.length) * 0.4;
          const dotProgress = Math.max(0, (phaseProgress - dotDelay) / 0.3);
          (dot.material as THREE.MeshBasicMaterial).opacity = Math.min(0.9, dotProgress);
          
          // Subtle pulse
          const pulse = Math.sin(phaseElapsed * 0.004 + i * 0.2) * 0.02;
          dot.scale.setScalar(1 + pulse);
        });

        // Animate traces with random timing
        traces.forEach((trace, i) => {
          traceAnimProgress[i] += 0.015;
          const traceMat = trace.material as THREE.LineBasicMaterial;
          
          // Fade in and out in waves
          const cyclePos = (traceAnimProgress[i] % 3);
          if (cyclePos < 1) {
            traceMat.opacity = easeOutCubic(cyclePos) * 0.6;
          } else if (cyclePos < 2) {
            traceMat.opacity = 0.6;
          } else {
            traceMat.opacity = (1 - (cyclePos - 2)) * 0.6;
          }
        });
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

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
  }, [notifyPhaseChange]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[400px] lg:min-h-[500px]"
      style={{ background: 'transparent' }}
    />
  );
};
