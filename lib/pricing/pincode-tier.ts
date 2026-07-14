// Deterministic demo heuristic based on the pincode's first digit - NOT a
// real Indian postal-code-to-city mapping. Good enough to make the premium
// feel geography-aware for a demo.
const TIER_1_FIRST_DIGITS = new Set([1, 4, 5, 6]);
const TIER_3_FIRST_DIGITS = new Set([7, 8]);

export type CityTier = 1 | 2 | 3;

export function cityTierFromPincode(pincode: string): CityTier {
  const firstDigit = Number(pincode[0]);
  if (TIER_1_FIRST_DIGITS.has(firstDigit)) return 1;
  if (TIER_3_FIRST_DIGITS.has(firstDigit)) return 3;
  return 2;
}
