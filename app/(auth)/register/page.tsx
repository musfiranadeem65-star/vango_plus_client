"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { StepIndicator } from "@/components/ui/StepIndicator";
import type { RegisterFormData } from "@/lib/auth/types";
import { ROLE_ROUTES } from "@/lib/auth/constants";
import { saveAuthSession } from "@/lib/auth/storage";
import { formatPkr } from "@/lib/subscription/plans";
import {
  getPasswordStrength,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/auth/validation";
import { createUser } from "@/services/userService";
import {
  createSubscription,
  getSubscriptionPlans,
  type SubscriptionPlan,
} from "@/services/subscriptionService";

const STEPS = ["Info", "Setup", "Plan"];

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

const FREE_TRIAL_PLAN = {
  name: "Free Trial",
  price: 0,
  period: "7 Days",
  tagline: "7 Days Free Trial",
  features: ["1 Child Enrollment", "Basic App Tracking", "Email Support"],
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [planError, setPlanError] = useState<string | undefined>();
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [freeTrialPlan, setFreeTrialPlan] = useState<SubscriptionPlan | null>(null);
  const isSubmitting = isCreatingSubscription || isCreatingUser;

  const selectedPlan = useMemo(
    () => ({
      ...FREE_TRIAL_PLAN,
      ...(freeTrialPlan ? {
        id: freeTrialPlan.id,
        name: freeTrialPlan.name,
        price: freeTrialPlan.price,
        period: freeTrialPlan.period,
      } : {}),
    }),
    [freeTrialPlan]
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

  async function handleNext() {
    if (!validateStep(step)) return;

    if (step === 2) {
      await createParentUser();
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function createParentUser() {
    if (createdUserId) {
      setStep(3);
      return;
    }

    setFormError(undefined);
    setIsCreatingUser(true);

    try {
      const user = await createUser({
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        role: "Parent",
        status: "Active",
      });

      // Backend may return the created id under different shapes. Coerce to number.
      const returnedId = Number(user?.id ?? user?.userId ?? user?.data?.id ?? NaN);
      if (Number.isNaN(returnedId) || !returnedId) {
        throw new Error("User created but backend did not return a valid id.");
      }
      setCreatedUserId(returnedId);
      setStep(3);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsCreatingUser(false);
    }
  }

  async function loadFreeTrialPlan() {
    if (freeTrialPlan || planError) return;

    setPlanError(undefined);
    setIsLoadingPlans(true);

    try {
      const plans = await getSubscriptionPlans();
      const trialPlan = plans.find((plan) =>
        typeof plan.name === "string" && plan.name.toLowerCase().includes("free trial")
      );
      if (!trialPlan) {
        throw new Error("Free Trial plan is not available.");
      }
      setFreeTrialPlan(trialPlan);
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "Unable to load subscription plans.");
    } finally {
      setIsLoadingPlans(false);
    }
  }

  useEffect(() => {
    if (step === 3) {
      void loadFreeTrialPlan();
    }
  }, [step]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!agreedToTerms || !selectedPlan) return;
    if (!createdUserId) {
      setFormError("Please complete account setup before starting the free trial.");
      return;
    }
    if (!freeTrialPlan) {
      setFormError("Unable to start free trial because the plan is not available.");
      return;
    }

    setFormError(undefined);
    setIsCreatingSubscription(true);

    try {
      const subscription = await createSubscription({
        id: 0,
        userId: Number(createdUserId),
        planId: Number(freeTrialPlan.id),
        planName: selectedPlan.name,
        price: Number(selectedPlan.price) ?? 0,
        status: "Active",
        paymentMethod: "None",
        startedAt: new Date().toISOString(),
      });

      saveAuthSession(
        {
          id: createdUserId,
          email: form.email,
          role: "parent",
          name: form.fullName,
          subscription: {
            planId: subscription.planId ?? freeTrialPlan.id,
            planName: subscription.planName ?? selectedPlan.name,
            price: subscription.price ?? selectedPlan.price,
            status: subscription.status ?? "active",
            paymentMethod: subscription.paymentMethod ?? "None",
            startedAt: subscription.startedAt ?? new Date().toISOString(),
          },
        },
        true
      );

      router.push(ROLE_ROUTES.parent);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to start free trial.");
      setIsCreatingSubscription(false);
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
          <div className="space-y-6">
            <p className="text-sm text-muted font-[family-name:var(--font-inter)]">
              Start your 7 day free trial with no payment required.
            </p>
            <div className="rounded-[1.5rem] border border-border bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {selectedPlan.name}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-950">
                    {formatPkr(selectedPlan.price)}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {selectedPlan.tagline}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-sm font-semibold text-foreground">
                Order Summary
              </h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Plan</dt>
                  <dd className="font-medium text-foreground">{selectedPlan.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Billing</dt>
                  <dd className="font-medium text-foreground">{selectedPlan.period}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-foreground font-semibold">Total due today</dt>
                  <dd className="font-bold text-foreground">{formatPkr(selectedPlan.price)}</dd>
                </div>
              </dl>
            </div>
            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy."
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            {planError && (
              <div
                role="alert"
                className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error font-[family-name:var(--font-inter)]"
              >
                {planError}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
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
              {isSubmitting ? "Starting free trial..." : "Start Free Trial"}
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
