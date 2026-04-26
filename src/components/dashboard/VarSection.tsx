import { fmtMoney, fmtPct } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function VarSection({ data }: { data: AnalyzeResponse }) {
  const n = data.normality;
  const conf = (data.var.confidence * 100).toFixed(0);

  const rows = [
    {
      method: "Historical VaR",
      desc: "Empirical quantile of observed returns",
      ...data.var.historical,
    },
    {
      method: "Parametric VaR",
      desc: "Gaussian assumption, μ ± z·σ",
      ...data.var.parametric,
    },
    {
      method: "Cornish-Fisher VaR",
      desc: "Adjusted for skewness & kurtosis",
      ...data.var.cornish_fisher,
    },
    {
      method: "CVaR Historical",
      desc: "Expected loss beyond historical VaR",
      ...data.var.cvar_historical,
    },
    {
      method: "CVaR Parametric",
      desc: "Expected loss beyond parametric VaR",
      ...data.var.cvar_parametric,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Jarque-Bera banner */}
      <div
        className={`border p-4 ${
          n.is_normal
            ? "border-positive bg-positive/5"
            : "border-negative bg-negative/5"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Jarque-Bera Normality Test
            </div>
            <div
              className={`text-sm font-semibold ${
                n.is_normal ? "text-positive" : "text-negative"
              }`}
            >
              {n.is_normal
                ? "Normality NOT rejected — Gaussian assumptions are reasonable"
                : "Normality REJECTED — return distribution exhibits non-Gaussian tails"}
            </div>
          </div>
          <div className="num text-xs text-muted-foreground">
            JB = {n.jarque_bera_stat.toFixed(2)} · p = {n.p_value.toExponential(2)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-3 text-left">Method</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-3 text-left">Description</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-3 text-right">Loss %</th>
              <th className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-3 text-right">Loss EUR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.method} className="border-b border-border last:border-b-0 hover:bg-secondary/60">
                <td className="px-4 py-3 font-medium">{r.method}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.desc}</td>
                <td className="px-4 py-3 text-right num text-negative">
                  {fmtPct(r.loss_pct)}
                </td>
                <td className="px-4 py-3 text-right num text-negative">
                  −{fmtMoney(r.loss_eur)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
        At the <span className="num text-foreground">{conf}%</span> confidence
        level, VaR estimates the worst expected daily loss under normal market
        conditions, while CVaR (Expected Shortfall) measures the average loss in
        the tail beyond that threshold. Differences between the methods reveal
        how much the distribution deviates from normality — when historical and
        Cornish-Fisher VaR diverge significantly from the parametric value, fat
        tails or skew are present and Gaussian assumptions understate tail risk.
      </p>
    </div>
  );
}
