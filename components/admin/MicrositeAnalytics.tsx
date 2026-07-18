"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatTile } from "@/components/analytics/StatTile";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { TrendChart } from "@/components/analytics/TrendChart";
import { productLabel } from "@/lib/products/catalog";
import { formatCurrency } from "@/lib/utils/format";
import {
  generateBackendMetrics,
  generateFrontendEvents,
  generateVersionMetrics,
} from "@/lib/analytics/mock-data";
import { getMicrosite, type Microsite } from "@/lib/admin/microsites";

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-black/50">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function MicrositeAnalytics({ micrositeId }: { micrositeId: string }) {
  const [microsite, setMicrosite] = useState<Microsite | null | undefined>(undefined);

  useEffect(() => {
    // One-time hydration from localStorage, which isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMicrosite(getMicrosite(micrositeId));
  }, [micrositeId]);

  if (microsite === undefined) {
    return <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/40">Loading…</main>;
  }
  if (microsite === null) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <p className="text-black/60">That journey could not be found.</p>
        <Link
          href="/configurator"
          className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/15 px-5 text-base font-semibold hover:bg-black/[.03]"
        >
          Back to journeys
        </Link>
      </main>
    );
  }

  const seed = microsite.partnerName;
  const funnel = generateVersionMetrics(seed);
  const fe = generateFrontendEvents(seed);
  const be = generateBackendMetrics(seed);

  return (
    <main className="mx-auto w-full min-h-screen max-w-6xl px-4 py-10">
      <Link
        href="/configurator"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" /> Journeys
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: microsite.theme.colors.primary }}
        >
          {microsite.partnerName.slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-bold">{microsite.partnerName}</h1>
          <p className="text-sm text-black/50">
            {productLabel(microsite.productId)} ·{" "}
            {microsite.status === "live" ? "Live" : "Disabled"}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-black/40">
        Illustrative demo analytics — deterministic mock data, not real traffic.
      </p>

      <div className="mt-10 flex flex-col gap-12">
        <Section
          title="Frontend event analytics"
          subtitle="Client-side sessions, page views and interaction events."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatTile label="Sessions" value={fe.sessions.toLocaleString("en-IN")} />
            <StatTile label="Page views" value={fe.pageViews.toLocaleString("en-IN")} />
            <StatTile label="CTA clicks" value={fe.ctaClicks.toLocaleString("en-IN")} />
            <StatTile label="Field focuses" value={fe.formFieldFocuses.toLocaleString("en-IN")} />
            <StatTile label="Avg. session" value={`${fe.avgSessionSec}s`} />
            <StatTile label="Bounce rate" value={`${fe.bounceRatePct}%`} />
            <StatTile label="Form abandon" value={`${fe.formAbandonPct}%`} sublabel="Started but not submitted" />
            <StatTile label="Mobile traffic" value={`${fe.mobileSharePct}%`} />
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <TrendChart data={fe.dailySessions} label="Sessions — last 14 days" />
          </div>
        </Section>

        <Section
          title="Backend analytics"
          subtitle="Server-side API calls, latency, and issuance."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatTile label="Quote API calls" value={be.quoteApiCalls.toLocaleString("en-IN")} />
            <StatTile label="Premium calcs" value={be.premiumCalcs.toLocaleString("en-IN")} />
            <StatTile label="PDFs generated" value={be.pdfsGenerated.toLocaleString("en-IN")} />
            <StatTile label="API success" value={`${(be.apiSuccessRatePct / 10).toFixed(1)}%`} />
            <StatTile label="Avg. latency" value={`${be.avgLatencyMs}ms`} />
            <StatTile label="P95 latency" value={`${be.p95LatencyMs}ms`} />
            <StatTile label="Errors (30d)" value={be.errorCount.toLocaleString("en-IN")} />
            <StatTile label="Premium collected" value={formatCurrency(be.premiumCollected)} />
          </div>
        </Section>

        <Section
          title="Conversion funnel"
          subtitle="Drop-off from landing to issued policy."
        >
          <div className="rounded-2xl border border-black/10 p-4">
            <FunnelChart
              stages={[
                { label: "Landing visits", value: funnel.landingVisits },
                { label: "Quotes generated", value: funnel.quotesGenerated },
                { label: "Proposals started", value: funnel.proposalsStarted },
                { label: "Payments initiated", value: funnel.paymentsInitiated },
                { label: "Policies issued", value: funnel.policiesIssued },
              ]}
            />
          </div>
        </Section>
      </div>
    </main>
  );
}
