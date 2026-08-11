"use client";

import { motion } from "framer-motion";

export function ScoreRing({
  value,
  label,
  color,
  subtitle,
  hint,
  size = "md",
}: {
  value: number;
  label: string;
  color: string;
  subtitle: string;
  hint?: string;
  size?: "md" | "lg";
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  const r = size === "lg" ? 52 : 42;
  const c = 2 * Math.PI * r;
  const dim = size === "lg" ? "h-32 w-32" : "h-24 w-24";
  const number = size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className={`relative ${dim} shrink-0`}>
        <svg viewBox="0 0 100 100" className={`${dim} -rotate-90`} aria-hidden>
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
            animate={{ strokeDashoffset: c * (1 - clamped / 100) }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${number} font-semibold tabular-nums text-white`}
            style={{ color }}
          >
            {clamped}
          </span>
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        {hint && (
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
