import { z } from "zod";

export const RelationSchema = z.enum([
  "self",
  "spouse",
  "son",
  "daughter",
  "father",
  "mother",
]);

export const CoveredMemberSchema = z.object({
  id: z.string(),
  relation: RelationSchema,
  age: z.number().int().min(0).max(99),
});

export const QuoteInputSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/),
  members: z.array(CoveredMemberSchema).min(1),
});

export const AddonIdSchema = z.enum([
  "maternity",
  "opd",
  "critical_illness",
  "personal_accident",
  "room_upgrade",
]);

export const SumInsuredSchema = z.union([
  z.literal(500000),
  z.literal(1000000),
  z.literal(2500000),
  z.literal(5000000),
  z.literal(10000000),
]);

export const PremiumBreakdownSchema = z.object({
  base: z.number(),
  addonTotal: z.number(),
  gst: z.number(),
  total: z.number(),
});

export const PlanSelectionSchema = z.object({
  sumInsured: SumInsuredSchema,
  addons: z.array(AddonIdSchema).default([]),
  premium: PremiumBreakdownSchema,
});

export const ProposalSchema = z.object({
  members: z.array(
    z.object({
      memberId: z.string(),
      fullName: z.string().min(1),
      dob: z.string(),
      gender: z.enum(["male", "female", "other"]),
    })
  ),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
  }),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  nominee: z.object({
    fullName: z.string().min(1),
    relation: z.string().min(1),
    dob: z.string(),
  }),
  hasPreexistingConditions: z.boolean(),
  medicalNotes: z.string().optional(),
});

export const PolicySchema = z.object({
  policyNumber: z.string(),
  issuedAt: z.string(),
  paymentMethod: z.enum(["card", "upi"]),
});

export const JourneyStateSchema = z.object({
  quote: QuoteInputSchema.nullable(),
  plan: PlanSelectionSchema.nullable(),
  proposal: ProposalSchema.nullable(),
  policy: PolicySchema.nullable(),
});

export type Relation = z.infer<typeof RelationSchema>;
export type CoveredMember = z.infer<typeof CoveredMemberSchema>;
export type QuoteInput = z.infer<typeof QuoteInputSchema>;
export type AddonId = z.infer<typeof AddonIdSchema>;
export type SumInsured = z.infer<typeof SumInsuredSchema>;
export type PremiumBreakdown = z.infer<typeof PremiumBreakdownSchema>;
export type PlanSelection = z.infer<typeof PlanSelectionSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type Policy = z.infer<typeof PolicySchema>;
export type JourneyState = z.infer<typeof JourneyStateSchema>;

export const EMPTY_JOURNEY_STATE: JourneyState = {
  quote: null,
  plan: null,
  proposal: null,
  policy: null,
};

export const RELATION_LABELS: Record<Relation, string> = {
  self: "Self",
  spouse: "Spouse",
  son: "Son",
  daughter: "Daughter",
  father: "Father",
  mother: "Mother",
};
