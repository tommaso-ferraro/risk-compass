import { fmtNum, fmtPct, isNeg } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function OverviewTable({ data }: { data: AnalyzeResponse }) {
  const rows = data.overview.rows;
  const total = data.overview.portfolio;

  return (
    <div className="border border-border bg-surface">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-foreground">
            <Th>#</Th>
            <Th>Ticker</Th>
            <Th align="right">Weight</Th>
            <Th align="right">Annual Return</Th>
            <Th align="right">Annual Vol</Th>
            <Th align="right">Sharpe</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.ticker}
              className="border-b border-border hover:bg-secondary/60 transition-colors"
            >
              <Td num className="text-muted-foreground w-10">
                {String(i + 1).padStart(2, "0")}
              </Td>
              <Td mono className="font-semibold">{r.ticker}</Td>
              <Td align="right" num>
                <WeightBar pct={r.weight}>{fmtPct(r.weight, 1)}</WeightBar>
              </Td>
              <Td align="right" num neg={isNeg(r.annual_return)}>
                {fmtPct(r.annual_return)}
              </Td>
              <Td align="right" num>{fmtPct(r.annual_volatility)}</Td>
              <Td align="right" num neg={isNeg(r.sharpe)}>
                {fmtNum(r.sharpe)}
              </Td>
            </tr>
          ))}
          <tr className="bg-foreground text-background border-t-2 border-foreground">
            <Td num className="text-background/60">Σ</Td>
            <Td mono bold>PORTFOLIO</Td>
            <Td align="right" num bold>{fmtPct(total.weight, 1)}</Td>
            <Td align="right" num bold>{fmtPct(total.annual_return)}</Td>
            <Td align="right" num bold>{fmtPct(total.annual_volatility)}</Td>
            <Td align="right" num bold>{fmtNum(total.sharpe)}</Td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function WeightBar({ pct, children }: { pct: number; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 justify-end w-full">
      <div className="hidden md:block h-1 w-20 bg-secondary relative">
        <div
          className="absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${Math.min(Math.abs(pct) * 100, 100)}%` }}
        />
      </div>
      <span>{children}</span>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`label-mono px-4 py-3 text-${align} font-normal`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  num,
  mono,
  bold,
  neg,
  className = "",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  num?: boolean;
  mono?: boolean;
  bold?: boolean;
  neg?: boolean;
  className?: string;
}) {
  return (
    <td
      className={[
        "px-4 py-3.5",
        `text-${align}`,
        num ? "num" : "",
        mono ? "font-mono" : "",
        bold ? "font-semibold" : "",
        neg ? "text-negative" : "",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}
