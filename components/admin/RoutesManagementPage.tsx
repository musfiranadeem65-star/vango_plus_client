"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  GripVertical,
  MapPin,
  Plus,
  Trash2,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import type { Driver } from "@/types/driver";
import type { Route, RouteStop } from "@/types/route";
import {
  createRoute,
  deleteRoute,
  getRoutes,
  updateRoute,
  updateRouteStatus,
} from "@/services/routeService";
import { getDrivers } from "@/services/driverService";
import {
  getStudents,
  getStudentRouteAssignments,
} from "@/services/studentService";

interface RouteCard extends Route {
  driver: string;
  stops: number;
  students: number;
  studentNames: string[];
  accent: "blue" | "orange";
}

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Maintenance: "bg-amber-50 text-amber-700",
  Inactive: "bg-slate-100 text-slate-600",
};

// Driver selection is populated from the backend drivers API

export function RoutesManagementPage() {
  const [routes, setRoutes] = useState<RouteCard[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteCard | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [routeName, setRouteName] = useState("");
  const [driverId, setDriverId] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [routeStatus, setRouteStatus] = useState<Route["status"]>("Active");
  const [routeDescription, setRouteDescription] = useState("");
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRoutes() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // ---------------------------------------------
        // 1. Load routes first
        // ---------------------------------------------
        const routeData = await getRoutes();

        // ---------------------------------------------
        // 2. Load students + route assignments
        //    If these APIs fail, routes will still load.
        // ---------------------------------------------
        let studentsData: Awaited<ReturnType<typeof getStudents>> = [];
        let assignments: Awaited<
          ReturnType<typeof getStudentRouteAssignments>
        > = [];

        try {
          const [studentsResult, assignmentsResult] = await Promise.all([
            getStudents(),
            getStudentRouteAssignments(),
          ]);

          studentsData = studentsResult;
          assignments = assignmentsResult;
        } catch (studentRouteError) {
          console.error(
            "[RoutesManagementPage] Unable to load route students:",
            studentRouteError
          );

          // Keep routes working even if student assignment API fails.
          studentsData = [];
          assignments = [];
        }

        // ---------------------------------------------
        // 3. Match students with their routes
        // ---------------------------------------------
        const mappedRoutes: RouteCard[] = routeData.map((route, index) => {
          const routeAssignments = assignments.filter(
            (assignment) => assignment.routeId === route.id
          );

          // Prevent the same student from being counted twice
          // if duplicate assignment records exist.
          const assignedStudentIds = new Set(
            routeAssignments.map((assignment) => assignment.studentId)
          );

          const assignedStudents = studentsData.filter((student) =>
            assignedStudentIds.has(student.id)
          );

          return {
            ...route,
            driver: `Driver ${route.driverId}`,
            stops: route.routeStops?.length ?? 0,
            students: assignedStudents.length,
            studentNames: assignedStudents.map((student) => student.name),
            accent: index % 2 === 0 ? "blue" : "orange",
          };
        });

        setRoutes(mappedRoutes);
        setSelectedRoute(mappedRoutes[0] ?? null);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load routes."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadRoutes();
  }, []);

  function openAddRoute() {
    setFormMode("add");
    setEditingId(null);
    setRouteName("");
    setDriverId("");
    setDriverName("");
    setRouteStatus("Active");
    setRouteDescription("");
    setStops([]);
    setErrorMessage("");
    setDrivers([]);
    setDriversError("");
    setIsFormOpen(true);
    loadDrivers();
  }

  function openEditRoute(route: RouteCard) {
    setFormMode("edit");
    setEditingId(route.id);
    setSelectedRoute(route);
    setRouteName(route.name);
    setDriverId(String(route.driverId));
    setDriverName(route.driver || "");
    setRouteStatus(route.status);
    setRouteDescription(route.description ?? "");
    setStops(route.routeStops ?? []);
    setErrorMessage("");
    setDrivers([]);
    setDriversError("");
    setIsFormOpen(true);
    loadDrivers();
  }

  async function handleSaveRoute() {
    if (!routeName.trim()) {
      setErrorMessage("Route name is required.");
      return;
    }

    if (
      !driverId ||
      Number(driverId) <= 0 ||
      Number.isNaN(Number(driverId))
    ) {
      setErrorMessage("Driver selection is required.");
      return;
    }

    const validStops = stops
      .filter((stop) => stop.stopName.trim())
      .map((stop, index) => ({
        stopName: stop.stopName.trim(),
        arrivalTime: stop.arrivalTime,
        orderIndex: index + 1,
      }));

    const payload = {
      name: routeName.trim(),
      status: routeStatus,
      driverId: Number(driverId),
      description: routeDescription,
      routeStops: validStops,
    };

    setIsSaving(true);
    setErrorMessage("");

    let savedRouteId: number | null = editingId;

    try {
      if (formMode === "add") {
        const created = await createRoute(payload);
        savedRouteId = created.id;

        const newRoute: RouteCard = {
          ...created,
          driver: driverName || `Driver ${created.driverId}`,
          stops: created.routeStops?.length ?? validStops.length,
          students: 0,
          studentNames: [],
          accent: routes.length % 2 === 0 ? "blue" : "orange",
        };

        setRoutes((current) => [newRoute, ...current]);
        setSelectedRoute(newRoute);
      } else if (editingId !== null) {
        await updateRoute(editingId, payload);

        setRoutes((current) =>
          current.map((route) =>
            route.id === editingId
              ? {
                  ...route,
                  name: payload.name,
                  status: payload.status,
                  driverId: payload.driverId,
                  description: payload.description,
                  driver: driverName || route.driver,
                  stops: validStops.length,
                  routeStops: route.routeStops ?? [],
                  // Keep existing assigned students
                  students: route.students,
                  studentNames: route.studentNames,
                }
              : route
          )
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save route."
      );
    } finally {
      setIsSaving(false);
      setIsFormOpen(false);
    }
  }

  async function loadDrivers() {
    setDriversLoading(true);
    setDriversError("");

    try {
      const data = await getDrivers();
      setDrivers(data);

      if (formMode === "edit" && editingId !== null) {
        const matchedDriver = data.find(
          (driver) => driver.id === Number(driverId)
        );

        if (matchedDriver) {
          setDriverName(matchedDriver.name);
          setDriverId(String(matchedDriver.id));
        }
      }
    } catch (error) {
      setDriversError(
        error instanceof Error
          ? error.message
          : "Unable to load drivers."
      );
    } finally {
      setDriversLoading(false);
    }
  }

  function addStop() {
    setStops((current) => [
      ...current,
      {
        id: Date.now(),
        routeId: editingId ?? 0,
        stopName: "",
        arrivalTime: "",
        orderIndex: current.length + 1,
      },
    ]);
  }

  function selectDriver(selectedId: string) {
    setDriverId(selectedId);

    const id = Number(selectedId);
    const driver = drivers.find((item) => item.id === id);

    setDriverName(driver?.name ?? "");
  }

  function removeStop(id: number) {
    setStops((current) =>
      current.filter((stop) => stop.id !== id)
    );
  }

  function updateStop(
    id: number,
    field: "stopName" | "arrivalTime",
    value: string
  ) {
    setStops((current) =>
      current.map((stop) =>
        stop.id === id
          ? { ...stop, [field]: value }
          : stop
      )
    );
  }

  async function handleDeleteRoute(id: number) {
    setDeletingId(id);
    setErrorMessage("");

    try {
      await deleteRoute(id);

      setRoutes((current) => {
        const nextRoutes = current.filter(
          (route) => route.id !== id
        );

        if (selectedRoute?.id === id) {
          setSelectedRoute(nextRoutes[0] ?? null);
        }

        return nextRoutes;
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete route."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdateRouteStatus(
    id: number,
    status: Route["status"]
  ) {
    setStatusUpdatingId(id);
    setErrorMessage("");

    try {
      await updateRouteStatus(id, status);

      setRoutes((current) =>
        current.map((route) =>
          route.id === id
            ? { ...route, status }
            : route
        )
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update route status."
      );
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">
                Routes
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage school transportation loops
              </p>
            </div>

            <button
              type="button"
              onClick={openAddRoute}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084c7a]"
            >
              <Plus size={16} />
              Add Route
            </button>
          </div>
        </header>

        <div className="px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                Loading routes...
              </div>
            ) : (
              routes.map((route) => {
                const active =
                  selectedRoute?.id === route.id;

                return (
                  <article
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`cursor-pointer rounded-[24px] border p-4 shadow-sm transition hover:shadow-md ${
                      active
                        ? "border-[#0B5394] bg-white"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {route.name}
                        </h3>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[route.status]}`}
                        >
                          {route.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={route.status}
                          onChange={(event) =>
                            handleUpdateRouteStatus(
                              route.id,
                              event.target.value as Route["status"]
                            )
                          }
                          disabled={
                            statusUpdatingId === route.id
                          }
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition disabled:opacity-50"
                        >
                          <option value="Active">
                            Active
                          </option>

                          <option value="Inactive">
                            Inactive
                          </option>

                          <option value="Maintenance">
                            Maintenance
                          </option>
                        </select>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteRoute(route.id);
                          }}
                          disabled={
                            deletingId === route.id
                          }
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6FF] text-[#0B5394]">
                        <UserCircle2 size={18} />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Driver
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {route.driver}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <MapPin
                          size={16}
                          className="text-slate-500"
                        />

                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Stops
                          </p>

                          <p className="text-sm font-semibold text-slate-700">
                            {route.stops}
                          </p>
                        </div>
                      </div>

                      {/* -----------------------------------
                          STUDENTS
                          Existing UI styling preserved.
                          Only student count + names added.
                      ----------------------------------- */}
                      <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <Users
                          size={16}
                          className="mt-0.5 text-slate-500"
                        />

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Students
                          </p>

                          <p className="text-sm font-semibold text-slate-700">
                            {route.students}
                          </p>

                          {route.studentNames.length > 0 ? (
                            <div className="mt-1 space-y-0.5">
                              {route.studentNames.map(
                                (studentName, index) => (
                                  <p
                                    key={`${route.id}-student-${index}`}
                                    className="truncate text-xs text-slate-500"
                                  >
                                    • {studentName}
                                  </p>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="mt-1 text-xs text-slate-400">
                              No students assigned
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditRoute(route);
                        }}
                        className="w-full rounded-2xl bg-[#0B5394] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                      >
                        Edit
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {formMode === "add"
                      ? "Add Route"
                      : "Edit Route"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {formMode === "add"
                      ? "Create a new transportation loop"
                      : "Modify route details and stop sequence"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                  aria-label="Close route form"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Route Name
                  </label>

                  <input
                    value={routeName}
                    onChange={(event) =>
                      setRouteName(event.target.value)
                    }
                    placeholder="e.g. North Loop Express"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Driver Name
                  </label>

                  <div className="relative">
                    <select
                      value={driverId}
                      onChange={(event) =>
                        selectDriver(event.target.value)
                      }
                      disabled={
                        driversLoading ||
                        drivers.length === 0
                      }
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option
                        value=""
                        disabled={
                          driversLoading ||
                          drivers.length > 0
                        }
                      >
                        {driversLoading
                          ? "Loading drivers..."
                          : "Select driver"}
                      </option>

                      {drivers.length === 0 &&
                      !driversLoading ? (
                        <option value="" disabled>
                          No drivers available
                        </option>
                      ) : null}

                      {drivers.map((driver) => (
                        <option
                          key={driver.id}
                          value={driver.id}
                        >
                          {driver.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {driversError ? (
                    <p className="mt-2 text-sm text-rose-600">
                      {driversError}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Driver ID
                  </label>

                  <div className="relative">
                    <select
                      value={driverId}
                      onChange={(event) =>
                        selectDriver(event.target.value)
                      }
                      disabled={
                        driversLoading ||
                        drivers.length === 0
                      }
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option
                        value=""
                        disabled={
                          driversLoading ||
                          drivers.length > 0
                        }
                      >
                        {driversLoading
                          ? "Loading drivers..."
                          : "Select driver"}
                      </option>

                      {drivers.length === 0 &&
                      !driversLoading ? (
                        <option value="" disabled>
                          No drivers available
                        </option>
                      ) : null}

                      {drivers.map((driver) => (
                        <option
                          key={driver.id}
                          value={driver.id}
                        >
                          {driver.id}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <div className="relative">
                    <select
                      value={routeStatus}
                      onChange={(event) =>
                        setRouteStatus(
                          event.target.value as Route["status"]
                        )
                      }
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="Maintenance">
                        Maintenance
                      </option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={routeDescription}
                    onChange={(event) =>
                      setRouteDescription(event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                    placeholder="Route details or notes"
                  />
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Route Sequence
                    </h4>

                    <button
                      type="button"
                      onClick={addStop}
                      className="text-sm font-semibold text-[#0B5394]"
                    >
                      + Add Stop
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {stops.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-xs text-slate-400">
                        No stops yet. Tap “Add Stop” to build
                        the sequence.
                      </p>
                    ) : (
                      stops.map((stop, index) => (
                        <div
                          key={`${stop.id}-${index}`}
                          className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm"
                        >
                          <GripVertical
                            size={16}
                            className="text-slate-400"
                          />

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <input
                              value={stop.stopName}
                              onChange={(event) =>
                                updateStop(
                                  stop.id,
                                  "stopName",
                                  event.target.value
                                )
                              }
                              placeholder="Stop name"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B5394] focus:bg-white"
                            />

                            <input
                              value={stop.arrivalTime}
                              onChange={(event) =>
                                updateStop(
                                  stop.id,
                                  "arrivalTime",
                                  event.target.value
                                )
                              }
                              placeholder="ETA (e.g. 07:15 AM)"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 outline-none transition focus:border-[#0B5394] focus:bg-white"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeStop(stop.id)
                            }
                            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                            aria-label="Remove stop"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveRoute}
                  disabled={isSaving}
                  className="rounded-2xl bg-[#0B5394] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Route"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}