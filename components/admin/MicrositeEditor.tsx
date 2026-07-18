"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ColorField } from "@/components/theme/ColorField";
import { LogoUploader } from "@/components/theme/LogoUploader";
import { FontPicker } from "@/components/theme/FontPicker";
import { JourneyPreview } from "@/components/admin/JourneyPreview";
import { PRODUCTS } from "@/lib/products/catalog";
import { type Theme } from "@/lib/theme/schema";
import {
  createMicrosite,
  getMicrosite,
  newDraftMicrosite,
  updateMicrosite,
} from "@/lib/admin/microsites";

type Draft = { partnerName: string; productId: string; theme: Theme };

export function MicrositeEditor({ micrositeId }: { micrositeId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(micrositeId);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage, which isn't available during SSR.
    const m = micrositeId ? getMicrosite(micrositeId) : null;
    if (micrositeId && !m) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotFound(true);
      return;
    }
    setDraft(
      m
        ? { partnerName: m.partnerName, productId: m.productId, theme: m.theme }
        : newDraftMicrosite()
    );
  }, [micrositeId]);

  const errors = useMemo(() => {
    if (!draft) return {};
    return {
      partnerName: draft.partnerName.trim() ? undefined : "Partner name is required",
      imId: draft.theme.imId.trim() ? undefined : "IM-ID is required",
      headline: draft.theme.headline.trim() ? undefined : "Heading is required",
    };
  }, [draft]);

  if (notFound) {
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
  if (!draft) {
    return <main className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/40">Loading…</main>;
  }

  const setTheme = (patch: Partial<Theme>) =>
    setDraft((d) => (d ? { ...d, theme: { ...d.theme, ...patch } } : d));
  const setColors = (patch: Partial<Theme["colors"]>) =>
    setDraft((d) => (d ? { ...d, theme: { ...d.theme, colors: { ...d.theme.colors, ...patch } } } : d));

  function handleSave() {
    setSubmitted(true);
    if (errors.partnerName || errors.imId || errors.headline) return;
    // partner name doubles as the site brand name
    const theme: Theme = { ...draft!.theme, brandName: draft!.partnerName.trim() };
    if (isEdit && micrositeId) {
      updateMicrosite(micrositeId, {
        partnerName: draft!.partnerName.trim(),
        productId: draft!.productId,
        theme,
        status: "live",
      });
    } else {
      createMicrosite({
        partnerName: draft!.partnerName.trim(),
        productId: draft!.productId,
        theme,
        status: "live",
      });
    }
    router.push("/configurator");
  }

  const show = (key: keyof typeof errors) => (submitted ? errors[key] : undefined);

  return (
    <main className="mx-auto w-full min-h-screen max-w-6xl px-4 py-10">
      <Link
        href="/configurator"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" /> Journeys
      </Link>
      <h1 className="mt-3 text-2xl font-bold">
        {isEdit ? "Edit journey design" : "Create new journey"}
      </h1>
      <p className="mt-1 text-sm text-black/60">
        Configure the partner branding. Saving pushes it live and updates the shareable URL.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="flex flex-col gap-6">
          <Input
            label="Partner name"
            placeholder="e.g. Meridian Health"
            value={draft.partnerName}
            maxLength={40}
            error={show("partnerName")}
            onChange={(e) =>
              setDraft({
                ...draft,
                partnerName: e.target.value,
                // keep brand name in sync so the live preview reflects it
                theme: { ...draft.theme, brandName: e.target.value },
              })
            }
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Product</label>
            <select
              value={draft.productId}
              onChange={(e) => setDraft({ ...draft, productId: e.target.value })}
              className="h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="IM-ID"
            placeholder="e.g. IMF12345678"
            value={draft.theme.imId}
            maxLength={40}
            error={show("imId")}
            onChange={(e) => setTheme({ imId: e.target.value })}
          />

          <FontPicker value={draft.theme.font} onChange={(font) => setTheme({ font })} />

          <LogoUploader
            value={draft.theme.logoUrl}
            onChange={(logoUrl) => setTheme({ logoUrl })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ColorField
              label="Primary color"
              value={draft.theme.colors.primary}
              onChange={(primary) => setColors({ primary })}
            />
            <ColorField
              label="Secondary color"
              value={draft.theme.colors.secondary}
              onChange={(secondary) => setColors({ secondary })}
            />
          </div>

          <Input
            label="Header heading"
            placeholder="Health cover that just works."
            value={draft.theme.headline}
            maxLength={60}
            error={show("headline")}
            onChange={(e) => setTheme({ headline: e.target.value })}
          />

          <Input
            label="Tagline (optional)"
            placeholder="Health insurance, sorted."
            value={draft.theme.tagline ?? ""}
            maxLength={80}
            onChange={(e) => setTheme({ tagline: e.target.value || undefined })}
          />

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              {isEdit ? "Push to production" : "Create journey"}
            </Button>
            <Link
              href="/configurator"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-black/15 px-5 text-base font-semibold hover:bg-black/[.03]"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="mb-3 text-sm font-medium text-black/60">Live preview</p>
          <JourneyPreview theme={draft.theme} />
        </div>
      </div>
    </main>
  );
}
