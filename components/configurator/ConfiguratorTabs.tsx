"use client";

import { useState } from "react";
import { ConfiguratorForm } from "./ConfiguratorForm";
import { LivePreviewPanel } from "./LivePreviewPanel";
import { ShareLinkPanel } from "./ShareLinkPanel";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "branding", label: "Branding" },
  { key: "analytics", label: "Analytics" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ConfiguratorTabs() {
  const [tab, setTab] = useState<TabKey>("branding");

  return (
    <div>
      <div className="mb-8 flex w-fit gap-1 rounded-xl border border-black/10 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "h-10 rounded-lg px-4 text-sm font-semibold transition-colors",
              tab === t.key
                ? "bg-brand text-brand-foreground"
                : "text-black/60 hover:bg-black/[.03]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "branding" ? (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1 lg:max-w-md">
            <div className="flex flex-col gap-8">
              <ConfiguratorForm />
              <ShareLinkPanel />
            </div>
          </div>
          <div className="flex-1 lg:sticky lg:top-10">
            <LivePreviewPanel />
          </div>
        </div>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
}
