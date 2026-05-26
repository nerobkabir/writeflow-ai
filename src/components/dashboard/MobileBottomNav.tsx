"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, PenLine, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const tabs = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Docs", href: "/dashboard/documents", icon: FileText },
  { label: "Write", href: "/documents/new", icon: PenLine },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-area-pb">
        <div className="flex items-center justify-around h-14 px-2">
          {tabs.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
            More
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="md:hidden fixed right-0 top-0 bottom-0 z-50 w-[260px] bg-surface border-l border-border p-5"
            >
              <p className="font-bold text-lg mb-1">WriteFlow AI</p>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-6">
                Intelligence Pro
              </p>
              <Link
                href="/documents/new"
                onClick={() => setMenuOpen(false)}
                className="block w-full py-2.5 mb-4 text-center border border-border rounded-lg font-bold text-[12px]"
              >
                + Create New
              </Link>
              <Link
                href="/dashboard/usage"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-[13px] font-medium"
              >
                AI Usage History
              </Link>
              <Link
                href="/explore"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-[13px] font-medium"
              >
                API
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
