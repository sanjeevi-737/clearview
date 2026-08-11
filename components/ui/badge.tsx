import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/40 bg-primary/15 text-indigo-200",
        secondary: "border-secondary/40 bg-secondary/15 text-violet-200",
        accent: "border-accent/40 bg-accent/15 text-cyan-200",
        outline: "border-white/15 bg-white/[0.04] text-slate-300",
        success: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
        destructive: "border-red-400/40 bg-red-400/15 text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
