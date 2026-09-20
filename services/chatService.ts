const API_BASE_URL = "https://localhost:7270";

export interface ChatResponse {
  intent: string;
  confidence: number;
  answer: string;
  escalated: boolean;
}

export async function askChatbot(
  parentUserId: number,
  message: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parentUserId, message }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Chat request failed (${response.status})`);
  }

  return (await response.json()) as ChatResponse;
}
