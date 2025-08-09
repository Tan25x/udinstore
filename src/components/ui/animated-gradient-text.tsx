'use client';

import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";
 
export const AnimatedGradientText = React.forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
  }
>(({ children, className }, ref) => {
  return (
    <div
      className={cn(
        "group relative flex max-w-fit flex-row items-center justify-center rounded-2xl bg-primary/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-black/5",
        className,
      )}
      ref={ref}
    >
      <div
        className={cn(
          `absolute inset-0 block h-full w-full animate-gradient-background-1 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-100 blur-xl transition-all duration-1000 group-hover:opacity-100 group-hover:blur-2xl`,
        )}
      />
      <div className={cn("relative z-10")}>{children}</div>
    </div>
  );
});

AnimatedGradientText.displayName = "AnimatedGradientText";
