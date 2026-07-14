import type { AddonId } from "@/lib/journey/schema";

type AddonRule =
  | { type: "pct"; value: number }
  | { type: "flat_per_member"; value: number };

export const ADDON_CATALOG: Record<
  AddonId,
  { label: string; description: string; rule: AddonRule }
> = {
  maternity: {
    label: "Maternity cover",
    description: "Covers delivery and newborn expenses.",
    rule: { type: "pct", value: 0.12 },
  },
  opd: {
    label: "OPD cover",
    description: "Doctor consultations, diagnostics, and pharmacy bills.",
    rule: { type: "pct", value: 0.08 },
  },
  critical_illness: {
    label: "Critical illness cover",
    description: "Lump-sum payout on diagnosis of a listed critical illness.",
    rule: { type: "pct", value: 0.1 },
  },
  personal_accident: {
    label: "Personal accident cover",
    description: "Extra payout for accidental death or disability.",
    rule: { type: "flat_per_member", value: 500 },
  },
  room_upgrade: {
    label: "Room rent upgrade",
    description: "Removes the room-category capping for hospitalization.",
    rule: { type: "pct", value: 0.06 },
  },
};
