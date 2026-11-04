import { AUTH_TOKEN_KEY } from "@/lib/auth/constants";

/**
 * The signed token kept for the current session, or null when nobody is
 * signed in.
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

/**
 * fetch, with the signed-in token attached.
 *
 * Every API call goes through this. The server now refuses a request that
 * does not carry a token, so a plain fetch to the API would come back as 401.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  // Headers() copes with every shape init.headers can take, so this works
  // whether the caller passed an object, an array or a Headers.
  const headers = new Headers(init.headers);

  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, { ...init, headers });
}
