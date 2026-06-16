export type UserRole = "admin" | "parent" | "driver";

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

export interface AuthUser {
  email: string;
  role: UserRole;
  name?: string;
}
