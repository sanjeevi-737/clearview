"use client";

import { motion } from "framer-motion";
import { Sparkles, TerminalSquare, ArrowUpRight, Rocket } from "lucide-react";
import SectionHeading from "@/components/section-heading";

export default function Creator() {
  return (
    <section id="creator" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.07] blur-[130px]" />
      </div>

      <div className="section-shell">
        <SectionHeading
          eyebrow="About the builder"
          title={
            <>
              Built by a solo developer,{" "}
              <span className="text-gradient-soft">one commit at a time</span>
            </>
          }
          description="One developer. One vision. A whole project coming to life — design, motion, and code from scratch."
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 blur-[90px]" />

          <div className="relative flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-600/30 to-cyan-500/30 text-3xl font-bold text-white backdrop-blur-xl">
                S
              </div>
              <motion.span
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-slate-900"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket className="h-4 w-4 text-cyan-400" />
              </motion.span>
            </div>

            <div className="flex-1">
              <p className="eyebrow justify-center sm:justify-start">
                <Sparkles className="h-3 w-3" />
                sanjeevikumar
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                Developing a whole project
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-400">
                I&apos;m building this entire project on my own — from the 3D
                visuals and interactions to the structure analysis engine
                behind it. Every pixel, every animation, every line of code.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-slate-300">
                  <TerminalSquare className="h-3.5 w-3.5 text-indigo-400" />
                  Solo founder & developer
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-medium text-slate-300">
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400" />
                  Shipping end to end
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
