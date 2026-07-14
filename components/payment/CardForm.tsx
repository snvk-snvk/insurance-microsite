"use client";

import { Input } from "@/components/ui/Input";
import type { CardFormValue, CardFormErrors } from "@/lib/payment/validation";

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CardForm({
  value,
  errors,
  onChange,
}: {
  value: CardFormValue;
  errors: CardFormErrors;
  onChange: (value: CardFormValue) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Card number"
        inputMode="numeric"
        placeholder="1234 5678 9012 3456"
        value={value.number}
        onChange={(e) =>
          onChange({ ...value, number: formatCardNumber(e.target.value) })
        }
        error={errors.number}
      />
      <Input
        label="Name on card"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        error={errors.name}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Expiry (MM/YY)"
          inputMode="numeric"
          placeholder="MM/YY"
          value={value.expiry}
          onChange={(e) =>
            onChange({ ...value, expiry: formatExpiry(e.target.value) })
          }
          error={errors.expiry}
        />
        <Input
          label="CVV"
          inputMode="numeric"
          maxLength={4}
          type="password"
          value={value.cvv}
          onChange={(e) =>
            onChange({ ...value, cvv: e.target.value.replace(/\D/g, "") })
          }
          error={errors.cvv}
        />
      </div>
    </div>
  );
}
