"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, MessageSquare, Zap, Shield, BarChart3 } from "lucide-react";
import { fadeInUp, stagger } from "@/lib/animations";

const features = [
  {
    icon: Sparkles,
    title: "AI Content Generation",
    description:
      "Generate blog posts, emails, landing pages, and ad copy in seconds with Claude-powered AI that understands your brand voice.",
    color: "text-accent",
    bgColor: "bg-badge",
  },
  {
    icon: RefreshCw,
    title: "Smart Rewriting",
    description:
      "Select any text and instantly make it shorter, longer, more formal, or casual. Four powerful modes, one click.",
    color: "text-success",
    bgColor: "bg-success-bg",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description:
      "Have a real conversation with your AI writing coach. Ask questions, brainstorm ideas, or get instant feedback.",
    color: "text-accent",
    bgColor: "bg-badge",
  },
  {
    icon: Zap,
    title: "50+ Templates",
    description:
      "Start with proven templates for every use case — product descriptions, LinkedIn posts, press releases, and more.",
    color: "text-warning",
    bgColor: "bg-warning-bg",
  },
  {
    icon: Shield,
    title: "Auto-Save & History",
    description:
      "Never lose your work. Automatic saving every few seconds with complete version history at your fingertips.",
    color: "text-success",
    bgColor: "bg-success-bg",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track your writing productivity with detailed insights — words generated, time saved, and content performance.",
    color: "text-accent",
    bgColor: "bg-badge",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16 space-y-4"
        >
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Everything you need
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-[32px] font-bold tracking-tight text-foreground">
            Built for serious writers
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[16px] text-muted-foreground max-w-xl mx-auto">
            Every feature is designed to remove friction from your workflow and keep you in your creative flow state.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="premium-card space-y-4 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default Features;
