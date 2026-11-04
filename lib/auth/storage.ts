import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./constants";
import { normalizeAuthUser, type AuthUser } from "./types";

export function saveAuthSession(
  user: AuthUser,
  rememberMe: boolean,
  token: string
): void {
  if (typeof window === "undefined") return;

  const normalized = normalizeAuthUser(user);
  if (!normalized) return;

  // Without a token there is no session worth keeping: the server refuses
  // every request that does not carry one.
  if (!token) return;

  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  // Ensure the session lives in exactly one storage to avoid stale copies.
  other.removeItem(AUTH_TOKEN_KEY);
  other.removeItem(AUTH_USER_KEY);

  // The real signed token from the server, sent back on every API call as
  // Authorization: Bearer <token>.
  storage.setItem(AUTH_TOKEN_KEY, token);
  storage.setItem(AUTH_USER_KEY, JSON.stringify(normalized));
}

/**
 * Stores just the token, before there is a user record to store with it.
 * The signup flow needs this: the plan step calls the API between creating
 * the account and saving the session.
 */
export function saveAuthToken(token: string, rememberMe: boolean): void {
  if (typeof window === "undefined" || !token) return;

  const storage = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  other.removeItem(AUTH_TOKEN_KEY);
  storage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw =
    localStorage.getItem(AUTH_USER_KEY) ?? sessionStorage.getItem(AUTH_USER_KEY);
  const token =
    localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (!raw || !token) return null;

  try {
    return normalizeAuthUser(JSON.parse(raw) as AuthUser);
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
