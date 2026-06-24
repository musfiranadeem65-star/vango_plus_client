import { Icon } from "@/components/admin/Icon";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TRANSPORT_ACTIVITY } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

const iconToneStyles = {
  primary: "bg-primary-container text-on-primary-container",
  alert: "bg-secondary-container text-on-secondary-container",
  neutral: "bg-surface-container-highest text-on-surface-variant",
};

const badgeToneMap = {
  Success: "success" as const,
  Alert: "alert" as const,
  Active: "active" as const,
};

export function TransportActivityTimeline() {
  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <h2 className="mb-4 text-xl font-semibold text-primary md:text-2xl">
        Transport Activity
      </h2>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary before:via-secondary before:to-transparent">
        {TRANSPORT_ACTIVITY.map((item) => (
          <div
            key={item.title}
            className="relative flex items-center justify-between gap-4 pl-10"
          >
            <div
              className={cn(
                "absolute left-0 grid h-10 w-10 place-items-center rounded-full border-2 border-surface shadow-sm",
                iconToneStyles[item.tone]
              )}
            >
              <Icon name={item.icon} filled={item.filled} size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                {item.subtitle}
              </p>
            </div>
            <StatusBadge tone={badgeToneMap[item.status as keyof typeof badgeToneMap]}>
              {item.status}
            </StatusBadge>
          </div>
        ))}
      </div>
    </section>
  );
}
