/** One child's travel on one day. */
export interface StudentDayStatus {
  studentId: number;
  studentName: string;
  routeId: number;
  routeName: string;

  /** The school day, as yyyy-mm-dd. */
  onDate: string;

  /** When the child boarded, or null if it has not been recorded. */
  boardedAt: string | null;
  droppedAt: string | null;
}

export type TripRecordKind = "Boarded" | "Dropped";

export interface TripRecord {
  id: number;
  studentId: number;
  studentName: string;
  routeId: number;
  routeName: string;
  kind: TripRecordKind;
  occurredAt: string;
  onDate: string;
  note?: string | null;
}
