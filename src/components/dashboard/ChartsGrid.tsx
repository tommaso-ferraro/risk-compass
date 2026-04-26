import type { AnalyzeResponse } from "@/lib/api";

const LABELS: Array<{ key: keyof AnalyzeResponse["charts"]; tag: string; title: string; subtitle: string }> = [
  { key: "return_distribution_b64", tag: "A", title: "Return distribution", subtitle: "histogram · daily log-returns" },
  { key: "cumulative_performance_b64", tag: "B", title: "Cumulative performance", subtitle: "growth of 1 unit" },
  { key: "rolling_var_b64", tag: "C", title: "Rolling VaR", subtitle: "63-day window" },
  { key: "drawdown_b64", tag: "D", title: "Drawdown", subtitle: "peak-to-trough" },
];

export default function ChartsGrid({ data }: { data: AnalyzeResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border border-border bg-border gap-px">
      {LABELS.map(({ key, tag, title, subtitle }) => (
        <figure key={key} className="bg-surface p-5">
          <figcaption className="flex items-baseline justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-baseline gap-3">
              <span className="num text-base font-semibold text-primary">[{tag}]</span>
              <span className="font-semibold text-sm">{title}</span>
            </div>
            <span className="label-mono">{subtitle}</span>
          </figcaption>
          {data.charts[key] ? (
            <img
              src={`data:image/png;base64,${data.charts[key]}`}
              alt={title}
              className="w-full h-auto block"
            />
          ) : (
            <div className="aspect-video bg-secondary flex items-center justify-center font-mono text-xs text-muted-foreground">
              no data
            </div>
          )}
        </figure>
      ))}
    </div>
  );
}
