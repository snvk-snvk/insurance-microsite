"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { ADDON_CATALOG } from "@/lib/pricing/addons";
import type { AddonId } from "@/lib/journey/schema";

const ADDON_IDS = Object.keys(ADDON_CATALOG) as AddonId[];

export function AddonsList({
  value,
  onChange,
}: {
  value: AddonId[];
  onChange: (value: AddonId[]) => void;
}) {
  function toggle(id: AddonId, checked: boolean) {
    onChange(checked ? [...value, id] : value.filter((a) => a !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {ADDON_IDS.map((id) => (
        <div key={id} className="rounded-2xl border border-black/10 p-4">
          <Checkbox
            label={ADDON_CATALOG[id].label}
            checked={value.includes(id)}
            onChange={(e) => toggle(id, e.target.checked)}
          />
          <p className="mt-1 pl-9 text-sm text-black/50">
            {ADDON_CATALOG[id].description}
          </p>
        </div>
      ))}
    </div>
  );
}
