"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, LogIn, LogOut } from "lucide-react";
import { getRoutes } from "@/services/routeService";
import { getRouteDay, recordTrip } from "@/services/tripRecordService";
import type { Route } from "@/types/route";
import type { StudentDayStatus, TripRecordKind } from "@/types/tripRecord";

/** Today as yyyy-mm-dd in the school's own timezone, not in UTC. */
function todayInPakistan(): string {
  const now = new Date();
  const pk = new Date(now.getTime() + (5 * 60 + now.getTimezoneOffset()) * 60_000);

  return [
    pk.getFullYear(),
    String(pk.getMonth() + 1).padStart(2, "0"),
    String(pk.getDate()).padStart(2, "0"),
  ].join("-");
}

function timeOf(value: string | null): string {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AttendanceManagementPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState<number | null>(null);
  const [date, setDate] = useState(todayInPakistan());
  const [roster, setRoster] = useState<StudentDayStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingFor, setSavingFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRoutes() {
      try {
        const result = await getRoutes();
        if (!active) return;
        setRoutes(result);
        setRouteId((current) => current ?? result[0]?.id ?? null);
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Unable to load routes.");
        }
      }
    }

    void loadRoutes();
    return () => {
      active = false;
    };
  }, []);

  const loadRoster = useCallback(async () => {
    if (!routeId) return;

    setLoading(true);
    setError(null);

    try {
      setRoster(await getRouteDay(routeId, date));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load the roster.");
      setRoster([]);
    } finally {
      setLoading(false);
    }
  }, [routeId, date]);

  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  async function mark(studentId: number, kind: TripRecordKind) {
    if (!routeId) return;

    // One child and one button at a time, so a second click while the first
    // request is in flight cannot queue a duplicate.
    const key = `${studentId}-${kind}`;
    if (savingFor) return;

    setSavingFor(key);
    setError(null);

    try {
      await recordTrip(studentId, routeId, kind);
      await loadRoster();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save this record.");
    } finally {
      setSavingFor(null);
    }
  }

  const isToday = date === todayInPakistan();

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 md:text-[32px] md:leading-10">
          Attendance
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Mark each child on and off the van. Parents see these times on their
          own screen.
        </p>
      </section>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Route</span>
          <select
            value={routeId ?? ""}
            onChange={(event) => setRouteId(Number(event.target.value) || null)}
            className="min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0B5394]"
          >
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Day</span>
          <input
            type="date"
            value={date}
            max={todayInPakistan()}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#0B5394]"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-5 text-sm font-medium text-slate-500">Loading roster...</p>
        ) : null}

        {!loading && !roster.length ? (
          <p className="p-5 text-sm font-medium text-slate-500">
            No children are assigned to this route.
          </p>
        ) : null}

        {!loading && roster.length ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Child</th>
                <th className="px-5 py-3">Picked up</th>
                <th className="px-5 py-3">Dropped off</th>
                <th className="px-5 py-3 text-right">Record</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((row) => (
                <tr key={row.studentId} className="border-t border-slate-100">
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                    {row.studentName}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {timeOf(row.boardedAt)}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {timeOf(row.droppedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <MarkButton
                        label="Boarded"
                        icon={<LogIn size={14} />}
                        done={Boolean(row.boardedAt)}
                        busy={savingFor === `${row.studentId}-Boarded`}
                        disabled={!isToday || Boolean(savingFor)}
                        onClick={() => mark(row.studentId, "Boarded")}
                      />
                      <MarkButton
                        label="Dropped"
                        icon={<LogOut size={14} />}
                        done={Boolean(row.droppedAt)}
                        busy={savingFor === `${row.studentId}-Dropped`}
                        disabled={!isToday || Boolean(savingFor)}
                        onClick={() => mark(row.studentId, "Dropped")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>

      {!isToday ? (
        <p className="text-xs font-medium text-slate-500">
          You are looking at an earlier day. Records can only be added for
          today, so what happened is not rewritten later.
        </p>
      ) : null}
    </div>
  );
}

function MarkButton({
  label,
  icon,
  done,
  busy,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  done: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <Check size={14} />
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#0B5394] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {icon}
      {busy ? "Saving..." : label}
    </button>
  );
}
