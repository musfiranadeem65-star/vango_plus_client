"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer select-none",
        "text-sm text-foreground font-[family-name:var(--font-inter)]",
        className
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
        {...props}
      />
      {label}
    </label>
  );
}
