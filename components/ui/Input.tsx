import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border border-black/15 px-4 text-base outline-none transition-colors",
            "focus:border-brand focus:ring-2 focus:ring-brand/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
