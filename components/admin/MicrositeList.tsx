"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Check, Copy, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { encodeThemeToParam } from "@/lib/theme/codec";
import { productLabel } from "@/lib/products/catalog";
import { generateVersionMetrics } from "@/lib/analytics/mock-data";
import {
  listMicrosites,
  setStatus,
  type Microsite,
} from "@/lib/admin/microsites";

function shareUrlFor(m: Microsite): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/?theme=${encodeThemeToParam(m.theme)}`;
}

function JourneyCard({
  microsite,
  onToggleStatus,
}: {
  microsite: Microsite;
  onToggleStatus: (id: string, next: "live" | "disabled") => void;
}) {
  const [copied, setCopied] = useState(false);
  const metrics = generateVersionMetrics(microsite.partnerName);
  const conversion = metrics.quotesGenerated
    ? Math.round((metrics.policiesIssued / metrics.quotesGenerated) * 100)
    : 0;
  const isLive = microsite.status === "live";

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrlFor(microsite));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be blocked; ignore
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: microsite.theme.colors.primary }}
          >
            {microsite.partnerName.slice(0, 1).toUpperCase() || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{microsite.partnerName}</p>
            <p className="text-xs text-black/50">
              {productLabel(microsite.productId)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleStatus(microsite.id, isLive ? "disabled" : "live")}
          className={
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors " +
            (isLive
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-black/5 text-black/50 hover:bg-black/10")
          }
          title="Toggle live/disabled"
        >
          {isLive ? "● Live" : "○ Disabled"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-black/[.02] p-3">
          <p className="text-xs text-black/50">Policies issued</p>
          <p className="text-lg font-bold tabular-nums">
            {metrics.policiesIssued.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl bg-black/[.02] p-3">
          <p className="text-xs text-black/50">Conversion</p>
          <p className="text-lg font-bold tabular-nums">{conversion}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={copyUrl}
          className="h-10 flex-1 px-3 text-sm"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy URL"}
        </Button>
        <Link
          href={`/configurator/${microsite.id}/edit`}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-black/15 px-3 text-sm font-semibold hover:bg-black/[.03]"
        >
          <Pencil className="h-4 w-4" /> Edit design
        </Link>
        <Link
          href={`/configurator/${microsite.id}/analytics`}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-black/15 px-3 text-sm font-semibold hover:bg-black/[.03]"
        >
          <BarChart3 className="h-4 w-4" /> Analytics
        </Link>
      </div>
    </div>
  );
}

export function MicrositeList() {
  const [microsites, setMicrosites] = useState<Microsite[] | null>(null);

  useEffect(() => {
    // One-time hydration from localStorage, which isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMicrosites(listMicrosites());
  }, []);

  function handleToggle(id: string, next: "live" | "disabled") {
    setStatus(id, next);
    setMicrosites(listMicrosites());
  }

  return (
    <main className="mx-auto w-full min-h-screen max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Journeys</h1>
          <p className="mt-1 text-sm text-black/60">
            Admin portal — manage partner microsites, branding, and analytics.
          </p>
        </div>
        <Link
          href="/configurator/new"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-base font-semibold text-brand-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Create new journey
        </Link>
      </div>

      {microsites === null ? (
        <p className="mt-10 text-sm text-black/40">Loading…</p>
      ) : microsites.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-black/15 p-10 text-center">
          <p className="text-sm text-black/60">No journeys yet.</p>
          <Link
            href="/configurator/new"
            className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-base font-semibold text-brand-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Create your first journey
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {microsites.map((m) => (
            <JourneyCard key={m.id} microsite={m} onToggleStatus={handleToggle} />
          ))}
        </div>
      )}
    </main>
  );
}
