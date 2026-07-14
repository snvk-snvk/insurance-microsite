"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useJourney } from "@/lib/journey/JourneyProvider";
import { Button } from "@/components/ui/Button";

export function DownloadPolicyButton() {
  const { theme } = useTheme();
  const { state } = useJourney();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!state.quote || !state.plan || !state.proposal || !state.policy) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          quote: state.quote,
          plan: state.plan,
          proposal: state.proposal,
          policy: state.policy,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `policy-${state.policy.policyNumber.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Couldn't generate the policy PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full" onClick={handleDownload} disabled={downloading}>
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {downloading ? "Preparing your policy..." : "Download policy PDF"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
