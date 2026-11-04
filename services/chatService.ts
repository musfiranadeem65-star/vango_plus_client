import { authFetch } from "@/lib/api/authFetch";

const API_BASE_URL = "https://localhost:7270";

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
