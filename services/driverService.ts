import type { Driver } from "@/types/driver";

const API_BASE_URL = "https://localhost:7270";

export async function getDrivers(): Promise<Driver[]> {
  const response = await fetch(`${API_BASE_URL}/api/Driver`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load drivers from the backend.");
  }

  return response.json();
}

export async function getDriverById(id: number): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/api/Driver/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load driver ${id}.`);
  }

  return response.json();
}

export interface DriverPayload {
  name: string;
  phone?: string;
  email?: string;
  licenseNo: string;
  status: "Active" | "Inactive" | "On Leave";
}

export async function createDriver(payload: DriverPayload): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/api/Driver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 201) {
    let errorMessage = "Unable to create driver.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON response
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateDriver(id: number, payload: DriverPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Driver/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update driver.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON response
    }
    throw new Error(errorMessage);
  }
}

export async function deleteDriver(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Driver/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 204) {
    throw new Error("Unable to delete driver.");
  }
}

export async function updateDriverStatus(id: number, status: DriverPayload["status"]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Driver/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update driver status.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON response
    }
    throw new Error(errorMessage);
  }
}
