"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

const PARTICLE_COUNT = 2200;
const NEURON_COUNT = 46;
const EDGE_RADIUS = 2.4;
const COLORS = [
  new THREE.Color("#6366F1"),
  new THREE.Color("#8B5CF6"),
  new THREE.Color("#06B6D4"),
  new THREE.Color("#A5B4FC"),
];

function randomInSphere(radius: number) {
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

function ParticleField() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const { positions, colors, edges } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colorsArr = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = randomInSphere(16);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      colorsArr[i * 3] = c.r;
      colorsArr[i * 3 + 1] = c.g;
      colorsArr[i * 3 + 2] = c.b;
    }

    const neurons: THREE.Vector3[] = [];
    for (let i = 0; i < NEURON_COUNT; i++) {
      neurons.push(randomInSphere(9));
    }

    const edges: THREE.Vector3[][] = [];
    for (let i = 0; i < neurons.length; i++) {
      const links = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < links; k++) {
        let j = Math.floor(Math.random() * neurons.length);
        if (j === i) j = (j + 1) % neurons.length;
        const a = neurons[i];
        const b = neurons[j];
        const dist = a.distanceTo(b);
        if (dist < EDGE_RADIUS) {
          edges.push([a.clone(), b.clone()]);
        }
      }
    }

    return { positions, colors: colorsArr, edges };
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const pointer = state.pointer;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, pointer.x, 2, delta);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, pointer.y, 2, delta);

    if (group.current) {
      group.current.rotation.y += delta * 0.02;
      group.current.rotation.x += delta * 0.008;
      group.current.position.x = mouse.current.x * 0.8;
      group.current.position.y = mouse.current.y * 0.5;
    }
    if (mesh.current) {
      mesh.current.rotation.y = -delta * 0.01;
    }
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {edges.map((points, i) => (
        <Line
          key={i}
          points={points.map((p) => [p.x, p.y, p.z])}
          color={
            i % 3 === 0 ? "#6366F1" : i % 3 === 1 ? "#8B5CF6" : "#06B6D4"
          }
          lineWidth={0.6}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      ))}
    </group>
  );
}

export default function ParticleScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 14], fov: 55 }}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ParticleField />
    </Canvas>
  );
}
