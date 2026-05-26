"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Hammer, LogOut, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);
  const [siteName, setSiteName] = useState("WriteFlow AI");

  useEffect(() => {
    // Exclude API routes entirely
    if (pathname?.startsWith("/api")) return;

    const checkMaintenance = async () => {
      try {
        const res = await fetch("/api/settings/public");
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) {
            setMaintenanceMode(data.settings.maintenanceMode);
            setSiteName(data.settings.siteName || "WriteFlow AI");
          }
        }
      } catch (err) {
        console.error("Error checking site maintenance status:", err);
      }
    };

    checkMaintenance();

    // Check again every 10 seconds to detect when maintenance finishes
    const interval = setInterval(checkMaintenance, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";

  // Exclude these paths from being blocked so admins can log in and manage the site
  const isExcludedPath =
    pathname === "/login" ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  const shouldBlock = maintenanceMode === true && !isAdmin && !isExcludedPath;

  if (shouldBlock) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background px-4">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface/75 p-8 text-center shadow-xl backdrop-blur-md relative z-10"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Hammer className="h-7 w-7 animate-bounce" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">{siteName}</h1>
          <h2 className="mt-2 text-md font-semibold text-muted-foreground">Scheduled Maintenance</h2>
          
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground/80">
            We are currently updating our systems to bring you the best AI writing experience. 
            We will be back online shortly. Thank you for your patience!
          </p>

          <div className="mt-8 border-t border-border/60 pt-6 space-y-3">
            {status === "authenticated" ? (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Logged in as <span className="font-semibold text-foreground">{session.user?.email}</span>
                </p>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-badge hover:bg-badge/80 border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground hover:bg-foreground/90 px-4 py-2.5 text-sm font-semibold text-background transition-all duration-200"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin Sign In
              </a>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
export default MaintenanceGuard;
