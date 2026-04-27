import { fmtNum } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function CorrelationSection({ data }: { data: AnalyzeResponse }) {
  const c = data?.correlation;
  const heatmap = data?.charts?.correlation;
  const hi = c?.highest_pair;
  const lo = c?.lowest_pair;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border border-border bg-border gap-px">
      <div className="lg:col-span-2 bg-surface p-5">
        <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border">
          <span className="font-semibold text-sm">Correlation matrix</span>
          <span className="label-mono">
            pearson · ρ
            {typeof c?.avg_correlation === "number" && (
              <> · avg {fmtNum(c.avg_correlation, 3)}</>
            )}
          </span>
        </div>
        {heatmap ? (
          <img
            src={`data:image/png;base64,${heatmap}`}
            alt="Correlation heatmap"
            className="w-full h-auto block"
          />
        ) : (
          <div className="aspect-square bg-secondary flex items-center justify-center font-mono text-xs text-muted-foreground">
            no heatmap available
          </div>
        )}
        {c?.interpretation && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-4 border-l-2 border-primary pl-3">
            {c.interpretation}
          </p>
        )}
      </div>

      <div className="bg-surface p-5 flex flex-col">
        {hi ? (
          <ExtremeCard
            label="Most correlated"
            pair={hi.pair}
            value={hi.correlation}
            tone="negative"
            note="High pairwise correlation reduces diversification — these assets move together under stress."
          />
        ) : (
          <EmptyCard label="Most correlated" />
        )}
        <div className="border-t border-border my-6" />
        {lo ? (
          <ExtremeCard
            label="Least correlated"
            pair={lo.pair}
            value={lo.correlation}
            tone="primary"
            note="Low or negative correlation provides genuine diversification and dampens portfolio variance."
          />
        ) : (
          <EmptyCard label="Least correlated" />
        )}
      </div>
    </div>
  );
}

function EmptyCard({ label }: { label: string }) {
  return (
    <div>
      <div className="label-mono mb-3">{label}</div>
      <div className="font-mono text-sm text-muted-foreground">— no data —</div>
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
  pair: string;
  value: number;
  tone: "negative" | "primary";
  note: string;
}) {
  const toneText = tone === "negative" ? "text-negative" : "text-primary";
  const toneBg = tone === "negative" ? "bg-negative" : "bg-primary";
  const v = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const widthPct = Math.min(Math.abs(v) * 100, 100);
  return (
    <div>
      <div className="label-mono mb-3">{label}</div>
      <div className="font-mono text-base font-semibold mb-2">{pair ?? "—"}</div>
      <div className={`display-num text-4xl ${toneText} mb-3`}>
        {v >= 0 ? "+" : ""}
        {fmtNum(v, 3)}
      </div>
      <div className="h-1 bg-secondary mb-4 relative">
        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground" />
        <div
          className={`absolute inset-y-0 ${toneBg}`}
          style={{
            width: `${widthPct / 2}%`,
            left: v >= 0 ? "50%" : `${50 - widthPct / 2}%`,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
    </div>
  );
}
