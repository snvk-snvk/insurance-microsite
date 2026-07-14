"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";

export function ShareLinkPanel() {
  const { shareUrl } = useTheme();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 p-4">
      <p className="text-sm font-medium">Shareable link</p>
      <p className="text-xs text-black/50">
        Anyone who opens this link sees the microsite with this exact
        branding - no account needed.
      </p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={shareUrl ?? "Generating..."}
          className="h-11 flex-1 truncate rounded-xl border border-black/15 bg-black/[.02] px-3 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          disabled={!shareUrl}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {shareUrl && (
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand"
        >
          Open full preview <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
