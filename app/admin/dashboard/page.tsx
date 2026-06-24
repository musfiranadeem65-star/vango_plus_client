import { ChartsSection } from "@/components/admin/ChartsSection";
import {
  DashboardQuickActions,
  DashboardStats,
} from "@/components/admin/DashboardStats";
import { GuardianApprovalsTable } from "@/components/admin/GuardianApprovalsTable";
import { RecentRoutesTable } from "@/components/admin/RecentRoutesTable";
import { TransportActivityTimeline } from "@/components/admin/TransportActivityTimeline";

function getFormattedDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
          Good morning, Admin 👋
        </h1>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          {getFormattedDate()}
        </p>
      </section>

      <DashboardStats />

      <ChartsSection />

      <div className="grid gap-6 xl:grid-cols-2">
        <GuardianApprovalsTable />
        <TransportActivityTimeline />
      </div>

      <RecentRoutesTable />

      <DashboardQuickActions />
    </div>
  );
}
