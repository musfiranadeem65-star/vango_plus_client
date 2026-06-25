import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { GUARDIAN_APPROVALS } from "@/lib/admin/constants";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function GuardianApprovalsTable() {
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

      <div className="flex flex-col gap-4 lg:hidden">
        {GUARDIAN_APPROVALS.slice(0, 2).map((guardian) => (
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
                  Child: {guardian.child}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="md" className="flex-1">
                Approve
              </Button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-error px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-error transition-transform active:scale-95"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <DataTable
          data={GUARDIAN_APPROVALS}
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
                      {row.child}
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
                  {row.requestedAt}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: () => <StatusBadge tone="pending">Pending</StatusBadge>,
            },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: () => (
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="md">
                    Approve
                  </Button>
                  <button
                    type="button"
                    className="rounded-lg border border-error px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-error"
                  >
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
