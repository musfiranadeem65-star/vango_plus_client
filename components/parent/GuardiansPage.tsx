"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Edit3,
  MoreVertical,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { AddGuardianDrawer } from "@/components/parent/AddGuardianDrawer";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createGuardian,
  deleteGuardian,
  getGuardians,
  GuardianPayload,
  updateGuardian,
  updateGuardianStatus,
} from "@/services/guardianService";
import type { Guardian as GuardianType } from "@/types/guardian";

const statusConfig: Record<GuardianType["status"], { label: string; className: string; icon: typeof CheckCircle2 }> = {
  Approved: {
    label: "Approved",
    className: "bg-secondary-container text-on-secondary-container",
    icon: CheckCircle2,
  },
  Pending: {
    label: "Pending Review",
    className: "bg-tertiary-fixed text-tertiary",
    icon: Clock,
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function GuardiansPage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState<GuardianType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSaving, setDrawerSaving] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [editingGuardian, setEditingGuardian] = useState<GuardianType | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const userId = user?.id ?? 0;

  const loadGuardians = useCallback(async () => {
    setPageError(null);
    setLoading(true);
    try {
      const result = await getGuardians();
      setGuardians(result);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to load guardians.");
      setGuardians([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuardians();
  }, [loadGuardians]);

  const openAddDrawer = () => {
    setEditingGuardian(null);
    setDrawerError(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (guardian: GuardianType) => {
    setEditingGuardian(guardian);
    setDrawerError(null);
    setDrawerOpen(true);
    setMenuOpenId(null);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingGuardian(null);
    setDrawerError(null);
  };

  const handleSaveGuardian = async (payload: Omit<GuardianPayload, "status">) => {
    if (!userId) {
      setDrawerError("Unable to determine your account. Please refresh and try again.");
      return;
    }

    setDrawerError(null);
    setDrawerSaving(true);

    try {
      if (editingGuardian) {
        const updatePayload: GuardianPayload = {
          ...payload,
          userId,
          status: editingGuardian.status,
          note: editingGuardian.note ?? "",
        };
        await updateGuardian(editingGuardian.id, updatePayload);
        setGuardians((current) =>
          current.map((guardian) =>
            guardian.id === editingGuardian.id
              ? { ...guardian, ...updatePayload }
              : guardian
          )
        );
      } else {
        const createPayload: GuardianPayload = {
          ...payload,
          userId,
          status: "Pending",
          note: payload.note ?? "",
        };
        const created = await createGuardian(createPayload);
        setGuardians((current) => [...current, created]);
      }
      closeDrawer();
    } catch (error) {
      setDrawerError(error instanceof Error ? error.message : "Unable to save guardian.");
    } finally {
      setDrawerSaving(false);
    }
  };

  const handleStatusUpdate = async (guardian: GuardianType, status: GuardianType["status"]) => {
    setActionError(null);
    setActionLoadingId(guardian.id);
    try {
      await updateGuardianStatus(guardian.id, { status });
      setGuardians((current) =>
        current.map((item) => (item.id === guardian.id ? { ...item, status } : item))
      );
      setMenuOpenId(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update guardian status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteGuardian = async (guardian: GuardianType) => {
    const confirmed = window.confirm(`Delete ${guardian.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setActionError(null);
    setActionLoadingId(guardian.id);
    try {
      await deleteGuardian(guardian.id);
      setGuardians((current) => current.filter((item) => item.id !== guardian.id));
      setMenuOpenId(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete guardian.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
            Authorized Guardians
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            Manage who is authorized to pick up your children from the van.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddDrawer}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
        >
          <Plus size={18} />
          Add Guardian
        </button>
      </section>

      {pageError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {pageError}
        </div>
      ) : null}
      {actionError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {actionError}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface p-5 text-center text-sm font-medium text-on-surface-variant">
          Loading guardians...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {guardians.map((guardian) => {
            const config = statusConfig[guardian.status];
            const StatusIcon = config.icon;
            const initials = getInitials(guardian.name);
            const isMenuOpen = menuOpenId === guardian.id;
            const processing = actionLoadingId === guardian.id;

            return (
              <article
                key={guardian.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-primary">
                      {initials}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{guardian.name}</h3>
                      <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {guardian.relation}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpenId(isMenuOpen ? null : guardian.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
                      aria-label="More options"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {isMenuOpen ? (
                      <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface text-sm shadow-lg">
                        <button
                          type="button"
                          onClick={() => openEditDrawer(guardian)}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-surface-bright"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        {guardian.status !== "Approved" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(guardian, "Approved")}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-surface-bright"
                            disabled={processing}
                          >
                            <CheckCircle2 size={16} />
                            Approve
                          </button>
                        ) : null}
                        {guardian.status !== "Rejected" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(guardian, "Rejected")}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-surface-bright"
                            disabled={processing}
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeleteGuardian(guardian)}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-50"
                          disabled={processing}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                  <Phone size={15} className="text-muted" />
                  {guardian.phone}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
                  >
                    <StatusIcon size={13} />
                    {config.label}
                  </span>
                </div>

                {guardian.note ? (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 font-[family-name:var(--font-inter)] text-xs font-medium text-red-700">
                    {guardian.note}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <section className="flex items-start gap-4 rounded-2xl border border-border bg-surface-bright p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">Verification Security</h3>
          <p className="mt-1 max-w-2xl font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            All guardians must pass a basic identity verification for the safety of your
            passengers. Reviews usually take 24-48 hours.
          </p>
        </div>
      </section>

      {drawerOpen ? (
        <AddGuardianDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          onSave={handleSaveGuardian}
          saving={drawerSaving}
          error={drawerError}
          guardian={editingGuardian}
        />
      ) : null}
    </div>
  );
}
