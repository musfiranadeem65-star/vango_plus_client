import type { Student } from "@/types/student";
import type { RouteStop } from "@/types/route";
import type { StudentSchedule } from "@/types/schedule";

const API_BASE_URL = "https://localhost:7270";

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/api/Student`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load students from the backend.");
  }

  return response.json();
}

export async function getStudentsByParentId(parentUserId: number): Promise<Student[]> {
  const url = `${API_BASE_URL}/api/Student/parent/${parentUserId}`;
  console.log("[getStudentsByParentId] URL:", url, "parentUserId:", parentUserId, "type:", typeof parentUserId);
  
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    console.log("[getStudentsByParentId] Response status:", response.status, response.statusText);
  } catch (fetchError) {
    console.error("[getStudentsByParentId] Fetch error:", fetchError);
    throw new Error("Unable to load your children from the backend. Network error: " + String(fetchError));
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[getStudentsByParentId] Response not OK. Status:", response.status, "Body:", errorText);
    throw new Error("Unable to load your children from the backend. Status: " + response.status);
  }

  let body: unknown;
  try {
    body = await response.json();
    console.log("[getStudentsByParentId] Parsed JSON body:", body);
  } catch (parseError) {
    console.error("[getStudentsByParentId] JSON parse error:", parseError);
    throw new Error("Unable to parse children response from backend.");
  }

  if (Array.isArray(body)) {
    console.log("[getStudentsByParentId] Body is an array, normalizing...");
    const children = normalizeStudents(body);
    console.log("[getStudentsByParentId] Normalized children:", children);
    return children;
  }
  
  if (body && typeof body === "object") {
    console.log("[getStudentsByParentId] Body is an object, checking for wrapped data...");
    const record = body as { data?: unknown; students?: unknown; items?: unknown };
    const children = record.data ?? record.students ?? record.items;
    if (Array.isArray(children)) {
      console.log("[getStudentsByParentId] Found array in wrapper, normalizing...");
      const parsedChildren = normalizeStudents(children);
      console.log("[getStudentsByParentId] Normalized children:", parsedChildren);
      return parsedChildren;
    }
  }
  
  console.log("[getStudentsByParentId] No valid array found in response, returning empty array");
  return [];
}

export async function getStudentById(id: number): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/api/Student/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load student ${id}.`);
  }

  return response.json();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeStudents(value: unknown): Student[] {
  if (!Array.isArray(value)) {
    console.log("[normalizeStudents] value is not an array:", value);
    return [];
  }
  
  console.log("[normalizeStudents] Processing array with", value.length, "items");
  
  return value.flatMap((item, index) => {
    const record = asRecord(item);
    if (!record) {
      console.log("[normalizeStudents] Item", index, "is not a valid record:", item);
      return [];
    }
    
    console.log("[normalizeStudents] Item", index, "raw record:", record);
    
    const id = Number(record.id ?? record.Id ?? record.studentId ?? record.StudentId);
    const name = String(record.name ?? record.Name ?? "").trim();
    const grade = String(record.grade ?? record.Grade ?? "");
    const section = String(record.section ?? record.Section ?? "");
    const status = String(record.status ?? record.Status ?? "");
    const parentUserId = Number(record.parentUserId ?? record.ParentUserId ?? 0);
    
    console.log("[normalizeStudents] Item", index, "parsed values:", {
      id, name, grade, section, status, parentUserId
    });
    
    if (!Number.isFinite(id) || !id) {
      console.log("[normalizeStudents] Item", index, "rejected: id not valid (id=" + id + ")");
      return [];
    }
    
    if (!name) {
      console.log("[normalizeStudents] Item", index, "rejected: name is empty");
      return [];
    }
    
    const student: Student = {
      id,
      parentUserId,
      name,
      grade,
      section,
      status,
    };
    
    console.log("[normalizeStudents] Item", index, "accepted as:", student);
    return [student];
  });
}

function getNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return undefined;
}

function normalizeStops(value: unknown): RouteStop[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const stop = asRecord(item);
    if (!stop) return [];
    const stopName = String(stop.stopName ?? stop.StopName ?? stop.name ?? stop.Name ?? stop.label ?? stop.Label ?? "").trim();
    const arrivalTime = String(stop.arrivalTime ?? stop.ArrivalTime ?? stop.time ?? stop.Time ?? stop.pickupTime ?? stop.PickupTime ?? "").trim();
    if (!stopName && !arrivalTime) return [];
    return [{
      id: getNumber(stop, "id", "Id") ?? index + 1,
      routeId: getNumber(stop, "routeId", "RouteId") ?? 0,
      stopName: stopName || "Stop",
      arrivalTime,
      orderIndex: getNumber(stop, "orderIndex", "OrderIndex", "sequence", "Sequence", "order", "Order") ?? index + 1,
    }];
  });
}

export async function getStudentSchedule(id: number): Promise<StudentSchedule> {
  const response = await fetch(`${API_BASE_URL}/api/students/${id}/schedule`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    if (response.status === 404) return { stops: [] };
    throw new Error("Unable to load this child's schedule from the backend.");
  }

  const body = (await response.json()) as unknown;
  const root = asRecord(body) ?? {};
  const data = asRecord(root.data) ?? root;
  const route = asRecord(data.route) ?? asRecord(data.Route);
  return {
    routeId: getNumber(data, "routeId", "RouteId") ?? (route ? getNumber(route, "id", "routeId") : undefined),
    routeName: String(data.routeName ?? data.RouteName ?? route?.name ?? route?.Name ?? "").trim() || undefined,
    driverId: getNumber(data, "driverId", "DriverId") ?? (route ? getNumber(route, "driverId", "DriverId") : undefined),
    stops: normalizeStops(data.routeStops ?? data.RouteStops ?? data.stops ?? data.Stops ?? route?.routeStops ?? route?.RouteStops ?? route?.stops ?? route?.Stops),
  };
}

export interface StudentCreatePayload {
  parentUserId: number;
  name: string;
  grade: string;
  section: string;
  status: string;
}

interface StudentUpdatePayload {
  parentUserId: number;
  name: string;
  grade: string;
  section: string;
  status: string;
}

export async function createStudent(payload: StudentCreatePayload): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/api/Student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 201) {
    let errorMessage = "Unable to create student.";
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

export async function updateStudent(id: number, payload: StudentUpdatePayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Student/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update student.";
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
