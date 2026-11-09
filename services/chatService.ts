import { authFetch } from "@/lib/api/authFetch";

// The default is the port `dotnet run` uses locally. Set
// NEXT_PUBLIC_API_URL in .env.local to point somewhere else.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7270";

export interface ChatResponse {
  intent: string;
  confidence: number;
  answer: string;
  escalated: boolean;
}

/**
 * Asks the parent assistant one question.
 *
 * Which parent is asking is taken from the signed-in token on the server, so
 * it is deliberately not sent in the body. A caller cannot ask about somebody
 * else's children.
 */
export async function askChatbot(message: string): Promise<ChatResponse> {
  const response = await authFetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Chat request failed (${response.status})`);
  }

  return (await response.json()) as ChatResponse;
}
