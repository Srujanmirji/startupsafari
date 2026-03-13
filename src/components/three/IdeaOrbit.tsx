"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const EXPERTS = [
  { name: "Fox", icon: "🦊", role: "Idea Logic", color: "#facc15" },
  { name: "Owl", icon: "🦉", role: "Market Intelligence", color: "#60a5fa" },
  { name: "Shark", icon: "🦈", role: "Business Model", color: "#a855f7" },
  { name: "Bee", icon: "🐝", role: "Demand Validation", color: "#f59e0b" },
  { name: "Wolf", icon: "🐺", role: "Competitive Strategy", color: "#9ca3af" },
  { name: "Cheetah", icon: "🐆", role: "Speed to Market", color: "#f97316" },
  { name: "Peacock", icon: "🦚", role: "Branding", color: "#34d399" },
  { name: "Eagle", icon: "🦅", role: "Long Term Vision", color: "#fbbf24" },
];

function OrbitingExpert({ expert, index, total, radius }: { expert: any, index: number, total: number, radius: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const angle = (index / total) * Math.PI * 2;
  const speed = 0.2 + (index % 3) * 0.1; // slight variation in speed

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed + angle;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      // gentle bobbing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Html center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#09090b]/80 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform hover:scale-110 cursor-pointer pointer-events-auto w-32 border-b-[3px]" style={{ borderBottomColor: expert.color }}>
          <div className="text-3xl mb-1 filter drop-shadow-lg">{expert.icon}</div>
          <div className="text-white text-xs font-bold font-heading">{expert.name}</div>
          <div className="text-zinc-400 text-[10px] text-center leading-tight mt-1">{expert.role}</div>
        </div>
      </Html>
    </group>
  );
}

export function IdeaOrbit() {
  const coreRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && auraRef.current) {
      coreRef.current.rotation.y += 0.01;
      coreRef.current.rotation.x += 0.005;
      
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.005;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Glowing Idea Sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial color="#8b5cf6" wireframe transparent opacity={0.6} emissive="#8b5cf6" emissiveIntensity={2} />
      </mesh>
      
      <mesh ref={auraRef} scale={1.2}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Orbit Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
        <ringGeometry args={[4.9, 5, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.9, 7, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Experts Orbiting */}
      {EXPERTS.map((expert, i) => (
        <OrbitingExpert key={expert.name} expert={expert} index={i} total={EXPERTS.length} radius={i % 2 === 0 ? 5 : 7} />
      ))}
    </group>
  );
}
