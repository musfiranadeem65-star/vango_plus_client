"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RECENT_ROUTES } from "@/lib/admin/constants";
import type { Student } from "@/types/student";
import { getStudents } from "@/services/studentService";
import type { Driver } from "@/types/driver";
import type { Route } from "@/types/route";
import { getDrivers } from "@/services/driverService";
import { getRoutes, getStudentRouteAssignments } from "@/services/routeService";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface OverviewSectionProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

function OverviewSection({ title, href, children }: OverviewSectionProps) {
  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-primary md:text-2xl">
          {title}
        </h2>
        <Link
          href={href}
          className="font-[family-name:var(--font-inter)] text-xs font-semibold text-secondary underline"
        >
          View All
        </Link>
      </div>
      {children}
    </section>
  );
}

interface StudentRow {
  id: string;
  name: string;
  parentUserId: number;
  status: string;
}

interface DriverRow {
  id: string;
  name: string;
  phone: string;
}

interface RouteRow {
  id: string;
  name: string;
  status: string;
  students: number;
}

interface StudentRouteAssignment {
  id: number;
  studentId: number;
  routeId: number;
  status: string;
}

export function RecentStudentsTable() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getStudents();
        if (!active) return;

        const recent = data.slice(-3).map((student) => ({
          id: String(student.id),
          name: student.name,
          parentUserId: student.parentUserId,
          status: student.status,
        }));

        setStudents(recent);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load students.");
        setStudents([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadStudents();

    return () => {
      active = false;
    };
  }, []);

  return (
    <OverviewSection title="Recent Students" href="/admin/students">
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading students...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <DataTable
          data={students}
          columns={[
            {
              key: "student",
              header: "Student",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-sm font-bold text-primary">
                    {getInitials(row.name)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{row.name}</p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                      ID: {row.parentUserId}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "parent",
              header: "Parent",
              render: (row) => (
                <span className="font-[family-name:var(--font-inter)] text-muted">
                  {row.parentUserId}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              className: "text-right",
              render: (row) => (
                <div className="flex justify-end">
                  <StatusBadge tone="success">{row.status}</StatusBadge>
                </div>
              ),
            },
          ]}
        />
      )}
    </OverviewSection>
  );
}

export function RecentDriversTable() {
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [driversError, setDriversError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDrivers() {
      setIsLoadingDrivers(true);
      setDriversError(null);

      try {
        const data = await getDrivers();
        if (!active) return;

        setDrivers(
          data
            .slice(-3)
            .map((driver) => ({
              id: String(driver.id),
              name: driver.name,
              phone: driver.phone,
            }))
        );
      } catch (err) {
        if (!active) return;
        setDriversError(err instanceof Error ? err.message : "Unable to load drivers.");
        setDrivers([]);
      } finally {
        if (active) setIsLoadingDrivers(false);
      }
    }

    loadDrivers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <OverviewSection title="Recent Drivers" href="/admin/drivers">
      {isLoadingDrivers ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading drivers...
        </div>
      ) : driversError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          {driversError}
        </div>
      ) : (
        <DataTable
          data={drivers}
          columns={[
            {
              key: "driver",
              header: "Driver",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-sm font-bold text-secondary">
                    {getInitials(row.name)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{row.name}</p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                      {row.phone}
                    </p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}
    </OverviewSection>
  );
}

const routeStatusTone: Record<
  string,
  "success" | "alert" | "active" | "neutral"
> = {
  Completed: "success",
  Active: "active",
  Delayed: "alert",
  Scheduled: "neutral",
};

export function RecentRoutesOverviewTable() {
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [routesError, setRoutesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRoutes() {
      setIsLoadingRoutes(true);
      setRoutesError(null);

      try {
        const [routeData, assignments] = await Promise.all([
          getRoutes(),
          getStudentRouteAssignments(),
        ]);

        if (!active) return;

        const activeAssignments = assignments.filter(
          (assignment) => assignment.status === "Active"
        );

        const studentCountByRoute = activeAssignments.reduce<Record<number, number>>(
          (acc, assignment) => {
            acc[assignment.routeId] = (acc[assignment.routeId] ?? 0) + 1;
            return acc;
          },
          {}
        );

        setRoutes(
          routeData
            .slice(-4)
            .map((route) => ({
              id: String(route.id),
              name: route.name,
              status: route.status,
              students: studentCountByRoute[route.id] ?? 0,
            }))
        );
      } catch (err) {
        if (!active) return;
        setRoutesError(err instanceof Error ? err.message : "Unable to load routes.");
        setRoutes([]);
      } finally {
        if (active) setIsLoadingRoutes(false);
      }
    }

    loadRoutes();

    return () => {
      active = false;
    };
  }, []);

  return (
    <OverviewSection title="Recent Routes" href="/admin/routes">
      {isLoadingRoutes ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading routes...
        </div>
      ) : routesError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          {routesError}
        </div>
      ) : (
        <DataTable
          data={routes}
          columns={[
            {
              key: "route",
              header: "Route",
              render: (row) => (
                <div>
                  <p className="font-semibold text-foreground">{row.name}</p>
                </div>
              ),
            },
            {
              key: "students",
              header: "Students",
              render: (row) => (
                <span className="font-[family-name:var(--font-inter)] text-muted">
                  {row.students} students
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              className: "text-right",
              render: (row) => (
                <div className="flex justify-end">
                  <StatusBadge tone={routeStatusTone[row.status] ?? "neutral"}>
                    {row.status}
                  </StatusBadge>
                </div>
              ),
            },
          ]}
        />
      )}
    </OverviewSection>
  );
}
