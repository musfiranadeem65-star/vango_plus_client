import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  RECENT_DRIVERS,
  RECENT_ROUTES,
  RECENT_STUDENTS,
} from "@/lib/admin/constants";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface OverviewSectionProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

function OverviewSection({ title, href, children }: OverviewSectionProps) {
  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-primary md:text-2xl">
          {title}
        </h2>
        <Link
          href={href}
          className="font-[family-name:var(--font-inter)] text-xs font-semibold text-secondary underline"
        >
          View All
        </Link>
      </div>
      {children}
    </section>
  );
}

export function RecentStudentsTable() {
  return (
    <OverviewSection title="Recent Students" href="/admin/students">
      <DataTable
        data={RECENT_STUDENTS}
        columns={[
          {
            key: "student",
            header: "Student",
            render: (row) => (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-sm font-bold text-primary">
                  {getInitials(row.name)}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                    {row.grade}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "parent",
            header: "Parent",
            render: (row) => (
              <span className="font-[family-name:var(--font-inter)] text-muted">
                {row.parent}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end">
                <StatusBadge tone="success">{row.status}</StatusBadge>
              </div>
            ),
          },
        ]}
      />
    </OverviewSection>
  );
}

export function RecentDriversTable() {
  return (
    <OverviewSection title="Recent Drivers" href="/admin/drivers">
      <DataTable
        data={RECENT_DRIVERS}
        columns={[
          {
            key: "driver",
            header: "Driver",
            render: (row) => (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-sm font-bold text-secondary">
                  {getInitials(row.name)}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{row.name}</p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                    {row.phone}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "route",
            header: "Route",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end">
                <StatusBadge
                  tone={row.routeLabel === "Unassigned" ? "neutral" : "active"}
                >
                  {row.routeLabel}
                </StatusBadge>
              </div>
            ),
          },
        ]}
      />
    </OverviewSection>
  );
}

const routeStatusTone: Record<
  string,
  "success" | "alert" | "active" | "neutral"
> = {
  Completed: "success",
  Active: "active",
  Delayed: "alert",
  Scheduled: "neutral",
};

export function RecentRoutesOverviewTable() {
  return (
    <OverviewSection title="Recent Routes" href="/admin/routes">
      <DataTable
        data={RECENT_ROUTES}
        columns={[
          {
            key: "route",
            header: "Route",
            render: (row) => (
              <div>
                <p className="font-semibold text-foreground">{row.name}</p>
                <p className="font-[family-name:var(--font-inter)] text-xs text-muted">
                  Driver: {row.driver}
                </p>
              </div>
            ),
          },
          {
            key: "students",
            header: "Students",
            render: (row) => (
              <span className="font-[family-name:var(--font-inter)] text-muted">
                {row.students} students
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            className: "text-right",
            render: (row) => (
              <div className="flex justify-end">
                <StatusBadge tone={routeStatusTone[row.status] ?? "neutral"}>
                  {row.status}
                </StatusBadge>
              </div>
            ),
          },
        ]}
      />
    </OverviewSection>
  );
}
