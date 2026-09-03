"use client";

import { useEffect, useState } from "react";
import { Info, Phone, Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getDriverById } from "@/services/driverService";
import { getRouteStops } from "@/services/routeService";
import { getStudentSchedule, getStudentsByParentId } from "@/services/studentService";
import { getUserByEmail } from "@/services/userService";
import type { Driver } from "@/types/driver";
import type { RouteStop } from "@/types/route";
import type { Student } from "@/types/student";

interface Stop {
  time: string;
  label: string;
  current?: boolean;
}

function formatTime(value: string): string {
  if (!value) return "";
  const date = new Date(`1970-01-01T${value}`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

function getDriverRating(driver: Driver): string | number {
  return (driver as Driver & { rating?: string | number }).rating ?? "-";
}

function mapStops(routeStops: RouteStop[]): Stop[] {
  return [...routeStops]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((stop, index) => ({
      time: formatTime(stop.arrivalTime),
      label: stop.stopName,
      current: index === 1,
    }));
}

export default function TransportSchedulePage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeBadge, setRouteBadge] = useState("");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;
    let active = true;

    async function loadChildren() {
      setLoadingChildren(true);
      setError(null);
      try {
        const parentId = currentUser.id ?? (await getUserByEmail(currentUser.email)).id;
        console.log("[schedule] resolved parentId", parentId);
        if (!parentId) throw new Error("Unable to determine your parent account.");
        const result = await getStudentsByParentId(Number(parentId));
        if (active) {
          setChildren(result);
          setSelectedId(result[0]?.id ?? null);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load your children.");
      } finally {
        if (active) setLoadingChildren(false);
      }
    }

    void loadChildren();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!selectedId) return;
    const studentId = selectedId;
    let active = true;

    async function loadSchedule() {
      setLoadingSchedule(true);
      setLoadingDriver(false);
      setError(null);
      setStops([]);
      setDriver(null);
      try {
        const schedule = await getStudentSchedule(studentId);
        let scheduleStops = schedule.stops;
        if (!scheduleStops.length && schedule.routeId) {
          scheduleStops = await getRouteStops(schedule.routeId);
        }
        if (!active) return;
        setStops(mapStops(scheduleStops));
        setRouteBadge(schedule.routeName ?? "");
        if (schedule.driverId) {
          setLoadingDriver(true);
          try {
            const loadedDriver = await getDriverById(schedule.driverId);
            if (active) setDriver(loadedDriver);
          } catch (cause) {
            if (active) setError(cause instanceof Error ? cause.message : "Unable to load driver details.");
          } finally {
            if (active) setLoadingDriver(false);
          }
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load this child's schedule.");
      } finally {
        if (active) setLoadingSchedule(false);
      }
    }

    void loadSchedule();
    return () => { active = false; };
  }, [selectedId]);

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
          Transport Schedule
        </h1>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          Track today&apos;s route stops and driver details for each child.
        </p>
      </section>

      {loadingChildren ? <p className="text-sm font-medium text-on-surface-variant">Loading children...</p> : null}
      {error ? <p role="alert" className="text-sm font-medium text-tertiary">{error}</p> : null}
      {!loadingChildren && !children.length ? <p className="text-sm font-medium text-on-surface-variant">No children found for this account.</p> : null}

      {children.length ? (
        <>
          <div className="inline-flex w-fit gap-1 rounded-full bg-surface-container p-1">
            {children.map((child) => {
              const isSelected = child.id === selectedId;
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedId(child.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-primary text-white shadow-[var(--shadow-card)]"
                      : "text-on-surface-variant hover:text-foreground"
                  }`}
                >
                  {child.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
            <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Route Info</h2>
                <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container">
                  {routeBadge}
                </span>
              </div>

              {loadingSchedule ? <p className="mt-5 text-sm font-medium text-on-surface-variant">Loading schedule...</p> : null}
              {!loadingSchedule && !stops.length ? <p className="mt-5 text-sm font-medium text-on-surface-variant">No schedule available for this child.</p> : null}
              {!loadingSchedule && stops.length ? (
                <ol className="mt-5">
                  {stops.map((stop, index) => {
                    const isLast = index === stops.length - 1;
                    return (
                      <li key={`${stop.label}-${index}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${stop.current ? "border-secondary bg-secondary" : "border-outline-variant bg-surface"}`}>
                            {stop.current ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                          </span>
                          {!isLast ? <span className="my-1 w-0.5 flex-1 bg-outline-variant" /> : null}
                        </div>
                        <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                          <p className={`font-[family-name:var(--font-inter)] text-xs font-semibold ${stop.current ? "text-secondary" : "text-on-surface-variant"}`}>
                            {stop.time}
                          </p>
                          <p className={`mt-0.5 text-sm font-semibold ${stop.current ? "text-secondary" : "text-foreground"}`}>
                            {stop.label}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </section>

            <aside className="flex flex-col gap-4">
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-bold text-foreground">Driver Info</h2>
                {loadingDriver ? <p className="mt-4 text-sm font-medium text-on-surface-variant">Loading driver...</p> : null}
                {!loadingDriver && driver ? (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                      {getInitials(driver.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{driver.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        <Star size={13} className="fill-tertiary text-tertiary" />
                        {getDriverRating(driver)} · Driver Rating
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        <Phone size={13} className="text-muted" />
                        {driver.phone}
                      </p>
                    </div>
                    <a href={`tel:${driver.phone.replace(/\s+/g, "")}`} className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white transition hover:opacity-90" aria-label={`Call ${driver.name}`}>
                      <Phone size={18} />
                    </a>
                  </div>
                ) : null}
                {!loadingDriver && !driver ? <p className="mt-4 text-sm font-medium text-on-surface-variant">No driver assigned.</p> : null}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-bright p-3">
                  <Info size={16} className="mt-0.5 shrink-0 text-muted" />
                  <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Contact admin for emergencies. Direct calls are for logistics only.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </>
      ) : null}
    </div>
  );
}