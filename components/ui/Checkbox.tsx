import { type InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => (
    <label
      className={cn(
        "relative flex min-h-11 cursor-pointer select-none items-center gap-3",
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="peer sr-only"
        {...props}
      />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-black/20 transition-colors peer-checked:border-brand peer-checked:bg-brand" />
      <Check
        className="pointer-events-none absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-foreground opacity-0 peer-checked:opacity-100"
        strokeWidth={3}
      />
      <span className="text-base">{label}</span>
    </label>
  )
);
Checkbox.displayName = "Checkbox";
