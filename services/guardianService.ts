import type { Guardian, GuardianStatusPayload } from "@/types/guardian";

const API_BASE_URL = "https://localhost:7270";

export interface GuardianPayload {
  userId: number;
  name: string;
  relation?: string;
  phone?: string;
  status: Guardian["status"];
  note?: string;
}

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

export async function createGuardian(payload: GuardianPayload): Promise<Guardian> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status !== 201 && res.status !== 200) {
    let errorMessage = "Unable to create guardian.";
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

export async function updateGuardian(id: number, payload: GuardianPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status !== 204 && res.status !== 200) {
    let errorMessage = "Unable to update guardian.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
}

export async function deleteGuardian(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status !== 204 && res.status !== 200) {
    let errorMessage = "Unable to delete guardian.";
    try {
      const body = await res.json();
      if (body?.message) errorMessage = body.message;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
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
