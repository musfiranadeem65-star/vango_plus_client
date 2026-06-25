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
            href={stat.href}
            className="md:min-w-0"
          />
        ))}
      </div>
    </section>
  );
}
