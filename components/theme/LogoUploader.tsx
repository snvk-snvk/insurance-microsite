"use client";

import { useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { resizeLogoFile } from "@/lib/utils/resize-image";

async function deleteBlob(url: string) {
  await fetch("/api/upload-logo", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {
    // best-effort cleanup - not worth surfacing to the user
  });
}

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
      const resized = await resizeLogoFile(file);
      const formData = new FormData();
      formData.append("file", resized, "logo.png");
      const res = await fetch("/api/upload-logo", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = (await res.json()) as { url: string };

      const previousUrl = theme.logoUrl;
      updateTheme({ logoUrl: url });
      if (previousUrl) void deleteBlob(previousUrl);
    } catch {
      setError("Couldn't upload that image - try a different file.");
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    const previousUrl = theme.logoUrl;
    updateTheme({ logoUrl: undefined });
    if (previousUrl) void deleteBlob(previousUrl);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Logo</span>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-black/[.02]">
          {theme.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.logoUrl}
              alt="Logo preview"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-xs text-black/40">None</span>
          )}
        </div>
        <label className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-black/15 px-4 text-sm font-medium hover:bg-black/[.03]">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFile}
            disabled={busy}
          />
        </label>
        {theme.logoUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/15 hover:bg-black/[.03]"
            aria-label="Remove logo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
