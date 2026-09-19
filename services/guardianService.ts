import type { Guardian, GuardianStatusPayload } from "@/types/guardian";

const API_BASE_URL = "https://localhost:7270";

export interface GuardianPayload {
  userId: number;
  name: string;
  relation?: string;
  phone?: string;
  status: Guardian["status"];
  note?: string;
  identityDocument?: File | null;
}

function normalizeGuardian(guardian: Guardian): Guardian {
  const status = String(guardian.status ?? "").toLowerCase();

  return {
    ...guardian,
    status:
      status === "approved"
        ? "Approved"
        : status === "rejected"
          ? "Rejected"
          : "Pending",
  };
}

function toGuardianFormData(payload: GuardianPayload): FormData {
  const formData = new FormData();
  formData.append("userId", String(payload.userId));
  formData.append("name", payload.name);
  formData.append("relation", payload.relation ?? "");
  formData.append("phone", payload.phone ?? "");
  formData.append("status", payload.status);
  formData.append("note", payload.note ?? "");
  if (payload.identityDocument) {
    formData.append("identityDocument", payload.identityDocument);
  }
  return formData;
}

async function getGuardianErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.message === "string") return body.message;
    if (typeof body?.title === "string") return body.title;

    if (body?.errors && typeof body.errors === "object") {
      const messages = Object.values(body.errors).flatMap((value) =>
        Array.isArray(value) ? value : [value]
      );
      const firstMessage = messages.find((value) => typeof value === "string");
      if (firstMessage) return firstMessage;
    }
  } catch {
    // The response may not contain JSON.
  }
  return fallback;
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

  const guardians: Guardian[] = await res.json();
  return guardians.map(normalizeGuardian);
}

export async function createGuardian(payload: GuardianPayload): Promise<Guardian> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian`, {
    method: "POST",
    body: toGuardianFormData(payload),
  });

  if (res.status !== 201 && res.status !== 200) {
    throw new Error(await getGuardianErrorMessage(res, "Unable to create guardian."));
  }

  const guardian: Guardian = await res.json();
  return normalizeGuardian(guardian);
}

export async function updateGuardian(id: number, payload: GuardianPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Guardian/${id}`, {
    method: "PUT",
    body: toGuardianFormData(payload),
  });

  if (res.status !== 204 && res.status !== 200) {
    throw new Error(await getGuardianErrorMessage(res, "Unable to update guardian."));
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
