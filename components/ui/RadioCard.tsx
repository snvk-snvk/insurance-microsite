import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, label, description, ...props }, ref) => (
    <label
      className={cn(
        "relative flex min-h-11 cursor-pointer flex-col gap-0.5 rounded-xl border-2 border-black/10 p-4 transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/5",
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="absolute right-4 top-4 h-5 w-5 accent-[var(--color-primary)]"
        {...props}
      />
      <span className="pr-8 font-semibold">{label}</span>
      {description && (
        <span className="pr-8 text-sm text-black/60">{description}</span>
      )}
    </label>
  )
);
RadioCard.displayName = "RadioCard";
