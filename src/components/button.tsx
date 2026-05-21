import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantClass: Record<Variant, string> = {
  primary: cn(
    "bg-(--color-accent-cta) text-(--color-accent-cta-text)",
    "hover:bg-(--color-shuiro)/85 active:bg-(--color-shuiro)/95",
    "shadow-sm shadow-(--color-shuiro)/20",
  ),
  secondary: cn(
    "bg-transparent text-(--color-text-primary)",
    "border border-(--color-accent-emphasis)/50",
    "hover:bg-(--color-accent-emphasis)/10 hover:border-(--color-accent-emphasis)/70",
    "active:bg-(--color-accent-emphasis)/15",
  ),
  ghost: cn(
    "bg-transparent text-(--color-text-secondary)",
    "hover:text-(--color-text-primary) hover:bg-(--color-bg-elevated)",
  ),
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-[40px] px-4 text-(length:--text-caption)",
  md: "min-h-[44px] px-6 text-(length:--text-body)", // 44px = accessibility tap minimum
  lg: "min-h-[52px] px-8 text-(length:--text-body-lg)",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-sm",
        "font-mincho tracking-(--tracking-jp-wide) font-medium",
        "transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-bg-base)",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
