import { fmtMoney, fmtPct } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function ComponentVarSection({ data }: { data: AnalyzeResponse }) {
  const rows = Array.isArray(data?.component_var) ? data.component_var : [];
  const maxContrib = Math.max(...rows.map((r) => Math.abs(r.pct_of_total_var)), 0);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
        Additive decomposition of <span className="text-foreground">parametric</span> VaR by asset.
        Historical and Cornish-Fisher VaR are empirical quantiles and cannot be
        decomposed linearly — this breakdown applies to the parametric method only.
      </p>
      <div className="border border-border bg-surface">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-foreground">
              <Th>Ticker</Th>
              <Th align="right">Weight</Th>
              <Th align="right">VaR Contribution</Th>
              <Th align="right">% of Total VaR</Th>
              <Th>Magnitude</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ratio = maxContrib > 0 ? Math.abs(r.pct_of_total_var) / maxContrib : 0;
              return (
                <tr key={r.ticker} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-mono font-semibold">{r.ticker}</td>
                  <td className="px-4 py-3 text-right num">{fmtPct(r.weight, 1)}</td>
                  <td className="px-4 py-3 text-right num text-negative">
                    −{fmtMoney(r.component_var_eur)}
                  </td>
                  <td className="px-4 py-3 text-right num">{fmtPct(r.pct_of_total_var, 1)}</td>
                  <td className="px-4 py-3 w-1/4">
                    <div className="h-2 bg-secondary relative">
                      <div className="absolute inset-y-0 left-0 bg-negative" style={{ width: `${ratio * 100}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return <th className={`label-mono px-4 py-3 text-${align} font-normal`}>{children}</th>;
}
