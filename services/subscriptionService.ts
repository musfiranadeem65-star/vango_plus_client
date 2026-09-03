import type { Subscription, SubscriptionStatusPayload } from "@/types/subscription";

const API_BASE_URL = "https://localhost:7270";

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  [key: string]: any;
}

export interface SubscriptionCreatePayload {
  id?: number;
  userId: number;
  planId: number;
  planName: string;
  price: number;
  status: string;
  paymentMethod: string;
  startedAt: string;
}

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

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await fetch(`${API_BASE_URL}/api/subscription/plans`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    let errorMessage = "Unable to load subscription plans from the backend.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function createSubscription(
  payload: SubscriptionCreatePayload
): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/api/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = `Unable to create subscription (status ${res.status}).`;
    try {
      const body = await res.json();
      // Attach backend message or full body for easier debugging.
      if (body?.message) errorMessage = body.message;
      else if (body?.error) errorMessage = body.error;
      else errorMessage = `${errorMessage} Response: ${JSON.stringify(body)}`;
    } catch (err) {
      // If response not JSON, include raw text
      try {
        const text = await res.text();
        if (text) errorMessage = `${errorMessage} ResponseText: ${text}`;
      } catch {
        // ignore
      }
    }
    console.error("createSubscription failed:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    return await res.json();
  } catch {
    // If API returns empty body but status 201, return minimal object
    return {
      id: 0,
      planId: payload.planId,
      userId: payload.userId,
      planName: payload.planName,
      price: payload.price,
      status: payload.status,
      paymentMethod: payload.paymentMethod,
      startedAt: payload.startedAt,
    } as unknown as Subscription;
  }
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
