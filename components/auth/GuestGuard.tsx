"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_ROUTES } from "@/lib/auth/constants";

/**
 * Wraps the auth pages. Sends already-authenticated users to their portal so
 * they never see the login/register screens while signed in.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(ROLE_ROUTES[user.role]);
    }
  }, [isLoading, user, router]);

  if (!isLoading && user) return null;

  return <>{children}</>;
}
