"use client";

import { useState } from "react";
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

interface RouteCard {
  id: number;
  name: string;
  status: "Active" | "Maintenance";
  driver: string;
  stops: number;
  students: number;
  accent: "blue" | "orange";
}

const seedRoutes: RouteCard[] = [
  {
    id: 1,
    name: "North Loop Express",
    status: "Active",
    driver: "David Anderson",
    stops: 12,
    students: 24,
    accent: "blue",
  },
  {
    id: 2,
    name: "West Side Shuttle",
    status: "Maintenance",
    driver: "Mina Patel",
    stops: 8,
    students: 16,
    accent: "orange",
  },
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Maintenance: "bg-amber-50 text-amber-700",
};

interface RouteStop {
  id: number;
  name: string;
  time: string;
}

const defaultStops: RouteStop[] = [
  { id: 1, name: "Maplewood Heights", time: "07:15 AM" },
  { id: 2, name: "Riverside Court", time: "07:32 AM" },
  { id: 3, name: "Lincoln Park", time: "07:48 AM" },
];

export function RoutesManagementPage() {
  const [routes, setRoutes] = useState<RouteCard[]>(seedRoutes);
  const [selectedRoute, setSelectedRoute] = useState<RouteCard | null>(seedRoutes[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [routeName, setRouteName] = useState("");
  const [assignDriver, setAssignDriver] = useState("David Anderson");
  const [stops, setStops] = useState<RouteStop[]>(defaultStops);

  function openAddRoute() {
    setFormMode("add");
    setEditingId(null);
    setRouteName("");
    setAssignDriver("David Anderson");
    setStops([]);
    setIsFormOpen(true);
  }

  function openEditRoute(route: RouteCard) {
    setFormMode("edit");
    setEditingId(route.id);
    setSelectedRoute(route);
    setRouteName(route.name);
    setAssignDriver(route.driver);
    setStops(defaultStops);
    setIsFormOpen(true);
  }

  function handleSaveRoute() {
    if (!routeName.trim()) return;

    const stopCount = stops.filter((stop) => stop.name.trim()).length;

    if (formMode === "add") {
      setRoutes((current) => [
        ...current,
        {
          id: Date.now(),
          name: routeName.trim(),
          status: "Active",
          driver: assignDriver,
          stops: stopCount,
          students: 0,
          accent: "blue",
        },
      ]);
    } else if (editingId !== null) {
      setRoutes((current) =>
        current.map((route) =>
          route.id === editingId
            ? {
                ...route,
                name: routeName.trim(),
                driver: assignDriver,
                stops: stopCount,
              }
            : route
        )
      );
    }

    setIsFormOpen(false);
  }

  function addStop() {
    setStops((current) => [
      ...current,
      { id: Date.now(), name: "", time: "" },
    ]);
  }

  function removeStop(id: number) {
    setStops((current) => current.filter((stop) => stop.id !== id));
  }

  function updateStop(id: number, field: "name" | "time", value: string) {
    setStops((current) =>
      current.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop))
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Routes</h2>
              <p className="mt-1 text-sm text-slate-500">Manage school transportation loops</p>
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
          <div className="space-y-3">
            {routes.map((route) => {
              const active = selectedRoute?.id === route.id;
              return (
                <article
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`cursor-pointer rounded-[24px] border p-4 shadow-sm transition hover:shadow-md ${
                    active ? "border-[#0B5394] bg-white" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{route.name}</h3>
                      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[route.status]}`}>
                        {route.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={`Open options for ${route.name}`}
                    >
                      <GripVertical size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6FF] text-[#0B5394]">
                      <UserCircle2 size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Driver</p>
                      <p className="text-sm font-semibold text-slate-700">{route.driver}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                      <MapPin size={16} className="text-slate-500" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Stops</p>
                        <p className="text-sm font-semibold text-slate-700">{route.stops}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5">
                      <Users size={16} className="text-slate-500" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Students</p>
                        <p className="text-sm font-semibold text-slate-700">{route.students}</p>
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
            })}
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
                    {formMode === "add" ? "Add Route" : "Edit Route"}
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
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Route Name</label>
                  <input
                    value={routeName}
                    onChange={(event) => setRouteName(event.target.value)}
                    placeholder="e.g. North Loop Express"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Assign Driver</label>
                  <div className="relative">
                    <select
                      value={assignDriver}
                      onChange={(event) => setAssignDriver(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                    >
                      <option>David Anderson</option>
                      <option>Mina Patel</option>
                      <option>Peter Brooks</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">Route Sequence</h4>
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
                        No stops yet. Tap “Add Stop” to build the sequence.
                      </p>
                    ) : (
                      stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm">
                          <GripVertical size={16} className="text-slate-400" />
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <input
                              value={stop.name}
                              onChange={(event) => updateStop(stop.id, "name", event.target.value)}
                              placeholder="Stop name"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B5394] focus:bg-white"
                            />
                            <input
                              value={stop.time}
                              onChange={(event) => updateStop(stop.id, "time", event.target.value)}
                              placeholder="ETA (e.g. 07:15 AM)"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 outline-none transition focus:border-[#0B5394] focus:bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStop(stop.id)}
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
                  className="rounded-2xl bg-[#0B5394] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                >
                  Save Route
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
