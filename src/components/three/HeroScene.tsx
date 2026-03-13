"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { IdeaOrbit } from "./IdeaOrbit";

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        {/* Particle Background */}
        <ParticleField count={800} />
        
        {/* Central Idea Orbit */}
        <group position={[3, 0, 0]} rotation={[0.2, -0.3, 0]}>
          <IdeaOrbit />
        </group>
      </Canvas>
    </div>
  );
}
