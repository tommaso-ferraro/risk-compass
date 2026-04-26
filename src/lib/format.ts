export const fmtPct = (v: number, digits = 2) =>
  `${(v * 100).toFixed(digits)}%`;

export const fmtNum = (v: number, digits = 2) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const fmtMoney = (v: number, currency = "EUR") =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

export const isNeg = (v: number) => v < 0;
