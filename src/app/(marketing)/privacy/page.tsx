"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FadeInUp } from "@/components/animations/FadeInUp";

const sections = [
  { id: "info-collect", title: "1. Information We Collect" },
  { id: "use-info", title: "2. How We Use Your Information" },
  { id: "storage-security", title: "3. Data Storage and Security" },
  { id: "third-party", title: "4. Third-Party Services" },
  { id: "your-rights", title: "5. Your Rights" },
  { id: "cookie-policy", title: "6. Cookie Policy" },
  { id: "contact-us", title: "7. Contact Us" },
];

export default function PrivacyPage() {
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
            Legal Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-foreground pt-1">
            Privacy Policy
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
                At WriteFlow AI, we collect different layers of information to power our generative platform and secure user accounts:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                <li>
                  <strong>Account Identification:</strong> Standard names, active emails, profile avatars, and bcrypt-hashed passwords for credentials.
                </li>
                <li>
                  <strong>Telemetry Metrics:</strong> Device contexts, IP addresses, system operating models, browser agents, and timestamps.
                </li>
                <li>
                  <strong>Generation History:</strong> Logs of token sizes, AI agent usage types (Draft, Rewrite, Chat, Summarise), response durations, and prompt variables strictly used to track usage and billing limits.
                </li>
              </ul>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[1].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[1].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                We strictly use your information to operate, optimize, and secure WriteFlow AI:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                <li>Providing custom copywriting templates and responsive TipTap workspace editors.</li>
                <li>Processing payments, subscription plan limits (FREE, PRO, TEAM), and generating usage invoice reports.</li>
                <li>Monitoring platform reliability, system status, and tracking database errors to maintain our 99.8% operational level.</li>
                <li>Enforcing account safety parameters and executing ban notifications for suspicious automation checks.</li>
              </ul>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[2].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[2].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                Your data security is managed under premium multi-tenant protocols:
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                We leverage secure Supabase PostgreSQL databases and enforce row-level security policies (RLS). All user sessions are authenticated via JWT tokens under secure NextAuth schemas. Prompts and documents generated are encrypted in transit via SSL/TLS and at rest using standard AES-256 protocols.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[3].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[3].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                To power advanced AI reasoning and subscription payments, we connect securely with vetted third-party modules:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                <li><strong>AI Reasoning Engines:</strong> Google Gemini API and Anthropic Claude systems securely evaluate prompts and generate draft templates. Vetted endpoints do not use user documents for model training.</li>
                <li><strong>Payment Systems:</strong> Stripe processes licensing credentials and manages active subscriptions. We do not store credit card metrics on our servers.</li>
              </ul>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[4].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[4].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                You have absolute control over your digital footprint on WriteFlow AI:
              </p>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                You have the right to request access to your stored records, export your documents, update your bio/profile, or permanently delete your account. Deleting an account triggers a cascading database purge, erasing all associated accounts, session states, usage history, and stored document drafts from our active Supabase cluster.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[5].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[5].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                We use high-fidelity browser cookies to maintain active login states and dark/light system theme variables. Theme cookies are stored client-side and do not contain personal identifiers, satisfying standard cookie privacy regulations.
              </p>
            </FadeInUp>

            <FadeInUp className="space-y-4" id={sections[6].id}>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {sections[6].title}
              </h2>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed leading-normal">
                For questions regarding data processing or RLS access, submit a secure form through our <a href="/contact" className="text-accent font-semibold hover:underline">Contact Page</a> or reach out directly via email at <a href="mailto:hello@writeflow.ai" className="text-foreground font-semibold hover:text-accent">hello@writeflow.ai</a>.
              </p>
            </FadeInUp>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
