import { cn } from "@/lib/utils";

type StatusTone = "success" | "alert" | "active" | "neutral" | "pending";

const toneStyles: Record<StatusTone, string> = {
  success: "bg-secondary-container text-on-secondary-container",
  alert: "bg-error-container text-on-error-container",
  active: "bg-surface-container text-on-surface-variant",
  neutral: "bg-surface-container-high text-on-surface-variant",
  pending: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
