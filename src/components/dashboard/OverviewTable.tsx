import { fmtNum, fmtPct, isNeg } from "@/lib/format";
import type { AnalyzeResponse } from "@/lib/api";

export default function OverviewTable({ data }: { data: AnalyzeResponse }) {
  const rows = data.overview.rows;
  const total = data.overview.portfolio;

  return (
    <div className="border border-border bg-surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary">
            <Th>Ticker</Th>
            <Th align="right">Weight</Th>
            <Th align="right">Annual Return</Th>
            <Th align="right">Annual Vol</Th>
            <Th align="right">Sharpe</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ticker} className="border-b border-border hover:bg-secondary/60">
              <Td mono>{r.ticker}</Td>
              <Td align="right" num>{fmtPct(r.weight, 1)}</Td>
              <Td align="right" num neg={isNeg(r.annual_return)}>{fmtPct(r.annual_return)}</Td>
              <Td align="right" num>{fmtPct(r.annual_volatility)}</Td>
              <Td align="right" num neg={isNeg(r.sharpe)}>{fmtNum(r.sharpe)}</Td>
            </tr>
          ))}
          <tr className="bg-foreground text-background">
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

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-3 text-${align}`}>
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
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  num?: boolean;
  mono?: boolean;
  bold?: boolean;
  neg?: boolean;
}) {
  return (
    <td
      className={[
        "px-4 py-3",
        `text-${align}`,
        num ? "num" : "",
        mono ? "font-mono" : "",
        bold ? "font-semibold" : "",
        neg ? "text-negative" : "",
      ].join(" ")}
    >
      {children}
    </td>
  );
}
