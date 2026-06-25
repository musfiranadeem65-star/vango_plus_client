"use client";

import { useState } from "react";
import { Info, Phone, Star } from "lucide-react";

interface Stop {
  time: string;
  label: string;
  current?: boolean;
}

interface ChildSchedule {
  id: string;
  name: string;
  routeBadge: string;
  driver: {
    name: string;
    rating: string;
    initials: string;
    phone: string;
  };
  stops: Stop[];
}

const schedules: ChildSchedule[] = [
  {
    id: "leo",
    name: "Leo",
    routeBadge: "Morning Route #12",
    driver: { name: "Marcus Thompson", rating: "4.9", initials: "MT", phone: "+92 300 1234567" },
    stops: [
      { time: "07:15 AM", label: "Central Depot" },
      { time: "07:45 AM", label: "123 Maple Avenue (Leo's Pickup)", current: true },
      { time: "08:05 AM", label: "Pine Heights School" },
      { time: "08:20 AM", label: "Oakwood Elementary" },
    ],
  },
  {
    id: "maya",
    name: "Maya",
    routeBadge: "Morning Route #15",
    driver: { name: "Sarah Johnson", rating: "4.8", initials: "SJ", phone: "+92 301 7654321" },
    stops: [
      { time: "07:20 AM", label: "Central Depot" },
      { time: "07:50 AM", label: "88 Oak Street (Maya's Pickup)", current: true },
      { time: "08:10 AM", label: "Riverside Academy" },
      { time: "08:25 AM", label: "St. Mary's School" },
    ],
  },
];

export default function TransportSchedulePage() {
  const [selectedId, setSelectedId] = useState<string>(schedules[0].id);
  const selected = schedules.find((s) => s.id === selectedId) ?? schedules[0];

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
          Transport Schedule
        </h1>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
          Track today&apos;s route stops and driver details for each child.
        </p>
      </section>

      <div className="inline-flex w-fit gap-1 rounded-full bg-surface-container p-1">
        {schedules.map((child) => {
          const isSelected = child.id === selected.id;
          return (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedId(child.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "bg-primary text-white shadow-[var(--shadow-card)]"
                  : "text-on-surface-variant hover:text-foreground"
              }`}
            >
              {child.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Route Info</h2>
            <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container">
              {selected.routeBadge}
            </span>
          </div>

          <ol className="mt-5">
            {selected.stops.map((stop, index) => {
              const isLast = index === selected.stops.length - 1;
              return (
                <li key={stop.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        stop.current
                          ? "border-secondary bg-secondary"
                          : "border-outline-variant bg-surface"
                      }`}
                    >
                      {stop.current ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      ) : null}
                    </span>
                    {!isLast ? (
                      <span className="my-1 w-0.5 flex-1 bg-outline-variant" />
                    ) : null}
                  </div>
                  <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                    <p
                      className={`font-[family-name:var(--font-inter)] text-xs font-semibold ${
                        stop.current ? "text-secondary" : "text-on-surface-variant"
                      }`}
                    >
                      {stop.time}
                    </p>
                    <p
                      className={`mt-0.5 text-sm font-semibold ${
                        stop.current ? "text-secondary" : "text-foreground"
                      }`}
                    >
                      {stop.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-foreground">Driver Info</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                {selected.driver.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {selected.driver.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  <Star size={13} className="fill-tertiary text-tertiary" />
                  {selected.driver.rating} · Driver Rating
                </p>
                <p className="mt-0.5 flex items-center gap-1 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  <Phone size={13} className="text-muted" />
                  {selected.driver.phone}
                </p>
              </div>
              <a
                href={`tel:${selected.driver.phone.replace(/\s+/g, "")}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white transition hover:opacity-90"
                aria-label={`Call ${selected.driver.name}`}
              >
                <Phone size={18} />
              </a>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-bright p-3">
              <Info size={16} className="mt-0.5 shrink-0 text-muted" />
              <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                Contact admin for emergencies. Direct calls are for logistics only.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
