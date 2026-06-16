"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { detectRoleFromEmail, ROLE_ROUTES } from "@/lib/auth/constants";
import { saveAuthSession } from "@/lib/auth/storage";
import { validateEmail, validatePassword } from "@/lib/auth/validation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const role = detectRoleFromEmail(email);
    saveAuthSession({ email, role }, rememberMe);

    router.push(ROLE_ROUTES[role]);
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your VanGo Plus account">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

      <p className="mt-4 rounded-lg bg-primary/5 px-4 py-3 text-xs text-muted font-[family-name:var(--font-inter)]">
        Demo tip: use an email with &quot;admin&quot;, &quot;driver&quot;, or anything else to
        route to the admin, driver, or parent portal.
      </p>
    </AuthCard>
  );
}
