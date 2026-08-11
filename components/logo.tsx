import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="cv-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        stroke="url(#cv-grad)"
        strokeWidth="1.5"
        fill="rgba(99,102,241,0.08)"
      />
      <circle cx="16" cy="16" r="5" stroke="url(#cv-grad)" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="1.6" fill="url(#cv-grad)" />
      <circle
        cx="19.6"
        cy="12.4"
        r="1.1"
        fill="#06B6D4"
        className="animate-pulse-glow"
      />
      <path
        d="M4 20.5 28 11.5"
        stroke="url(#cv-grad)"
        strokeWidth="1.2"
        opacity="0.5"
        strokeDasharray="2 3"
      />
    </svg>
  );
}
