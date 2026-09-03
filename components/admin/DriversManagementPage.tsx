"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  PencilLine,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { Driver } from "@/types/driver";
import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
  updateDriverStatus,
} from "@/services/driverService";

interface DriverCard extends Driver {
  route: string;
  routeLabel: string;
  initials: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DriversManagementPage() {
  const [drivers, setDrivers] = useState<DriverCard[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLicense, setFormLicense] = useState("");
  const [formStatus, setFormStatus] = useState<Driver["status"]>("Active");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredDrivers = drivers.filter((driver) =>
    [driver.name, driver.phone, driver.licenseNo, driver.route]
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
    setFormStatus("Active");
    setIsDrawerOpen(true);
  }

  useEffect(() => {
    async function loadDrivers() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getDrivers();
        setDrivers(
          data.map((driver) => ({
            ...driver,
            route: "No route history",
            routeLabel: "Unassigned",
            initials: getInitials(driver.name),
          }))
        );
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load drivers.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDrivers();
  }, []);

  function openEditDriver(driver: DriverCard) {
    setFormMode("edit");
    setEditingId(driver.id);
    setFormName(driver.name);
    setFormPhone(driver.phone);
    setFormEmail(driver.email);
    setFormLicense(driver.licenseNo);
    setFormStatus(driver.status);
    setIsDrawerOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formName.trim() || !formLicense.trim() || !formStatus.trim()) return;

    const route = "No route history";
    const routeLabel = "Unassigned";
    const payload = {
      name: formName.trim(),
      phone: formPhone || "",
      email: formEmail || "",
      licenseNo: formLicense.trim(),
      status: formStatus,
    };

    setIsSaving(true);
    setErrorMessage("");

    try {
      if (formMode === "add") {
        const created = await createDriver(payload);
        setDrivers((current) => [
          {
            ...created,
            route,
            routeLabel,
            initials: getInitials(created.name),
          },
          ...current,
        ]);
      } else if (editingId !== null) {
        await updateDriver(editingId, payload);
        setDrivers((current) =>
          current.map((driver) =>
            driver.id === editingId
              ? {
                  ...driver,
                  ...payload,
                  licenseNo: payload.licenseNo,
                  initials: getInitials(payload.name),
                }
              : driver
          )
        );
      }

      setIsDrawerOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save driver.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteDriver(id: number) {
    setDeletingId(id);
    setErrorMessage("");

    try {
      await deleteDriver(id);
      setDrivers((current) => current.filter((driver) => driver.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete driver.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: number, status: Driver["status"]) {
    setStatusUpdatingId(id);
    setErrorMessage("");

    try {
      await updateDriverStatus(id, status);
      setDrivers((current) =>
        current.map((driver) =>
          driver.id === id ? { ...driver, status } : driver
        )
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update driver status.");
    } finally {
      setStatusUpdatingId(null);
    }
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
          {errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}
          <section className="flex-1 space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                Loading drivers...
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                No drivers found.
              </div>
            ) : (
              filteredDrivers.map((driver) => (
              <article key={driver.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-sm font-semibold text-[#0B5394]">
                      {driver.initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{driver.name}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${driver.status === "Active" ? "bg-emerald-50 text-emerald-700" : driver.status === "Inactive" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>
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
                    <button
                      type="button"
                      onClick={() => handleDeleteDriver(driver.id)}
                      disabled={deletingId === driver.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                      aria-label={`Delete ${driver.name}`}
                    >
                      <Trash2 size={16} />
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
                    <p className="mt-1 text-sm font-semibold text-slate-700">{driver.licenseNo}</p>
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
                    <div className="flex items-center gap-2">
                      <select
                        value={driver.status}
                        onChange={(event) => handleStatusChange(driver.id, event.target.value as Driver["status"])}
                        disabled={statusUpdatingId === driver.id}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteDriver(driver.id)}
                        disabled={deletingId === driver.id}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
                ))
              )}
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
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Status</label>
                  <select
                    value={formStatus}
                    onChange={(event) => setFormStatus(event.target.value as Driver["status"])}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0B5394] focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-2 w-full rounded-2xl bg-[#0B5394] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#084c7a] disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : formMode === "add" ? "Create Driver Profile" : "Update Driver"}
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
