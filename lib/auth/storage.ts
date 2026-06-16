import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./constants";
import type { AuthUser } from "./types";

export function saveAuthSession(user: AuthUser, rememberMe: boolean): void {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_KEY, "demo-jwt-token");
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}
