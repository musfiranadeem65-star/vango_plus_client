import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "parent" | "outline";
type ButtonSize = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-[#2563a0] focus-visible:ring-primary/40",
  secondary:
    "bg-secondary text-white hover:bg-[#005850] focus-visible:ring-secondary/40",
  parent:
    "bg-parent text-white hover:bg-[#0b7a70] focus-visible:ring-parent/40",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary/5 focus-visible:ring-primary/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm font-semibold",
  lg: "h-12 px-6 text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
