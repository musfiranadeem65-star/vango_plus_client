const API_BASE_URL = "https://localhost:7270";

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  role: "Parent";
  status: "Active";
}

export interface UserCreateResponse {
  id: number;
  email?: string;
  name?: string;
  role?: string;
  phone?: string;
  city?: string;
  [key: string]: unknown;
}

export async function createUser(
  payload: UserCreateRequest
): Promise<UserCreateResponse> {
  const res = await fetch(`${API_BASE_URL}/api/User`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Unable to create user.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
      else if (body?.error) errorMessage = body.error;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Try to parse JSON response; some backends may return CreatedAtAction with
  // the created resource in the body or an alternate wrapper. Return whatever
  // the API returned so callers can extract the created id.
  try {
    return await res.json();
  } catch {
    // If no JSON body, return a minimal object with status for callers.
    return { id: undefined } as UserCreateResponse;
  }
}

export interface UserResponse {
  id?: number;
  userId?: number;
  email?: string;
  role?: string;
  name?: string;
  [key: string]: unknown;
}

function normalizeUserResponse(user: unknown): UserResponse | null {
  if (!user || typeof user !== "object") return null;

  const record = user as Record<string, unknown>;
  if (typeof record.email !== "string") return null;

  return {
    id: Number(record.id ?? record.userId ?? record.data?.id ?? record.data?.userId) || undefined,
    userId: Number(record.userId) || undefined,
    email: record.email,
    role: typeof record.role === "string" ? record.role : undefined,
    name: typeof record.name === "string" ? record.name : undefined,
    ...record,
  };
}

export async function getUserByEmail(email: string): Promise<UserResponse> {
  const queryUrl = `${API_BASE_URL}/api/User?email=${encodeURIComponent(email)}`;
  const fallbackUrl = `${API_BASE_URL}/api/User`;

  async function parseResponse(response: Response): Promise<UserResponse | null> {
    if (!response.ok) return null;
    const body = await response.json();

    if (Array.isArray(body)) {
      return body.find(
        (item) =>
          typeof item?.email === "string" &&
          item.email.trim().toLowerCase() === email.trim().toLowerCase()
      ) ?? null;
    }

    if (body && typeof body === "object") {
      if (typeof body.email === "string") {
        return normalizeUserResponse(body);
      }

      if (Array.isArray(body.data)) {
        return body.data.find(
          (item) =>
            typeof item?.email === "string" &&
            item.email.trim().toLowerCase() === email.trim().toLowerCase()
        ) ?? null;
      }

      if (body.data && typeof body.data.email === "string") {
        return normalizeUserResponse(body.data);
      }
    }

    return null;
  }

  let user = await parseResponse(await fetch(queryUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  }));

  if (!user) {
    user = await parseResponse(await fetch(fallbackUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }));
  }

  if (!user) {
    throw new Error("Unable to determine your account. Please refresh and try again.");
  }

  return user;
}
