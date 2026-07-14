import type {
  CoveredMember,
  SumInsured,
  AddonId,
  PremiumBreakdown,
} from "@/lib/journey/schema";
import { cityTierFromPincode } from "./pincode-tier";
import { ADDON_CATALOG } from "./addons";

// All figures below are an illustrative demo formula, not real actuarial
// pricing. 18% matches real Indian insurance GST for an authentic touch.
const BASE_RATE_PER_LAKH = 150;
const GST_RATE = 0.18;

const CITY_TIER_MULTIPLIER: Record<number, number> = { 1: 1.15, 2: 1.0, 3: 0.9 };

export const SUM_INSURED_OPTIONS: SumInsured[] = [
  500000, 1000000, 2500000, 5000000, 10000000,
];

function ageMultiplier(age: number): number {
  if (age < 18) return 0.4;
  if (age <= 25) return 0.8;
  if (age <= 35) return 1.0;
  if (age <= 45) return 1.3;
  if (age <= 55) return 1.8;
  if (age <= 65) return 2.5;
  return 3.2;
}

function familyFloaterDiscount(memberCount: number): number {
  if (memberCount <= 1) return 1;
  if (memberCount === 2) return 0.95;
  if (memberCount === 3) return 0.9;
  return 0.85;
}

function roundToNearestTen(value: number): number {
  return Math.round(value / 10) * 10;
}

export function calculatePremium(
  pincode: string,
  members: CoveredMember[],
  sumInsured: SumInsured,
  addons: AddonId[]
): PremiumBreakdown {
  const tierMultiplier = CITY_TIER_MULTIPLIER[cityTierFromPincode(pincode)];
  const sumInLakhs = sumInsured / 100000;

  const perMemberTotal = members.reduce(
    (sum, member) =>
      sum +
      sumInLakhs * BASE_RATE_PER_LAKH * ageMultiplier(member.age) * tierMultiplier,
    0
  );
  const base = perMemberTotal * familyFloaterDiscount(members.length);

  const addonTotal = addons.reduce((sum, id) => {
    const rule = ADDON_CATALOG[id].rule;
    return rule.type === "pct"
      ? sum + base * rule.value
      : sum + rule.value * members.length;
  }, 0);

  const gst = (base + addonTotal) * GST_RATE;

  return {
    base: roundToNearestTen(base),
    addonTotal: roundToNearestTen(addonTotal),
    gst: roundToNearestTen(gst),
    total: roundToNearestTen(base + addonTotal + gst),
  };
}
