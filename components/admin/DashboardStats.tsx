import { Icon } from "@/components/admin/Icon";
import { StatCard } from "@/components/admin/StatCard";
import { DASHBOARD_STATS } from "@/lib/admin/constants";

export function DashboardStats() {
  return (
    <section>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            tone={stat.tone}
            badge={stat.badge}
            className="md:min-w-0"
          />
        ))}
      </div>
    </section>
  );
}

export function DashboardQuickActions() {
  return (
    <section className="grid grid-cols-2 gap-4 md:max-w-md">
      <button
        type="button"
        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-primary p-4 text-white shadow-sm transition-transform active:scale-95"
      >
        <Icon name="add_circle" size={22} />
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium">
          New Route
        </span>
      </button>
      <button
        type="button"
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface p-4 text-primary shadow-sm transition-transform active:scale-95"
      >
        <Icon name="contact_support" size={22} />
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium">
          Broadcast
        </span>
      </button>
    </section>
  );
}
