"use client";

import { Loader2 } from "lucide-react";

export function ProcessingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/95 backdrop-blur">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
      <p className="text-sm font-medium text-black/60">{message}</p>
    </div>
  );
}
