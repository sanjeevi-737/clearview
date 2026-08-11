import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        foreground: "#E6EAF5",
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#06B6D4",
          foreground: "#050816",
        },
        card: "rgba(255,255,255,0.04)",
        muted: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#8A93AC",
        },
        border: "rgba(255,255,255,0.10)",
        input: "rgba(255,255,255,0.10)",
        ring: "#6366F1",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          sm: "2rem",
          lg: "2rem",
          xl: "2rem",
        },
      },
      boxShadow: {
        glow: "0 0 40px 0 rgba(99,102,241,0.45)",
        "glow-cyan": "0 0 40px 0 rgba(6,182,212,0.40)",
        "glow-violet": "0 0 40px 0 rgba(139,92,246,0.45)",
        "glow-sm": "0 0 20px 0 rgba(99,102,241,0.35)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(0,0,0,0.8)",
        "card-lg":
          "0 0 0 1px rgba(255,255,255,0.08), 0 40px 120px -30px rgba(0,0,0,0.9), 0 0 80px -40px rgba(99,102,241,0.5)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.05) 1px, transparent 1px)",
        "radial-primary":
          "radial-gradient(circle at center, rgba(99,102,241,0.25) 0%, transparent 60%)",
        "text-gradient":
          "linear-gradient(135deg, #A5B4FC 0%, #8B5CF6 45%, #06B6D4 100%)",
        "text-gradient-soft":
          "linear-gradient(135deg, #C7D2FE 0%, #A78BFA 50%, #22D3EE 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "border-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        marquee: "marquee 40s linear infinite",
        "border-flow": "border-flow 6s ease infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [],
};
export default config;
