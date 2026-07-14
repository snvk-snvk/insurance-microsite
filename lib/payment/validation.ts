export function isValidCardNumber(raw: string): boolean {
  const digits = raw.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(mmYY: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(mmYY);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryEnd = new Date(year, month, 0);
  return expiryEnd >= new Date(now.getFullYear(), now.getMonth(), 1);
}

export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

export function isValidVpa(vpa: string): boolean {
  return /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(vpa);
}

export type CardFormValue = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};
export type CardFormErrors = Partial<Record<keyof CardFormValue, string>>;

export function validateCard(value: CardFormValue): CardFormErrors {
  const errors: CardFormErrors = {};
  if (!isValidCardNumber(value.number)) errors.number = "Enter a valid card number";
  if (value.name.trim().length < 2) errors.name = "Enter the name on the card";
  if (!isValidExpiry(value.expiry)) errors.expiry = "Enter a valid expiry (MM/YY)";
  if (!isValidCvv(value.cvv)) errors.cvv = "Enter a valid CVV";
  return errors;
}

export type UpiFormValue = { vpa: string };
export type UpiFormErrors = Partial<Record<keyof UpiFormValue, string>>;

export function validateUpi(value: UpiFormValue): UpiFormErrors {
  const errors: UpiFormErrors = {};
  if (!isValidVpa(value.vpa)) errors.vpa = "Enter a valid UPI ID (e.g. name@bank)";
  return errors;
}
