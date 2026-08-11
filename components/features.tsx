"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import type { ReactNode } from "react";
import {
  Sparkles,
  Network,
  Gauge,
  AlertTriangle,
  BookOpen,
  Code2,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "@/components/section-heading";
import Reveal from "@/components/reveal";
import { cn } from "@/lib/utils";

function TiltCard({
  children,
  className,
  glowColor = "rgba(99,102,241,0.35)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const gx = useSpring(mx, { stiffness: 120, damping: 20 });
  const gy = useSpring(my, { stiffness: 120, damping: 20 });

  const glow = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, ${glowColor}, transparent 70%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 8);
    rx.set((0.5 - py) * 8);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group relative h-full", className)}
    >
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  );
}

const cardBase =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.16]";

function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

function MiniSummary() {
  return (
    <div className="mt-5 space-y-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-300">
        <Sparkles className="h-3 w-3" />
        AI SUMMARY
      </div>
      <p className="text-sm leading-relaxed text-slate-300">
        Acme.io is a focused SaaS landing page. Value proposition is clear in the
        hero; pricing is discoverable within two clicks.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {["Clear", "Convertible", "Minimal"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniTree() {
  const nodes: Array<[number, number, string]> = [
    [120, 10, "#8B5CF6"],
    [120, 46, "#6366F1"],
    [60, 90, "#06B6D4"],
    [180, 90, "#06B6D4"],
    [22, 90, "#8B5CF6"],
    [218, 90, "#8B5CF6"],
  ];
  return (
    <div className="mt-5 flex flex-1 items-center justify-center rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <svg viewBox="0 0 240 120" className="w-full max-w-[240px]" aria-hidden>
        <defs>
          <linearGradient id="tree-grad" x1="0" y1="0" x2="240" y2="0">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <g stroke="rgba(148,163,184,0.35)" strokeWidth="1">
          <path d="M120 16 V 40" />
          <path d="M60 84 V 62 H 120 V 40" />
          <path d="M180 84 V 62 H 120" />
          <path d="M60 84 H 28" />
          <path d="M180 84 H 212" />
        </g>
        {nodes.map(([cx, cy, c], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill={c} />
            <circle cx={cx} cy={cy} r="9" fill={c} opacity="0.2" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function MiniGauge() {
  return (
    <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 26}
            initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - 0.92) }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
          <defs>
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="64" y2="64">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          92
        </span>
      </div>
      <div className="flex-1 space-y-2">
        {[92, 78, 88].map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-12 text-[11px] text-slate-400">
              {["Headline", "CTA", "Flow"][i]}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniClutter() {
  const flags = [
    { label: "14 tracking scripts", level: "bg-red-400/80", width: "w-[86%]" },
    { label: "2 carousels auto-rotating", level: "bg-amber-400/80", width: "w-[64%]" },
    { label: "8 popup surfaces", level: "bg-red-400/80", width: "w-[78%]" },
  ];
  return (
    <div className="mt-5 space-y-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-4">
      {flags.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[11px] text-slate-300">{f.label}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: f.width }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12 }}
                className={cn("h-full rounded-full", f.level)}
              />
            </div>
          </div>
        </div>
      ))}
      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <AlertTriangle className="h-3 w-3 text-amber-400" />
        3 issues found — 1 critical
      </p>
    </div>
  );
}

function MiniArticle() {
  return (
    <div className="mt-5 space-y-2 rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <div className="h-2.5 w-3/4 rounded-full bg-white/20" />
      <div className="space-y-1.5">
        {[100, 92, 70].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full bg-white/[0.09]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <span className="rounded-md bg-cyan-400/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
          Text 62% of page
        </span>
        <span className="rounded-md bg-violet-400/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          Ads filtered
        </span>
      </div>
    </div>
  );
}

function MiniCode() {
  const code = `{
  "structure": "ok",
  "nodes": 128,
  "depth": 3,
  "readability": 0.92,
  "clutter": 0.24,
  "action": "simplify"
}`;
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-black/30">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/60" />
        <span className="h-2 w-2 rounded-full bg-amber-400/60" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
        <span className="ml-2 text-[10px] text-slate-500">report.json</span>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    color: "text-indigo-300",
    tile: "from-indigo-500/25 to-violet-500/25",
    title: "AI Summary",
    desc: "A plain-language overview of what any website is about, who it's for, and what it's trying to do.",
    span: "lg:col-span-2",
    visual: <MiniSummary />,
  },
  {
    icon: Network,
    color: "text-violet-300",
    tile: "from-violet-500/25 to-fuchsia-500/25",
    title: "Structure Mapping",
    desc: "An instant visual tree of sections, pages, and navigation flows.",
    span: "",
    visual: <MiniTree />,
  },
  {
    icon: Gauge,
    color: "text-cyan-300",
    tile: "from-cyan-500/25 to-indigo-500/25",
    title: "Readability Analysis",
    desc: "Score every page against clarity, length, and conversion-focus standards.",
    span: "",
    visual: <MiniGauge />,
  },
  {
    icon: AlertTriangle,
    color: "text-amber-300",
    tile: "from-amber-500/25 to-orange-500/25",
    title: "Clutter Detection",
    desc: "Popups, auto-players, script bloat, and design noise — flagged automatically.",
    span: "",
    visual: <MiniClutter />,
  },
  {
    icon: BookOpen,
    color: "text-emerald-300",
    tile: "from-emerald-500/25 to-cyan-500/25",
    title: "Clean Reading View",
    desc: "Rebuild any page as pure, readable content. Ads and nav stripped away.",
    span: "",
    visual: <MiniArticle />,
  },
  {
    icon: Code2,
    color: "text-sky-300",
    tile: "from-sky-500/25 to-indigo-500/25",
    title: "Developer Insights",
    desc: "Export structured data: node graphs, JSON reports, and diff-friendly insight bundles for your stack.",
    span: "lg:col-span-3",
    visual: (
      <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
        <MiniCode />
        <div className="space-y-3">
          {[
            "REST + GraphQL APIs for every report",
            "Webhook alerts on site changes",
            "CI-ready analysis in your pipeline",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-400/15">
                <Code2 className="h-3.5 w-3.5 text-sky-300" />
              </span>
              {t}
            </div>
          ))}
          <button
            type="button"
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200 cursor-pointer"
          >
            Explore the API
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
          </button>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="section-shell">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need to <span className="text-gradient-soft">see a site clearly</span>
            </>
          }
          description="One tool replaces a dozen: summary, structure, readability, clutter, reading mode, and developer output."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal
                key={f.title}
                delay={(i % 3) * 0.08}
                className={cn(f.span)}
              >
                <TiltCard className={cn(f.span)} glowColor="rgba(99,102,241,0.22)">
                  <div className={cn(cardBase, f.span)}>
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                    <div className="flex items-start gap-4">
                      <IconTile className={f.tile}>
                        <Icon className={cn("h-5 w-5", f.color)} />
                      </IconTile>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                    {f.visual}
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
