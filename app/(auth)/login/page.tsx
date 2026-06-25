"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROLE_LABELS } from "@/lib/auth/constants";
import { DEMO_ACCOUNTS } from "@/lib/auth/mock-auth";
import { validateEmail, validatePassword } from "@/lib/auth/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setFormError(undefined);
    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setFormError(undefined);
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your VanGo Plus account">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error font-[family-name:var(--font-inter)]"
          >
            {formError}
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember Me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted font-[family-name:var(--font-inter)]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-parent hover:underline">
          Create Parent Account
        </Link>
      </p>

      <div className="mt-6 rounded-lg bg-primary/5 px-4 py-3 font-[family-name:var(--font-inter)]">
        <p className="text-xs font-medium text-foreground">
          Demo accounts (password: password)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account.email, account.password)}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
            >
              {ROLE_LABELS[account.role]}
            </button>
          ))}
        </div>
      </div>
    </AuthCard>
  );
}
