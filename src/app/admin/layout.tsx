"use client";

import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { AdminSidebar } from "@/components/shared/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
