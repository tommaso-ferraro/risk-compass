const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

export const fmtPct = (v: number | null | undefined, digits = 2) =>
  isNum(v) ? `${(v * 100).toFixed(digits)}%` : "—";

export const fmtNum = (v: number | null | undefined, digits = 2) =>
  isNum(v)
    ? v.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "—";

export const fmtMoney = (v: number | null | undefined, currency = "EUR") =>
  isNum(v)
    ? v.toLocaleString("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      })
    : "—";

export const isNeg = (v: number | null | undefined) => isNum(v) && v < 0;
