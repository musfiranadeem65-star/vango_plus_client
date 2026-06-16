"use client";

import { cn } from "@/lib/utils";
import type { PasswordStrength } from "@/lib/auth/validation";

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

const strengthConfig: Record<
  PasswordStrength,
  { label: string; width: string; color: string }
> = {
  weak: { label: "Weak", width: "w-1/3", color: "bg-error" },
  fair: { label: "Fair", width: "w-2/3", color: "bg-driver" },
  strong: { label: "Strong", width: "w-full", color: "bg-success" },
};

export function PasswordStrengthMeter({ strength }: PasswordStrengthMeterProps) {
  const config = strengthConfig[strength];

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300", config.width, config.color)}
        />
      </div>
      <p className="text-xs text-muted font-[family-name:var(--font-inter)]">
        Password strength:{" "}
        <span className="font-medium text-foreground">{config.label}</span>
      </p>
    </div>
  );
}
