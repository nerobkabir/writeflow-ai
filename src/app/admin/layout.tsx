"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  BarChart3,
  Users,
  LayoutTemplate,
  Star,
  Settings,
  LogOut,
  Shield,
  ChevronLeft
} from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AdminSidebar } from "@/components/shared/AdminSidebar";

const adminNav = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
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

  const initials = session?.user?.name?.[0]?.toUpperCase() || "A";

  return (
    <ProtectedRoute requireAdmin>
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-background text-foreground">
        
        {/* Mobile Header (Fixed Top) */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-border z-45 flex items-center justify-between px-4 text-white">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open admin sidebar"
            className="p-2 -ml-2 rounded-lg hover:bg-neutral-800 text-white shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 font-bold text-[14px] tracking-tight uppercase">
            <span>WriteFlow AI</span>
            <span className="text-[9px] font-semibold tracking-wider text-black bg-white px-1 py-0.5 rounded shrink-0">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-neutral-800 text-white shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
            </button>
            <div className="w-7 h-7 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
          </div>
        </header>

        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Mobile Drawer (Left Slide-in Sidebar) */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              
              {/* Drawer Menu Container */}
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-surface border-r border-border md:hidden flex flex-col h-screen overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold tracking-tight">WriteFlow AI</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-background bg-accent px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close admin sidebar"
                    className="p-2 -mr-2 rounded-lg hover:bg-badge text-muted-foreground hover:text-foreground flex items-center justify-center min-h-[44px] min-w-[44px]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Admin Panel
                    </p>
                  </div>
                  {adminNav.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] font-medium transition-all duration-150 min-h-[44px] ${
                          active
                            ? "bg-badge text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-badge"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        <span>{label}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
                      </Link>
                    );
                  })}

                  <div className="border-t border-border my-3" />
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-badge transition-all duration-150 min-h-[44px]"
                  >
                    <ChevronLeft className="w-4.5 h-4.5 shrink-0" />
                    <span>Back to App</span>
                  </Link>
                </nav>

                {/* Footer User Profile & Sign Out */}
                <div className="px-4 py-4 border-t border-border shrink-0 bg-badge/5">
                  {session && (
                    <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-accent text-background text-[11px] font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-foreground truncate">{session.user?.name}</p>
                        <p className="text-[11px] text-muted-foreground">Administrator</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-error hover:bg-error-bg transition-all duration-150 min-h-[44px]"
                  >
                    <LogOut className="w-4.5 h-4.5 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Wrapper */}
        <div className="flex-grow flex flex-col min-w-0 overflow-hidden pt-14 md:pt-0">
          <main className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
