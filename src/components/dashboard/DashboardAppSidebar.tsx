"use client";

import { useEffect, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { UserAvatarMenu } from "@/components/dashboard/UserAvatarMenu";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "writeflow-dashboard-sidebar-collapsed";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Writer", href: "/documents/new", icon: PenLine },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Analytics", href: "/dashboard", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/profile", icon: Settings },
];

function SidebarTooltip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return <>{children}</>;

  return (
    <span className="group/tooltip relative flex w-full">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export function DashboardAppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setCollapsed(true);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative hidden md:flex shrink-0 flex-col h-screen overflow-hidden border-r border-border bg-surface"
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        style={{ right: -12, top: "50%" }}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <div
        className={cn(
          "border-b border-border shrink-0",
          collapsed ? "px-2 pt-6 pb-4" : "px-5 pt-6 pb-4"
        )}
      >
        <Link href="/" className="hover:opacity-80 transition-opacity block">
          {!collapsed ? (
            <>
              <p className="text-[15px] font-bold tracking-tight whitespace-nowrap">WriteFlow AI</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5 whitespace-nowrap">
                Intelligence Pro
              </p>
            </>
          ) : (
            <p className="text-center text-[15px] font-bold tracking-tight" title="WriteFlow AI">
              W
            </p>
          )}
        </Link>
        <SidebarTooltip label="Create New" show={collapsed}>
          <Link
            href="/documents/new"
            title={collapsed ? undefined : "Create New"}
            className={cn(
              "mt-4 flex items-center rounded-lg border border-border font-bold hover:border-foreground transition-colors",
              collapsed
                ? "justify-center p-2.5"
                : "justify-center gap-2 w-full py-2.5 text-[12px]"
            )}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Create New</span>}
          </Link>
        </SidebarTooltip>
      </div>

      <nav className={cn("flex-1 space-y-0.5 py-4", collapsed ? "px-2" : "px-3")}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);

          const link = (
            <Link
              href={href}
              title={collapsed ? undefined : label}
              className={cn(
                "relative flex items-center rounded-lg text-[13px] font-medium transition-colors",
                collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5",
                active ? "text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="dashboardNavPill"
                  className="absolute inset-0 rounded-lg bg-foreground"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              {!collapsed && <span className="relative z-10 whitespace-nowrap">{label}</span>}
            </Link>
          );

          return (
            <SidebarTooltip key={href + label} label={label} show={collapsed}>
              {link}
            </SidebarTooltip>
          );
        })}
      </nav>

      <div
        className={cn(
          "shrink-0 space-y-3 border-t border-border py-4",
          collapsed ? "px-2" : "px-4"
        )}
      >
        <SidebarTooltip label="Home" show={collapsed}>
          <Link
            href="/"
            title={collapsed ? undefined : "Home"}
            className={cn(
              "relative flex items-center rounded-lg text-[13px] font-medium transition-colors text-muted-foreground hover:text-foreground",
              collapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Home</span>}
          </Link>
        </SidebarTooltip>

        <div
          className={cn(
            "flex text-[11px] font-semibold text-muted-foreground",
            collapsed ? "flex-col items-center gap-2" : "items-center gap-4"
          )}
        >
          <SidebarTooltip label="Support" show={collapsed}>
            <Link
              href="/contact"
              className={cn(
                "flex items-center hover:text-foreground transition-colors",
                collapsed ? "justify-center p-1.5" : "gap-1"
              )}
            >
              <LifeBuoy className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span>Support</span>}
            </Link>
          </SidebarTooltip>
          {!collapsed && <span className="text-border">|</span>}
          <SidebarTooltip label="API" show={collapsed}>
            <Link
              href="/explore"
              className={cn(
                "flex items-center hover:text-foreground transition-colors",
                collapsed ? "justify-center p-1.5" : "gap-1"
              )}
            >
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span>API</span>}
            </Link>
          </SidebarTooltip>
        </div>
        <UserAvatarMenu collapsed={collapsed} />
      </div>
    </motion.aside>
  );
}
