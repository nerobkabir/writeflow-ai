"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FadeInUp } from "@/components/animations/FadeInUp";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "use-service", title: "2. Use of Service" },
  { id: "account-resp", title: "3. Account Responsibilities" },
  { id: "ai-content", title: "4. AI-Generated Content" },
  { id: "intellectual-prop", title: "5. Intellectual Property" },
  { id: "payments-refunds", title: "6. Payments and Refunds" },
  { id: "termination", title: "7. Termination" },
  { id: "limitation-liab", title: "8. Limitation of Liability" },
  { id: "changes-terms", title: "9. Changes to Terms" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Block */}
        <div className="border-b border-border/60 pb-8 mb-12 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted bg-badge px-3 py-1.5 rounded-full border border-border/40 w-fit">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-foreground pt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: May 26, 2026
          </p>
        </div>

        {/* 2-column Desktop layout with sticky sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sticky Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 border-r border-border/60 pr-6 space-y-4">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left block py-2 px-3 text-[12.5px] rounded-lg transition-all ${
                      isActive
                        ? "bg-badge text-foreground font-bold border-l-2 border-accent pl-2.5"
                        : "text-muted-foreground hover:text-foreground hover:bg-badge/40"
                    }`}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Content Column */}
          <div className="lg:col-span-9 space-y-12">
            <FadeInUp className="space-y-4" id={sections[0].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[0].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                Welcome to WriteFlow AI. By registering an account, purchasing a subscription (FREE, PRO, TEAM), or using our AI writing templates, you explicitly agree to compile and align with these Terms & Conditions. If you do not accept these terms in full, you must immediately terminate use of our platform.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[1].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[1].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                We grant you a non-exclusive, non-transferable, revocable license to access our platform under active billing limits:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                <li>You agree not to reverse-engineer our TipTap workspace plugins or bypass template rating structures.</li>
                <li>You may not use WriteFlow AI to automatically generate malicious scripts, systemic spam, or highly deceptive advertising copy.</li>
                <li>Any attempts to abuse the AI writing API endpoints via continuous scripting or headless scraping will trigger security locks.</li>
              </ul>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[2].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[2].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                To access document editors and templates, you must establish an account:
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                You are responsible for safeguarding your credentials (including NextAuth OAuth sessions). If our security telemetry registers compromised access patterns, we reserve the right to temporarily lock your account to secure user documents.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[3].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[3].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                Our templates leverage Google Gemini and Anthropic Claude models to synthesize technical summaries, expand copy, and re-write tones:
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                While our systems utilize high-fidelity constraints, AI-generated outputs can occasionally contain inaccuracies. You assume complete responsibility for reviewing, validating, and editing all AI-generated content before publishing or presenting it in professional, clinical, or financial contexts.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[4].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[4].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                <strong>Your Content:</strong> You retain full intellectual property ownership of all custom documents, input prompts, and generated text drafts created inside your workspace. WriteFlow AI does not claim ownership over your files.
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                <strong>Our Platform:</strong> All pre-engineered templates, custom workspace components, branding logos, design tokens, and frontend software code remain the exclusive property of WriteFlow AI.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[5].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[5].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                Premium subscription upgrades (PRO, TEAM) are processed securely through Stripe under active billing frequencies. Subscriptions auto-renew until cancelled via your customer portal. All payments are non-refundable unless specified otherwise by Stripe operations or where mandated by regional consumer regulations.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[6].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[6].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                Administrators reserve the right to suspend or permanently ban users who breach these terms or abuse API resources. Banned users are locked out of all dashboard pages instantly, and billing subscription records are cancelled.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[7].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[7].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                WriteFlow AI is provided on an "as-is" and "as-available" basis:
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages, including loss of revenue, data corruptions, or generation errors resulting from system outages or model API downtime.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[8].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[8].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                We reserve the right to update these terms at any time. When updates occur, we will adjust the "Last Updated" date at the top. Continual use of the dashboard after modifications constitutes full acceptance of the revised Terms & Conditions.
              </p>
            </FadeInUp>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
