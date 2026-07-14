"use client";

import { Input } from "@/components/ui/Input";
import type { UpiFormValue, UpiFormErrors } from "@/lib/payment/validation";

export function UpiForm({
  value,
  errors,
  onChange,
}: {
  value: UpiFormValue;
  errors: UpiFormErrors;
  onChange: (value: UpiFormValue) => void;
}) {
  return (
    <Input
      label="UPI ID"
      placeholder="yourname@bank"
      value={value.vpa}
      onChange={(e) => onChange({ vpa: e.target.value })}
      error={errors.vpa}
    />
  );
}
