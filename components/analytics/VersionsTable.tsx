import type { MicrositeVersion, VersionMetrics } from "@/lib/analytics/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils/format";

type Row = MicrositeVersion & { metrics: VersionMetrics };

export function VersionsTable({ versions }: { versions: Row[] }) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-black/10">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/[.02] text-left text-xs font-medium uppercase tracking-wide text-black/50">
            <th className="px-4 py-3">Version</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">DAU</th>
            <th className="px-4 py-3 text-right">MAU</th>
            <th className="px-4 py-3 text-right">Quotes</th>
            <th className="px-4 py-3 text-right">Policies</th>
            <th className="px-4 py-3 text-right">Conversion</th>
            <th className="px-4 py-3 text-right">Premium collected</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => {
            const conversion = Math.round(
              (v.metrics.policiesIssued / v.metrics.quotesGenerated) * 100
            );
            return (
              <tr key={v.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: v.primaryColor }}
                    />
                    <span className="font-medium">{v.brandName}</span>
                    {v.isLive && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        Live
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-black/60">
                  {formatDate(`${v.createdAt}T00:00:00.000Z`)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {v.metrics.dau.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {v.metrics.mau.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {v.metrics.quotesGenerated.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {v.metrics.policiesIssued.toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{conversion}%</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatCurrency(v.metrics.totalPremiumCollected)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
