"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  MoreVertical,
  Phone,
  Plus,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AddGuardianDrawer } from "@/components/parent/AddGuardianDrawer";

type GuardianStatus = "approved" | "pending" | "rejected";

interface Guardian {
  id: string;
  name: string;
  relation: string;
  phone: string;
  initials: string;
  status: GuardianStatus;
  note?: string;
}

const guardians: Guardian[] = [
  {
    id: "marcus",
    name: "Marcus Smith",
    relation: "Uncle",
    phone: "(555) 123-4567",
    initials: "MS",
    status: "approved",
  },
  {
    id: "elena",
    name: "Elena Rodriguez",
    relation: "Neighbor",
    phone: "(555) 987-4543",
    initials: "ER",
    status: "pending",
  },
  {
    id: "david",
    name: "David Chen",
    relation: "Family Friend",
    phone: "(555) 246-8101",
    initials: "DC",
    status: "rejected",
    note: "Reason: ID document expired.",
  },
];

const statusConfig: Record<
  GuardianStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  approved: {
    label: "Approved",
    className: "bg-secondary-container text-on-secondary-container",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending Review",
    className: "bg-tertiary-fixed text-tertiary",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

export default function GuardiansPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
            Authorized Guardians
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            Manage who is authorized to pick up your children from the van.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
        >
          <Plus size={18} />
          Add Guardian
        </button>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {guardians.map((guardian) => {
          const config = statusConfig[guardian.status];
          const StatusIcon = config.icon;
          return (
            <article
              key={guardian.id}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-bold text-primary">
                    {guardian.initials}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{guardian.name}</h3>
                    <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                      {guardian.relation}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                <Phone size={15} className="text-muted" />
                {guardian.phone}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
                >
                  <StatusIcon size={13} />
                  {config.label}
                </span>
              </div>

              {guardian.note ? (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 font-[family-name:var(--font-inter)] text-xs font-medium text-red-700">
                  {guardian.note}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <section className="flex items-start gap-4 rounded-2xl border border-border bg-surface-bright p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">Verification Security</h3>
          <p className="mt-1 max-w-2xl font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            All guardians must pass a basic identity verification for the safety of your
            passengers. Reviews usually take 24-48 hours.
          </p>
        </div>
      </section>

      {drawerOpen ? (
        <AddGuardianDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      ) : null}
    </div>
  );
}
