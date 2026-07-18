"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useJourney } from "@/lib/journey/JourneyProvider";
import { MembersStep } from "@/components/quote/MembersStep";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StickyCTA } from "@/components/site/StickyCTA";
import { ProgressSteps } from "@/components/site/ProgressSteps";
import type { CoveredMember } from "@/lib/journey/schema";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setQuote } = useJourney();
  const [pincode, setPincode] = useState("");
  const [members, setMembers] = useState<CoveredMember[]>([
    { id: crypto.randomUUID(), relation: "self", age: 30 },
  ]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }
    if (members.length === 0) {
      setError("Add at least one person to cover");
      return;
    }
    setError(null);
    setQuote({ pincode, members });
    router.push("/quote");
  }

  return (
    <>
      <ProgressSteps current="quote" />
      <main className="flex flex-1 flex-col gap-6 px-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {theme.headline}
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Tell us who you want to protect and get an instant quote.
          </p>
        </div>
        <Input
          label="Pincode"
          inputMode="numeric"
          maxLength={6}
          placeholder="e.g. 560001"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
        />
        <MembersStep members={members} onChange={setMembers} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </main>
      <StickyCTA>
        <Button className="w-full" onClick={handleSubmit}>
          Get my quote
        </Button>
      </StickyCTA>
    </>
  );
}
