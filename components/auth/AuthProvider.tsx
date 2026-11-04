"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ROLE_ROUTES } from "@/lib/auth/constants";
import {
  registerUser,
  updateSubscription,
} from "@/lib/auth/mock-auth";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  updateStoredUser,
} from "@/lib/auth/storage";
import {
  normalizeAuthUser,
  type AuthUser,
  type ParentSubscription,
  type RegisterFormData,
  type UserRole,
} from "@/lib/auth/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7270";

/**
 * Signs in and returns the token, or null when the credentials are refused.
 * Used after registration, where the account exists but the session does not
 * have a token yet.
 */
async function fetchLoginToken(
  email: string,
  password: string
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/User/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    const body = (await response.json()) as { token?: unknown };
    return typeof body.token === "string" && body.token ? body.token : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ error?: string }>;
  register: (
    form: RegisterFormData,
    subscription?: ParentSubscription
  ) => Promise<{ error?: string }>;
  subscribe: (subscription: ParentSubscription) => Promise<{ error?: string }>;
  logout: () => void;
}

function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role || typeof role !== "string") return null;
  const normalized = role.trim().toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "parent") return "parent";
  return null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: AuthUser | null;
    isLoading: boolean;
  }>({ user: null, isLoading: true });
  const { user, isLoading } = session;

  useEffect(() => {
    // One-time hydration from browser storage after mount. This must run in an
    // effect (not a lazy initializer) to avoid an SSR/client hydration mismatch.
    const stored = getAuthSession();
    const normalizedRole = normalizeRole(stored?.role);
    const valid = stored && normalizedRole && normalizedRole in ROLE_ROUTES
      ? { ...stored, role: normalizedRole }
      : null;
    if (stored && !valid) {
      clearAuthSession();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession({ user: valid, isLoading: false });
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const apiBaseUrl = API_BASE_URL;

      try {
        const response = await fetch(`${apiBaseUrl}/api/User/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const responseBody = response.headers
          .get("content-type")
          ?.includes("application/json")
          ? await response.json()
          : null;

        if (response.ok) {
          const backendUser =
            responseBody && typeof responseBody === "object"
              ? (responseBody as Record<string, unknown>)
              : null;

          if (!backendUser || typeof backendUser.email !== "string") {
            return { error: "Unable to sign in." };
          }

          // Every later request has to carry this, so a sign-in without one
          // is not a sign-in.
          const token =
            typeof backendUser.token === "string" ? backendUser.token : "";

          if (!token) {
            return { error: "Unable to sign in. The server did not return a token." };
          }

          const frontendRole = normalizeRole(
            typeof backendUser.role === "string" ? backendUser.role : undefined
          );

          if (!frontendRole) {
            return {
              error: "Unable to sign in. Account role is not supported.",
            };
          }

          const normalizedUser =
            normalizeAuthUser({
              ...backendUser,
              email: backendUser.email,
              role: frontendRole,
              name: typeof backendUser.name === "string" ? backendUser.name : undefined,
              id: typeof backendUser.id === "number" ? backendUser.id : undefined,
            }) ?? {
              email: backendUser.email,
              role: frontendRole,
              name: typeof backendUser.name === "string" ? backendUser.name : undefined,
              id: typeof backendUser.id === "number" ? backendUser.id : undefined,
            };

          saveAuthSession(normalizedUser, rememberMe, token);
          setSession({ user: normalizedUser, isLoading: false });
          router.push(ROLE_ROUTES[normalizedUser.role]);
          return {};
        }

        if (response.status === 401) {
          const message =
            responseBody && typeof responseBody === "object" &&
            typeof (responseBody as Record<string, unknown>).message === "string"
              ? String((responseBody as Record<string, unknown>).message)
              : "Invalid email or password.";
          return { error: message };
        }

        const message =
          responseBody && typeof responseBody === "object" &&
          typeof (responseBody as Record<string, unknown>).message === "string"
            ? String((responseBody as Record<string, unknown>).message)
            : "Unable to connect to the server. Please try again.";
        return { error: message };
      } catch {
        return { error: "Unable to connect to the server. Please try again." };
      }
    },
    [router]
  );

  const register = useCallback(
    async (form: RegisterFormData, subscription?: ParentSubscription) => {
      const result = await registerUser(form, subscription);
      if (result.error || !result.user) {
        return { error: result.error ?? "Unable to create account." };
      }

      const normalizedUser = normalizeAuthUser({
        ...result.user,
        role: normalizeRole(result.user.role) ?? result.user.role,
      }) ?? {
        ...result.user,
        role: normalizeRole(result.user.role) ?? result.user.role,
      };
      // Creating the account does not sign anyone in. Sign in now so the
      // session carries a real token, otherwise the very next request the
      // new parent makes comes back as 401.
      const token = await fetchLoginToken(form.email, form.password);

      if (!token) {
        return {
          error: "Your account was created. Please sign in to continue.",
        };
      }

      saveAuthSession(normalizedUser, true, token);
      setSession({ user: normalizedUser, isLoading: false });
      router.push(ROLE_ROUTES[normalizedUser.role]);
      return {};
    },
    [router]
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setSession({ user: null, isLoading: false });
    router.push("/login");
  }, [router]);

  const subscribe = useCallback(
    async (subscription: ParentSubscription) => {
      if (!user) {
        return { error: "You must be signed in to subscribe." };
      }

      const result = await updateSubscription(user.email, subscription);
      if (result.error || !result.user) {
        return { error: result.error ?? "Unable to update subscription." };
      }

      updateStoredUser(result.user);
      setSession({ user: result.user, isLoading: false });
      return {};
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, register, subscribe, logout }),
    [user, isLoading, login, register, subscribe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
