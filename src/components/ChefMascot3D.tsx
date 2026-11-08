import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Sparkles, ChevronRight, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button3D } from './Button3D';

const CHEF_TIPS = [
  {
    title: "Chef's Signature Pick",
    text: "Our Arabian Mutton Juicy Mandi is slow-cooked for 4 hours with fragrant spices. Highly recommended for family dinner!",
    actionText: "Explore Mandi",
    category: "Mandi"
  },
  {
    title: "100% Vegetarian Delicacy",
    text: "Craving vegetarian royal flavours? Try our velvety Royal Bagara Paneer paired with hot Clay Oven Butter Naan.",
    actionText: "View Veg Dishes",
    category: "North Indian"
  },
  {
    title: "Free Delivery Across Kurnool",
    text: "Enjoy complimentary free doorstep delivery on all dinner & lunch orders above ₹500!",
    actionText: "Order Online",
    category: "All"
  },
  {
    title: "3rd Floor Terrace Dining",
    text: "Visiting us this evening? Book a table on our breezy outdoor terrace overlooking Ameen Abbas Nagar.",
    actionText: "Reserve Table",
    category: "Reservation"
  }
];

export const ChefMascot3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();

  // Three.js 3D Chef Animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(96, 96);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Warm ambient and key light
    const ambientLight = new THREE.AmbientLight(0xfff7e9, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd7a64a, 2.2);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Stylized 3D Chef Group
    const chefGroup = new THREE.Group();

    // 1. Chef Head
    const headGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf5cfb3,
      roughness: 0.55,
      metalness: 0.05
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.2;
    chefGroup.add(headMesh);

    // 2. Chef Hat (Toque)
    const hatBaseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.5, 24);
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.35
    });
    const hatBaseMesh = new THREE.Mesh(hatBaseGeo, hatMat);
    hatBaseMesh.position.y = 1.2;
    chefGroup.add(hatBaseMesh);

    // Hat Crown (Puffy top)
    const hatPuffGeo = new THREE.SphereGeometry(1.15, 24, 24);
    const hatPuffMesh = new THREE.Mesh(hatPuffGeo, hatMat);
    hatPuffMesh.position.y = 1.8;
    hatPuffMesh.scale.set(1.0, 0.72, 1.0);
    chefGroup.add(hatPuffMesh);

    // Gold ribbon band on hat
    const ribbonGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.1, 24);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd7a64a,
      metalness: 0.65,
      roughness: 0.25
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.y = 1.0;
    chefGroup.add(ribbonMesh);

    // 3. Smiling Eyes & Mustache
    const mustacheGeo = new THREE.TorusGeometry(0.35, 0.08, 12, 24, Math.PI);
    const mustacheMat = new THREE.MeshStandardMaterial({ color: 0x2e0813, roughness: 0.8 });
    const mustacheMesh = new THREE.Mesh(mustacheGeo, mustacheMat);
    mustacheMesh.rotation.z = Math.PI;
    mustacheMesh.position.set(0, 0.05, 0.95);
    chefGroup.add(mustacheMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1f1a19 });
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.35, 0.35, 0.9);
    chefGroup.add(eyeLeft);

    const eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.35;
    chefGroup.add(eyeRight);

    // Neckerchief (Royal gold scarf)
    const scarfGeo = new THREE.TorusGeometry(0.85, 0.12, 12, 24);
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xd7a64a, roughness: 0.3, metalness: 0.5 });
    const scarfMesh = new THREE.Mesh(scarfGeo, scarfMat);
    scarfMesh.rotation.x = Math.PI / 2;
    scarfMesh.position.y = -0.32;
    chefGroup.add(scarfMesh);

    // 4. Chef Jacket & Collar
    const bodyGeo = new THREE.CylinderGeometry(0.9, 1.2, 1.0, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a1020, roughness: 0.45 }); // Deep burgundy jacket
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = -0.8;
    chefGroup.add(bodyMesh);

    // Gold Buttons
    for (let i = 0; i < 3; i++) {
      const buttonGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const buttonMesh = new THREE.Mesh(buttonGeo, ribbonMat);
      buttonMesh.position.set(0, -0.6 - i * 0.25, 1.05);
      chefGroup.add(buttonMesh);
    }

    // Rolling Pin / Ladle
    const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xc8964d, roughness: 0.6 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(0.95, -0.6, 0.6);
    pinMesh.rotation.z = -Math.PI / 4;
    pinMesh.rotation.x = Math.PI / 8;
    chefGroup.add(pinMesh);

    chefGroup.position.y = -0.2;
    scene.add(chefGroup);

    // Mouse tracking
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = x * 0.45;
      targetRotX = -y * 0.25;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Idle floating bob
        chefGroup.position.y = -0.2 + Math.sin(elapsed * 2.2) * 0.12;

        // Subtle pin sway
        pinMesh.rotation.z = -Math.PI / 4 + Math.sin(elapsed * 3) * 0.1;

        // Smooth rotation to cursor
        chefGroup.rotation.y += (targetRotY - chefGroup.rotation.y) * 0.08;
        chefGroup.rotation.x += (targetRotX - chefGroup.rotation.x) * 0.08;
      }

      renderer?.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      headGeo.dispose();
      headMat.dispose();
      hatBaseGeo.dispose();
      hatMat.dispose();
      hatPuffGeo.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      mustacheGeo.dispose();
      mustacheMat.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      pinGeo.dispose();
      pinMat.dispose();
      scarfGeo.dispose();
      scarfMat.dispose();
    };
  }, []);

  const currentTip = CHEF_TIPS[currentTipIndex];

  const handleNextTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTipIndex((prev) => (prev + 1) % CHEF_TIPS.length);
  };

  const handleAction = () => {
    if (currentTip.category === 'Reservation') {
      const el = document.getElementById('reservation');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/#reservation');
      }
    } else if (currentTip.category === 'All' || currentTip.category === 'Mandi') {
      navigate('/menu');
    } else {
      navigate('/menu');
    }
    setIsOpen(false);
  };

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
      aria-label="Chef Mascot Virtual Assistant"
    >
      {/* Speech Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-charcoal-900 border-2 border-gold-500/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(215,166,74,0.15)] animate-slideUp text-cream-100 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Burgundy Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-burgundy-850 via-gold-500 to-burgundy-850" />

          <div className="flex items-start justify-between gap-3 mb-2 pt-1">
            <div className="flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTip.title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cream-400 hover:text-cream-100 p-1 rounded-full hover:bg-charcoal-800 transition-colors"
              aria-label="Close speech bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-cream-200 leading-relaxed font-light mb-4">
            {currentTip.text}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-charcoal-800">
            <Button3D
              variant="gold"
              size="xs"
              onClick={handleAction}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              {currentTip.actionText}
            </Button3D>

            <button
              onClick={handleNextTip}
              className="text-[11px] text-gold-400 hover:text-gold-300 font-medium underline"
            >
              Next ({currentTipIndex + 1}/{CHEF_TIPS.length})
            </button>
          </div>

          {/* Speech bubble pointer arrow */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-charcoal-900 border-r-2 border-b-2 border-gold-500/40 transform rotate-45" />
        </div>
      )}

      {/* Mascot Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasInteracted(true);
        }}
        className="group relative flex items-center gap-2 p-1.5 pr-4 rounded-full bg-gradient-to-r from-burgundy-850 via-burgundy-900 to-charcoal-900 border-2 border-gold-500/50 hover:border-gold-400 shadow-[0_12px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(74,16,32,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-400"
        aria-label="Chat with Ajwa Exotica Chef Mascot"
      >
        {/* 3D Canvas Container */}
        <div
          ref={containerRef}
          className="w-13 h-13 rounded-full overflow-hidden flex items-center justify-center bg-charcoal-950/70 border border-gold-500/30 group-hover:scale-110 transition-transform"
        />

        <div className="text-left hidden sm:block">
          <span className="font-serif text-xs font-bold text-cream-100 block group-hover:text-gold-300 transition-colors">
            Chef Exotica
          </span>
          <span className="text-[10px] text-gold-400 uppercase tracking-wider block font-mono">
            {isOpen ? 'Tap to close' : "Chef's Recommendations"}
          </span>
        </div>

        {/* Pulse Dot */}
        {!hasInteracted && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold-500 border border-charcoal-950" />
          </span>
        )}
      </button>
    </aside>
  );
};
