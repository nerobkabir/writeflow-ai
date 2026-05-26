"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles, LogOut, LayoutDashboard, User, Bell, Settings, FileText } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

// Scale in animation specific to top-right corner origin
const dropdownScaleIn = {
  initial: { opacity: 0, scale: 0.92, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.92, y: -4, transition: { duration: 0.12, ease: "easeIn" as const } },
};

// Slide down mobile overlay variant
const mobileMenuSlideDown = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const userRole = (session?.user as any)?.role;
  const isLoggedIn = !!session;

  const currentNavLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Documents", href: "/dashboard/documents" },
        { label: "Explore", href: "/explore" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ]
    : [
        { label: "Solutions", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Enterprise", href: "/#pricing" },
        { label: "Docs", href: "https://github.com" },
      ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 bg-background/0",
        scrolled
          ? "bg-surface/80 backdrop-blur-md border-b border-border shadow-sm"
          : "border-b border-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo left */}
        <Logo />

        {/* Center navigation links */}
        <ul className="hidden md:flex items-center gap-1.5">
          {currentNavLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150",
                  pathname === link.href
                    ? "text-foreground bg-badge"
                    : "text-muted-foreground hover:text-foreground hover:bg-badge/50"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="w-16 h-8 rounded-lg bg-border/40 animate-pulse" />
          ) : session ? (
            /* Logged-in view */
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button
                className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Notifications"
                id="navbar-notifications-btn"
              >
                <Bell className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:border-accent transition-all duration-150"
                  aria-expanded={userMenuOpen}
                  id="user-menu-btn"
                >
                  <span className="w-6 h-6 rounded-full bg-accent text-background text-[10px] font-bold flex items-center justify-center shrink-0">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-150", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={dropdownScaleIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ transformOrigin: "top right" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="p-2 space-y-0.5">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-foreground hover:bg-badge transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          My Profile
                        </Link>
                        <Link
                          href="/documents"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-foreground hover:bg-badge transition-colors"
                        >
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          My Documents
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-foreground hover:bg-badge transition-colors"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          Settings
                        </Link>
                        {userRole === "ADMIN" && (
                          <Link
                            href="/admin/analytics"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-foreground hover:bg-badge transition-colors"
                          >
                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-error hover:bg-error-bg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Logged-out view */
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-accent text-background border border-accent hover:opacity-90 transition-opacity duration-150 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Hamburger toggle button */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile full-height slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuSlideDown}
            initial="initial"
            animate="animate"
            exit="exit"
            className="md:hidden border-t border-border bg-surface overflow-hidden px-4 py-4 space-y-1 z-40"
          >
            {currentNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-[14px] font-semibold text-foreground hover:bg-badge transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-2 space-y-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2.5 rounded-lg text-[14px] font-semibold text-foreground hover:bg-badge"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-semibold text-error hover:bg-error-bg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2.5 rounded-lg text-[14px] font-semibold text-foreground hover:bg-badge text-center border border-border"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2.5 rounded-lg text-[14px] font-semibold bg-accent text-background text-center hover:opacity-90"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
