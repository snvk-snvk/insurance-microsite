"use client";

import { CheckCircle2 } from "lucide-react";
import { useRequirePolicy } from "@/lib/journey/guards";
import { useJourney } from "@/lib/journey/JourneyProvider";
import { PolicySummaryCard } from "@/components/success/PolicySummaryCard";
import { DownloadPolicyButton } from "@/components/success/DownloadPolicyButton";
import { ProgressSteps } from "@/components/site/ProgressSteps";

export default function SuccessPage() {
  const policy = useRequirePolicy();
  const { state } = useJourney();

  if (!policy || !state.plan) return null;

  return (
    <>
      <ProgressSteps current="done" />
      <main className="flex flex-1 flex-col gap-6 px-4 pb-10">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-14 w-14 text-accent" />
          <h1 className="text-2xl font-bold">You&apos;re covered!</h1>
          <p className="text-sm text-black/60">
            Your policy has been issued. A copy has been generated below.
          </p>
        </div>
        <PolicySummaryCard plan={state.plan} policy={policy} />
        <DownloadPolicyButton />
      </main>
    </>
  );
}
