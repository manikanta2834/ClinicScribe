import React from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-full gap-2",
    lg: "px-7 py-3.5 text-base rounded-full gap-2.5",
  }[size];

  const variantClasses = {
    primary:
      "bg-brand-evergreen hover:bg-brand-deepTeal text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-brand-mint hover:bg-brand-oceanTeal text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]",
    outline:
      "bg-white/80 hover:bg-white text-brand-evergreen border border-brand-oceanTeal/30 font-medium transition-all duration-200 active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-brand-seafoam/30 text-brand-evergreen font-medium transition-colors duration-200",
  }[variant];

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center select-none cursor-pointer",
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

