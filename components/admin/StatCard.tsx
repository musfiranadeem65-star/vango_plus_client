import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type StatTone = "primary" | "secondary" | "tertiary" | "neutral";

const toneStyles: Record<
  StatTone,
  { container: string; icon: string; border: string }
> = {
  primary: {
    container: "bg-primary-fixed text-on-primary-fixed-variant",
    icon: "text-primary",
    border: "border-primary-fixed-dim/20",
  },
  secondary: {
    container: "bg-secondary-fixed text-on-secondary-fixed-variant",
    icon: "text-secondary",
    border: "border-secondary-fixed-dim/20",
  },
  tertiary: {
    container: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    icon: "text-tertiary",
    border: "border-tertiary-fixed-dim/20",
  },
  neutral: {
    container: "bg-surface-container-highest text-foreground",
    icon: "text-on-surface-variant",
    border: "border-outline-variant/30",
  },
};

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  tone?: StatTone;
  badge?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  tone = "primary",
  badge,
  href,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];

  const content = (
    <>
      {badge && (
        <span className="absolute right-4 top-4 rounded bg-tertiary px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
      <Icon name={icon} className={styles.icon} size={22} />
      <span className="mt-1 text-[48px] font-bold leading-none tracking-tight">
        {value}
      </span>
      <span className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
    </>
  );

  const baseClassName = cn(
    "relative flex min-w-[140px] flex-col gap-1 rounded-xl border p-4 shadow-sm",
    "snap-center transition-shadow hover:shadow-[var(--shadow-card-hover)]",
    styles.container,
    styles.border,
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return <div className={baseClassName}>{content}</div>;
}
