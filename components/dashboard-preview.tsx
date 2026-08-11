"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  Gauge,
  Clock,
  AlertTriangle,
  BookOpenText,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import SectionHeading from "@/components/section-heading";
import Reveal from "@/components/reveal";
import StructureVisualizer from "@/components/structure-visualizer";
import { Badge } from "@/components/ui/badge";

const SCORES = [
  {
    value: 92,
    label: "Readability Score",
    color: "#6366F1",
    subtitle: "Excellent",
    hint: "Higher is better",
  },
  {
    value: 24,
    label: "Clutter Score",
    color: "#06B6D4",
    subtitle: "Low noise",
    hint: "Lower is better",
  },
  {
    value: 84,
    label: "Cognitive Load",
    color: "#F59E0B",
    subtitle: "Effort score — high",
    hint: "Lower is better",
  },
];

const SUGGESTIONS = [
  { text: "Move pricing link into primary nav", impact: "High" },
  { text: "Reduce hero carousel to one static image", impact: "Medium" },
  { text: "Cut 14 tracking scripts to 6", impact: "Medium" },
];

const READ_POINTS = [
  "Clear value proposition in the first screen",
  "Predictable 8-page navigation",
  "Pricing reachable but not surfaced in the primary nav",
];

const METRICS = [
  { label: "Avg sentence length", value: "14.2" },
  { label: "Heading density", value: "0.9%" },
  { label: "Content density", value: "61.4" },
  { label: "Navigation complexity", value: "8 links" },
  { label: "DOM depth", value: "6" },
  { label: "Word count", value: "1,284" },
  { label: "Total links", value: "14" },
  { label: "Buttons", value: "9" },
];

const INSIGHTS_JSON = `{
  "readability": { "score": 92, "grade": "A" },
  "clutter": { "score": 24, "issues": 3 },
  "cognitiveLoad": { "score": 84, "level": "high" },
  "structure": { "nodes": 128, "edges": 131 }
}`;

function ScoreRing({
  value,
  label,
  color,
  subtitle,
  hint,
  delay = 0.3,
}: {
  value: number;
  label: string;
  color: string;
  subtitle: string;
  hint: string;
  delay?: number;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut", delay }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-white">
            {value}
          </span>
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
          {hint}
        </p>
      </div>
    </div>
  );
}

function Row({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPreview() {
  const [copied, setCopied] = React.useState(false);

  const copyInsights = async () => {
    try {
      await navigator.clipboard.writeText(INSIGHTS_JSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="dashboard" className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.07] blur-[160px]" />

      <div className="section-shell relative">
        <SectionHeading
          eyebrow="Dashboard"
          title={
            <>
              One glance, <span className="text-gradient-soft">full clarity</span>
            </>
          }
          description="Every report distills raw signals into scores, a plain-language clean read, technical developer insights, and a live structure map."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070B1D]/70 shadow-card-lg backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3 sm:px-5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-1.5 text-xs text-slate-400">
                <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                clearview.ai/reports/acme.io
              </div>
              <Badge variant="outline" className="ml-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Sample Analysis
              </Badge>
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                  aria-label="Share report"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <Row className="grid gap-4 sm:grid-cols-3">
                {SCORES.map((score, i) => (
                  <div
                    key={score.label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                  >
                    <ScoreRing
                      value={score.value}
                      label={score.label}
                      color={score.color}
                      subtitle={score.subtitle}
                      hint={score.hint}
                      delay={0.1 + i * 0.1}
                    />
                  </div>
                ))}
              </Row>

              <Row delay={0.1} className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      AI Summary
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      Sample data
                    </Badge>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                    Acme.io is a focused marketing site with a clear value
                    proposition. Navigation is predictable across 8 pages, and the
                    hero CTA converts well. Pricing sits two clicks deep — moving
                    it to the top nav could lift conversions.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    Sample report · illustrative numbers only
                  </div>
                </div>

                <div className="flex flex-col rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Improvement Suggestions
                    </span>
                    <Badge variant="destructive" className="ml-auto">
                      3
                    </Badge>
                  </div>
                  <ul className="mt-3 flex-1 space-y-2.5">
                    {SUGGESTIONS.map((item, i) => (
                      <li
                        key={item.text}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-amber-400/30 bg-amber-400/10 text-[11px] font-semibold tabular-nums text-amber-300">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-slate-300">{item.text}</span>
                        <span
                          className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            item.impact === "High"
                              ? "bg-red-400/10 text-red-300"
                              : "bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {item.impact}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Row>

              <Row delay={0.15}>
                <div className="flex items-center justify-between px-1 pb-2 pt-1">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Gauge className="h-4 w-4 text-violet-400" />
                    Structure Map
                  </span>
                  <span className="text-[11px] text-slate-500">
                    drag · zoom · click nodes
                  </span>
                </div>
                <StructureVisualizer />
              </Row>

              <Row delay={0.1} className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpenText className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Clean Read View
                    </span>
                    <Badge variant="accent" className="ml-auto">
                      Reader mode
                    </Badge>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">
                    Focused, conversion-ready marketing site
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                    The value proposition is clear from the first screen and
                    navigation stays predictable across pages. Content is
                    well-structured and scannable. The main friction is discovery:
                    pricing is buried two clicks deep and the hero carousel adds
                    motion without value.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {READ_POINTS.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Code2 className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-medium uppercase tracking-widest">
                      Developer Insights
                    </span>
                    <button
                      type="button"
                      onClick={copyInsights}
                      className="ml-auto flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy JSON"}
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {METRICS.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5"
                      >
                        <p className="text-sm font-semibold tabular-nums text-white">
                          {metric.value}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <pre className="mt-3 flex-1 overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 text-[11px] leading-relaxed text-slate-400">
                    <code className="font-mono">{INSIGHTS_JSON}</code>
                  </pre>
                </div>
              </Row>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
