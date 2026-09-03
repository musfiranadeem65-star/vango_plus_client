export type UserRole = "admin" | "parent";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  fullName: string;
  phone: string;
  city: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ParentSubscription {
  planId: string | number;
  planName: string;
  price: number;
  status: string;
  paymentMethod: string;
  startedAt: string;
}

export interface AuthUser {
  id?: number;
  email: string;
  role: UserRole;
  name?: string;
  subscription?: ParentSubscription;
  subscriptions?: ParentSubscription[];
}

export function getActiveParentSubscription(
  user: Partial<AuthUser> | null | undefined
): ParentSubscription | undefined {
  if (!user) return undefined;

  if (user.subscription) return user.subscription;

  const list = Array.isArray(user.subscriptions) ? user.subscriptions : [];
  if (list.length === 0) return undefined;

  return (
    list.find((item) => String(item?.status ?? "").trim().toLowerCase() === "active") ??
    list[0]
  );
}

export function normalizeAuthUser(
  value: Partial<AuthUser> | null | undefined
): AuthUser | null {
  if (!value || typeof value !== "object") return null;
  if (typeof value.email !== "string" || value.email.trim().length === 0) return null;

  const role = value.role && typeof value.role === "string"
    ? value.role.trim().toLowerCase()
    : "parent";

  const list = Array.isArray(value.subscriptions) ? value.subscriptions : [];
  const resolvedSubscription = getActiveParentSubscription({
    ...value,
    subscriptions: list,
  });

  return {
    id: typeof value.id === "number" ? value.id : undefined,
    email: value.email,
    role: role === "admin" ? "admin" : "parent",
    name: typeof value.name === "string" ? value.name : undefined,
    subscription: resolvedSubscription,
    subscriptions: list,
  };
}

export interface MockUser extends AuthUser {
  password: string;
  phone?: string;
  city?: string;
}

export interface AuthResult {
  user?: AuthUser;
  error?: string;
}
