"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_ROUTES } from "@/lib/auth/constants";
import type { UserRole } from "@/lib/auth/types";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

/**
 * Client-side route guard for portal areas. Redirects unauthenticated users to
 * login and users with the wrong role to their own portal.
 */
export function AuthGuard({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
    } else if (user.role !== role) {
      router.replace(ROLE_ROUTES[user.role]);
    }
  }, [isLoading, user, role, router]);

  if (isLoading || !user || user.role !== role) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
