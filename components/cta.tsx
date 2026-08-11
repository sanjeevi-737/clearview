"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/reveal";

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-24 lg:py-36">
      <div className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/25 via-violet-600/15 to-cyan-500/20"
              style={{ transform: "rotate(-2deg) scale(1.05)" }}
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="bg-grid absolute inset-0 opacity-40 mask-fade-y" />
              <div className="absolute left-1/2 top-1/2 h-[340px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/25 blur-[120px]" />
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px] animate-pulse-glow" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
            </div>

            <div className="relative">
              <motion.span
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-6 w-6 text-indigo-200" />
              </motion.span>

              <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                Ready to{" "}
                <span className="text-gradient-soft">simplify the web?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Paste any URL and get a complete AI breakdown — structure,
                readability, clutter, and insight. Free for your first 10 analyses.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 px-8 shadow-glow">
                  <a href="/dashboard" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Analyze Your First Site
                  </a>
                </Button>
                <Button variant="glass" size="lg" className="gap-2">
                  <a href="/dashboard" className="flex items-center gap-2">
                    Open Live Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                Free demo account: test@clearview.dev · password Demo123!
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
