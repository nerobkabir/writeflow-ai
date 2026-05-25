"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  BarChart3, Users, LayoutTemplate, Star, Settings,
  LogOut, Shield, ChevronLeft
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Manage Templates", href: "/admin/templates", icon: LayoutTemplate },
  { label: "Manage Reviews", href: "/admin/reviews", icon: Star },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex flex-col w-60 h-screen bg-surface border-r border-border shrink-0">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border shrink-0">
        <Logo />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-background bg-accent px-1.5 py-0.5 rounded-md ml-1">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-badge text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-badge"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </Link>
          );
        })}

        <div className="border-t border-border my-3" />
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-badge transition-all duration-150"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to App
        </Link>
      </nav>

      <div className="px-3 py-4 border-t border-border shrink-0">
        {session && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-accent text-background text-[11px] font-bold flex items-center justify-center shrink-0">
              {session.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-foreground truncate">{session.user?.name}</p>
              <p className="text-[11px] text-muted-foreground">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-error hover:bg-error-bg transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
