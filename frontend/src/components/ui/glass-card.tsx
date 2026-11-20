import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "solid" | "translucent";
  radius?: "xl" | "2xl" | "3xl";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = "default",
  radius = "2xl",
  ...props
}) => {
  const radiusClass = {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  }[radius];

  const variantClass = {
    default: "bg-white/85 backdrop-blur-xl border border-brand-oceanTeal/20 shadow-glass",
    solid: "bg-white border border-brand-seafoam/40 shadow-sm",
    translucent: "bg-white/60 backdrop-blur-md border border-brand-seafoam/25 shadow-sm",
  }[variant];

  return (
    <div
      className={cn(
        "p-6 transition-all duration-200",
        radiusClass,
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

