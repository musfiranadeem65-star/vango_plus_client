"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { DASHBOARD_STATS } from "@/lib/admin/constants";
import { getDrivers } from "@/services/driverService";
import { getRoutes } from "@/services/routeService";
import { getStudents } from "@/services/studentService";
import { getSubscriptions } from "@/services/subscriptionService";

export function DashboardStats() {
  const [students, setStudents] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [driversError, setDriversError] = useState<string | null>(null);
  const [routesError, setRoutesError] = useState<string | null>(null);
  const [subscriptionsError, setSubscriptionsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadKpis() {
      setIsLoadingStudents(true);
      setIsLoadingDrivers(true);
      setIsLoadingRoutes(true);
      setIsLoadingSubscriptions(true);

      setStudentsError(null);
      setDriversError(null);
      setRoutesError(null);
      setSubscriptionsError(null);

      const studentPromise = getStudents().then(
        (data) => ({ status: "fulfilled", data } as const),
        (error) => ({ status: "rejected", error } as const)
      );
      const driverPromise = getDrivers().then(
        (data) => ({ status: "fulfilled", data } as const),
        (error) => ({ status: "rejected", error } as const)
      );
      const routePromise = getRoutes().then(
        (data) => ({ status: "fulfilled", data } as const),
        (error) => ({ status: "rejected", error } as const)
      );
      const subscriptionPromise = getSubscriptions().then(
        (data) => ({ status: "fulfilled", data } as const),
        (error) => ({ status: "rejected", error } as const)
      );

      const [studentResult, driverResult, routeResult, subscriptionResult] = await Promise.all([
        studentPromise,
        driverPromise,
        routePromise,
        subscriptionPromise,
      ]);

      if (!active) return;

      if (studentResult.status === "fulfilled") {
        setStudents(studentResult.data);
      } else {
        setStudentsError(studentResult.error instanceof Error ? studentResult.error.message : "Unable to load students.");
        setStudents([]);
      }

      if (driverResult.status === "fulfilled") {
        setDrivers(driverResult.data);
      } else {
        setDriversError(driverResult.error instanceof Error ? driverResult.error.message : "Unable to load drivers.");
        setDrivers([]);
      }

      if (routeResult.status === "fulfilled") {
        setRoutes(routeResult.data);
      } else {
        setRoutesError(routeResult.error instanceof Error ? routeResult.error.message : "Unable to load routes.");
        setRoutes([]);
      }

      if (subscriptionResult.status === "fulfilled") {
        setSubscriptions(subscriptionResult.data);
      } else {
        setSubscriptionsError(
          subscriptionResult.error instanceof Error ? subscriptionResult.error.message : "Unable to load subscriptions."
        );
        setSubscriptions([]);
      }

      setIsLoadingStudents(false);
      setIsLoadingDrivers(false);
      setIsLoadingRoutes(false);
      setIsLoadingSubscriptions(false);
    }

    loadKpis();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () =>
      DASHBOARD_STATS.map((stat) => {
        let value = stat.value;

        if (stat.label === "Students") {
          value = isLoadingStudents ? "..." : studentsError ? "Error" : String(students.length);
        }

        if (stat.label === "Drivers") {
          value = isLoadingDrivers ? "..." : driversError ? "Error" : String(drivers.length);
        }

        if (stat.label === "Routes") {
          value = isLoadingRoutes ? "..." : routesError ? "Error" : String(routes.length);
        }

        if (stat.label === "Subs Due") {
          value = isLoadingSubscriptions ? "..." : subscriptionsError ? "Error" : String(subscriptions.length);
        }

        return {
          ...stat,
          value,
        };
      }),
    [drivers.length, driversError, isLoadingDrivers, isLoadingRoutes, isLoadingStudents, isLoadingSubscriptions, routes.length, students.length, studentsError, subscriptions.length, subscriptionsError]
  );

  return (
    <section>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
            badge={stat.badge}
            href={stat.href}
            className="md:min-w-0"
          />
        ))}
      </div>
    </section>
  );
}
