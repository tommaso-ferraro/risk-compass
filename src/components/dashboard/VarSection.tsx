import { Check, X } from "lucide-react";
import { fmtMoney, fmtPct } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function VarSection({ data }: { data: AnalyzeResponse }) {
  const n = data.normality;
  const conf = (data.var.confidence * 100).toFixed(0);

  const rows = [
    { method: "Historical VaR", desc: "Empirical quantile of observed returns", ...data.var.historical },
    { method: "Parametric VaR", desc: "Gaussian assumption · μ ± z·σ", ...data.var.parametric },
    { method: "Cornish-Fisher VaR", desc: "Adjusted for skewness & kurtosis", ...data.var.cornish_fisher },
    { method: "CVaR Historical", desc: "Expected loss beyond historical VaR", ...data.var.cvar_historical },
    { method: "CVaR Parametric", desc: "Expected loss beyond parametric VaR", ...data.var.cvar_parametric },
  ];

  // Worst (largest absolute loss) for visual scale
  const maxLoss = Math.max(...rows.map((r) => Math.abs(r.loss_pct)));

  return (
    <div className="space-y-8">
      {/* Jarque-Bera banner */}
      <div
        className={`border-2 ${
          n.is_normal ? "border-positive" : "border-negative"
        }`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-stretch">
          <div
            className={`flex items-center justify-center px-5 ${
              n.is_normal ? "bg-positive" : "bg-negative"
            }`}
          >
            {n.is_normal ? (
              <Check className="h-6 w-6 text-background" strokeWidth={3} />
            ) : (
              <X className="h-6 w-6 text-background" strokeWidth={3} />
            )}
          </div>
          <div className="px-5 py-4 border-l border-r border-border">
            <div className="label-mono mb-1">JARQUE_BERA · NORMALITY_TEST</div>
            <div
              className={`text-sm font-semibold ${
                n.is_normal ? "text-positive" : "text-negative"
              }`}
            >
              {n.is_normal
                ? "Normality NOT rejected — Gaussian assumptions are reasonable"
                : "Normality REJECTED — distribution exhibits non-Gaussian tails"}
            </div>
          </div>
          <div className="px-5 py-4 flex flex-col justify-center text-right">
            <div className="num text-xs text-muted-foreground">JB</div>
            <div className="num text-base font-semibold">{n.jarque_bera_stat.toFixed(2)}</div>
            <div className="num text-[10px] text-muted-foreground mt-1">
              p = {n.p_value.toExponential(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Method table */}
      <div className="border border-border bg-surface">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-foreground">
              <Th>Method</Th>
              <Th>Description</Th>
              <Th align="right">Loss %</Th>
              <Th align="right">Loss EUR</Th>
              <Th>Magnitude</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const ratio = Math.abs(r.loss_pct) / (maxLoss || 1);
              return (
                <tr
                  key={r.method}
                  className="border-b border-border last:border-b-0 hover:bg-secondary/60 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium align-top">
                    <div className="flex items-baseline gap-2">
                      <span className="num text-[10px] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {r.method}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs align-top">
                    {r.desc}
                  </td>
                  <td className="px-4 py-3.5 text-right num text-negative align-top">
                    {fmtPct(r.loss_pct)}
                  </td>
                  <td className="px-4 py-3.5 text-right num text-negative align-top">
                    −{fmtMoney(r.loss_eur)}
                  </td>
                  <td className="px-4 py-3.5 align-middle w-1/4">
                    <div className="h-2 bg-secondary relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-negative"
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl border-l-2 border-primary pl-4">
        At the <span className="num text-foreground">{conf}%</span> confidence
        level, VaR estimates the worst expected daily loss under normal market
        conditions, while CVaR (Expected Shortfall) measures the average loss in
        the tail beyond that threshold. Divergence between historical,
        parametric, and Cornish-Fisher estimates reveals the degree of
        non-normality — when fat tails or skew are present, Gaussian
        assumptions systematically understate tail risk.
      </p>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`label-mono px-4 py-3 text-${align} font-normal`}>{children}</th>
  );
}
