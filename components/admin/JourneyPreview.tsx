"use client";

import { Button } from "@/components/ui/Button";
import { themeStyleVars } from "@/lib/theme/apply";
import { DEFAULT_HEADLINE, type Theme } from "@/lib/theme/schema";

/**
 * Phone-frame preview of the public microsite, driven entirely by a passed
 * theme (not ThemeProvider context). Colours + font are scoped to this
 * container via CSS vars so they don't leak into the admin chrome.
 */
export function JourneyPreview({ theme }: { theme: Theme }) {
  const brandName = theme.brandName.trim() || "Your brand";
  const headline = theme.headline.trim() || DEFAULT_HEADLINE;

  return (
    <div className="mx-auto w-full max-w-[380px]" style={themeStyleVars(theme)}>
      <div className="rounded-[2.5rem] border-8 border-black/80 bg-black/80 shadow-xl">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          <div className="h-[640px] overflow-y-auto">
            <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur">
              {theme.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={theme.logoUrl}
                  alt={brandName}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-brand-foreground">
                  {brandName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-base font-bold">{brandName}</span>
                {theme.tagline && (
                  <span className="truncate text-xs text-black/50">
                    {theme.tagline}
                  </span>
                )}
              </div>
            </header>
            <div className="flex flex-col gap-6 p-5">
              <div>
                <h1 className="text-2xl font-bold leading-tight">{headline}</h1>
                <p className="mt-2 text-sm text-black/60">
                  Get a quote in under a minute for you and your family.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 p-4">
                <p className="text-sm font-medium">Where do you live?</p>
                <div className="mt-3 h-12 rounded-xl border border-black/15 bg-black/[.02]" />
              </div>
              <Button className="w-full">Get my quote</Button>
              <div className="rounded-2xl bg-accent/10 p-4">
                <p className="text-sm font-semibold text-accent">
                  No claim bonus up to 50%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
