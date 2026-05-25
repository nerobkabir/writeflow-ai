"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 select-none group ${className}`}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-background font-bold text-lg transition-transform group-hover:scale-105 duration-200">
        <span className="font-display">W</span>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-surface animate-pulse" />
      </div>
      <span className="font-display font-bold tracking-tight text-[16px] text-foreground transition-colors group-hover:text-muted-foreground duration-200">
        WriteFlow<span className="text-muted-foreground font-medium">.AI</span>
      </span>
    </Link>
  );
}
export default Logo;
