"use client";

import React from "react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
        {/* Left Sidebar */}
        <DashboardSidebar />

        {/* Right Scrollable Content Pane */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background p-6 sm:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
