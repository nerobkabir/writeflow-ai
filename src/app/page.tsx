"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CountUp from "react-countup";
import {
  Cpu, Sparkles, FileText, Briefcase, Shield, BarChart3,
  Star, ChevronDown, Check, Loader2, ArrowRight, Zap,
  Lock, Globe, Users, TrendingUp, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const scaleInCard = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

const slideInLeft = {
  initial: { opacity: 0, x: -32 },
  animate: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 280, damping: 28 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isPremium: boolean;
  rating: number;
  usageCount: number;
  image: string;
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────

const TYPEWRITER_TEXT = "Absolute Authority.";

function HeroSection() {
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, i + 1));
        i++;
        if (i >= TYPEWRITER_TEXT.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 38);
      return () => clearInterval(interval);
    }, 240);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left column */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-[11px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
              Intelligence Pro 2.0
            </span>
          </motion.div>

          {/* H1 */}
          <motion.div variants={fadeInUp} custom={1} className="space-y-1">
            <h1 className="text-[44px] sm:text-[52px] lg:text-[56px] font-display font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
              Engineered for
            </h1>
            <h1 className="text-[44px] sm:text-[52px] lg:text-[56px] font-display font-light leading-[1.08] tracking-[-0.03em] text-foreground/70">
              {displayed}
              {!typingDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-0.5 h-[0.9em] bg-foreground/60 ml-0.5 align-middle"
                />
              )}
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p variants={fadeInUp} custom={2} className="text-[16px] text-muted-foreground leading-relaxed max-w-md">
            WriteFlow AI delivers institutional-grade content infrastructure — precision-engineered for professionals who refuse to compromise on quality, consistency, or control.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} custom={3} className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm"
              id="hero-init-workspace-btn"
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-foreground font-semibold text-[14px] hover:border-foreground active:scale-[0.98] transition-all duration-150"
              id="hero-demo-btn"
            >
              Request Technical Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Right column — floating dark card */}
        <motion.div
          variants={slideInLeft}
          initial="initial"
          animate="animate"
          className="hidden lg:flex items-center justify-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full max-w-[420px] rounded-2xl bg-[#000] border border-[#333] p-6 shadow-2xl relative overflow-hidden"
            style={{ boxShadow: "0 0 60px rgba(255,255,255,0.04) inset, 0 25px 60px rgba(0,0,0,0.5)" }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-2xl" />

            {/* Dashboard preview content */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">Live Output</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Processing
              </span>
            </div>

            {/* Mock content lines */}
            <div className="space-y-3 mb-5">
              {["Executive Briefing — Q4 Strategy", "Product Vision Statement", "Clinical Research Summary"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                    <FileText className="w-3 h-3 text-white/50" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold text-white/80 mb-1">{t}</div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-white/30 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${[88, 64, 42][i]}%` }}
                        transition={{ delay: 0.8 + i * 0.2, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini metrics grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Words", val: "12,840" },
                { label: "Quality", val: "98.4%" },
                { label: "Models", val: "GPT-4o" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-[14px] font-bold text-white">{val}</div>
                  <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTION 2: TECHNICAL CAPABILITIES ───────────────────────────────────────

const featureCards = [
  {
    title: "Pro Workspace",
    description: "A focused, distraction-free writing environment with AI assistance always one keystroke away.",
    icon: Zap,
    dark: true,
  },
  {
    title: "Vault Security",
    description: "Enterprise-grade encryption and data residency controls. Your content remains exclusively yours.",
    icon: Lock,
    dark: false,
  },
  {
    title: "Contextual Analytics",
    description: "Deep insights into your writing patterns, audience engagement, and content performance at a glance.",
    icon: BarChart3,
    dark: false,
  },
];

function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Technical Capabilities</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">
            Built for Precision<br />at Every Layer.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-4">
          {/* Large dark card — Semantic Architect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
            whileHover={{ y: -3 }}
            className="relative rounded-2xl bg-[#0A0A0A] dark:bg-[#111] border border-[#222] p-8 flex flex-col justify-between min-h-[380px] overflow-hidden group cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            <Cpu className="w-6 h-6 text-white/40 mb-6" />
            <div>
              <h3 className="text-[22px] font-display font-bold text-white mb-3">Semantic Architect</h3>
              <p className="text-[14px] text-white/50 leading-relaxed max-w-xs">
                Deep semantic understanding that maps intent to output. Every word is placed with structural intelligence, not probability alone.
              </p>
            </div>
            {/* Abstract grid decoration */}
            <div className="mt-6 grid grid-cols-6 gap-1 opacity-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded-full bg-white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, delay: i * 0.08, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right stacked cards */}
          <div className="flex flex-col gap-4">
            {featureCards.map(({ title, description, icon: Icon, dark }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 30 } }}
                className={cn(
                  "rounded-2xl border p-6 flex items-start gap-4 cursor-default",
                  dark
                    ? "bg-[#0A0A0A] dark:bg-[#111] border-[#222] text-white"
                    : "bg-surface border-border text-foreground"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                  dark ? "bg-white/10" : "bg-badge"
                )}>
                  <Icon className={cn("w-4 h-4", dark ? "text-white/70" : "text-muted-foreground")} />
                </div>
                <div>
                  <h3 className={cn("text-[15px] font-bold mb-1", dark ? "text-white" : "text-foreground")}>{title}</h3>
                  <p className={cn("text-[13px] leading-relaxed", dark ? "text-white/50" : "text-muted-foreground")}>{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3: HOW IT WORKS ──────────────────────────────────────────────────

const steps = [
  { num: "01", title: "Pick a Template", desc: "Browse our curated library of 50+ precision-engineered writing templates designed for every professional use case." },
  { num: "02", title: "Enter Your Topic", desc: "Provide your subject, tone, audience, and any specific requirements. The more context, the sharper the output." },
  { num: "03", title: "AI Generates Content", desc: "Our semantic engine processes your inputs through advanced language models, producing structured, high-quality content." },
  { num: "04", title: "Edit & Publish", desc: "Refine in our rich text editor, collaborate with your team, and publish directly to your platform of choice." },
];

function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="mb-16"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">How It Works</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">
            Four Steps to<br />Perfect Content.
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {steps.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-background p-8 flex flex-col gap-4"
            >
              <span className="text-[44px] font-display font-bold text-border leading-none">{num}</span>
              <h3 className="text-[16px] font-bold text-foreground">{title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4: POPULAR TEMPLATES ────────────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Cpu, Sparkles, FileText, Briefcase,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn("w-3 h-3", s <= Math.round(rating) ? "text-foreground fill-foreground" : "text-border")}
        />
      ))}
    </div>
  );
}

function TemplateSkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-3 animate-pulse">
      <div className="h-36 rounded-xl bg-border/50" />
      <div className="h-3 w-16 rounded bg-border/50" />
      <div className="h-4 w-3/4 rounded bg-border/50" />
      <div className="h-3 w-full rounded bg-border/50" />
      <div className="h-3 w-1/2 rounded bg-border/50" />
    </div>
  );
}

function TemplatesSection() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    fetch("/api/templates?featured=true")
      .then((r) => r.json())
      .then((data) => {
        const templateList = Array.isArray(data)
          ? data
          : (data.templates ?? data.data ?? []);
        setTemplates(templateList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Templates</span>
            <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">Popular Templates.</h2>
          </div>
          <Link href="/explore" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0">
            Browse all templates <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <TemplateSkeletonCard key={i} />)
            : templates.map((tpl, i) => {
              const Icon = iconMap[tpl.icon] || Sparkles;
              return (
                <motion.div
                  key={tpl.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 30 } }}
                  className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col group cursor-default"
                >
                  <div className="relative h-36 bg-badge overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {tpl.isPremium && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background uppercase tracking-wider">Pro</span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tpl.category}</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-foreground leading-snug">{tpl.name}</h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{tpl.description}</p>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <StarRating rating={tpl.rating} />
                      <span className="text-[11px] text-muted-foreground">{tpl.rating.toFixed(1)}</span>
                      <span className="text-[11px] text-border ml-auto">{(tpl.usageCount / 1000).toFixed(1)}k uses</span>
                    </div>
                    <Link
                      href={`/templates/${tpl.slug}`}
                      className="mt-2 text-[12px] font-semibold text-foreground hover:underline flex items-center gap-1"
                    >
                      Use Template <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              );
            })
          }
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5: PRICING ───────────────────────────────────────────────────────

const pricingTiers = [
  {
    name: "Writer Core",
    price: "$49",
    period: "/mo",
    description: "For individual professionals who need reliable, high-quality AI writing tools.",
    features: [
      "50,000 Words / Month",
      "Standard AI Models",
      "Document History",
      "3 Active Projects",
      "Email Support",
    ],
    cta: "Select Core",
    featured: false,
  },
  {
    name: "Intelligence Pro",
    price: "$129",
    period: "/mo",
    description: "For power users and teams who demand unlimited, institutional-grade performance.",
    badge: "MOST ADOPTED",
    features: [
      "Unlimited Generation",
      "Custom Brand Models",
      "Priority Compute Access",
      "API Connectivity",
      "Team Collaboration",
      "Advanced Analytics",
    ],
    cta: "Deploy Intelligence",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations requiring dedicated infrastructure, compliance, and support.",
    features: [
      "On-Premise Hosting",
      "Unlimited Team Seats",
      "Dedicated Support",
      "SLA Guarantee",
      "Custom Integrations",
      "Security Audits",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Pricing</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">Transparent, Scalable<br />Pricing Architecture.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingTiers.map(({ name, price, period, description, badge, features, cta, featured }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "rounded-2xl border p-8 flex flex-col relative",
                featured
                  ? "bg-[#0A0A0A] dark:bg-[#000] border-[#333] text-white"
                  : "bg-surface border-border text-foreground"
              )}
            >
              {badge && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black tracking-[0.14em] px-3 py-1 rounded-full bg-white text-black uppercase">
                  {badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className={cn("text-[15px] font-bold mb-1", featured ? "text-white" : "text-foreground")}>{name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={cn("text-[40px] font-display font-bold leading-none", featured ? "text-white" : "text-foreground")}>{price}</span>
                  <span className={cn("text-[15px]", featured ? "text-white/50" : "text-muted-foreground")}>{period}</span>
                </div>
                <p className={cn("text-[13px] leading-relaxed", featured ? "text-white/50" : "text-muted-foreground")}>{description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px]">
                    <Check className={cn("w-3.5 h-3.5 shrink-0", featured ? "text-white/70" : "text-foreground")} />
                    <span className={featured ? "text-white/70" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={name === "Enterprise" ? "/contact" : "/register"}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold text-[14px] text-center transition-all duration-150 hover:opacity-90 active:scale-[0.99]",
                  featured
                    ? "bg-white text-black"
                    : "border border-border hover:border-foreground bg-transparent text-foreground"
                )}
                id={`pricing-${name.toLowerCase().replace(" ", "-")}-btn`}
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6: STATISTICS ────────────────────────────────────────────────────

const stats = [
  { label: "Active Users", value: 10000, suffix: "+", prefix: "" },
  { label: "Words Generated", value: 500000, suffix: "+", prefix: "" },
  { label: "Satisfaction Rate", value: 98, suffix: "%", prefix: "" },
  { label: "Templates Available", value: 50, suffix: "+", prefix: "" },
];

function StatisticsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-[#0A0A0A] dark:bg-[#000] border-b border-[#222]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#222]">
          {stats.map(({ label, value, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-[#0A0A0A] dark:bg-[#000] px-8 py-10 text-center"
            >
              <div className="text-[44px] font-display font-bold text-white leading-none mb-2">
                {inView ? (
                  <CountUp end={value} duration={2} separator="," suffix={suffix} />
                ) : (
                  <span>0{suffix}</span>
                )}
              </div>
              <div className="text-[12px] text-white/40 font-semibold uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 7: TESTIMONIALS ──────────────────────────────────────────────────

const testimonials = [
  {
    quote: "WriteFlow AI has fundamentally changed how our team produces regulatory documentation. The precision and consistency are unmatched by any other tool we've tested.",
    name: "Dr. Sarah Chen",
    role: "Head of Medical Affairs",
    company: "BioTech Dynamics",
    initials: "SC",
  },
  {
    quote: "We deployed Intelligence Pro across 12 editorial teams. The semantic architecture understands our brand voice in a way that feels less like AI and more like a seasoned editor.",
    name: "Marcus Webb",
    role: "Editorial Director",
    company: "Meridian Publishing",
    initials: "MW",
  },
  {
    quote: "The enterprise infrastructure gave us everything we needed: on-premise deployment, audit logs, and content quality that actually meets our legal review standards.",
    name: "Alexandra Torres",
    role: "Chief Legal Officer",
    company: "Nexus Financial",
    initials: "AT",
  },
];

function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Testimonials</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">Trusted by Professionals<br />at Every Level.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(({ quote, name, role, company, initials }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="rounded-2xl border border-border bg-surface p-7 flex flex-col gap-5"
            >
              <p className="text-[14px] text-muted-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
              <div className="border-t border-border pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-foreground text-background text-[12px] font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-foreground">{name}</div>
                  <div className="text-[11px] text-muted-foreground">{role} · {company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: FAQ ───────────────────────────────────────────────────────────

const faqs = [
  { q: "What is WriteFlow AI?", a: "WriteFlow AI is an institutional-grade AI writing platform engineered for professionals who require precision, consistency, and control in their content operations. It combines advanced language models with a purpose-built writing environment." },
  { q: "How does the AI content generation work?", a: "Our semantic engine analyzes your inputs — topic, tone, audience, and constraints — then generates structured content through multiple AI model layers. Each output is optimized for coherence, accuracy, and alignment with your specified parameters." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest using AES-256. We operate under strict data residency controls and never use your content to train our models. Enterprise plans include dedicated on-premise deployment options." },
  { q: "Can I use WriteFlow AI for my team?", a: "Absolutely. Intelligence Pro supports collaborative workflows with shared workspaces, commenting, and version history. Enterprise plans provide unlimited team seats with fine-grained permissions and audit logging." },
  { q: "What content types does it support?", a: "WriteFlow AI supports over 50 content types including executive briefings, technical documentation, marketing copy, blog articles, regulatory submissions, legal summaries, research abstracts, and more." },
  { q: "How are tokens and usage calculated?", a: "Writer Core plans include 50,000 words per month. Intelligence Pro offers unlimited generation. Usage is calculated based on input and output character counts, with generous burst capacity during peak demand periods." },
  { q: "Can I cancel my subscription anytime?", a: "Yes. You can cancel at any time from your account settings. Your plan remains active until the end of your current billing period. No cancellation fees or lock-in contracts." },
  { q: "Is there a free trial?", a: "We offer a 7-day trial of Intelligence Pro for qualified professionals. Reach out via our contact form or request a technical demo to begin the evaluation process." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="text-center mb-14"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">FAQ</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight mt-2">Precision Answers<br />to Critical Questions.</h2>
        </motion.div>

        <div className="space-y-px border-t border-border">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                id={`faq-item-${i}`}
              >
                <span className="text-[14px] font-semibold text-foreground group-hover:text-foreground/80 transition-colors">{q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="text-[13px] text-muted-foreground leading-relaxed pb-5">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 9: NEWSLETTER ────────────────────────────────────────────────────

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type NewsletterInput = z.infer<typeof newsletterSchema>;

function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterInput) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="py-24 border-b border-border" ref={ref}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="space-y-4 mb-8"
        >
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Intelligence Briefing</span>
          <h2 className="text-[32px] sm:text-[40px] font-display font-bold tracking-tight">Stay Ahead of<br />the Curve.</h2>
          <p className="text-[14px] text-muted-foreground max-w-md mx-auto">
            Receive our weekly intelligence briefing — AI writing research, platform updates, and professional insights delivered with precision.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
                className="w-14 h-14 rounded-full bg-success-bg border border-success/30 flex items-center justify-center"
              >
                <CheckCircle2 className="w-7 h-7 text-success" />
              </motion.div>
              <p className="text-[15px] font-semibold text-foreground">You&apos;re subscribed.</p>
              <p className="text-[13px] text-muted-foreground">Your first briefing arrives next Monday.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-background text-[14px] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all",
                    errors.email ? "border-error focus:ring-error" : "border-border"
                  )}
                  {...register("email")}
                  id="newsletter-email-input"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-error mt-1.5 text-left"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-accent text-background font-semibold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0"
                id="newsletter-subscribe-btn"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── SECTION 10: FOOTER ───────────────────────────────────────────────────────

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.627 5.905-5.627zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const footerCols = [
  {
    label: "PRODUCT",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Templates", href: "/explore" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  {
    label: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    label: "RESOURCES",
    links: [
      { label: "Docs", href: "https://github.com" },
      { label: "Status", href: "#" },
    ],
  },
];

function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">
          {/* Left brand block */}
          <div className="space-y-4 max-w-xs">
            <div className="text-[15px] font-display font-bold tracking-tight text-foreground">WriteFlow AI</div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Precision engineering for professional content. Institutional-grade AI tools for teams that demand excellence.
            </p>
            <p className="text-[12px] text-muted-foreground/60">
              &copy; {new Date().getFullYear()} WriteFlow AI. All rights reserved.
            </p>
          </div>

          {/* Right link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerCols.map(({ label, links }) => (
              <div key={label} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground/60">{label}</h4>
                <ul className="space-y-2">
                  {links.map(({ label: lLabel, href }) => (
                    <li key={lLabel}>
                      <Link href={href} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150">
                        {lLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Social column */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground/60">SOCIAL</h4>
              <div className="flex flex-col gap-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                  <LinkedInIcon /> LinkedIn
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                  <XIcon /> X (Twitter)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-success"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              System Status: Operational
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">BUILD v2.4.8-PRO</span>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ASSEMBLY ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TemplatesSection />
        <PricingSection />
        <StatisticsSection />
        <TestimonialsSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <LandingFooter />
    </>
  );
}
