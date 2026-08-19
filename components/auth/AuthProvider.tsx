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
  authenticate,
  registerUser,
  updateSubscription,
} from "@/lib/auth/mock-auth";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  updateStoredUser,
} from "@/lib/auth/storage";
import type {
  AuthUser,
  ParentSubscription,
  RegisterFormData,
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
      const result = await authenticate(email, password);
      if (result.error || !result.user) {
        return { error: result.error ?? "Unable to sign in." };
      }

      const normalizedUser = {
        ...result.user,
        role: normalizeRole(result.user.role) ?? result.user.role,
      };
      saveAuthSession(normalizedUser, rememberMe);
      setSession({ user: normalizedUser, isLoading: false });
      router.push(ROLE_ROUTES[normalizedUser.role]);
      return {};
    },
    [router]
  );

  const register = useCallback(
    async (form: RegisterFormData, subscription?: ParentSubscription) => {
      const result = await registerUser(form, subscription);
      if (result.error || !result.user) {
        return { error: result.error ?? "Unable to create account." };
      }

      const normalizedUser = {
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
