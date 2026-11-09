import { authFetch } from "@/lib/api/authFetch";
import type { StudentDayStatus, TripRecord, TripRecordKind } from "@/types/tripRecord";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7270";

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body?.message ?? body?.error ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * The signed-in parent's own children, most recent day first.
 *
 * No parent id is sent: the server takes it from the token, so this cannot
 * be pointed at another family.
 */
export async function getMyChildrenTravel(days = 7): Promise<StudentDayStatus[]> {
  const res = await authFetch(
    `${API_BASE_URL}/api/trip-records/my-children?days=${days}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(await readError(res, "Unable to load travel records."));
  }

  return (await res.json()) as StudentDayStatus[];
}

/**
 * The roster for one route on one day. Staff only: it names every child on
 * the route.
 */
export async function getRouteDay(
  routeId: number,
  date?: string
): Promise<StudentDayStatus[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";

  const res = await authFetch(
    `${API_BASE_URL}/api/trip-records/route/${routeId}${query}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(await readError(res, "Unable to load the route roster."));
  }

  return (await res.json()) as StudentDayStatus[];
}

/** Records that a child boarded the van, or was dropped off. Staff only. */
export async function recordTrip(
  studentId: number,
  routeId: number,
  kind: TripRecordKind
): Promise<TripRecord> {
  const res = await authFetch(`${API_BASE_URL}/api/trip-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, routeId, kind }),
  });

  if (!res.ok) {
    throw new Error(await readError(res, "Unable to save this record."));
  }

  return (await res.json()) as TripRecord;
}
