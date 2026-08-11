"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Gauge, Layers, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const summaryLines = [
  { color: "bg-indigo-400", width: "w-full", label: "Headline communicates value clearly" },
  { color: "bg-violet-400", width: "w-[86%]", label: "Navigation is predictable across pages" },
  { color: "bg-cyan-400", width: "w-[72%]", label: "Hero CTA is above the fold" },
  { color: "bg-indigo-400", width: "w-[58%]", label: "Pricing page buried two clicks deep" },
];

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables =
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || active === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#070B1D] shadow-card-lg outline-none"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="ClearView AI demo"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-1.5 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                clearview.ai/demo — sample preview
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label="Close demo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="col-span-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/10 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    AI Summary
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Clean, conversion-focused marketing site. Great clarity, minor
                    navigation depth issue on pricing.
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  Sample data
                </Badge>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Gauge className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Readability
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">92</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Excellent</p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Layers className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Clutter
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">24</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "24%" }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Low noise</p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Brain className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Cognitive Load
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">84</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  High effort — not a quality score
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Clarity
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {summaryLines.map((line, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-sm ${line.color}`} />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                          className={`h-full ${line.color}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-5 py-3">
              <p className="text-xs text-slate-500">
                Run a real analysis with structure map, insights and PDF export.
              </p>
              <Button size="sm" onClick={onClose}>
                <a href="/dashboard" className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Open Live Dashboard
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
