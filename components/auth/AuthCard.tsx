import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-xl bg-surface p-8 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
