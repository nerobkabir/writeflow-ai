"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthVisuals } from "./AuthVisuals";

type AuthShellProps = {
  mode: "login" | "register";
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ mode, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      {/* Left Column: Form Container */}
      <main className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-surface h-screen overflow-y-auto relative z-10">
        {/* Upper Brand & Theme Row */}
        <div className="flex items-center justify-between pb-4 shrink-0">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Middle Form Panel */}
        <div className="my-auto py-4 max-w-[400px] w-full mx-auto shrink-0">
          {/* Header titles with slide-up animations */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 space-y-2 border-b border-border pb-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {mode === "login" ? "SECURE AUTHORIZATION" : "WORKSPACE INITIALIZATION"}
            </span>
            <h2 className="font-display text-[24px] sm:text-[28px] font-extrabold tracking-tight text-foreground leading-tight">
              {title}
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* Form Children container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>

          {/* Form Footer */}
          {footer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 border-t border-border pt-4"
            >
              {footer}
            </motion.div>
          )}
        </div>

        {/* Balanced spacer for perfect vertical form centering (replacing removed copyright footer) */}
        <div className="h-10 shrink-0" />
      </main>

      {/* Right Column: Cybernetic Simulation (Hidden on small viewports) */}
      <section className="h-screen hidden lg:flex lg:w-1/2 flex-col justify-center bg-[#050505] border-l border-border/10">
        <AuthVisuals initialMode={mode} />
      </section>
    </div>
  );
}

/** Shared auth field styles — matches dashboard / landing */
export const authInputClass = (hasError?: boolean) =>
  `w-full border bg-background px-3.5 py-3 text-[13.5px] rounded-lg outline-none transition-all duration-200 focus:ring-1 focus:ring-foreground focus:border-foreground ${
    hasError 
      ? "border-error focus:border-error focus:ring-error text-error bg-error-bg/5" 
      : "border-border hover:border-neutral-400 focus:hover:border-foreground"
  }`;

export const authLabelClass =
  "block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground select-none";

