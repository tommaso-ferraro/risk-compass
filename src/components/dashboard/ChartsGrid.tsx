import type { AnalyzeResponse } from "@/lib/api";

const LABELS: Array<{ key: keyof AnalyzeResponse["charts"]; tag: string; title: string }> = [
  { key: "return_distribution_b64", tag: "A", title: "Return distribution" },
  { key: "cumulative_performance_b64", tag: "B", title: "Cumulative performance" },
  { key: "rolling_var_b64", tag: "C", title: "Rolling VaR" },
  { key: "drawdown_b64", tag: "D", title: "Drawdown" },
];

export default function ChartsGrid({ data }: { data: AnalyzeResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
      {LABELS.map(({ key, tag, title }) => (
        <figure key={key} className="bg-surface p-4">
          <figcaption className="flex items-baseline gap-3 mb-3">
            <span className="font-mono text-xs text-primary">{tag}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
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
