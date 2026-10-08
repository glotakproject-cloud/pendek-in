import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border-2 border-black select-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-black",
        secondary: "bg-accent text-black",
        destructive: "bg-destructive text-white",
        warning: "bg-warning text-black",
        info: "bg-info text-white",
        outline: "bg-white text-black",
        dark: "bg-black text-white",
      },
      rounded: {
        none: "rounded-none",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "none",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, rounded, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, rounded }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
