"use client";

import { FONT_OPTIONS, type FontId } from "@/lib/theme/schema";
import { cn } from "@/lib/utils/cn";

export function FontPicker({
  value,
  onChange,
}: {
  value: FontId;
  onChange: (id: FontId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Font</span>
      <div className="grid grid-cols-2 gap-2">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.id}
            type="button"
            onClick={() => onChange(font.id)}
            style={{ fontFamily: font.stack }}
            className={cn(
              "flex flex-col items-start gap-0.5 rounded-xl border-2 p-3 text-left transition-colors",
              value === font.id
                ? "border-brand bg-brand/5"
                : "border-black/10 hover:border-black/20"
            )}
          >
            <span className="text-base font-semibold">{font.label}</span>
            <span className="text-sm text-black/50">Aa Bb Cc 123</span>
          </button>
        ))}
      </div>
    </div>
  );
}
