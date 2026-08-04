import type { Route, RouteStop } from "@/types/route";

const API_BASE_URL = "https://localhost:7270";

export async function getRoutes(): Promise<Route[]> {
  const response = await fetch(`${API_BASE_URL}/api/Route`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load routes from the backend.");
  }

  return response.json();
}

export async function getRouteById(id: number): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/Route/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load route ${id}.`);
  }

  return response.json();
}

export interface RoutePayload {
  name: string;
  status: "Active" | "Inactive" | "Maintenance";
  driverId: number;
  description?: string;
}

export async function createRoute(payload: RoutePayload): Promise<Route> {
  const response = await fetch(`${API_BASE_URL}/api/Route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 201) {
    let errorMessage = "Unable to create route.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON body
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateRoute(id: number, payload: RoutePayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Route/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update route.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON body
    }
    throw new Error(errorMessage);
  }
}

export async function deleteRoute(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Route/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 204) {
    throw new Error("Unable to delete route.");
  }
}

export async function updateRouteStatus(id: number, status: RoutePayload["status"]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Route/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update route status.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON body
    }
    throw new Error(errorMessage);
  }
}

export async function getStopsByRoute(routeId: number): Promise<RouteStop[]> {
  const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/stops`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load stops for route ${routeId}.`);
  }

  return response.json();
}

export async function createRouteStop(routeId: number, payload: Omit<RouteStop, "id" | "routeId">): Promise<RouteStop> {
  const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}/stops`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 201) {
    let errorMessage = "Unable to create route stop.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON body
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateRouteStop(id: number, payload: RouteStop): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/routes/stops/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update route stop.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON body
    }
    throw new Error(errorMessage);
  }
}

export async function deleteRouteStop(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/routes/stops/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 204) {
    throw new Error("Unable to delete route stop.");
  }
}
