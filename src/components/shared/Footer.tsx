"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

// Minimal inline SVGs
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const footerCols = [
  {
    label: "PRODUCT",
    links: [
      { label: "Features", href: "/explore" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Templates", href: "/explore" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  {
    label: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    label: "RESOURCES",
    links: [
      { label: "Docs", href: "/blog" },
      { label: "Status", href: "https://status.writeflow.ai", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left brand side */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              Precision engineering for professional content.
            </p>
            <p className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} WriteFlow AI. All rights reserved.
            </p>
          </div>

          {/* Right links side */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerCols.map((col) => (
              <div key={col.label} className="space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider text-foreground">
                  {col.label}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social column */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold tracking-wider text-foreground">
                SOCIAL
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <TwitterIcon className="w-3.5 h-3.5" />
                    <span>X (Twitter)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-foreground tracking-wider uppercase">
              SYSTEM STATUS: OPERATIONAL
            </span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground tracking-wider">
            BUILD v2.4.8-PRO
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
