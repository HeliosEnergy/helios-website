'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  galaxyParticleCount?: number;
  enableParallax?: boolean;
  parallaxIntensity?: number;
  brightnessReduction?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  className = '',
  particleCount = 25000, // Reduced default for better performance
  galaxyParticleCount = 50000, // Reduced default for better performance
  enableParallax = true,
  parallaxIntensity = 1.0,
  brightnessReduction = 0.7 // 0 = no reduction, 1 = complete fade
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    points?: THREE.Points;
    clock?: THREE.Clock;
    animationId?: number;
    gu?: { 
      time: { value: number };
      scrollProgress: { value: number };
      brightness: { value: number };
    };
    handleResize?: () => void;
    resizeTimeout?: NodeJS.Timeout;
    initialCameraZ?: number;
  }>({});

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // Performance check - reduce particles on mobile/low-end devices
    const isMobile = window.innerWidth < 768;
    const adjustedParticleCount = isMobile ? Math.floor(particleCount * 0.3) : particleCount;
    const adjustedGalaxyCount = isMobile ? Math.floor(galaxyParticleCount * 0.3) : galaxyParticleCount;
    
    const mount = mountRef.current;
    const { current: refs } = sceneRef;

    try {

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160016);
    refs.scene = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 4, 21);
    refs.camera = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    refs.renderer = renderer;

    // Setup global uniforms with scroll data
    const gu = { 
      time: { value: 0 },
      scrollProgress: { value: 0 },
      brightness: { value: 1.0 }
    };
    refs.gu = gu;
    refs.initialCameraZ = 21; // Store initial camera position

    // Create particle geometry
    const sizes: number[] = [];
    const shift: number[] = [];
    
    const pushShift = () => {
      shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    // Create initial particles
    const pts: THREE.Vector3[] = new Array(adjustedParticleCount).fill(null).map(() => {
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
      return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
    });

    // Add galaxy-like structure
    for (let i = 0; i < adjustedGalaxyCount; i++) {
      const r = 10;
      const R = 40;
      const rand = Math.pow(Math.random(), 1.5);
      const radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
      pts.push(
        new THREE.Vector3().setFromCylindricalCoords(
          radius,
          Math.random() * 2 * Math.PI,
          (Math.random() - 0.5) * 2
        )
      );
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    geometry.setAttribute('sizes', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('shift', new THREE.Float32BufferAttribute(shift, 4));

    // Create material with custom shaders
    const material = new THREE.PointsMaterial({
      size: 0.125,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // Custom shader modifications
    material.onBeforeCompile = (shader) => {
      shader.uniforms.time = gu.time;
      shader.uniforms.scrollProgress = gu.scrollProgress;
      shader.uniforms.brightness = gu.brightness;
      
      shader.vertexShader = `
        uniform float time;
        uniform float scrollProgress;
        attribute float sizes;
        attribute vec4 shift;
        varying vec3 vColor;
        varying float vBrightness;
        ${shader.vertexShader}
      `
        .replace('gl_PointSize = size;', 'gl_PointSize = size * sizes;')
        .replace(
          '#include <color_vertex>',
          `#include <color_vertex>
          float d = length(abs(position) / vec3(40., 10., 40));
          d = clamp(d, 0., 1.);
          
          // Reduce color intensity based on scroll
          float colorIntensity = 1.0 - (scrollProgress * ${brightnessReduction});
          vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.0 * colorIntensity;
          vBrightness = colorIntensity;`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float t = time * 0.15; // Increased from 0.05 to 0.15 for more visible movement
          float moveT = mod(shift.x + shift.z * t * 0.2, 6.28318530718); // Increased from 0.1 to 0.2
          float moveS = mod(shift.y + shift.z * t * 0.2, 6.28318530718); // Increased from 0.1 to 0.2
          transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w * 0.2;` // Increased from 0.1 to 0.2
        );

      shader.fragmentShader = `
        varying vec3 vColor;
        varying float vBrightness;
        uniform float brightness;
        ${shader.fragmentShader}
      `
        .replace(
          'vec4 diffuseColor = vec4( diffuse, opacity );',
          `float d = length(gl_PointCoord.xy - 0.5);
          float alpha = smoothstep(0.5, 0.1, d) * brightness * vBrightness;
          vec4 diffuseColor = vec4( vColor, alpha );`
        );
    };

    // Create points and add to scene
    const points = new THREE.Points(geometry, material);
    points.rotation.order = 'ZYX';
    points.rotation.z = 0.2;
    scene.add(points);
    refs.points = points;

    // Setup clock
    const clock = new THREE.Clock();
    refs.clock = clock;

    // Animation loop with performance monitoring and scroll updates
    let frameCount = 0;
    let lastFpsCheck = performance.now();
    let lastAnimationTime = 0;
    const targetFrameTime = 1000 / 35; // Increased to 35fps for smoother movement
    
    const animate = (currentTime: number) => {
      // Limit frame rate to 30fps
      if (currentTime - lastAnimationTime < targetFrameTime) {
        refs.animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastAnimationTime = currentTime;
      frameCount++;
      
      // Check FPS every second and adjust quality if needed
      if (currentTime - lastFpsCheck >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastFpsCheck = currentTime;
        
        // Adjust rendering quality based on performance
        if (fps < 20 && renderer) {
          renderer.setPixelRatio(Math.max(0.25, window.devicePixelRatio * 0.25));
        }
      }
      
      const t = clock.getElapsedTime() * 0.15; // Increased from 0.05 to 0.15 (3x faster but still controlled)
      gu.time.value = t; // Remove Math.PI multiplication
      
 
      points.rotation.y = t * 0.015; // Increased from 0.005 to 0.015
      renderer.render(scene, camera);
      refs.animationId = requestAnimationFrame(animate);
    };

    // Handle resize with debouncing
    const handleResize = () => {
      if (refs.resizeTimeout) {
        clearTimeout(refs.resizeTimeout);
      }
      refs.resizeTimeout = setTimeout(() => {
        if (!mount || !camera || !renderer) return;
        
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        
        // Adjust pixel ratio for mobile on resize
        const isMobileNow = width < 768;
        const pixelRatio = isMobileNow ? Math.min(1.5, window.devicePixelRatio) : Math.min(2, window.devicePixelRatio);
        renderer.setPixelRatio(pixelRatio);
      }, 100);
    };
    refs.handleResize = handleResize;

    window.addEventListener('resize', handleResize);
    refs.animationId = requestAnimationFrame(animate);

    } catch (error) {
      console.error('Error initializing ParticleBackground:', error);
      // Fallback: just show a simple gradient background
      if (mount) {
        mount.style.background = 'linear-gradient(135deg, #160016 0%, #000000 100%)';
      }
    }

    // Cleanup function
    return () => {
      try {
        if (refs.handleResize) {
          window.removeEventListener('resize', refs.handleResize);
        }
        
        if (refs.resizeTimeout) {
          clearTimeout(refs.resizeTimeout);
        }
        
        if (refs.animationId) {
          cancelAnimationFrame(refs.animationId);
        }
        
        if (refs.renderer && mount.contains(refs.renderer.domElement)) {
          mount.removeChild(refs.renderer.domElement);
          refs.renderer.dispose();
        }
        
        if (refs.scene) {
          refs.scene.traverse((object) => {
            if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
              object.geometry?.dispose();
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                object.material?.dispose();
              }
            }
          });
          refs.scene.clear();
        }
        
        // Clear refs
        Object.keys(refs).forEach((key) => {
          delete refs[key as keyof typeof refs];
        });
      } catch (error) {
        console.error('Error during ParticleBackground cleanup:', error);
      }
    };
  }, [particleCount, galaxyParticleCount, enableParallax, parallaxIntensity, brightnessReduction]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleBackground;