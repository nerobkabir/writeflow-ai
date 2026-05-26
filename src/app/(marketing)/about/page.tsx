"use client";

import React from "react";
import Link from "next/link";
import { Shield, EyeOff, Zap, Users, Calendar } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FadeInUp } from "@/components/animations/FadeInUp";

const teamMembers = [
  {
    name: "Alexander Mercer",
    role: "Chief Executive Officer & Founder",
    bio: "Horological enthusiast and system designer. Previously engineered quantitative analysis pipelines.",
    initials: "AM",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Chief Scientist & AI Director",
    bio: "Ph.D. in Computational Linguistics. Leads the context validation and prompt engineering frameworks.",
    initials: "SC",
  },
  {
    name: "Marcus Vance",
    role: "Head of Product Design",
    bio: "Passionate about minimalist user experiences. Former lead designer at several high-performance SaaS startups.",
    initials: "MV",
  },
  {
    name: "Elena Rostova",
    role: "Director of Systems Engineering",
    bio: "Infrastructure architect specializing in sub-millisecond API response pipelines and secure database layers.",
    initials: "ER",
  },
];

const values = [
  {
    icon: Shield,
    title: "Precision",
    description: "Every template is engineered to provide analytically accurate, context-aware output tailored perfectly to your brand frequency.",
  },
  {
    icon: EyeOff,
    title: "Privacy",
    description: "Your intellectual property is absolute. We do not store sensitive prompts, and data is locked under secure multi-tenant protocols.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Experience immediate generation speeds and frictionless tip-tap edits. Built to execute at the speed of human reasoning.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Section 1: Hero */}
        <FadeInUp className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-badge px-3 py-1.5 rounded-full border border-border/40">
            About Our Organization
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-foreground pt-2">
            Built for the future of professional content
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            WriteFlow AI was established to solve the core friction points of enterprise communication. We design high-fidelity AI tools enabling creators and operators to write with speed, strict structural accuracy, and perfect brand coherence.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-badge border border-border/45 px-3 py-1 text-xs font-bold text-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Founded 2024
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-badge border border-border/45 px-3 py-1 text-xs font-bold text-foreground">
              <Users className="w-3.5 h-3.5" />
              10,000+ Users
            </span>
          </div>
        </FadeInUp>

        {/* Section 2: Mission */}
        <FadeInUp className="border border-border bg-surface rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-accent/2 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent">
                Our Purpose
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                The Mission
              </h2>
            </div>
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm sm:text-[14.5px] leading-relaxed">
                We believe that modern AI should empower, not replace, human intelligence. WriteFlow AI bridges this divide by delivering structured, pre-engineered prompt workflows and micro-refinement editors. By putting precise controls in the hands of users, we remove the guesswork from generation, delivering predictable and premium professional content at scale.
              </p>
            </div>
          </div>
        </FadeInUp>

        {/* Section 3: Team */}
        <div className="space-y-8">
          <FadeInUp className="text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              Meet the Visionaries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Our Core Team
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              A harmonic collaboration between software architects and AI researchers.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <FadeInUp
                key={member.name}
                delay={index * 0.05}
                className="border border-border bg-surface rounded-xl p-5 space-y-4 hover:border-accent hover:shadow-md transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-foreground text-background text-sm font-bold flex items-center justify-center select-none shadow-sm">
                  {member.initials}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[14px] leading-tight text-foreground">{member.name}</h3>
                  <p className="text-[10.5px] font-bold text-accent uppercase tracking-wide">{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed leading-normal line-clamp-4">
                  {member.bio}
                </p>
              </FadeInUp>
            ))}
          </div>
        </div>

        {/* Section 4: Values */}
        <div className="space-y-8">
          <FadeInUp className="text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              What Defines Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Core Principles
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Our values are built directly into the codebase and engineering operations.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, index) => {
              const Icon = val.icon;
              return (
                <FadeInUp
                  key={val.title}
                  delay={index * 0.08}
                  className="border border-border bg-surface rounded-xl p-6 space-y-4 hover:shadow-sm"
                >
                  <div className="h-10 w-10 bg-accent/5 border border-accent/10 rounded-lg flex items-center justify-center text-accent shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-[15px] text-foreground">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed leading-normal">
                      {val.description}
                    </p>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        </div>

        {/* Section 5: CTA */}
        <FadeInUp className="border border-border bg-surface rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-badge/5 to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground max-w-lg mx-auto leading-none">
            Ready to transform your writing workflow?
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Initialize your pre-configured dashboard workspace and deploy Swiss-precision copywriting templates in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-foreground hover:bg-foreground/90 text-background text-xs font-bold rounded-xl transition-all duration-200 shadow-sm"
            >
              Get Started Free →
            </Link>
          </div>
        </FadeInUp>
      </main>

      <Footer />
    </div>
  );
}
