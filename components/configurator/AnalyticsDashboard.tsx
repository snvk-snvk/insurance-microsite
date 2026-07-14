"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getAllVersions, generateVersionMetrics } from "@/lib/analytics/mock-data";
import { StatTile } from "@/components/analytics/StatTile";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { VersionsTable } from "@/components/analytics/VersionsTable";
import { formatCurrency } from "@/lib/utils/format";

const EMPTY_TOTALS = {
  dau: 0,
  mau: 0,
  landingVisits: 0,
  quotesGenerated: 0,
  proposalsStarted: 0,
  paymentsInitiated: 0,
  policiesIssued: 0,
  totalPremiumCollected: 0,
};

export function AnalyticsDashboard() {
  const { theme } = useTheme();

  const versions = useMemo(
    () =>
      getAllVersions(theme).map((v) => ({
        ...v,
        metrics: generateVersionMetrics(v.brandName),
      })),
    [theme]
  );

  const liveVersion = versions[0];

  const totals = useMemo(
    () =>
      versions.reduce((acc, v) => {
        acc.dau += v.metrics.dau;
        acc.mau += v.metrics.mau;
        acc.landingVisits += v.metrics.landingVisits;
        acc.quotesGenerated += v.metrics.quotesGenerated;
        acc.proposalsStarted += v.metrics.proposalsStarted;
        acc.paymentsInitiated += v.metrics.paymentsInitiated;
        acc.policiesIssued += v.metrics.policiesIssued;
        acc.totalPremiumCollected += v.metrics.totalPremiumCollected;
        return acc;
      }, { ...EMPTY_TOTALS }),
    [versions]
  );

  const conversionRate = Math.round(
    (totals.policiesIssued / totals.quotesGenerated) * 100
  );
  const stickiness = Math.round((totals.dau / totals.mau) * 100);
  const avgPremium = Math.round(totals.totalPremiumCollected / totals.policiesIssued);

  const dailyTrend = useMemo(() => {
    const totalsByDay = Array.from({ length: 14 }, () => 0);
    versions.forEach((v) => {
      v.metrics.dailyPolicies.forEach((n, i) => {
        totalsByDay[i] += n;
      });
    });
    return totalsByDay;
  }, [versions]);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-black/50">
        Sample analytics across every microsite version you&apos;ve configured,
        including the one you&apos;re editing now. This is illustrative demo
        data, not real traffic.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile
          label="DAU"
          value={totals.dau.toLocaleString("en-IN")}
          sublabel="Daily active users"
        />
        <StatTile
          label="MAU"
          value={totals.mau.toLocaleString("en-IN")}
          sublabel="Monthly active users"
        />
        <StatTile
          label="Stickiness"
          value={`${stickiness}%`}
          sublabel="DAU / MAU"
        />
        <StatTile
          label="Quotes generated"
          value={totals.quotesGenerated.toLocaleString("en-IN")}
        />
        <StatTile
          label="Policies issued"
          value={totals.policiesIssued.toLocaleString("en-IN")}
        />
        <StatTile
          label="Quote-to-payment"
          value={`${conversionRate}%`}
          sublabel="Conversion rate"
        />
        <StatTile
          label="Premium collected"
          value={formatCurrency(totals.totalPremiumCollected)}
        />
        <StatTile
          label="Avg. premium"
          value={formatCurrency(avgPremium)}
          sublabel="Per policy issued"
        />
        <StatTile
          label="Mobile traffic"
          value={`${liveVersion.metrics.mobileSharePct}%`}
          sublabel="Live version"
        />
        <StatTile
          label="Top add-on"
          value={liveVersion.metrics.topAddon}
          sublabel="Live version"
        />
      </div>

      <div className="rounded-2xl border border-black/10 p-4">
        <p className="mb-4 text-sm font-semibold">Quote-to-payment funnel</p>
        <FunnelChart
          stages={[
            { label: "Landing visits", value: totals.landingVisits },
            { label: "Quotes generated", value: totals.quotesGenerated },
            { label: "Proposals started", value: totals.proposalsStarted },
            { label: "Payments initiated", value: totals.paymentsInitiated },
            { label: "Policies issued", value: totals.policiesIssued },
          ]}
        />
      </div>

      <div className="rounded-2xl border border-black/10 p-4">
        <TrendChart data={dailyTrend} label="Policies issued - last 14 days" />
      </div>

      <div>
        <p className="mb-4 text-sm font-semibold">Versions</p>
        <VersionsTable versions={versions} />
      </div>
    </div>
  );
}
