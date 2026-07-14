"use client";

import { useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { compressLogoFile } from "@/lib/utils/image-compress";
import { willLinkIncludeLogo } from "@/lib/theme/codec";

export function LogoUploader() {
  const { theme, updateTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await compressLogoFile(file);
      updateTheme({ logoDataUrl: dataUrl });
    } catch {
      setError("Couldn't process that image - try a different file.");
    } finally {
      setBusy(false);
    }
  }

  const logoOmittedFromLink =
    !!theme.logoDataUrl && !willLinkIncludeLogo(theme);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Logo</span>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/[.02]">
          {theme.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.logoDataUrl}
              alt="Logo preview"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-xs text-black/40">None</span>
          )}
        </div>
        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-black/15 px-4 text-sm font-medium hover:bg-black/[.03]">
          <Upload className="h-4 w-4" />
          {busy ? "Processing..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFile}
            disabled={busy}
          />
        </label>
        {theme.logoDataUrl && (
          <button
            type="button"
            onClick={() => updateTheme({ logoDataUrl: undefined })}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/15 hover:bg-black/[.03]"
            aria-label="Remove logo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
      {logoOmittedFromLink && (
        <span className="text-sm text-amber-600">
          This logo won&apos;t be included in the shareable link (it&apos;s
          still visible in this browser&apos;s preview).
        </span>
      )}
    </div>
  );
}
