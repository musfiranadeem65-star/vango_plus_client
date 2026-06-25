"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  CirclePlus,
  GripVertical,
  Home,
  MapPin,
  Menu,
  Plus,
  Save,
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

const routes: RouteCard[] = [
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

export function RoutesManagementPage() {
  const [selectedRoute, setSelectedRoute] = useState<RouteCard | null>(routes[0]);
  const [routeName, setRouteName] = useState("North Loop Express");
  const [assignDriver, setAssignDriver] = useState("David Anderson");

  const selectedRouteMeta = useMemo(() => {
    if (!selectedRoute) return null;
    return selectedRoute;
  }, [selectedRoute]);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col bg-[#F8FAFC] px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pb-10">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-[#0B5394]">
              <MapPin size={18} />
              <h1 className="text-base font-bold sm:text-lg">VanGo Plus</h1>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
              AM
            </div>
          </div>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Routes</h2>
              <p className="mt-1 text-sm text-slate-500">Manage school transportation loops</p>
            </div>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B5394] text-white shadow-sm transition hover:bg-[#084c7a]"
              aria-label="Add route"
            >
              <Plus size={18} />
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

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Detail
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl bg-[#0B5394] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                    >
                      Edit
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-4 flex w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:bg-slate-100"
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-[#0B5394]">
              <CirclePlus size={22} />
            </div>
            <span className="text-sm font-semibold text-slate-700">Create New Route</span>
          </button>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-200 bg-white px-2 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] sm:px-4 lg:hidden">
        {[
          { label: "Home", icon: Home },
          { label: "Routes", icon: MapPin, active: true },
          { label: "Alerts", icon: Bell },
          { label: "Profile", icon: UserCircle2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold ${
                item.active ? "text-[#0B5394]" : "text-slate-500"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <aside className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-6xl border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-12px_35px_rgba(15,23,42,0.12)] lg:static lg:mt-5 lg:max-w-none lg:rounded-[24px] lg:border lg:px-5 lg:py-5 lg:shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Route</h3>
            <p className="mt-1 text-sm text-slate-500">Modify route details and stop sequence</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close edit route"
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
              <button type="button" className="text-sm font-semibold text-[#0B5394]">
                + Add Stop
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {[
                { number: 1, name: "Maplewood Heights", time: "07:15 AM" },
                { number: 2, name: "Riverside Court", time: "07:32 AM" },
                { number: 3, name: "Lincoln Park", time: "07:48 AM" },
              ].map((stop) => (
                <div key={stop.number} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-sm">
                  <GripVertical size={16} className="text-slate-400" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                    {stop.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{stop.name}</p>
                    <p className="text-xs text-slate-500">ETA: {stop.time}</p>
                  </div>
                  <button type="button" className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-2xl bg-[#0B5394] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
          >
            Save Route
          </button>
        </div>
      </aside>
    </div>
  );
}
