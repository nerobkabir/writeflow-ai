"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, LayoutTemplate, Sparkles, Download } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/animations";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up for free in under 30 seconds. No credit card required. Start with 10,000 free words every month.",
  },
  {
    step: "02",
    icon: LayoutTemplate,
    title: "Pick a template",
    description: "Browse 50+ expert-crafted templates. From product descriptions to long-form blog posts — pick your starting point.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Generate with AI",
    description: "Describe your content goals and let Claude AI generate a polished draft. Refine it with one-click rewriting tools.",
  },
  {
    step: "04",
    icon: Download,
    title: "Export & ship",
    description: "Copy your finished content, export to Markdown, or integrate with your publishing workflow. Done.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-badge/30 dark:bg-badge/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16 space-y-4"
        >
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Simple by design
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-[32px] font-bold tracking-tight text-foreground">
            From idea to published in 4 steps
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative"
        >
          {/* connector line */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(25%+24px)] right-[calc(25%+24px)] h-px bg-border" aria-hidden />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeInUp}
              className="premium-card space-y-4 text-center relative"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-border flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-background text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default HowItWorks;
