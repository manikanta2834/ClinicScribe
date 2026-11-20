import React from "react";
import { cn } from "@/lib/utils";

interface PillBadgeProps {
  children: React.ReactNode;
  variant?: "mint" | "teal" | "slate" | "warning";
  className?: string;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  children,
  variant = "mint",
  className,
}) => {
  const variantClasses = {
    mint: "bg-brand-mint/15 text-brand-evergreen border border-brand-mint/30",
    teal: "bg-brand-deepTeal/10 text-brand-deepTeal border border-brand-deepTeal/20",
    slate: "bg-brand-slate/15 text-brand-slate border border-brand-slate/25",
    warning: "bg-amber-500/15 text-amber-800 border border-amber-500/30",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
        variantClasses,
        className
      )}
    >
      {children}
    </span>
  );
};

