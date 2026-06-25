"use client";

import {
  AlertTriangle,
  Bus,
  CalendarDays,
  ChevronDown,
  Home,
  SlidersHorizontal,
} from "lucide-react";

type AlertTone = "dropoff" | "pickup" | "delay";

interface AlertItem {
  id: string;
  child: string;
  title: string;
  message: string;
  time: string;
  tone: AlertTone;
}

interface AlertGroup {
  label: string;
  items: AlertItem[];
}

const groups: AlertGroup[] = [
  {
    label: "Today, Oct 27",
    items: [
      {
        id: "leo-drop",
        child: "Leo",
        title: "Successful Drop-off",
        message: "Leo has been safely dropped off at Home by Driver James.",
        time: "2:45 PM",
        tone: "dropoff",
      },
      {
        id: "mia-pickup",
        child: "Mia",
        title: "Pickup Confirmed",
        message: "Mia is on board Van #402. Estimated arrival at School: 8:45 AM.",
        time: "8:15 AM",
        tone: "pickup",
      },
    ],
  },
  {
    label: "Yesterday, Oct 23",
    items: [
      {
        id: "mia-drop",
        child: "Mia",
        title: "Successful Drop-off",
        message: "Mia has arrived home. Driver Sarah verified with guardian.",
        time: "3:10 PM",
        tone: "dropoff",
      },
      {
        id: "route-delay",
        child: "Route Update",
        title: "5-Minute Delay",
        message: "Van #402 is running slightly behind due to local traffic on Main St.",
        time: "2:30 PM",
        tone: "delay",
      },
    ],
  },
];

const toneConfig: Record<
  AlertTone,
  { icon: typeof Home; iconWrap: string; card: string }
> = {
  dropoff: {
    icon: Home,
    iconWrap: "bg-secondary-container text-on-secondary-container",
    card: "border-secondary-container bg-secondary-container/30",
  },
  pickup: {
    icon: Bus,
    iconWrap: "bg-primary-fixed text-primary",
    card: "border-border bg-surface",
  },
  delay: {
    icon: AlertTriangle,
    iconWrap: "bg-tertiary-fixed text-tertiary",
    card: "border-tertiary-fixed bg-tertiary-fixed/30",
  },
};

export default function AlertsPage() {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
          Notifications
        </h1>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          A full history of pickups, drop-offs and route updates for your children.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="font-[family-name:var(--font-inter)] text-xs font-semibold text-on-surface-variant">
            Select Child
          </label>
          <div className="relative mt-1.5">
            <select className="w-full appearance-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary">
              <option>Leo &amp; Mia (All)</option>
              <option>Leo</option>
              <option>Mia</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>
        <div>
          <label className="font-[family-name:var(--font-inter)] text-xs font-semibold text-on-surface-variant">
            Date Range
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5">
            <CalendarDays size={16} className="text-muted" />
            <span className="flex-1 text-sm font-medium text-foreground">
              This Week (Oct 21 - Oct 27)
            </span>
            <SlidersHorizontal size={16} className="text-muted" />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {group.label}
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {group.items.map((item) => {
                const config = toneConfig[item.tone];
                const ToneIcon = config.icon;
                return (
                  <li
                    key={item.id}
                    className={`flex gap-4 rounded-2xl border p-4 shadow-[var(--shadow-card)] ${config.card}`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.iconWrap}`}
                    >
                      <ToneIcon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">{item.child}</p>
                        <span className="shrink-0 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-on-surface-variant">{item.message}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
