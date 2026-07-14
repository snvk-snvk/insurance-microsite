import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function StickyCTA({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 border-t border-black/5 bg-white/95 px-4 pt-3 backdrop-blur",
        className
      )}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      {children}
    </div>
  );
}
