"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,0,0,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.06),transparent)]"
      />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Badge */}
        <motion.div variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-badge text-[12px] font-semibold text-muted-foreground">
            <Zap className="w-3 h-3 text-accent" />
            Powered by Claude AI · New templates every week
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-[clamp(36px,6vw,64px)] font-bold tracking-tight text-foreground leading-[1.1]"
        >
          Write smarter.
          <br />
          <span className="text-muted-foreground">Ship faster.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeInUp}
          className="text-[18px] text-muted-foreground leading-relaxed max-w-xl mx-auto"
        >
          WriteFlow AI gives teams an intelligent writing workspace — generate first drafts,
          rewrite in any tone, and refine copy with a single click.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            id="hero-cta-primary"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background font-semibold text-[15px] hover:opacity-90 transition-opacity duration-150"
          >
            <Sparkles className="w-4 h-4" />
            Start Writing Free
          </Link>
          <Link
            href="/explore"
            id="hero-cta-secondary"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-foreground font-semibold text-[15px] hover:border-accent transition-colors duration-150"
          >
            Browse Templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p variants={fadeInUp} className="text-[13px] text-muted-foreground pt-1">
          No credit card required · 10,000 words free every month
        </motion.p>
      </motion.div>

      {/* Hero visual */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-16 w-full max-w-4xl mx-auto"
      >
        <div className="premium-card !p-0 overflow-hidden">
          {/* Editor chrome bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-badge/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="flex-1 mx-4 h-5 rounded-md bg-border/60 max-w-xs" />
            <span className="text-[11px] font-medium text-muted-foreground ml-auto">Auto-saved</span>
          </div>
          {/* Editor body mockup */}
          <div className="grid grid-cols-3 min-h-[280px] sm:min-h-[320px]">
            <div className="col-span-2 p-6 space-y-3 border-r border-border">
              <div className="h-7 rounded-lg bg-border/40 w-2/3" />
              <div className="space-y-2 pt-2">
                {[100, 90, 95, 70, 85].map((w, i) => (
                  <div key={i} className="h-4 rounded bg-border/30" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-4">
                <div className="h-8 w-28 rounded-lg bg-accent/10 border border-accent/20" />
                <div className="h-8 w-20 rounded-lg bg-border/40" />
              </div>
            </div>
            <div className="p-4 bg-badge/30 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI Assistant</p>
              {["Shorten", "Make formal", "Expand ideas", "Fix grammar"].map((action) => (
                <div
                  key={action}
                  className="px-3 py-2 rounded-lg border border-border bg-surface text-[12px] text-foreground cursor-pointer hover:border-accent transition-colors"
                >
                  {action}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
export default Hero;
