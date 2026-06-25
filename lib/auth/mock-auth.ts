import { MOCK_USERS_KEY, ROLE_ROUTES } from "./constants";
import type {
  AuthResult,
  AuthUser,
  MockUser,
  ParentSubscription,
  RegisterFormData,
} from "./types";

/**
 * Demo-only credential store. Persists to localStorage so registered accounts
 * survive a refresh. Replace with real API calls when a backend is available.
 */

const SEED_USERS: MockUser[] = [
  {
    email: "admin@vango.test",
    password: "password",
    role: "admin",
    name: "VanGo Admin",
  },
  {
    email: "parent@vango.test",
    password: "password",
    role: "parent",
    name: "Sarah Mitchell",
  },
];

export const DEMO_ACCOUNTS = SEED_USERS.map(({ email, password, role }) => ({
  email,
  password,
  role,
}));

function readUsers(): MockUser[] {
  if (typeof window === "undefined") return SEED_USERS;

  const raw = localStorage.getItem(MOCK_USERS_KEY);
  if (!raw) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }

  try {
    const parsed = JSON.parse(raw) as MockUser[];
    const usable = Array.isArray(parsed)
      ? parsed.filter((user) => user.role in ROLE_ROUTES)
      : [];
    return usable.length > 0 ? usable : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

function writeUsers(users: MockUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: MockUser): AuthUser {
  return {
    email: user.email,
    role: user.role,
    name: user.name,
    subscription: user.subscription,
  };
}

/** Simulate network latency so loading states are testable. */
function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function emailExists(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return readUsers().some((user) => user.email.toLowerCase() === normalized);
}

export async function authenticate(
  email: string,
  password: string
): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  const match = readUsers().find(
    (user) => user.email.toLowerCase() === normalized
  );

  if (!match || match.password !== password) {
    return delay({ error: "Invalid email or password." });
  }

  return delay({ user: toAuthUser(match) });
}

export async function registerUser(
  form: RegisterFormData,
  subscription?: ParentSubscription
): Promise<AuthResult> {
  const normalized = form.email.trim().toLowerCase();

  if (emailExists(normalized)) {
    return delay({ error: "An account with this email already exists." });
  }

  const newUser: MockUser = {
    email: normalized,
    password: form.password,
    role: "parent",
    name: form.fullName,
    phone: form.phone,
    city: form.city,
    subscription,
  };

  const users = readUsers();
  writeUsers([...users, newUser]);

  return delay({ user: toAuthUser(newUser) });
}

export async function updateSubscription(
  email: string,
  subscription: ParentSubscription
): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const index = users.findIndex(
    (user) => user.email.toLowerCase() === normalized
  );

  if (index === -1) {
    return delay({ error: "Account not found." });
  }

  const updated = [...users];
  updated[index] = { ...updated[index], subscription };
  writeUsers(updated);

  return delay({ user: toAuthUser(updated[index]) });
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{ error?: string; success?: boolean }> {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const index = users.findIndex(
    (user) => user.email.toLowerCase() === normalized
  );

  if (index === -1) {
    return delay({ error: "Account not found." });
  }

  if (users[index].password !== currentPassword) {
    return delay({ error: "Current password is incorrect." });
  }

  const updated = [...users];
  updated[index] = { ...updated[index], password: newPassword };
  writeUsers(updated);

  return delay({ success: true });
}
