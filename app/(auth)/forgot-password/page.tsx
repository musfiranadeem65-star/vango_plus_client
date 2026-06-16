"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateEmail } from "@/lib/auth/validation";

const RESEND_DELAY_SECONDS = 30;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    window.setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setResendCountdown(RESEND_DELAY_SECONDS);
    }, 600);
  }

  function handleResend() {
    if (resendCountdown > 0) return;
    setResendCountdown(RESEND_DELAY_SECONDS);
  }

  if (submitted) {
    return (
      <AuthCard title="Email Sent!" subtitle="Check your inbox for the reset link.">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-parent/10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="#0d9488"
                strokeWidth="1.5"
              />
              <path
                d="M3 7l9 6 9-6"
                stroke="#0d9488"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-sm text-muted leading-relaxed font-[family-name:var(--font-inter)]">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>. Didn&apos;t get it?
          </p>

          <Button
            variant="outline"
            fullWidth
            onClick={handleResend}
            disabled={resendCountdown > 0}
          >
            {resendCountdown > 0
              ? `Resend Email (${resendCountdown}s)`
              : "Resend Email"}
          </Button>

          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your Password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Login
        </Link>
      </p>
    </AuthCard>
  );
}
