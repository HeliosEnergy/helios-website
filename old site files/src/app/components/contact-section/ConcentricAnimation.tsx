'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ConcentricAnimationProps {
  className?: string;
}

const ConcentricAnimation: React.FC<ConcentricAnimationProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const mount = mountRef.current;

    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfbbf24); // Orange background

      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 6;

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      // Create 24 vertical dashes for outer ring (faded)
      const dashCount = 24;
      const outerRadius = 2.8;
      const dashHeight = 0.12;

      for (let i = 0; i < dashCount; i++) {
        const angle = (i / dashCount) * Math.PI * 2;
        const geometry = new THREE.PlaneGeometry(0.015, dashHeight);
        const material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.2 // More faded outer ring
        });

        const dash = new THREE.Mesh(geometry, material);
        dash.position.x = Math.cos(angle) * outerRadius;
        dash.position.y = Math.sin(angle) * outerRadius;
        dash.rotation.z = angle;
        scene.add(dash);
      }

      // Create 24 vertical dashes for inner ring
      const innerOuterRadius = 1.8;

      for (let i = 0; i < dashCount; i++) {
        const angle = (i / dashCount) * Math.PI * 2;
        const geometry = new THREE.PlaneGeometry(0.015, dashHeight);
        const material = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });

        const dash = new THREE.Mesh(geometry, material);
        dash.position.x = Math.cos(angle) * innerOuterRadius;
        dash.position.y = Math.sin(angle) * innerOuterRadius;
        dash.rotation.z = angle;
        scene.add(dash);
      }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Animate all dashes
        scene.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
            // Outer ring dashes (first 24) rotate clockwise slower
            if (index < 24) {
              child.rotation.z += 0.001;
            }
            // Inner ring dashes (next 24) rotate counter-clockwise
            else {
              child.rotation.z -= 0.0015;
            }
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        scene.clear();
      };
    } catch (error) {
      console.error('Error initializing ConcentricAnimation:', error);
      // Fallback: simple orange background
      if (mount) {
        mount.style.backgroundColor = '#fbbf24';
      }
    }
  }, []);

  return (
    <div ref={mountRef} className={`absolute inset-0 ${className}`} />
  );
};

export default ConcentricAnimation;