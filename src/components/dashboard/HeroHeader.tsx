import { fmtMoney, fmtNum, fmtPct, isNeg } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

type Props = { data: AnalyzeResponse };

export default function HeroHeader({ data }: Props) {
  const p = data?.portfolio ?? ({} as AnalyzeResponse["portfolio"]);
  const v = data?.var?.historical;
  const c = data?.var?.cvar_historical;
  const confRaw = data?.var?.confidence ?? v?.confidence ?? c?.confidence;
  const conf = typeof confRaw === "number" ? (confRaw * 100).toFixed(0) : "—";

  const kpis = [
    { label: "PORTFOLIO_VALUE", value: fmtMoney(p?.portfolio_value) },
    { label: "ANN_RETURN", value: fmtPct(p?.ann_return), neg: isNeg(p?.ann_return) },
    { label: "ANN_VOLATILITY", value: fmtPct(p?.ann_vol) },
    { label: "SHARPE", value: fmtNum(p?.sharpe), neg: isNeg(p?.sharpe) },
    {
      label: `VAR_${conf}`,
      value: fmtPct(v?.var_pct),
      sub: v?.var_eur != null ? `−${fmtMoney(v.var_eur)}` : undefined,
      neg: true,
    },
    {
      label: `CVAR_${conf}`,
      value: fmtPct(c?.cvar_pct),
      sub: c?.cvar_eur != null ? `−${fmtMoney(c.cvar_eur)}` : undefined,
      neg: true,
    },
  ];

  return (
    <header className="border-b border-border">
      <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] border-b border-border bg-surface grid-bg">
        <div className="border-r border-border px-4 py-10 bg-surface flex flex-col justify-between">
          <span className="num text-[10px] text-primary">001</span>
          <span className="label-mono [writing-mode:vertical-rl] rotate-180 origin-center mt-4">
            risk · q4
          </span>
        </div>
        <div className="px-6 md:px-10 py-10 md:py-14">
          <div className="label-mono mb-4">// dashboard ─ portfolio risk</div>
          <h1 className="text-[40px] md:text-[64px] leading-[0.95] font-semibold tracking-[-0.025em] text-foreground max-w-4xl">
            Portfolio Risk
            <br />
            <span className="text-primary">Analytics</span> Dashboard.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 label-mono">
            <span>
              range ·{" "}
              <span className="num normal-case tracking-normal text-foreground">
                {data?.meta?.start_date ?? "—"} → {data?.meta?.end_date ?? "—"}
              </span>
            </span>
            <span>
              source ·{" "}
              <span className="normal-case tracking-wide text-foreground">
                {data?.meta?.data_source ?? "Yahoo Finance"}
              </span>
            </span>
            <span>
              confidence ·{" "}
              <span className="num normal-case tracking-normal text-foreground">{conf}%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k, i) => {
          const isLastCol = (i + 1) % 6 === 0;
          const isMdLastCol = (i + 1) % 3 === 0;
          return (
            <div
              key={k.label}
              className={[
                "px-5 py-6 bg-surface relative",
                "border-b border-border lg:border-b-0",
                !isLastCol ? "lg:border-r lg:border-border" : "",
                !isMdLastCol ? "md:border-r md:border-border" : "",
                i % 2 === 0 ? "border-r border-border" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="label-mono">{k.label}</span>
                <span className="num text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                className={`display-num text-3xl md:text-[34px] leading-none ${
                  k.neg ? "text-negative" : "text-foreground"
                }`}
              >
                {k.value}
              </div>
              {k.sub && (
                <div className="num text-xs text-muted-foreground mt-2">{k.sub}</div>
              )}
            </div>
          );
        })}
      </div>
    </header>
  );
}
