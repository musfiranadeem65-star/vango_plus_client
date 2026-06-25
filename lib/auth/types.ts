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
  planId: string;
  planName: string;
  price: number;
  status: "active";
  paymentMethod: "JazzCash";
  startedAt: string;
}

export interface AuthUser {
  email: string;
  role: UserRole;
  name?: string;
  subscription?: ParentSubscription;
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
