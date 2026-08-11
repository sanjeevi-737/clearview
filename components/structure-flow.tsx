"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SITE_NODES, STRUCTURE_EDGES } from "@/lib/data";
import { cn } from "@/lib/utils";

type SiteNodeData = {
  label: string;
  detail: string;
  type: "root" | "section" | "page";
  stats: number;
  color: string;
};

function SiteNode({ data, selected }: NodeProps<Node<SiteNodeData>>) {
  const accent =
    data.type === "root"
      ? "border-indigo-400/50 bg-indigo-500/10"
      : data.type === "section"
        ? "border-violet-400/30 bg-violet-500/[0.07]"
        : "border-cyan-400/30 bg-cyan-500/[0.07]";

  return (
    <div
      className={cn(
        "relative w-[156px] rounded-xl border bg-[#0A0F24]/80 p-3 backdrop-blur-xl transition-all duration-200",
        accent,
        selected && "shadow-glow-sm ring-1 ring-indigo-400/40"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: data.color, boxShadow: `0 0 8px ${data.color}` }}
        />
        <span className="truncate text-xs font-semibold text-white">
          {data.label}
        </span>
      </div>
      <p className="mt-1 truncate text-[10px] text-slate-400">{data.detail}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${data.stats}%`,
            background: data.color,
            boxShadow: `0 0 6px ${data.color}`,
          }}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-indigo-400/70"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-cyan-400/70"
      />
    </div>
  );
}

const NODE_TYPES = { site: SiteNode };

const nodeWidth = 160;
const startX = 300;
const rows: Record<string, number> = {
  root: 20,
  nav: 150,
  hero: 260,
  features: 370,
  pricing: 480,
  blog: 150,
  about: 260,
  contact: 370,
};

const ROW_X: Record<string, number> = {
  nav: 40,
  blog: 220,
  hero: 400,
  features: 560,
  pricing: 40,
  about: 240,
  contact: 440,
};

const initialNodes: Node<SiteNodeData>[] = SITE_NODES.map((n) => ({
  id: n.id,
  type: "site",
  position: {
    x: n.id === "root" ? startX - nodeWidth / 2 : ROW_X[n.id],
    y: n.id === "root" ? 0 : rows[n.id],
  },
  data: {
    label: n.label,
    detail: n.detail,
    type: n.type,
    stats: n.stats,
    color: n.color,
  },
}));

const initialEdges: Edge[] = STRUCTURE_EDGES.map((e, i) => ({
  id: `e-${i}`,
  source: e.source,
  target: e.target,
  animated: true,
  style: {
    stroke: i % 2 === 0 ? "rgba(99,102,241,0.55)" : "rgba(6,182,212,0.45)",
    strokeWidth: 1.2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 12,
    height: 12,
    color: "rgba(99,102,241,0.7)",
  },
}));

export default function StructureFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={NODE_TYPES}
      fitView
      fitViewOptions={{ padding: 0.35 }}
      minZoom={0.4}
      maxZoom={1.6}
      proOptions={{ hideAttribution: true }}
      colorMode="dark"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={22}
        size={1.4}
        color="rgba(148,163,184,0.12)"
      />
      <Controls
        className="!border-white/10 !bg-[#0A0F24]/80 !text-slate-300"
        showInteractive={false}
      />
    </ReactFlow>
  );
}
