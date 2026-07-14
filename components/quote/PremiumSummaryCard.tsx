import { formatCurrency } from "@/lib/utils/format";
import type { PremiumBreakdown } from "@/lib/journey/schema";

export function PremiumSummaryCard({
  premium,
}: {
  premium: PremiumBreakdown;
}) {
  return (
    <div className="rounded-2xl bg-brand/5 p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-black/60">
          Annual premium
        </span>
        <span className="text-2xl font-bold text-brand">
          {formatCurrency(premium.total)}
        </span>
      </div>
      <div className="mt-3 flex flex-col gap-1 text-sm text-black/50">
        <div className="flex justify-between">
          <span>Base premium</span>
          <span>{formatCurrency(premium.base)}</span>
        </div>
        {premium.addonTotal > 0 && (
          <div className="flex justify-between">
            <span>Add-ons</span>
            <span>{formatCurrency(premium.addonTotal)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>{formatCurrency(premium.gst)}</span>
        </div>
      </div>
    </div>
  );
}
