import type { UserRole } from "./types";

export const AUTH_TOKEN_KEY = "vango_auth_token";
export const AUTH_USER_KEY = "vango_auth_user";
export const MOCK_USERS_KEY = "vango_mock_users";

export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  parent: "/parent/dashboard",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  parent: "Parent",
};

