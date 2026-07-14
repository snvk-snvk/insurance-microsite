"use client";

import { cn } from "@/lib/utils/cn";

export function PaymentMethodTabs({
  value,
  onChange,
}: {
  value: "card" | "upi";
  onChange: (value: "card" | "upi") => void;
}) {
  return (
    <div className="flex rounded-xl border border-black/10 p-1">
      {(["card", "upi"] as const).map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => onChange(method)}
          className={cn(
            "h-10 flex-1 rounded-lg text-sm font-semibold transition-colors",
            value === method
              ? "bg-brand text-brand-foreground"
              : "text-black/60"
          )}
        >
          {method === "upi" ? "UPI" : "Card"}
        </button>
      ))}
    </div>
  );
}
