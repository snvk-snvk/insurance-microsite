export function StatTile({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-black/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-black/40">{sublabel}</p>}
    </div>
  );
}
