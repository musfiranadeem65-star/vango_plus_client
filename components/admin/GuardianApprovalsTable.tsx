"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Guardian } from "@/types/guardian";
import { getGuardians, updateGuardianStatus } from "@/services/guardianService";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface GuardianRow {
  id: string;
  name: string;
  status: Guardian["status"];
  requestedAt?: string;
  createdAt?: string;
  relation?: string;
}

export function GuardianApprovalsTable() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadGuardians() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getGuardians();
        if (!active) return;
        setGuardians(data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load guardians.");
        setGuardians([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadGuardians();

    return () => {
      active = false;
    };
  }, []);

  const pendingGuardians = useMemo(
    () => guardians.filter((guardian) => guardian.status === "Pending"),
    [guardians]
  );

  async function setStatus(id: number, status: Guardian["status"]) {
    setProcessingId(id);
    setError(null);

    try {
      await updateGuardianStatus(id, { status });
      const data = await getGuardians();
      setGuardians(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update guardian status.");
    } finally {
      setProcessingId(null);
    }
  }

  const tableData = useMemo<GuardianRow[]>(
    () =>
      pendingGuardians.map((guardian) => ({
        id: String(guardian.id),
        name: guardian.name,
        status: guardian.status,
        requestedAt: (guardian as any).requestedAt,
        createdAt: (guardian as any).createdAt,
        relation: guardian.relation,
      })),
    [pendingGuardians]
  );

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-primary md:text-2xl">
          Guardian Approvals
        </h2>
        <Link
          href="/admin/guardians"
          className="font-[family-name:var(--font-inter)] text-xs font-semibold text-secondary underline"
        >
          View All
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading guardians...
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 lg:hidden">
            {tableData.slice(0, 2).map((guardian) => (
              <div
                key={guardian.id}
                className="flex flex-col gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low p-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-sm font-bold text-primary">
                    {getInitials(guardian.name)}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{guardian.name}</p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                      {guardian.relation ?? ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setStatus(Number(guardian.id), "Approved")}
                    disabled={processingId === Number(guardian.id)}
                  >
                    {processingId === Number(guardian.id) ? "Processing..." : "Approve"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStatus(Number(guardian.id), "Rejected")}
                    disabled={processingId === Number(guardian.id)}
                    className="flex-1 rounded-lg border border-error px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-error transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {processingId === Number(guardian.id) ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <DataTable
              data={tableData}
              columns={[
                {
                  key: "guardian",
                  header: "Guardian",
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-sm font-bold text-primary">
                        {getInitials(row.name)}
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">{row.name}</p>
                        <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                          {row.relation ?? ""}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "requested",
                  header: "Requested",
                  render: (row) => (
                    <span className="font-[family-name:var(--font-inter)] text-muted">
                      {row.createdAt ?? row.requestedAt ?? "—"}
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge tone="pending">{row.status}</StatusBadge>,
                },
                {
                  key: "actions",
                  header: "Actions",
                  className: "text-right",
                  render: (row) => (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setStatus(Number(row.id), "Approved")}
                        disabled={processingId === Number(row.id)}
                      >
                        {processingId === Number(row.id) ? "Processing..." : "Approve"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setStatus(Number(row.id), "Rejected")}
                        disabled={processingId === Number(row.id)}
                        className="rounded-lg border border-error px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-error disabled:opacity-50"
                      >
                        {processingId === Number(row.id) ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </>
      )}
    </section>
  );
}
