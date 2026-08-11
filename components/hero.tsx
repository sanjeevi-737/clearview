"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  CheckCircle2,
  Loader2,
  Globe,
  Gauge,
  FileText,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero3D from "@/components/hero-3d";
import DemoModal from "@/components/demo-modal";
import { cn } from "@/lib/utils";

const STEPS = [
  "Connecting to website",
  "Crawling page structure",
  "Detecting clutter patterns",
  "Scoring readability",
  "Generating structure map",
];

const FLOATING_CHIPS = [
  {
    icon: Gauge,
    label: "Readability 92",
    sub: "Excellent",
    className: "left-2 top-6 sm:-left-10 lg:-left-16",
    delay: 0.4,
  },
  {
    icon: Layers,
    label: "Clutter 24%",
    sub: "Low noise",
    className: "right-2 top-16 sm:-right-6 lg:-right-12",
    delay: 0.55,
  },
  {
    icon: FileText,
    label: "AI Summary",
    sub: "Generated in 2.4s",
    className: "bottom-8 left-4 sm:-left-4 lg:-left-8",
    delay: 0.7,
  },
];

export default function Hero() {
  const [url, setUrl] = React.useState("https://acme.io");
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = React.useState(0);
  const [demoOpen, setDemoOpen] = React.useState(false);

  React.useEffect(() => {
    if (state !== "running") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 1.2 + Math.random() * 1.8, 100);
        return next;
      });
    }, 90);
    return () => clearInterval(id);
  }, [state]);

  React.useEffect(() => {
    if (progress < 100 || state !== "running") return;
    const t = setTimeout(() => {
      setState("done");
      const dashboard = document.getElementById("dashboard");
      if (!dashboard) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      dashboard.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }, 450);
    return () => clearTimeout(t);
  }, [progress, state]);

  React.useEffect(() => {
    if (state !== "done") return;
    const reset = setTimeout(() => {
      setState("idle");
      setProgress(0);
    }, 4000);
    return () => clearTimeout(reset);
  }, [state]);

  const stepIndex = Math.min(
    Math.floor(progress / (100 / STEPS.length)),
    STEPS.length - 1
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "running") return;
    setProgress(0);
    setState("running");
  };

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-[10%] h-[380px] w-[380px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="bg-grid absolute inset-0 mask-fade-y opacity-60" />
      </div>

      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="relative z-10 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-2"
          >
            <Badge variant="default" className="gap-2 border-indigo-400/40 bg-indigo-500/10 py-1.5 pl-2">
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/30">
                <Sparkles className="h-3 w-3 text-indigo-200" />
              </span>
              ClearView Vision v2
            </Badge>
            <Badge variant="outline" className="py-1.5">
              Understand any site
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem] xl:text-6xl"
          >
            Understand any website in{" "}
            <span className="text-gradient relative inline-block">
              seconds
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 9"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6.5C50 2 150 2 198 6.5"
                  stroke="url(#cv-underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cv-underline" x1="0" y1="0" x2="200" y2="0">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            AI-powered website simplification and structure visualization.
            ClearView converts any site into a visual map, plain-language summary,
            readability insight, and clutter report — instantly.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-xs text-slate-500"
          >
            This preview uses sample data — run a{" "}
            <a
              href="/dashboard"
              className="font-medium text-indigo-400 underline-offset-4 transition-colors hover:text-indigo-300 hover:underline"
            >
              real analysis
            </a>{" "}
            in the live dashboard.
          </motion.p>

          <motion.form
            id="analyze"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={onSubmit}
            className={cn(
              "mt-8 w-full max-w-xl overflow-hidden rounded-2xl border p-1.5 transition-colors",
              state === "running"
                ? "border-indigo-500/50 shadow-glow"
                : "border-white/10 bg-white/[0.03] backdrop-blur-xl"
            )}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://any-website.com"
                  aria-label="Website URL to analyze"
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  disabled={state === "running"}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={state === "running"}
                className="h-11 shrink-0 gap-2 px-6"
              >
                {state === "running" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : state === "done" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Website
                  </>
                )}
              </Button>
            </div>
            {state === "running" && (
              <div className="px-1 pb-2 pt-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                    {STEPS[stepIndex]}
                  </span>
                  <span className="font-mono text-indigo-300">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-wrap items-center gap-5"
          >
            <Button
              variant="glass"
              size="lg"
              className="gap-2"
              onClick={() => setDemoOpen(true)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
              Watch Demo
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <a href="/dashboard" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Open Live Dashboard
              </a>
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {["from-indigo-500 to-violet-500", "from-violet-500 to-fuchsia-500", "from-cyan-500 to-indigo-500"].map(
                  (g, i) => (
                    <span
                      key={i}
                      className={`h-7 w-7 rounded-full border-2 border-[#050816] bg-gradient-to-br ${g}`}
                    />
                  )
                )}
              </div>
              <span>
                Trusted by <span className="text-slate-300">12,000+</span> teams
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-slate-600 lg:flex"
          >
            <span className="text-slate-500">Used at</span>
            {["Nebula", "Quantum Labs", "Vertex", "Orbita", "Hyperloop"].map((n) => (
              <span key={n} className="font-semibold text-slate-600">
                {n}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:sticky lg:top-24"
        >
          <div className="pointer-events-none absolute inset-8 rounded-full bg-indigo-600/15 blur-[90px]" />
          <Hero3D />
          {FLOATING_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: chip.delay, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute z-20 hidden sm:block",
                  chip.className
                )}
              >
                <div className="glass flex animate-float items-center gap-2.5 rounded-xl px-3.5 py-2.5 shadow-card">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/30">
                    <Icon className="h-4 w-4 text-indigo-200" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-white">{chip.label}</p>
                    <p className="text-[11px] text-slate-400">{chip.sub}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
