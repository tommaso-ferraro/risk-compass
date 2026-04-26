import { fmtMoney, fmtNum, fmtPct, isNeg } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

type Props = { data: AnalyzeResponse };

export default function HeroHeader({ data }: Props) {
  const p = data.portfolio;
  const v95 = data.var.historical;
  const c95 = data.var.cvar_historical;

  const kpis = [
    { label: "Portfolio Value", value: fmtMoney(p.portfolio_value) },
    { label: "Ann. Return", value: fmtPct(p.annual_return), neg: isNeg(p.annual_return) },
    { label: "Ann. Volatility", value: fmtPct(p.annual_volatility) },
    { label: "Sharpe", value: fmtNum(p.sharpe), neg: isNeg(p.sharpe) },
    {
      label: `VaR ${(data.var.confidence * 100).toFixed(0)}%`,
      value: fmtPct(v95.loss_pct),
      sub: `−${fmtMoney(v95.loss_eur)}`,
      neg: true,
    },
    {
      label: `CVaR ${(data.var.confidence * 100).toFixed(0)}%`,
      value: fmtPct(c95.loss_pct),
      sub: `−${fmtMoney(c95.loss_eur)}`,
      neg: true,
    },
  ];

  return (
    <header className="bg-surface border-b border-border">
      <div className="px-8 py-6 border-b border-border">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          // dashboard
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Portfolio Risk Analytics Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className={`p-5 border-border ${
              i < kpis.length - 1 ? "border-r" : ""
            } ${i >= 3 ? "border-t md:border-t lg:border-t-0" : ""}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
              {k.label}
            </div>
            <div
              className={`num text-2xl font-medium ${
                k.neg ? "text-negative" : "text-foreground"
              }`}
            >
              {k.value}
            </div>
            {k.sub && (
              <div className="num text-xs text-muted-foreground mt-1">{k.sub}</div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
