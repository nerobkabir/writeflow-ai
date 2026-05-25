"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, LayoutDashboard, ArrowLeft } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Logo } from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground selection:bg-accent selection:text-background relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shrink-0 z-10">
        <Logo />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <FadeInUp className="w-full max-w-lg text-center" delay={0.1}>
          {/* Animated 404 SVG Illustration */}
          <div className="relative w-full max-w-xs mx-auto mb-8 flex justify-center">
            <svg
              className="w-full aspect-[4/3] text-foreground opacity-90 max-h-[180px]"
              viewBox="0 0 240 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="font-display font-bold fill-current"
                style={{ fontSize: "72px", letterSpacing: "-0.05em" }}
              >
                404
              </text>
              <path
                d="M30 140 H210"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-20"
              />
              <path
                d="M90 140 C90 130, 110 110, 120 110 C130 110, 150 130, 150 140"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-40"
              />
              <circle cx="120" cy="95" r="3" className="fill-current opacity-60" />
            </svg>
          </div>

          <h1 className="text-[32px] sm:text-[48px] font-display font-bold leading-tight tracking-tight mb-4">
            Lost in Space
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-md mx-auto mb-10">
            The page you are looking for has flown away, been renamed, or never existed. Let&apos;s get you back into your creative flow.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] bg-accent text-background border border-accent hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm"
              id="notfound-dashboard-btn"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] bg-surface text-foreground border border-border hover:border-accent active:scale-[0.98] transition-all duration-150"
              id="notfound-home-btn"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </FadeInUp>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-border/50 shrink-0 z-10">
        <p className="text-[13px] text-muted-foreground">
          &copy; {new Date().getFullYear()} WriteFlow AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
