// Single-series trend over time - line + area, one hue, per the dataviz
// form rules (sequential/one-hue for a single series).
const TREND_HUE = "#2a78d6";
const WIDTH = 600;
const HEIGHT = 140;
const PADDING = 12;

export function TrendChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  const stepX = data.length > 1 ? (WIDTH - PADDING * 2) / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = PADDING + i * stepX;
    const y = HEIGHT - PADDING - (v / max) * (HEIGHT - PADDING * 2);
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${HEIGHT - PADDING} L${points[0][0].toFixed(1)},${HEIGHT - PADDING} Z`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm tabular-nums text-black/60">
          {data[data.length - 1]?.toLocaleString("en-IN")} today
        </p>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="mt-3 h-28 w-full"
      >
        <line
          x1={PADDING}
          y1={HEIGHT - PADDING}
          x2={WIDTH - PADDING}
          y2={HEIGHT - PADDING}
          stroke="#e1e0d9"
          strokeWidth={1}
        />
        <path d={areaPath} fill={TREND_HUE} fillOpacity={0.12} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke={TREND_HUE}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r={4} fill={TREND_HUE} />
      </svg>
    </div>
  );
}
