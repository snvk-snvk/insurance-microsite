import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-12 min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
      variant === "primary" && "bg-brand text-brand-foreground hover:opacity-90",
      variant === "secondary" &&
        "bg-accent text-accent-foreground hover:opacity-90",
      variant === "outline" &&
        "border border-black/15 text-foreground hover:bg-black/[.03]",
      variant === "ghost" && "text-foreground hover:bg-black/[.03]",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
