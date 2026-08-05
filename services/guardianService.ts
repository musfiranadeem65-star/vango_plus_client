import type { Guardian, GuardianStatusPayload } from "@/types/guardian";

const API_BASE_URL = "https://localhost:7270";

export async function getGuardians(): Promise<Guardian[]> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Unable to load guardians from the backend.");
  }

  return res.json();
}

export async function updateGuardianStatus(id: number, payload: GuardianStatusPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status !== 204 && res.status !== 200) {
    let errorMessage = "Unable to update guardian status.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
}
