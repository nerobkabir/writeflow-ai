"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PenLine,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Code2,
  LifeBuoy,
} from "lucide-react";
import { UserAvatarMenu } from "@/components/dashboard/UserAvatarMenu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Writer", href: "/documents/new", icon: PenLine },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Analytics", href: "/dashboard", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/profile", icon: Settings },
];

export function DashboardAppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 h-screen border-r border-border bg-surface">
      <div className="px-5 pt-6 pb-4 border-b border-border">
        <p className="text-[15px] font-bold tracking-tight">WriteFlow AI</p>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
          Intelligence Pro
        </p>
        <Link
          href="/documents/new"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-[12px] font-bold hover:border-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href + label}
              href={href}
              className={cn(
                "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                active ? "text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="dashboardNavPill"
                  className="absolute inset-0 bg-foreground rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0 relative z-10" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
          <Link href="/contact" className="flex items-center gap-1 hover:text-foreground">
            <LifeBuoy className="w-3.5 h-3.5" />
            Support
          </Link>
          <span className="text-border">|</span>
          <Link href="/explore" className="flex items-center gap-1 hover:text-foreground">
            <Code2 className="w-3.5 h-3.5" />
            API
          </Link>
        </div>
        <UserAvatarMenu />
      </div>
    </aside>
  );
}
