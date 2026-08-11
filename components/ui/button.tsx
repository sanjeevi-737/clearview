import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow-sm hover:shadow-glow hover:bg-indigo-500",
        secondary:
          "bg-secondary text-secondary-foreground shadow-glow-violet hover:shadow-glow-violet hover:bg-violet-500",
        ghost: "bg-transparent text-foreground hover:bg-white/[0.06]",
        outline:
          "border border-white/15 bg-white/[0.02] text-foreground hover:border-primary/50 hover:bg-white/[0.06] hover:shadow-glow-sm",
        glass:
          "glass text-foreground hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-xl",
        accent:
          "bg-accent text-accent-foreground shadow-glow-cyan hover:bg-cyan-400",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
