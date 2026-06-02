"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  PenLine,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Home,
  LifeBuoy,
  Code2
} from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardAppSidebar } from "@/components/dashboard/DashboardAppSidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { UserAvatarMenu } from "@/components/dashboard/UserAvatarMenu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Writer", href: "/documents/new", icon: PenLine },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Analytics", href: "/dashboard", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/profile", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = /^\/documents\/[^/]+$/.test(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on path change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <ProtectedRoute>
      {isEditor ? (
        children
      ) : (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-background text-foreground">
          {/* Mobile Header */}
          <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface border-b border-border z-45 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open sidebar"
              className="p-2 -ml-2 rounded-lg hover:bg-badge text-foreground shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="font-bold text-[14px] tracking-tight uppercase">
              WriteFlow AI
            </Link>
            <div className="flex items-center shrink-0 min-w-[44px] min-h-[44px] justify-end">
              <UserAvatarMenu />
            </div>
          </header>

          {/* Desktop Sidebar */}
          <DashboardAppSidebar />

          {/* Mobile Drawer (Left Slide-in Sidebar) */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                  onClick={() => setDrawerOpen(false)}
                />
                
                {/* Drawer Menu */}
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-surface border-r border-border md:hidden flex flex-col h-screen overflow-hidden shadow-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
                    <div>
                      <p className="text-[15px] font-bold tracking-tight">WriteFlow AI</p>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                        Intelligence Pro
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      aria-label="Close sidebar"
                      className="p-2 -mr-2 rounded-lg hover:bg-badge text-muted-foreground hover:text-foreground flex items-center justify-center min-h-[44px] min-w-[44px]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Create New Document Button */}
                  <div className="px-4 pt-4 pb-2 shrink-0">
                    <Link
                      href="/documents/new"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-background text-[12px] font-bold rounded-lg hover:opacity-90 transition-opacity min-h-[44px]"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>Create New</span>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 space-y-1 py-4 px-3 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                      const active =
                        href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname === href || pathname.startsWith(`${href}/`);

                      return (
                        <Link
                          key={href + label}
                          href={href}
                          className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] font-medium transition-colors min-h-[44px] ${
                            active
                              ? "bg-badge text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5 shrink-0" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Footer Support/API and User Avatar */}
                  <div className="shrink-0 space-y-4 border-t border-border py-4 px-4 bg-badge/5">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground min-h-[44px]"
                    >
                      <Home className="h-4.5 w-4.5 shrink-0" />
                      <span>Home</span>
                    </Link>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground px-3">
                      <Link
                        href="/contact"
                        className="flex items-center gap-1 hover:text-foreground transition-colors py-2 min-h-[44px]"
                      >
                        <LifeBuoy className="h-3.5 w-3.5 shrink-0" />
                        <span>Support</span>
                      </Link>
                      <span className="text-border">|</span>
                      <Link
                        href="/explore"
                        className="flex items-center gap-1 hover:text-foreground transition-colors py-2 min-h-[44px]"
                      >
                        <Code2 className="h-3.5 w-3.5 shrink-0" />
                        <span>API</span>
                      </Link>
                    </div>

                    <div className="pt-2">
                      <UserAvatarMenu />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content wrapper */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0">
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-20 md:pb-10">
              {children}
            </main>
          </div>
          <MobileBottomNav />
        </div>
      )}
    </ProtectedRoute>
  );
}
