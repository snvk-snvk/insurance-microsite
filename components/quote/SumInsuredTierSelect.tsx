"use client";

import { RadioCard } from "@/components/ui/RadioCard";
import { formatCurrency } from "@/lib/utils/format";
import { SUM_INSURED_OPTIONS } from "@/lib/pricing/premium";
import type { SumInsured } from "@/lib/journey/schema";

export function SumInsuredTierSelect({
  value,
  onChange,
}: {
  value: SumInsured;
  onChange: (value: SumInsured) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {SUM_INSURED_OPTIONS.map((option) => (
        <RadioCard
          key={option}
          name="sum-insured"
          label={formatCurrency(option)}
          description={
            option >= 2500000 ? "Recommended for metro cities" : undefined
          }
          checked={value === option}
          onChange={() => onChange(option)}
        />
      ))}
    </div>
  );
}
