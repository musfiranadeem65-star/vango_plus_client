"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { StepIndicator } from "@/components/ui/StepIndicator";
import type { ParentSubscription, RegisterFormData } from "@/lib/auth/types";
import {
  formatPkr,
  getPlanById,
  SUBSCRIPTION_PLANS,
} from "@/lib/subscription/plans";
import {
  getPasswordStrength,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/auth/validation";

const STEPS = ["Info", "Setup", "Plan", "Payment"];

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
];

const initialForm: RegisterFormData = {
  fullName: "",
  phone: "",
  city: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [selectedPlanId, setSelectedPlanId] = useState("standard");
  const [jazzCashNumber, setJazzCashNumber] = useState("");
  const [jazzCashError, setJazzCashError] = useState<string | undefined>();

  const selectedPlan = useMemo(
    () => getPlanById(selectedPlanId),
    [selectedPlanId]
  );

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password]
  );

  function updateField<K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep(currentStep: number): boolean {
    const nextErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (currentStep === 1) {
      nextErrors.fullName = validateRequired(form.fullName, "Full name");
      nextErrors.phone = validateRequired(form.phone, "Phone number");
      nextErrors.city = validateRequired(form.city, "City/Area");
    }

    if (currentStep === 2) {
      nextErrors.email = validateEmail(form.email);
      nextErrors.password = validatePassword(form.password);
      nextErrors.confirmPassword = validateConfirmPassword(
        form.password,
        form.confirmPassword
      );
    }

    const filtered = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value !== undefined)
    ) as Partial<Record<keyof RegisterFormData, string>>;

    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  }

  function handleNext() {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 4));
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function validateJazzCash(): boolean {
    const digits = jazzCashNumber.replace(/\D/g, "");
    if (digits.length < 11) {
      setJazzCashError("Enter a valid JazzCash mobile number.");
      return false;
    }
    setJazzCashError(undefined);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!agreedToTerms || !selectedPlan) return;
    if (!validateJazzCash()) return;

    setFormError(undefined);
    setIsSubmitting(true);

    const subscription: ParentSubscription = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      status: "active",
      paymentMethod: "JazzCash",
      startedAt: new Date().toISOString(),
    };

    const result = await register(form, subscription);

    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your Parent Account"
      subtitle="Reliable school transport at your fingertips"
      className="max-w-lg"
    >
      <div className="mb-8">
        <StepIndicator steps={STEPS} currentStep={step} accent="parent" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error font-[family-name:var(--font-inter)]"
          >
            {formError}
          </div>
        )}

        {step === 1 && (
          <>
            <Input
              label="Full Name"
              placeholder="Sarah Ahmed"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              error={errors.fullName}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+92 300 1234567"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              error={errors.phone}
            />
            <div className="space-y-1.5">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-foreground font-[family-name:var(--font-inter)]"
              >
                City / Area
              </label>
              <select
                id="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-parent/20 font-[family-name:var(--font-inter)] ${
                  errors.city
                    ? "border-error focus:border-error"
                    : "border-border focus:border-parent"
                }`}
              >
                <option value="">Select your city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-xs text-error font-[family-name:var(--font-inter)]">
                  {errors.city}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
            />
            <PasswordInput
              label="Password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
            />
            {form.password && <PasswordStrengthMeter strength={passwordStrength} />}
            <PasswordInput
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
            />
          </>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-muted font-[family-name:var(--font-inter)]">
              Choose a subscription plan for your child&apos;s transport.
            </p>
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
                      : "border-border bg-white hover:border-parent/50"
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
                      <p className="mt-0.5 text-xs text-muted font-[family-name:var(--font-inter)]">
                        {plan.tagline}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {formatPkr(plan.price)}
                      </p>
                      <p className="text-[11px] text-muted font-[family-name:var(--font-inter)]">
                        per {plan.period}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-foreground font-[family-name:var(--font-inter)]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-parent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && selectedPlan && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-background p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Summary
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-medium text-parent hover:underline"
                >
                  Change plan
                </button>
              </div>
              <dl className="space-y-2 text-sm font-[family-name:var(--font-inter)]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Plan</dt>
                  <dd className="font-medium text-foreground text-right">
                    {selectedPlan.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Billing</dt>
                  <dd className="font-medium text-foreground text-right">
                    Monthly
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <dt className="text-foreground font-semibold">
                    Total due today
                  </dt>
                  <dd className="font-bold text-foreground text-right">
                    {formatPkr(selectedPlan.price)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9B1B6E] text-sm font-bold text-white">
                  JC
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Pay with JazzCash
                  </h3>
                  <p className="text-xs text-muted font-[family-name:var(--font-inter)]">
                    You&apos;ll receive a payment prompt on your mobile.
                  </p>
                </div>
              </div>
              <Input
                label="JazzCash Mobile Number"
                type="tel"
                placeholder="03XX XXXXXXX"
                value={jazzCashNumber}
                onChange={(e) => {
                  setJazzCashNumber(e.target.value);
                  setJazzCashError(undefined);
                }}
                error={jazzCashError}
              />
            </div>

            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy."
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" variant="parent" onClick={handleNext} className="flex-1">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="parent"
              className="flex-1"
              disabled={!agreedToTerms || isSubmitting}
            >
              {isSubmitting
                ? "Processing payment..."
                : selectedPlan
                  ? `Pay ${formatPkr(selectedPlan.price)} & Register`
                  : "Complete Registration"}
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted font-[family-name:var(--font-inter)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
