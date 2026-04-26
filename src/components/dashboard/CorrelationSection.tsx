import { fmtNum } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function CorrelationSection({ data }: { data: AnalyzeResponse }) {
  const c = data.correlation;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border border-border bg-border gap-px">
      <div className="lg:col-span-2 bg-surface p-5">
        <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border">
          <span className="font-semibold text-sm">Correlation matrix</span>
          <span className="label-mono">pearson · ρ</span>
        </div>
        {c.matrix_png_b64 ? (
          <img
            src={`data:image/png;base64,${c.matrix_png_b64}`}
            alt="Correlation heatmap"
            className="w-full h-auto block"
          />
        ) : (
          <div className="aspect-square bg-secondary" />
        )}
      </div>

      <div className="bg-surface p-5 flex flex-col">
        <ExtremeCard
          label="Most correlated"
          pair={c.most_correlated.pair}
          value={c.most_correlated.value}
          tone="negative"
          note="High pairwise correlation reduces diversification — these assets move together under stress."
        />
        <div className="border-t border-border my-6" />
        <ExtremeCard
          label="Least correlated"
          pair={c.least_correlated.pair}
          value={c.least_correlated.value}
          tone="primary"
          note="Low or negative correlation provides genuine diversification and dampens portfolio variance."
        />
      </div>
    </div>
  );
}

function ExtremeCard({
  label,
  pair,
  value,
  tone,
  note,
}: {
  label: string;
  pair: [string, string];
  value: number;
  tone: "negative" | "primary";
  note: string;
}) {
  const toneText = tone === "negative" ? "text-negative" : "text-primary";
  const toneBg = tone === "negative" ? "bg-negative" : "bg-primary";
  // ρ is in [-1, 1]; scale to 0-100% width
  const widthPct = Math.min(Math.abs(value) * 100, 100);
  return (
    <div>
      <div className="label-mono mb-3">{label}</div>
      <div className="font-mono text-base font-semibold mb-2">
        {pair[0]} <span className="text-muted-foreground">↔</span> {pair[1]}
      </div>
      <div className={`display-num text-4xl ${toneText} mb-3`}>
        {value >= 0 ? "+" : ""}{fmtNum(value, 3)}
      </div>
      <div className="h-1 bg-secondary mb-4 relative">
        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground" />
        <div
          className={`absolute inset-y-0 ${toneBg}`}
          style={{
            width: `${widthPct / 2}%`,
            left: value >= 0 ? "50%" : `${50 - widthPct / 2}%`,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
    </div>
  );
}
