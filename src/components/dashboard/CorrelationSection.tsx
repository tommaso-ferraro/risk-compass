import { fmtNum } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function CorrelationSection({ data }: { data: AnalyzeResponse }) {
  const c = data.correlation;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
      <div className="lg:col-span-2 bg-surface p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
          Correlation matrix
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

      <div className="bg-surface p-5 space-y-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Most correlated
          </div>
          <div className="font-mono text-base font-semibold">
            {c.most_correlated.pair[0]} ↔ {c.most_correlated.pair[1]}
          </div>
          <div className="num text-3xl text-negative mt-1">
            {fmtNum(c.most_correlated.value, 3)}
          </div>
          <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
            High pairwise correlation reduces diversification benefits — these
            assets move together under stress.
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Least correlated
          </div>
          <div className="font-mono text-base font-semibold">
            {c.least_correlated.pair[0]} ↔ {c.least_correlated.pair[1]}
          </div>
          <div className="num text-3xl text-primary mt-1">
            {fmtNum(c.least_correlated.value, 3)}
          </div>
          <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Low or negative correlation provides genuine diversification and
            dampens portfolio variance.
          </div>
        </div>
      </div>
    </div>
  );
}
