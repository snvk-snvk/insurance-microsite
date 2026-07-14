"use client";

// Reuses the real site's Header directly (not a reimplementation) so the
// preview and the live microsite can never drift - both read the same
// ThemeProvider context and CSS vars.
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";

export function LivePreviewPanel() {
  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="rounded-[2.5rem] border-8 border-black/80 bg-black/80 shadow-xl">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          <div className="h-[640px] overflow-y-auto">
            <Header />
            <div className="flex flex-col gap-6 p-5">
              <div>
                <h1 className="text-2xl font-bold leading-tight">
                  Health cover that just works.
                </h1>
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
