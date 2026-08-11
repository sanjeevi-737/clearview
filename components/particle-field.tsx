"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const ParticleScene = dynamic(
  () => import("@/components/three/particle-scene"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ParticleField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      <ParticleScene />
    </div>
  );
}
