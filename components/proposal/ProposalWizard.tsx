"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequirePlan } from "@/lib/journey/guards";
import { useJourney } from "@/lib/journey/JourneyProvider";
import {
  ProposalSchema,
  RELATION_LABELS,
  type Proposal,
} from "@/lib/journey/schema";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { StickyCTA } from "@/components/site/StickyCTA";
import { ProgressSteps } from "@/components/site/ProgressSteps";

const SUB_STEPS = [
  { key: "members", title: "Who are we insuring?" },
  { key: "contact", title: "Contact & address" },
  { key: "nominee", title: "Nominee details" },
  { key: "declaration", title: "Medical declaration" },
] as const;

type SubStepKey = (typeof SUB_STEPS)[number]["key"];

const STEP_FIELD_PREFIXES: Record<SubStepKey, Path<Proposal>[]> = {
  members: ["members"],
  contact: ["contact", "address"],
  nominee: ["nominee"],
  declaration: ["hasPreexistingConditions", "medicalNotes"],
};

export function ProposalWizard() {
  const plan = useRequirePlan();
  const { state, setProposal } = useJourney();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  const quoteMembers = state.quote?.members ?? [];

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Proposal>({
    resolver: zodResolver(ProposalSchema),
    defaultValues: {
      members: quoteMembers.map((m) => ({
        memberId: m.id,
        fullName: "",
        dob: "",
        gender: "male",
      })),
      contact: { email: "", phone: "" },
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: state.quote?.pincode ?? "",
      },
      nominee: { fullName: "", relation: "", dob: "" },
      hasPreexistingConditions: false,
      medicalNotes: "",
    },
  });

  if (!plan || !state.quote) return null;

  const currentStep = SUB_STEPS[stepIndex];

  const onSubmit: SubmitHandler<Proposal> = (data) => {
    setProposal(data);
    router.push("/payment");
  };

  async function goNext() {
    const valid = await trigger(STEP_FIELD_PREFIXES[currentStep.key]);
    if (!valid) return;
    if (stepIndex < SUB_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handleSubmit(onSubmit)();
    }
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <>
      <ProgressSteps current="proposal" />
      <main className="flex flex-1 flex-col gap-6 px-4 pb-6">
        <h1 className="text-2xl font-bold">{currentStep.title}</h1>

        {currentStep.key === "members" && (
          <div className="flex flex-col gap-4">
            {quoteMembers.map((m, i) => (
              <div
                key={m.id}
                className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4"
              >
                <p className="text-sm font-medium text-black/60">
                  {RELATION_LABELS[m.relation]} - age {m.age}
                </p>
                <Input
                  label="Full name"
                  {...register(`members.${i}.fullName`)}
                  error={errors.members?.[i]?.fullName?.message}
                />
                <Input
                  label="Date of birth"
                  type="date"
                  {...register(`members.${i}.dob`)}
                  error={errors.members?.[i]?.dob?.message}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    {...register(`members.${i}.gender`)}
                    className="h-12 rounded-xl border border-black/15 px-4 text-base outline-none focus:border-brand"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep.key === "contact" && (
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              {...register("contact.email")}
              error={errors.contact?.email?.message}
            />
            <Input
              label="Mobile number"
              inputMode="numeric"
              maxLength={10}
              {...register("contact.phone")}
              error={errors.contact?.phone?.message}
            />
            <Input
              label="Address line 1"
              {...register("address.line1")}
              error={errors.address?.line1?.message}
            />
            <Input label="Address line 2 (optional)" {...register("address.line2")} />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                {...register("address.city")}
                error={errors.address?.city?.message}
              />
              <Input
                label="State"
                {...register("address.state")}
                error={errors.address?.state?.message}
              />
            </div>
            <Input
              label="Pincode"
              inputMode="numeric"
              maxLength={6}
              {...register("address.pincode")}
              error={errors.address?.pincode?.message}
            />
          </div>
        )}

        {currentStep.key === "nominee" && (
          <div className="flex flex-col gap-4">
            <Input
              label="Nominee full name"
              {...register("nominee.fullName")}
              error={errors.nominee?.fullName?.message}
            />
            <Input
              label="Relation to nominee"
              placeholder="e.g. Spouse, Son"
              {...register("nominee.relation")}
              error={errors.nominee?.relation?.message}
            />
            <Input
              label="Nominee date of birth"
              type="date"
              {...register("nominee.dob")}
              error={errors.nominee?.dob?.message}
            />
          </div>
        )}

        {currentStep.key === "declaration" && (
          <div className="flex flex-col gap-4">
            <Checkbox
              label="Any of the insured members have a pre-existing medical condition"
              {...register("hasPreexistingConditions")}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Additional notes (optional)
              </label>
              <textarea
                {...register("medicalNotes")}
                rows={4}
                className="rounded-xl border border-black/15 p-3 text-base outline-none focus:border-brand"
              />
            </div>
          </div>
        )}
      </main>
      <StickyCTA className="flex gap-3">
        {stepIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button type="button" onClick={goNext} className="flex-1">
          {stepIndex < SUB_STEPS.length - 1 ? "Continue" : "Continue to payment"}
        </Button>
      </StickyCTA>
    </>
  );
}
