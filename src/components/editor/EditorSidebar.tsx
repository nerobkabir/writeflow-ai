"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Writer", href: "/documents/new", icon: Sparkles, match: (p: string) => /^\/documents\/.+/.test(p) },
  { label: "Documents", href: "/documents", icon: FileText, exact: true },
  { label: "Analytics", href: "/dashboard", icon: BarChart3 },
  { label: "Settings", href: "/dashboard", icon: Settings },
];

export function EditorSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <aside className="w-[200px] shrink-0 h-screen hidden md:flex flex-col border-r border-border bg-surface">
      <div className="p-4 border-b border-border">
        <p className="text-[18px] font-bold tracking-tight leading-none">WriteFlow</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
          Intelligence Pro
        </p>
        <Link
          href="/documents/new"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 border border-border rounded-lg text-[12px] font-bold hover:border-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 relative">
        {navItems.map(({ label, href, icon: Icon, exact, match }) => {
          const active = match
            ? match(pathname)
            : exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={label}
              href={href}
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors z-10 ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 bg-badge rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0 relative z-10" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold truncate">{session?.user?.name || "User"}</p>
            <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-badge border border-border px-1.5 py-0.5 rounded mt-0.5">
              Pro Plan
            </span>
          </div>
        </div>
        <a
          href="mailto:support@writeflow.ai"
          className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Support
        </a>
      </div>
    </aside>
  );
}
