import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { PlanSelection, Policy } from "@/lib/journey/schema";

export function PolicySummaryCard({
  plan,
  policy,
}: {
  plan: PlanSelection;
  policy: Policy;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-black/50">Policy number</span>
        <span className="font-semibold">{policy.policyNumber}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-black/50">Issued on</span>
        <span className="font-medium">{formatDate(policy.issuedAt)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-black/50">Sum insured</span>
        <span className="font-medium">{formatCurrency(plan.sumInsured)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-black/50">Premium paid</span>
        <span className="font-medium">{formatCurrency(plan.premium.total)}</span>
      </div>
    </div>
  );
}
