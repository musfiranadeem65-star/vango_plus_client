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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7270";

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

          console.log("[AuthProvider.login] Backend response:", responseBody);
          console.log("[AuthProvider.login] backendUser.id:", backendUser?.id, "type:", typeof backendUser?.id);

          if (!backendUser || typeof backendUser.email !== "string") {
            return { error: "Unable to sign in." };
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

          console.log("[AuthProvider.login] normalizedUser:", normalizedUser);
          saveAuthSession(normalizedUser, rememberMe);
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
      saveAuthSession(normalizedUser, true);
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
