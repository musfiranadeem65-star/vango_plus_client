"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ROLE_ROUTES } from "@/lib/auth/constants";
import { saveAuthSession } from "@/lib/auth/storage";
import type { RegisterFormData } from "@/lib/auth/types";
import {
  getPasswordStrength,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/auth/validation";

const STEPS = ["Info", "Setup", "Confirm"];

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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setStep((prev) => Math.min(prev + 1, 3));
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!agreedToTerms) return;

    setIsSubmitting(true);
    saveAuthSession(
      { email: form.email, role: "parent", name: form.fullName },
      true
    );

    router.push(ROLE_ROUTES.parent);
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
          <>
            <div className="rounded-xl border border-border bg-background p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Account Summary</h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-parent hover:underline"
                >
                  Edit
                </button>
              </div>
              <dl className="space-y-2 text-sm font-[family-name:var(--font-inter)]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Full Name</dt>
                  <dd className="font-medium text-foreground text-right">{form.fullName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium text-foreground text-right">{form.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Email</dt>
                  <dd className="font-medium text-foreground text-right">{form.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">City</dt>
                  <dd className="font-medium text-foreground text-right">{form.city}</dd>
                </div>
              </dl>
            </div>

            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy."
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
          </>
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
              {isSubmitting ? "Creating account..." : "Complete Registration"}
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
