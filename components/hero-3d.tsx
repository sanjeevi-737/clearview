"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    ),
  }
);

export default function Hero3D() {
  return (
    <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
      <HeroScene />
    </div>
  );
}
