"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative font-bold text-3xl", className)}>
      <div className="flex">
        <div className="relative">
          <span className="absolute -top-0.5 -left-0.5 text-gray-700">U</span>
          <span className="relative z-10 text-gray-400">U</span>
        </div>
        <div className="relative">
          <span className="absolute -top-0.5 -left-0.5 text-gray-700">T</span>
          <span className="relative z-10 text-gray-300">T</span>
        </div>
        <div className="relative">
          <span className="absolute -top-0.5 -left-0.5 text-gray-700">A</span>
          <span className="relative z-10 text-gray-100">A</span>
        </div>
      </div>
    </div>
  );
}
