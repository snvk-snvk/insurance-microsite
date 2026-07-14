"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useJourney } from "@/lib/journey/JourneyProvider";
import { useRequireQuote } from "@/lib/journey/guards";
import { calculatePremium, SUM_INSURED_OPTIONS } from "@/lib/pricing/premium";
import { SumInsuredTierSelect } from "@/components/quote/SumInsuredTierSelect";
import { AddonsList } from "@/components/quote/AddonsList";
import { PremiumSummaryCard } from "@/components/quote/PremiumSummaryCard";
import { ProgressSteps } from "@/components/site/ProgressSteps";
import { StickyCTA } from "@/components/site/StickyCTA";
import { Button } from "@/components/ui/Button";
import type { AddonId, SumInsured } from "@/lib/journey/schema";

export default function QuoteResultsPage() {
  const quote = useRequireQuote();
  const router = useRouter();
  const { setPlan } = useJourney();
  const [sumInsured, setSumInsured] = useState<SumInsured>(
    SUM_INSURED_OPTIONS[1]
  );
  const [addons, setAddons] = useState<AddonId[]>([]);

  const premium = useMemo(() => {
    if (!quote) return null;
    return calculatePremium(quote.pincode, quote.members, sumInsured, addons);
  }, [quote, sumInsured, addons]);

  function handleContinue() {
    if (!premium) return;
    setPlan({ sumInsured, addons, premium });
    router.push("/proposal");
  }

  if (!quote || !premium) return null;

  return (
    <>
      <ProgressSteps current="quote" />
      <main className="flex flex-1 flex-col gap-6 px-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Choose your cover</h1>
          <p className="mt-1 text-sm text-black/60">
            Covering {quote.members.length}{" "}
            {quote.members.length === 1 ? "person" : "people"}
          </p>
        </div>
        <PremiumSummaryCard premium={premium} />
        <div>
          <h2 className="mb-3 text-base font-semibold">Sum insured</h2>
          <SumInsuredTierSelect value={sumInsured} onChange={setSumInsured} />
        </div>
        <div>
          <h2 className="mb-3 text-base font-semibold">Add-ons</h2>
          <AddonsList value={addons} onChange={setAddons} />
        </div>
      </main>
      <StickyCTA>
        <Button className="w-full" onClick={handleContinue}>
          Continue to proposal
        </Button>
      </StickyCTA>
    </>
  );
}
