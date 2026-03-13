"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function ParticleField({ count = 500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const time = Math.random() * 100;
        const factor = 10 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const x = Math.random() * 40 - 20;
        const y = Math.random() * 40 - 20;
        const z = Math.random() * 40 - 20;
        temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;
      time = particle.time += speed / 2;
      
      const px = x + Math.cos(time) * 2;
      const py = y + Math.sin(time) * 2;
      const pz = z + Math.cos(time) * 2;
      
      dummy.position.set(px, py, pz);
      dummy.rotation.set(time, time, time);
      
      // Some glow scaling effect
      const scale = Math.max(0.2, Math.sin(time * 2) * 2);
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} renderOrder={-1}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </>
  );
}
