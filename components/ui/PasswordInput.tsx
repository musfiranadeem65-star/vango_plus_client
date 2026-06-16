"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function PasswordInput({
  label,
  error,
  id,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground font-[family-name:var(--font-inter)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-3 pr-11 text-sm text-foreground",
            "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-colors font-[family-name:var(--font-inter)]",
            error
              ? "border-error focus:border-error"
              : "border-border focus:border-primary",
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.42-.58M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1.02 2.28-2.77 4.18-5 5.32M6.1 6.1C3.67 7.56 1.73 9.74 1 12c1.73 3.89 6 7 11 7 1.05 0 2.06-.13 3-.36"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-error font-[family-name:var(--font-inter)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
