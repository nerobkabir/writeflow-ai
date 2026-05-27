"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, Settings, User, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const dropdownScaleIn = {
  initial: { opacity: 0, scale: 0.92, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, scale: 0.92, y: 4, transition: { duration: 0.12 } },
};

interface UserAvatarMenuProps {
  className?: string;
  collapsed?: boolean;
}

export function UserAvatarMenu({ className, collapsed = false }: UserAvatarMenuProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const userRole = (session?.user as { role?: string })?.role;

  if (!session?.user) return null;

  const initials = session.user.name?.[0]?.toUpperCase() || "U";
  const avatarUrl = session.user.image;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={collapsed ? session.user.name ?? "Account" : undefined}
        className={cn(
          "flex w-full items-center rounded-lg p-1 transition-colors hover:bg-badge/60",
          collapsed ? "justify-center" : "gap-2"
        )}
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
        )}
        {!collapsed && (
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[12px] font-semibold truncate">{session.user.name}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              PRO PLAN
            </p>
          </div>
        )}
        {!collapsed && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              variants={dropdownScaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "bottom left" }}
              className="absolute left-0 bottom-full mb-2 w-52 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="p-1.5 space-y-0.5">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-badge"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  My Profile
                </Link>
                <Link
                  href="/dashboard/documents"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-badge"
                >
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  My Documents
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-badge"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </Link>
                {userRole === "ADMIN" && (
                  <Link
                    href="/admin/analytics"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] hover:bg-badge"
                  >
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-border my-1" />
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-error hover:bg-error-bg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
