"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, User, History, ChevronLeft,
  ChevronRight, LogOut, Plus, Home
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Documents", href: "/documents", icon: FileText },
  { label: "Profile", href: "/profile", icon: User },
  { label: "AI Usage History", href: "/usage", icon: History },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-screen bg-surface border-r border-border shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
        {!collapsed && <Logo />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-background hover:border-accent text-muted-foreground hover:text-foreground transition-all duration-150 shrink-0",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="sidebar-collapse-btn"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* New Document CTA */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <Link
          href="/documents/new"
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-accent text-background font-semibold text-[13px] transition-all duration-150 hover:opacity-90",
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          )}
          id="new-document-btn"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Document</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
            Workspace
          </p>
        )}
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-150",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                active
                  ? "bg-badge text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-badge"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="px-3 py-4 border-t border-border space-y-1 shrink-0">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-badge",
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          )}
          title={collapsed ? "Home" : undefined}
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>

        {session && (
          <div
            className={cn(
              "flex items-center gap-2.5 px-2 py-2 rounded-xl",
              collapsed && "justify-center"
            )}
          >
            <div className="w-7 h-7 rounded-full bg-accent text-background text-[11px] font-bold flex items-center justify-center shrink-0">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-foreground truncate">{session.user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "w-full flex items-center gap-2.5 text-[13px] font-medium text-muted-foreground hover:text-error hover:bg-error-bg rounded-xl transition-all duration-150",
            collapsed ? "justify-center p-2.5" : "px-3 py-2"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export default DashboardSidebar;
