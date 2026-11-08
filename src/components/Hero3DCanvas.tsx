import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let animationFrameId: number;

    // Check WebGL availability
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS background:', e);
      setWebGLSupported(false);
      return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e9, 1.2);
    scene.add(ambientLight);

    const goldSpot = new THREE.DirectionalLight(0xd7a64a, 2.5);
    goldSpot.position.set(8, 12, 10);
    scene.add(goldSpot);

    const wineBacklight = new THREE.PointLight(0x4a1020, 3.0, 30);
    wineBacklight.position.set(-6, -4, 2);
    scene.add(wineBacklight);

    // Responsive particle count
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 160 : 450;

    // 1. Golden Stardust Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 36;
      positions[i3 + 1] = (Math.random() - 0.5) * 22;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random() * 2.0 + 0.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(245, 215, 140, 1)');
        gradient.addColorStop(0.3, 'rgba(215, 166, 74, 0.6)');
        gradient.addColorStop(0.7, 'rgba(180, 130, 50, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.55,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(0xd7a64a)
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Decorative Orbital Rings (Dining elegance motif)
    const ringGroup = new THREE.Group();

    const ringGeo1 = new THREE.TorusGeometry(6.4, 0.03, 16, 120);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xd7a64a,
      metalness: 0.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0.45
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh1.rotation.y = Math.PI / 6;
    ringGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(4.6, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xfff7e9,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.3
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.z = Math.PI / 5;
    ringGroup.add(ringMesh2);

    ringGroup.position.set(0, 0, -2);
    scene.add(ringGroup);

    // Pointer-based Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = x * 1.4;
      targetMouseY = y * 1.0;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (camera) {
        camera.position.x = currentMouseX;
        camera.position.y = currentMouseY;
        camera.lookAt(0, 0, 0);
      }

      // Slowly rotate particles
      if (particles) {
        particles.rotation.y = elapsedTime * 0.035;
        particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;
      }

      // Slowly rotate orbital rings in opposite directions
      if (ringGroup) {
        ringMesh1.rotation.z = elapsedTime * 0.08;
        ringMesh2.rotation.z = -elapsedTime * 0.06;
        ringGroup.rotation.y = Math.sin(elapsedTime * 0.04) * 0.15;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }

      geometry.dispose();
      particleMaterial.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden transition-opacity duration-1000"
      aria-hidden="true"
    >
      {!webGLSupported && (
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-950 via-charcoal-900/60 to-charcoal-950 opacity-70" />
      )}
    </div>
  );
};
