import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export function Icon({ name, className, filled = false, size = 24 }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined leading-none",
        filled && "filled",
        className
      )}
      style={{ fontSize: size }}
      aria-hidden
    >
      {name}
    </span>
  );
}
