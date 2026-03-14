"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { IdeaOrbit } from "./IdeaOrbit";
import React, { useState, useEffect } from "react";

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, isMobile ? 0 : 2, isMobile ? 15 : 12], fov: 45 }}>
        <React.Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
          
          {/* Particle Background */}
          <ParticleField count={isMobile ? 400 : 800} />
          
          {/* Central Idea Orbit */}
          <group 
            position={isMobile ? [0, -2, 0] : [3, 0, 0]} 
            rotation={[0.2, -0.3, 0]}
            scale={isMobile ? 0.7 : 1}
          >
            <IdeaOrbit isMobile={isMobile} />
          </group>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
