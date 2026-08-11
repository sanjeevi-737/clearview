"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Globe, ScanSearch, WandSparkles, Boxes, Lightbulb } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import Reveal from "@/components/reveal";

const STEPS = [
  {
    icon: Globe,
    title: "Paste a URL",
    desc: "Point ClearView at any public website. No plugins or accounts needed.",
    color: "from-indigo-500/30 to-indigo-500/5",
    text: "text-indigo-300",
  },
  {
    icon: ScanSearch,
    title: "AI Analysis",
    desc: "A vision model reads the DOM, content, layout, and visual design.",
    color: "from-violet-500/30 to-violet-500/5",
    text: "text-violet-300",
  },
  {
    icon: WandSparkles,
    title: "Simplification",
    desc: "Clutter is stripped and the true hierarchy is distilled.",
    color: "from-fuchsia-500/30 to-fuchsia-500/5",
    text: "text-fuchsia-300",
  },
  {
    icon: Boxes,
    title: "Visualization",
    desc: "Sections become nodes in a living, explorable structure map.",
    color: "from-cyan-500/30 to-cyan-500/5",
    text: "text-cyan-300",
  },
  {
    icon: Lightbulb,
    title: "Insights",
    desc: "Scores, plain-language summaries, and exportable data in seconds.",
    color: "from-emerald-500/30 to-emerald-500/5",
    text: "text-emerald-300",
  },
];

export default function HowItWorks() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      <div className="section-shell">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From URL to insight in{" "}
              <span className="text-gradient-soft">five steps</span>
            </>
          }
          description="A fully automated pipeline. You paste a link — ClearView handles the rest."
        />

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/[0.08] lg:block" />
          <motion.div
            style={{ scaleX: progress }}
            className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.6)] lg:block"
          />

          <div className="hidden flex-row items-start gap-6 lg:flex">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-1 flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${step.color} ring-1 ring-white/10 backdrop-blur-xl`}
                  >
                    <Icon className={`h-6 w-6 ${step.text}`} />
                  </motion.div>
                  <Reveal delay={0.15 + i * 0.1} className="flex flex-col items-center">
                    <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-[220px] text-sm leading-relaxed text-slate-400">
                      {step.desc}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>

          <div className="relative space-y-10 lg:hidden">
            <div className="absolute bottom-4 left-7 top-4 w-px bg-white/[0.08]" />
            <motion.div
              style={{ scaleY: progress }}
              className="absolute bottom-4 left-7 top-4 w-px origin-top bg-gradient-to-b from-indigo-500 via-violet-500 to-cyan-400"
            />
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative flex gap-5">
                  <div className="relative z-10 shrink-0">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${step.color} ring-1 ring-white/10 backdrop-blur-xl`}
                    >
                      <Icon className={`h-6 w-6 ${step.text}`} />
                    </motion.div>
                  </div>
                  <Reveal delay={0.1} className="flex-1">
                    <h3 className="text-base font-semibold text-white">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                      {step.desc}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
