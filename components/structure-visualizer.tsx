"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const StructureFlow = dynamic(() => import("@/components/structure-flow"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
    </div>
  ),
});

export default function StructureVisualizer() {
  return (
    <div className="h-[420px] w-full rounded-xl border border-white/[0.07] bg-[#070B1D]/60 sm:h-[520px]">
      <StructureFlow />
    </div>
  );
}
