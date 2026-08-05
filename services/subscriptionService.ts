import type { Subscription, SubscriptionStatusPayload } from "@/types/subscription";

const API_BASE_URL = "https://localhost:7270";

export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Unable to load subscriptions from the backend.");
  }

  return res.json();
}

export async function getSubscriptionById(id: number): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/api/subscriptions/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Unable to load subscription ${id}.`);
  }

  return res.json();
}

export async function updateSubscriptionStatus(id: number, payload: SubscriptionStatusPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/subscriptions/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status !== 204 && res.status !== 200) {
    let errorMessage = "Unable to update subscription status.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
}
