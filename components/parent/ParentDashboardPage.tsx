"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Headset,
  MapPin,
  Navigation,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AddGuardianDrawer } from "@/components/parent/AddGuardianDrawer";
import { SubscribePlansModal } from "@/components/parent/SubscribePlansModal";
import { PARENT_PROFILE } from "@/lib/parent/constants";
import { formatPkr } from "@/lib/subscription/plans";

type TripPhase = "waiting" | "picked_up" | "dropped";

interface ChildTrip {
  id: string;
  name: string;
  route: string;
  initials: string;
  accent: "blue" | "teal" | "slate";
  pickup: string;
  drop: string;
  phase: TripPhase;
}

const initialChildren: ChildTrip[] = [
  {
    id: "leo",
    name: "Leo",
    route: "Route #42B",
    initials: "L",
    accent: "blue",
    pickup: "7:45 AM",
    drop: "8:15 AM",
    phase: "picked_up",
  },
  {
    id: "maya",
    name: "Maya",
    route: "Route #15A",
    initials: "M",
    accent: "teal",
    pickup: "7:50 AM",
    drop: "8:20 AM",
    phase: "dropped",
  },
  {
    id: "sam",
    name: "Sam",
    route: "Route #28C",
    initials: "S",
    accent: "slate",
    pickup: "7:55 AM",
    drop: "8:25 AM",
    phase: "waiting",
  },
];

const accentAvatar: Record<ChildTrip["accent"], string> = {
  blue: "bg-primary-fixed text-primary",
  teal: "bg-secondary-container text-on-secondary-container",
  slate: "bg-surface-container text-on-surface-variant",
};

const phaseBadge: Record<TripPhase, { label: string; className: string }> = {
  waiting: {
    label: "Waiting",
    className: "bg-surface-container text-on-surface-variant",
  },
  picked_up: {
    label: "Picked Up",
    className: "bg-primary text-white",
  },
  dropped: {
    label: "Dropped Safely",
    className: "bg-secondary-container text-on-secondary-container",
  },
};

function ChildTripCard({
  child,
  onSetPhase,
}: {
  child: ChildTrip;
  onSetPhase: (id: string, phase: TripPhase) => void;
}) {
  const badge = phaseBadge[child.phase];

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold ${accentAvatar[child.accent]}`}
          >
            {child.initials}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{child.name}</h3>
            <p className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {child.route}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.className}`}
        >
          {child.phase === "picked_up" ? <Navigation size={13} /> : null}
          {child.phase === "dropped" ? <CheckCircle2 size={13} /> : null}
          {badge.label}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-surface-bright p-4">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <MapPin size={16} className="text-muted" />
          <span>Today&apos;s Trip</span>
        </div>
        <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
          <span>Pickup: {child.pickup}</span>
          <span>Drop: {child.drop}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() =>
            onSetPhase(
              child.id,
              child.phase === "picked_up" ? "waiting" : "picked_up"
            )
          }
          className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            child.phase === "picked_up"
              ? "bg-primary text-white hover:bg-primary-container"
              : "border border-border bg-surface text-foreground hover:bg-surface-container-low"
          }`}
        >
          <Navigation size={16} />
          Picked Up
        </button>
        <button
          type="button"
          onClick={() =>
            onSetPhase(
              child.id,
              child.phase === "dropped" ? "picked_up" : "dropped"
            )
          }
          className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
            child.phase === "dropped"
              ? "bg-secondary text-white hover:opacity-90"
              : "border border-border bg-surface text-foreground hover:bg-surface-container-low"
          }`}
        >
          <CheckCircle2 size={16} />
          Dropped
        </button>
      </div>
    </article>
  );
}

export default function ParentDashboardPage() {
  const { user, subscribe } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? PARENT_PROFILE.firstName;
  const subscription = user?.subscription;

  const [children, setChildren] = useState<ChildTrip[]>(initialChildren);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [guardianDrawerOpen, setGuardianDrawerOpen] = useState(false);

  function setPhase(id: string, phase: TripPhase) {
    setChildren((prev) =>
      prev.map((child) => (child.id === id ? { ...child, phase } : child))
    );
  }

  const quickActions = [
    {
      label: "Add Guardian",
      icon: UserPlus,
      tone: "bg-primary-fixed text-primary",
      onClick: () => setGuardianDrawerOpen(true),
    },
    {
      label: "Pay Fee",
      icon: Wallet,
      tone: "bg-secondary-container text-on-secondary-container",
      onClick: () => setPlanModalOpen(true),
    },
    {
      label: "View Schedule",
      icon: CalendarDays,
      tone: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      onClick: undefined,
    },
    {
      label: "Contact Support",
      icon: Headset,
      tone: "bg-surface-container-high text-on-surface-variant",
      onClick: undefined,
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
            Hello, {firstName} 👋
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            Your children are in safe hands today.
          </p>
        </div>
      </section>

      {subscription ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-secondary-container bg-secondary-container/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Wallet size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {subscription.planName} Plan
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-secondary-container">
                  <CheckCircle2 size={11} />
                  Active
                </span>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {formatPkr(subscription.price)}/month · Paid via{" "}
                {subscription.paymentMethod}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPlanModalOpen(true)}
            className="shrink-0 rounded-xl border border-secondary px-4 py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary-container/50 sm:self-center"
          >
            Manage Plan
          </button>
        </section>
      ) : (
        <section className="flex flex-col gap-3 rounded-2xl border border-tertiary-fixed bg-tertiary-fixed/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No Active Plan</h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                Subscribe to a transport plan to start booking trips for your
                children.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPlanModalOpen(true)}
            className="shrink-0 rounded-xl bg-tertiary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:self-center"
          >
            Choose a Plan
          </button>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Today&apos;s Tracking
          </h2>
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            {children.length} children
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => (
            <ChildTripCard key={child.id} child={child} onSetPhase={setPhase} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${action.tone}`}
                >
                  <ActionIcon size={22} />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <SubscribePlansModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onSubscribe={subscribe}
        currentPlanId={subscription?.planId}
      />

      <AddGuardianDrawer
        open={guardianDrawerOpen}
        onClose={() => setGuardianDrawerOpen(false)}
      />
    </div>
  );
}
