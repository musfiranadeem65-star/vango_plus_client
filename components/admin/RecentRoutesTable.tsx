import { Icon } from "@/components/admin/Icon";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RECENT_ROUTES } from "@/lib/admin/constants";

function routeStatusTone(status: string) {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "Delayed":
      return "alert" as const;
    case "Active":
      return "active" as const;
    default:
      return "neutral" as const;
  }
}

export function RecentRoutesTable() {
  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-primary md:text-2xl">
            Recent Routes
          </h2>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-muted">
            Live fleet activity across all schools
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-3 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-primary transition-colors hover:bg-primary-fixed/30"
        >
          <Icon name="add_circle" size={18} />
          New Route
        </button>
      </div>

      <DataTable
        data={RECENT_ROUTES}
        columns={[
          {
            key: "route",
            header: "Route",
            render: (row) => (
              <div>
                <p className="font-semibold text-foreground">#{row.id}</p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                  {row.name}
                </p>
              </div>
            ),
          },
          {
            key: "driver",
            header: "Driver",
            render: (row) => (
              <span className="font-[family-name:var(--font-inter)]">{row.driver}</span>
            ),
          },
          {
            key: "students",
            header: "Students",
            render: (row) => (
              <span className="font-[family-name:var(--font-inter)]">{row.students}</span>
            ),
          },
          {
            key: "time",
            header: "Time",
            render: (row) => (
              <span className="font-[family-name:var(--font-inter)] text-muted">
                {row.time}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <StatusBadge tone={routeStatusTone(row.status)}>{row.status}</StatusBadge>
            ),
          },
        ]}
      />
    </section>
  );
}
