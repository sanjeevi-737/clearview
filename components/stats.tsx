"use client";

import * as React from "react";
import { motion, useInView, animate, useReducedMotion } from "framer-motion";
import Reveal from "@/components/reveal";

type Stat = {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  sub: string;
};

const STATS: Stat[] = [
  { value: 1250000, suffix: "+", label: "Websites Analyzed", sub: "crawled across the open web" },
  { value: 980000, suffix: "+", label: "Readability Improvements", sub: "actionable fixes delivered" },
  { value: 4.2, suffix: "M hrs", decimals: 1, label: "Time Saved", sub: "compared to manual audits" },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, stat.value, reduce]);

  const formatted =
    stat.decimals !== undefined
      ? display.toFixed(stat.decimals)
      : Math.round(display).toLocaleString("en-US");

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      <span className="text-gradient">{stat.suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-16 lg:py-20">
      <div className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/[0.08] via-transparent to-cyan-500/[0.06]" />
            <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-1 px-6 py-10 text-center"
                >
                  <span className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    <Counter stat={stat} />
                  </span>
                  <span className="mt-2 text-sm font-medium text-slate-200">
                    {stat.label}
                  </span>
                  <span className="text-xs text-slate-500">{stat.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
