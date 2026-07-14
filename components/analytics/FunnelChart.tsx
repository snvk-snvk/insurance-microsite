// Single-series magnitude comparison (each stage is a count of the same
// metric funneling down) - sequential, one hue, per the dataviz form rules.
const FUNNEL_HUE = "#2a78d6";

export function FunnelChart({
  stages,
}: {
  stages: { label: string; value: number }[];
}) {
  const max = stages[0]?.value || 1;

  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage, i) => {
        const pctOfTop = Math.round((stage.value / max) * 100);
        const prev = stages[i - 1];
        const dropFromPrev =
          prev && prev.value > 0
            ? Math.round(((prev.value - stage.value) / prev.value) * 100)
            : null;
        return (
          <div key={stage.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{stage.label}</span>
              <span className="tabular-nums text-black/60">
                {stage.value.toLocaleString("en-IN")}
                <span className="text-black/40"> ({pctOfTop}%)</span>
              </span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-full bg-black/5">
              <div
                className="h-3 rounded-full"
                style={{ width: `${pctOfTop}%`, backgroundColor: FUNNEL_HUE }}
              />
            </div>
            {dropFromPrev !== null && dropFromPrev > 0 && (
              <p className="mt-1 text-xs text-black/40">
                -{dropFromPrev}% drop-off from previous step
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
