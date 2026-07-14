"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireProposal } from "@/lib/journey/guards";
import { useJourney } from "@/lib/journey/JourneyProvider";
import { PaymentMethodTabs } from "@/components/payment/PaymentMethodTabs";
import { CardForm } from "@/components/payment/CardForm";
import { UpiForm } from "@/components/payment/UpiForm";
import { ProcessingOverlay } from "@/components/payment/ProcessingOverlay";
import {
  validateCard,
  validateUpi,
  type CardFormValue,
  type CardFormErrors,
  type UpiFormValue,
  type UpiFormErrors,
} from "@/lib/payment/validation";
import { generatePolicyNumber } from "@/lib/utils/policy-number";
import { formatCurrency } from "@/lib/utils/format";
import { ProgressSteps } from "@/components/site/ProgressSteps";
import { StickyCTA } from "@/components/site/StickyCTA";
import { Button } from "@/components/ui/Button";

const PROCESSING_STAGES = [
  "Verifying details...",
  "Contacting your bank...",
  "Confirming payment...",
];

export default function PaymentPage() {
  const proposal = useRequireProposal();
  const { state, setPolicy } = useJourney();
  const router = useRouter();

  const [method, setMethod] = useState<"card" | "upi">("card");
  const [cardValue, setCardValue] = useState<CardFormValue>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<CardFormErrors>({});
  const [upiValue, setUpiValue] = useState<UpiFormValue>({ vpa: "" });
  const [upiErrors, setUpiErrors] = useState<UpiFormErrors>({});
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(0);

  if (!proposal || !state.plan) return null;

  function handlePay() {
    if (method === "card") {
      const errors = validateCard(cardValue);
      setCardErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = validateUpi(upiValue);
      setUpiErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setProcessing(true);
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage += 1;
      if (currentStage >= PROCESSING_STAGES.length) {
        clearInterval(interval);
        setPolicy({
          policyNumber: generatePolicyNumber(),
          issuedAt: new Date().toISOString(),
          paymentMethod: method,
        });
        router.push("/success");
        return;
      }
      setStage(currentStage);
    }, 900);
  }

  return (
    <>
      <ProgressSteps current="payment" />
      <main className="flex flex-1 flex-col gap-6 px-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment</h1>
          <p className="mt-1 text-sm text-black/60">
            Amount payable:{" "}
            <span className="font-semibold text-brand">
              {formatCurrency(state.plan.premium.total)}
            </span>
          </p>
        </div>
        <PaymentMethodTabs value={method} onChange={setMethod} />
        {method === "card" ? (
          <CardForm value={cardValue} errors={cardErrors} onChange={setCardValue} />
        ) : (
          <UpiForm value={upiValue} errors={upiErrors} onChange={setUpiValue} />
        )}
        <p className="text-xs text-black/40">
          This is a simulated payment for demo purposes. No real transaction
          takes place and no card/UPI details are stored.
        </p>
      </main>
      <StickyCTA>
        <Button className="w-full" onClick={handlePay} disabled={processing}>
          Pay {formatCurrency(state.plan.premium.total)}
        </Button>
      </StickyCTA>
      {processing && <ProcessingOverlay message={PROCESSING_STAGES[stage]} />}
    </>
  );
}
