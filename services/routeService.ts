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

export async function getRouteStops(id: number): Promise<RouteStop[]> {
  const response = await fetch(`${API_BASE_URL}/api/routes/${id}/stops`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load route stops from the backend.");
  }

  const body = (await response.json()) as unknown;

  if (Array.isArray(body)) {
    return body as RouteStop[];
  }

  if (
    body &&
    typeof body === "object" &&
    Array.isArray((body as { data?: unknown }).data)
  ) {
    return (body as { data: RouteStop[] }).data;
  }

  return [];
}

export interface RoutePayload {
  name: string;
  status: "Active" | "Inactive" | "Maintenance";
  driverId: number;
  description?: string;
  routeStops: Array<{
    stopName: string;
    arrivalTime: string;
    orderIndex: number;
  }>;
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

export async function updateRoute(
  id: number,
  payload: RoutePayload
): Promise<void> {
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

export async function updateRouteStatus(
  id: number,
  status: RoutePayload["status"]
): Promise<void> {
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

/* =========================================================
   STUDENT ROUTE ASSIGNMENT
   ========================================================= */

export interface StudentRouteAssignmentPayload {
  studentId: number;
  routeId: number;
  pickupTime: string;
  dropoffTime: string;
  assignedAt: string;
  status: string;
}

export interface StudentRouteAssignment {
  id: number;
  studentId: number;
  routeId: number;
  pickupTime?: string | null;
  dropoffTime?: string | null;
  assignedAt: string;
  status: string;
}

/* Create assignment */

export async function assignStudentToRoute(
  payload: StudentRouteAssignmentPayload
): Promise<StudentRouteAssignment> {
  const response = await fetch(
    `${API_BASE_URL}/api/student-route-assignments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = "Unable to assign student to route.";

    if (body?.message) {
      errorMessage = body.message;
    }

    throw new Error(errorMessage);
  }

  return body;
}

/* Get all assignments */

export async function getStudentRouteAssignments(): Promise<
  StudentRouteAssignment[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/student-route-assignments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load student route assignments from the backend."
    );
  }

  const body = await response.json();

  if (Array.isArray(body)) {
    return body;
  }

  if (
    body &&
    typeof body === "object" &&
    Array.isArray(body.data)
  ) {
    return body.data;
  }

  return [];
}

/* Update existing assignment */

export async function updateStudentRouteAssignment(
  id: number,
  payload: StudentRouteAssignmentPayload
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/student-route-assignments/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message || "Unable to update student route assignment."
    );
  }
}

/* Delete assignment */

export async function deleteStudentRouteAssignment(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/student-route-assignments/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message || "Unable to remove student route assignment."
    );
  }
}