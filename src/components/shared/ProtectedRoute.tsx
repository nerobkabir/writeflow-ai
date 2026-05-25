"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && requireAdmin) {
      const userRole = (session?.user as any)?.role;
      if (userRole !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [status, session, requireAdmin, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <span className="text-[13px] text-muted-foreground animate-pulse">
          Authenticating access...
        </span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requireAdmin) {
    const userRole = (session?.user as any)?.role;
    if (userRole !== "ADMIN") {
      return null;
    }
  }

  return <>{children}</>;
}
export default ProtectedRoute;
