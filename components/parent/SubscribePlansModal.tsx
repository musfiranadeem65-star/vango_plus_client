"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { ParentSubscription } from "@/lib/auth/types";
import {
  formatPkr,
  getPlanById,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription/plans";

interface SubscribePlansModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: (subscription: ParentSubscription) => Promise<{ error?: string }>;
  currentPlanId?: string;
  initialPlanId?: string;
}

export function SubscribePlansModal({
  open,
  onClose,
  onSubscribe,
  currentPlanId,
  initialPlanId,
}: SubscribePlansModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(
    initialPlanId ?? currentPlanId ?? "standard"
  );
  const [jazzCashNumber, setJazzCashNumber] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedPlanId(initialPlanId ?? currentPlanId ?? "standard");
    }
  }, [open, initialPlanId, currentPlanId]);

  if (!open) return null;

  const selectedPlan = getPlanById(selectedPlanId);

  async function handleSubscribe() {
    if (!selectedPlan) return;

    const digits = jazzCashNumber.replace(/\D/g, "");
    if (digits.length < 11) {
      setError("Enter a valid JazzCash mobile number.");
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    const subscription: ParentSubscription = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      status: "active",
      paymentMethod: "JazzCash",
      startedAt: new Date().toISOString(),
    };

    const result = await onSubscribe(subscription);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-surface shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Choose Your Plan
            </h2>
            <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
              Pay securely with JazzCash to activate transport.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface-container-low"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-3 overflow-y-auto px-6 py-5">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-parent bg-parent/5 ring-2 ring-parent/20"
                    : "border-border bg-surface hover:border-parent/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <span className="rounded-full bg-parent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-parent">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {formatPkr(plan.price)}
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-[11px] text-on-surface-variant">
                      per {plan.period}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-xs text-foreground"
                    >
                      <Check size={13} className="shrink-0 text-parent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}

          <div className="mt-1 rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9B1B6E] text-sm font-bold text-white">
                JC
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Pay with JazzCash
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-xs text-on-surface-variant">
                  You&apos;ll receive a payment prompt on your mobile.
                </p>
              </div>
            </div>
            <input
              type="tel"
              placeholder="03XX XXXXXXX"
              value={jazzCashNumber}
              onChange={(e) => {
                setJazzCashNumber(e.target.value);
                setError(undefined);
              }}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-parent focus:ring-1 focus:ring-parent"
            />
            {error && (
              <p className="mt-2 font-[family-name:var(--font-inter)] text-xs text-error">
                {error}
              </p>
            )}
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isSubmitting || !selectedPlan}
            className="rounded-xl bg-parent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing payment..."
              : selectedPlan
                ? `Pay ${formatPkr(selectedPlan.price)}`
                : "Subscribe"}
          </button>
        </footer>
      </div>
    </div>
  );
}
