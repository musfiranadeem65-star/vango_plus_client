import type { UserRole } from "./types";

export const AUTH_TOKEN_KEY = "vango_auth_token";
export const AUTH_USER_KEY = "vango_auth_user";

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  parent: "/parent/dashboard",
  driver: "/driver/dashboard",
};

/** Demo role detection until backend is wired up */
export function detectRoleFromEmail(email: string): UserRole {
  const normalized = email.toLowerCase();

  if (normalized.includes("admin") || normalized.includes("school")) {
    return "admin";
  }

  if (normalized.includes("driver")) {
    return "driver";
  }

  return "parent";
}
