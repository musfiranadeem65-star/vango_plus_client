"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  PencilLine,
  Plus,
  Search,
  X,
} from "lucide-react";

interface DriverCard {
  id: number;
  name: string;
  status: "Active" | "Inactive";
  phone: string;
  email: string;
  license: string;
  route: string;
  routeLabel: string;
  initials: string;
}

const seedDrivers: DriverCard[] = [
  {
    id: 1,
    name: "David Anderson",
    status: "Active",
    phone: "+1 (555) 010-4821",
    email: "david.anderson@vango.com",
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
    email: "mina.patel@vango.com",
    license: "TX-881204",
    route: "No route history",
    routeLabel: "Unassigned",
    initials: "MP",
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DriversManagementPage() {
  const [drivers, setDrivers] = useState<DriverCard[]>(seedDrivers);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLicense, setFormLicense] = useState("");
  const [formRoute, setFormRoute] = useState("");

  const filteredDrivers = drivers.filter((driver) =>
    [driver.name, driver.phone, driver.license, driver.route]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  function openAddDriver() {
    setFormMode("add");
    setEditingId(null);
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormLicense("");
    setFormRoute("");
    setIsDrawerOpen(true);
  }

  function openEditDriver(driver: DriverCard) {
    setFormMode("edit");
    setEditingId(driver.id);
    setFormName(driver.name);
    setFormPhone(driver.phone);
    setFormEmail(driver.email);
    setFormLicense(driver.license);
    setFormRoute(driver.routeLabel === "Unassigned" ? "" : driver.route);
    setIsDrawerOpen(true);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formName.trim()) return;

    const hasRoute = Boolean(formRoute);
    const route = hasRoute ? formRoute : "No route history";
    const routeLabel = hasRoute ? "Assigned Route" : "Unassigned";

    if (formMode === "add") {
      setDrivers((current) => [
        {
          id: Date.now(),
          name: formName.trim(),
          status: "Active",
          phone: formPhone || "—",
          email: formEmail,
          license: formLicense || "—",
          route,
          routeLabel,
          initials: getInitials(formName),
        },
        ...current,
      ]);
    } else if (editingId !== null) {
      setDrivers((current) =>
        current.map((driver) =>
          driver.id === editingId
            ? {
                ...driver,
                name: formName.trim(),
                phone: formPhone || driver.phone,
                email: formEmail,
                license: formLicense || driver.license,
                route,
                routeLabel,
                initials: getInitials(formName),
              }
            : driver
        )
      );
    }

    setIsDrawerOpen(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-[28px]">Drivers Management</h2>
              <p className="mt-1 text-sm text-slate-500">24 Active Fleet Drivers</p>
            </div>
            <button
              type="button"
              onClick={openAddDriver}
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
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search drivers..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </header>

        <div className="flex flex-col gap-6 px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
          <section className="flex-1 space-y-3">
            {filteredDrivers.map((driver) => (
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
                      onClick={() => openEditDriver(driver)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-700 transition hover:bg-sky-100"
                      aria-label={`Edit ${driver.name}`}
                    >
                      <PencilLine size={16} />
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
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0B5394]">Quick Setup</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {formMode === "add" ? "Add New Driver" : "Edit Driver"}
                  </h3>
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

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(event) => setFormName(event.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(event) => setFormPhone(event.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(event) => setFormEmail(event.target.value)}
                    placeholder="john.doe@vango.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">License Number</label>
                  <input
                    type="text"
                    value={formLicense}
                    onChange={(event) => setFormLicense(event.target.value)}
                    placeholder="TX-000000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Assign Route</label>
                  <div className="relative">
                    <select
                      value={formRoute}
                      onChange={(event) => setFormRoute(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                    >
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
                  {formMode === "add" ? "Create Driver Profile" : "Update Driver"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
