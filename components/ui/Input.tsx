"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground font-[family-name:var(--font-inter)]"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-lg border bg-white px-4 py-3 text-sm text-foreground",
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
