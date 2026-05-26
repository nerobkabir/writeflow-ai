"use client";

import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardAppSidebar } from "@/components/dashboard/DashboardAppSidebar";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = /^\/documents\/[^/]+$/.test(pathname);

  return (
    <ProtectedRoute>
      {isEditor ? (
        children
      ) : (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
          <DashboardAppSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 pb-20 md:pb-10">
              {children}
            </main>
          </div>
          <MobileBottomNav />
        </div>
      )}
    </ProtectedRoute>
  );
}
