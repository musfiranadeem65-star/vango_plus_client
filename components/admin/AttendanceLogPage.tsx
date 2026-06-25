"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Download,
  Home,
  Menu,
  Route,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react";

interface AttendanceEntry {
  id: number;
  dateLabel: string;
  student: string;
  route: string;
  driver: string;
  time: string;
  status: "Drop-off" | "Pickup";
  initials: string;
  accent: "mint" | "blue";
}

const attendanceData: AttendanceEntry[] = [
  {
    id: 1,
    dateLabel: "Today, Oct 24",
    student: "Emma Mitchell",
    route: "Route: North Star 4",
    driver: "Sarah Jenkins",
    time: "03:42 PM",
    status: "Drop-off",
    initials: "EM",
    accent: "mint",
  },
  {
    id: 2,
    dateLabel: "Today, Oct 24",
    student: "Liam Mitchell",
    route: "Route: West Valley B",
    driver: "Marcus Lee",
    time: "03:15 PM",
    status: "Pickup",
    initials: "LM",
    accent: "blue",
  },
  {
    id: 3,
    dateLabel: "Yesterday, Oct 23",
    student: "Sophia Ortiz",
    route: "Route: Harbor Loop",
    driver: "Nina Cole",
    time: "08:10 AM",
    status: "Drop-off",
    initials: "SO",
    accent: "mint",
  },
];

const filterPills = [
  { label: "Today", icon: CalendarDays },
  { label: "North Route", icon: Route },
  { label: "Driver Smith", icon: Users },
];

export function AttendanceLogPage() {
  const [activeFilter, setActiveFilter] = useState("Today");

  const filteredEntries = useMemo(() => {
    if (activeFilter === "Today") return attendanceData.filter((entry) => entry.dateLabel.includes("Today"));
    if (activeFilter === "North Route") return attendanceData.filter((entry) => entry.route.includes("North"));
    return attendanceData.filter((entry) => entry.driver.includes("Smith") || entry.driver.includes("Sarah"));
  }, [activeFilter]);

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
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5394] text-sm font-semibold text-white">
                AM
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Attendance Log</h2>
              <p className="mt-1 text-sm text-slate-500">Real-time transportation tracking</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0B5394] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#084c7a]"
            >
              <Download size={16} />
              <span className="leading-tight text-left">
                Export
                <span className="block text-[11px] font-normal text-slate-100">CSV</span>
              </span>
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm">
            <Search size={17} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search student name..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {filterPills.map((pill) => {
              const Icon = pill.icon;
              const active = activeFilter === pill.label;
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => setActiveFilter(pill.label)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    active ? "border-[#0B5394] bg-[#0B5394] text-white" : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <Icon size={15} />
                  {pill.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <section key={entry.id}>
                <div className="mb-3 text-sm font-semibold text-[#0B5394]">{entry.dateLabel}</div>
                <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-sm font-semibold text-[#0B5394]">
                        {entry.initials}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{entry.student}</h3>
                        <p className="mt-1 text-sm text-slate-500">{entry.route}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${entry.accent === "mint" ? "bg-emerald-50 text-emerald-700" : "bg-[#EAF6FF] text-[#0B5394]"}`}>
                      {entry.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound size={16} className="text-slate-400" />
                      <span>Driver: {entry.driver}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0B5394]">
                      <Clock3 size={16} />
                      {entry.time}
                    </div>
                  </div>
                </article>
              </section>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-slate-200 bg-white px-2 py-3 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] sm:px-4 lg:hidden">
        {[
          { label: "Dashboard", icon: Home },
          { label: "Students", icon: Users },
          { label: "Logs", icon: CalendarDays, active: true },
          { label: "Routes", icon: Waypoints },
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
