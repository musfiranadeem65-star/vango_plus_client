import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./constants";
import type { AuthUser } from "./types";

export function saveAuthSession(user: AuthUser, rememberMe: boolean): void {
  if (typeof window === "undefined") return;

  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  // Ensure the session lives in exactly one storage to avoid stale copies.
  other.removeItem(AUTH_TOKEN_KEY);
  other.removeItem(AUTH_USER_KEY);

  storage.setItem(AUTH_TOKEN_KEY, "demo-jwt-token");
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw =
    localStorage.getItem(AUTH_USER_KEY) ?? sessionStorage.getItem(AUTH_USER_KEY);
  const token =
    localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (!raw || !token) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}

export function updateStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;

  if (localStorage.getItem(AUTH_USER_KEY)) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else if (sessionStorage.getItem(AUTH_USER_KEY)) {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}
