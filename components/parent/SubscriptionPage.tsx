"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bolt,
  Check,
  CheckCircle2,
  Download,
  Headset,
  History,
  Pencil,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SubscribePlansModal } from "@/components/parent/SubscribePlansModal";
import {
  formatPkr,
  getPlanById,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription/plans";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const stats = [
  { label: "Total Trips", value: "142" },
  { label: "Days Active", value: "284" },
];

const perks = [
  { icon: ShieldCheck, title: "Secure Payments", description: "End-to-end encrypted transactions." },
  { icon: Headset, title: "Billing Support", description: "24/7 dedicated finance desk." },
  { icon: History, title: "Easy Refunds", description: "No-questions-asked refund policy." },
];

export default function SubscriptionPage() {
  const { user, subscribe } = useAuth();
  const subscription = user?.subscription;
  const currentPlan = subscription ? getPlanById(subscription.planId) : undefined;
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | undefined>();

  function openPlanModal(planId?: string) {
    setPendingPlanId(planId);
    setPlanModalOpen(true);
  }

  const startedAt = subscription ? new Date(subscription.startedAt) : null;
  const nextBilling = startedAt
    ? new Date(startedAt.getFullYear(), startedAt.getMonth() + 1, startedAt.getDate())
    : null;

  const payments = subscription
    ? [
        {
          date: startedAt ? formatDate(startedAt) : "—",
          amount: formatPkr(subscription.price),
          reference: "JZC-88219455",
          status: "Success",
        },
      ]
    : [];

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-[32px] md:leading-10">
            Subscriptions
          </h1>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
            Manage your transportation plans and view billing history.
          </p>
        </div>
        {subscription ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container">
            <BadgeCheck size={14} />
            {subscription.planName} Member
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-1.5 text-xs font-semibold text-tertiary">
            No Active Plan
          </span>
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <section className="flex flex-col gap-4">
          {subscription ? (
            <article className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wide text-primary">
                    Current Plan
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">
                    {currentPlan?.name ?? subscription.planName} Plan
                  </h2>
                  {currentPlan ? (
                    <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-on-surface-variant">
                      {currentPlan.tagline}
                    </p>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-container">
                  Active
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-bright p-4">
                  <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Next Billing Date
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {nextBilling ? formatDate(nextBilling) : "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-bright p-4">
                  <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Children Covered
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    Up to {currentPlan?.maxChildren ?? 1}{" "}
                    {(currentPlan?.maxChildren ?? 1) === 1 ? "child" : "children"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-xl bg-primary-fixed/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    Monthly Amount
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-foreground">
                    {formatPkr(subscription.price)}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-secondary">
                    <CheckCircle2 size={14} />
                    Your account is in good standing.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => openPlanModal()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                  >
                    <Pencil size={16} />
                    Change Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => openPlanModal()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-container"
                  >
                    <Bolt size={16} />
                    Pay Now
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <article className="flex flex-col items-start gap-4 rounded-2xl border border-tertiary-fixed bg-tertiary-fixed/30 p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  No Active Plan
                </h2>
                <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-on-surface-variant">
                  Choose a subscription plan to start booking transport for your
                  children.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openPlanModal()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-tertiary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Bolt size={16} />
                Choose a Plan
              </button>
            </article>
          )}

          <article className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-foreground">Available Plans</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = subscription?.planId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`flex flex-col rounded-xl border p-4 ${
                      isCurrent
                        ? "border-primary bg-primary-fixed/30 ring-1 ring-primary"
                        : "border-border bg-surface-bright"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground">
                        {plan.name}
                      </h4>
                      {plan.recommended ? (
                        <span className="rounded-full bg-parent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-parent">
                          Popular
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {formatPkr(plan.price)}
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-[11px] text-on-surface-variant">
                      per {plan.period}
                    </p>
                    <ul className="mt-3 flex flex-1 flex-col gap-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-1.5 font-[family-name:var(--font-inter)] text-[11px] text-foreground"
                        >
                          <Check size={12} className="mt-0.5 shrink-0 text-parent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => openPlanModal(plan.id)}
                      disabled={isCurrent}
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-container disabled:pointer-events-none disabled:bg-surface-container disabled:text-on-surface-variant"
                    >
                      {isCurrent ? "Current Plan" : "Select Plan"}
                    </button>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-base font-bold text-foreground">Payment History</h3>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-container-low"
              >
                <Download size={14} />
                Export All
              </button>
            </div>
            <ul className="divide-y divide-border">
              {payments.length === 0 ? (
                <li className="px-5 py-6 text-center font-[family-name:var(--font-inter)] text-sm font-medium text-on-surface-variant">
                  No payments yet.
                </li>
              ) : (
                payments.map((payment) => (
                  <li
                    key={payment.reference}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                      <Receipt size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{payment.amount}</p>
                      <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {payment.date} · {payment.reference}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-container">
                      {payment.status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </article>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-foreground">Quick Stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-surface-bright p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-foreground">Payment Method</h3>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-bright p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tertiary-fixed text-tertiary">
                <Wallet size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">JazzCash Wallet</p>
                <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                  0300 •••• 123
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-surface-container-low"
              >
                <Pencil size={13} />
                Edit
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
            <ul className="flex flex-col gap-4">
              {perks.map((perk) => {
                const PerkIcon = perk.icon;
                return (
                  <li key={perk.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                      <PerkIcon size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{perk.title}</p>
                      <p className="font-[family-name:var(--font-inter)] text-xs font-medium text-on-surface-variant">
                        {perk.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      <SubscribePlansModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onSubscribe={subscribe}
        currentPlanId={subscription?.planId}
        initialPlanId={pendingPlanId}
      />
    </div>
  );
}
