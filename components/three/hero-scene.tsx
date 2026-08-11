"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";

const NODE_DATA = [
  { label: "acme.io", color: "#A5B4FC", big: true },
  { label: "Navigation", color: "#8B5CF6" },
  { label: "Hero", color: "#06B6D4" },
  { label: "Features", color: "#8B5CF6" },
  { label: "Pricing", color: "#06B6D4" },
  { label: "Blog", color: "#8B5CF6" },
  { label: "About", color: "#6366F1" },
  { label: "Contact", color: "#06B6D4" },
];

const LABELS: Record<number, string> = {
  0: "Home",
  3: "Features",
  4: "Pricing",
  5: "Blog",
  7: "Contact",
};

function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY * radius,
        y * radius,
        Math.sin(theta) * radiusAtY * radius
      )
    );
  }
  return points;
}

function arcPoints(
  a: THREE.Vector3,
  b: THREE.Vector3,
  radius: number,
  height: number,
  segments = 50
) {
  const va = a.clone().normalize();
  const vb = b.clone().normalize();
  const axis = new THREE.Vector3()
    .crossVectors(va, vb)
    .normalize()
    .multiplyScalar(-1);
  const angle = va.angleTo(vb);
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = va
      .clone()
      .multiplyScalar(Math.sin((1 - t) * angle))
      .add(vb.clone().multiplyScalar(Math.sin(t * angle)));
    const lift = Math.sin(t * Math.PI) * height;
    p.add(axis.clone().multiplyScalar(lift));
    p.normalize().multiplyScalar(radius);
    pts.push([p.x, p.y, p.z]);
  }
  return pts;
}

function GlowNode({
  position,
  color,
  scale = 1,
  big = false,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  big?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.setScalar(
        1 + Math.sin(t * 2 + position[0]) * 0.18
      );
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref} scale={big ? 1.6 : scale}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={big ? 3.4 : 2.4}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function WebsiteGlobe() {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const follow = useRef({ x: 0, y: 0 });
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const { nodes, surfaceDots, arcs } = useMemo(() => {
    const radius = 2.02;
    const raw = fibonacciSphere(NODE_DATA.length, radius);
    const nodes = raw.map((p, i) => ({
      position: [p.x, p.y, p.z] as [number, number, number],
      ...NODE_DATA[i],
    }));

    const dotPositions = fibonacciSphere(420, radius);
    const dots = new Float32Array(dotPositions.length * 3);
    dotPositions.forEach((p, i) => {
      dots[i * 3] = p.x;
      dots[i * 3 + 1] = p.y;
      dots[i * 3 + 2] = p.z;
    });

    const arcs: Array<{ points: Array<[number, number, number]>; color: string }> = [];
    const root = raw[0];
    for (let i = 1; i < raw.length; i++) {
      arcs.push({
        points: arcPoints(root, raw[i], radius + 0.02, 0.55),
        color: i % 2 === 0 ? "#06B6D4" : "#8B5CF6",
      });
    }
    arcs.push({
      points: arcPoints(raw[3], raw[4], radius + 0.02, 0.45),
      color: "#6366F1",
    });
    arcs.push({
      points: arcPoints(raw[4], raw[7], radius + 0.02, 0.45),
      color: "#A5B4FC",
    });

    return { nodes, surfaceDots: dots, arcs };
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (group.current) {
      const speed = hovered.current ? 0.45 : 0.22;
      group.current.rotation.y += delta * speed;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        hovered.current ? follow.current.y * 0.5 : 0,
        3,
        delta
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        hovered.current ? follow.current.x * 0.4 : 0,
        3,
        delta
      );
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        hovered.current ? follow.current.x * 0.7 : 0,
        3,
        delta
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        hovered.current ? follow.current.y * 0.5 : 0,
        3,
        delta
      );
    }
  });

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    hovered.current = true;
    const target = e.nativeEvent.target as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    follow.current.x = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
    follow.current.y =
      -(((e.nativeEvent.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    hovered.current = false;
  };

  return (
    <group
      ref={group}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* Holographic shells */}
        <mesh>
          <sphereGeometry args={[2, 48, 48]} />
          <meshBasicMaterial
            color="#6366F1"
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[2.05, 1]} />
          <meshBasicMaterial
            color="#8B5CF6"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Glowing core */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Orbital rings */}
        <mesh rotation={[Math.PI / 2.2, 0, 0.4]}>
          <torusGeometry args={[2.7, 0.012, 8, 120]} />
          <meshBasicMaterial
            color="#06B6D4"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 1.8, 0.5, -0.3]}>
          <torusGeometry args={[3.15, 0.008, 8, 120]} />
          <meshBasicMaterial
            color="#8B5CF6"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Surface data dots */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[surfaceDots, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.025}
            sizeAttenuation
            transparent
            opacity={0.7}
            depthWrite={false}
            color="#A5B4FC"
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Structure arcs */}
        {arcs.map((arc, i) => (
          <Line
            key={i}
            points={arc.points}
            color={arc.color}
            lineWidth={0.8}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        ))}

        {/* Hierarchy nodes */}
        {nodes.map((node, i) => (
          <GlowNode
            key={i}
            position={node.position}
            color={node.color}
            big={node.big}
          />
        ))}

        {/* Section labels */}
        {nodes.map((node, i) =>
          LABELS[i] !== undefined ? (
            <Html
              key={i}
              position={node.position}
              center
              distanceFactor={9}
              style={{ pointerEvents: "none" }}
              zIndexRange={[20, 0]}
            >
              <div className="whitespace-nowrap rounded-full border border-white/15 bg-[#0A0F24]/70 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-200 backdrop-blur-md">
                <span
                  className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{ background: node.color, boxShadow: `0 0 6px ${node.color}` }}
                />
                {LABELS[i]}
              </div>
            </Html>
          ) : null
        )}
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 4, 6]} intensity={8} color="#6366F1" />
      <pointLight position={[-6, -3, 4]} intensity={6} color="#06B6D4" />
      <WebsiteGlobe />
    </Canvas>
  );
}
