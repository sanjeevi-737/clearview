"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { StructureGraph } from "@/lib/types";

type FlowNodeData = { label: string; depth: number };

const DEPTH_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
];

function LayoutNode({ data, selected }: NodeProps<Node<FlowNodeData>>) {
  const color = DEPTH_COLORS[Math.min(data.depth, DEPTH_COLORS.length - 1)];
  return (
    <div
      className="relative w-[150px] rounded-xl border bg-[#0A0F24]/85 p-3 backdrop-blur-xl transition-all duration-200"
      style={{ borderColor: `${color}55` }}
      data-selected={selected}
    >
      {selected && (
        <div
          className="absolute inset-0 -z-10 rounded-xl opacity-40 blur-sm"
          style={{ background: `${color}22` }}
        />
      )}
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span className="truncate text-xs font-semibold text-white">
          {data.label}
        </span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-slate-400/70"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-cyan-400/70"
      />
    </div>
  );
}

const NODE_TYPES = { layout: LayoutNode };

const LEVEL_GAP = 190;
const ROW_GAP = 120;

function layoutStructure(
  structure: StructureGraph
): { nodes: Node<FlowNodeData>[]; edges: Edge[] } {
  const children = new Map<string, string[]>();
  for (const edge of structure.edges) {
    const list = children.get(edge.source) ?? [];
    list.push(edge.target);
    children.set(edge.source, list);
  }

  const rootId =
    structure.tree?.id ??
    structure.nodes.find((n) => !n.parent)?.id ??
    structure.nodes[0]?.id;

  const depth = new Map<string, number>();
  const order = new Map<string, number>();
  const queue: Array<{ id: string; d: number }> = rootId
    ? [{ id: rootId, d: 0 }]
    : structure.nodes.map((n) => ({ id: n.id, d: 0 }));
  let cursor = 0;
  const seen = new Set<string>();

  while (queue.length) {
    const { id, d } = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    depth.set(id, d);
    order.set(id, cursor++);
    for (const child of children.get(id) ?? []) {
      if (!seen.has(child)) queue.push({ id: child, d: d + 1 });
    }
  }

  const byDepth = new Map<number, string[]>();
  for (const [id, d] of depth) {
    const list = byDepth.get(d) ?? [];
    list.push(id);
    byDepth.set(d, list);
  }

  const positions = new Map<string, { x: number; y: number }>();
  for (const [d, ids] of byDepth) {
    ids.forEach((id, i) => {
      const span = (ids.length - 1) * LEVEL_GAP;
      positions.set(id, {
        x: i * LEVEL_GAP - span / 2,
        y: d * ROW_GAP,
      });
    });
  }

  const labelOf = (id: string) =>
    structure.nodes.find((n) => n.id === id)?.label ?? id;

  const nodes: Node<FlowNodeData>[] = structure.nodes
    .filter((n) => depth.has(n.id))
    .map((n) => ({
      id: n.id,
      type: "layout",
      position: positions.get(n.id) ?? { x: 0, y: 0 },
      data: { label: labelOf(n.id), depth: depth.get(n.id) ?? 0 },
    }));

  const edges: Edge[] = structure.edges
    .filter((e) => depth.has(e.source) && depth.has(e.target))
    .map((e, i) => ({
      id: `e-${i}-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      style: {
        stroke: "rgba(148,163,184,0.35)",
        strokeWidth: 1.2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "rgba(148,163,184,0.6)",
      },
    }));

  return { nodes, edges };
}

export default function AnalysisStructure({
  structure,
}: {
  structure: StructureGraph | null;
}) {
  const { nodes, edges } = useMemo(
    () => (structure ? layoutStructure(structure) : { nodes: [], edges: [] }),
    [structure]
  );

  if (!structure || nodes.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-500">
        No structure map available for this page.
      </div>
    );
  }

  return (
    <div className="h-[420px] w-full rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.35}
        maxZoom={1.5}
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
    </div>
  );
}
