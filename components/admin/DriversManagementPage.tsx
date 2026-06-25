"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Home,
  Menu,
  PencilLine,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Slash,
  X,
} from "lucide-react";

interface DriverCard {
  id: number;
  name: string;
  status: "Active" | "Inactive";
  phone: string;
  license: string;
  route: string;
  routeLabel: string;
  initials: string;
}

const drivers: DriverCard[] = [
  {
    id: 1,
    name: "David Anderson",
    status: "Active",
    phone: "+1 (555) 010-4821",
    license: "TX-482149",
    route: "Northview Academy AM",
    routeLabel: "Assigned Route",
    initials: "DA",
  },
  {
    id: 2,
    name: "Mina Patel",
    status: "Inactive",
    phone: "+1 (555) 014-7712",
    license: "TX-881204",
    route: "No route history",
    routeLabel: "Unassigned",
    initials: "MP",
  },
];

export function DriversManagementPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col bg-[#F8FAFC] px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pb-8">
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
              <ShieldCheck size={18} />
              <h1 className="text-base font-bold sm:text-lg">VanGo Plus</h1>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
              AM
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Drivers Management</h2>
              <p className="mt-1 text-sm text-slate-500">24 Active Fleet Drivers</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Plus size={16} />
              Add Driver
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
            <Search size={17} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </header>

        <div className="flex flex-col gap-6 px-3 py-4 sm:px-4 lg:flex-row lg:px-5 lg:py-5">
          <section className="flex-1 space-y-3">
            {drivers.map((driver) => (
              <article key={driver.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-sm font-semibold text-[#0B5394]">
                      {driver.initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{driver.name}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${driver.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {driver.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Fleet Driver</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-700 transition hover:bg-sky-100"
                      aria-label={`Edit ${driver.name}`}
                    >
                      <PencilLine size={16} />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      aria-label={`Toggle ${driver.name}`}
                    >
                      <Slash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{driver.phone}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">License No.</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{driver.license}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0B5394] shadow-sm">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Assigned Route</p>
                        <p className="text-sm font-semibold text-[#0B5394]">{driver.route}</p>
                      </div>
                    </div>
                    {driver.status === "Inactive" ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        Unassigned
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className={`${isDrawerOpen ? "block" : "hidden lg:block"} w-full lg:w-[340px]`}>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0B5394]">Quick Setup</p>
                  <h3 className="text-xl font-semibold text-slate-900">Add New Driver</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                  aria-label="Close add driver form"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john.doe@vango.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">License Number</label>
                  <input
                    type="text"
                    placeholder="TX-000000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Assign Route</label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white">
                      <option value="">Select a route...</option>
                      <option>Northview Academy AM</option>
                      <option>West Side Shuttle</option>
                      <option>River Loop</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
                >
                  Create Driver Profile
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-200 bg-white px-2 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] sm:px-4 lg:hidden">
        {[
          { label: "Dashboard", icon: Home },
          { label: "Students", icon: CircleUserRound },
          { label: "Drivers", icon: ShieldCheck, active: true },
          { label: "Settings", icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold ${
                item.active ? "text-[#0F766E]" : "text-slate-500"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
