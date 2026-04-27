// Read backend URL from Vite env, with REACT_APP_BACKEND_URL fallback for compatibility.
const env = (import.meta as any).env ?? {};
export const BACKEND_URL: string =
  env.VITE_BACKEND_URL ||
  env.REACT_APP_BACKEND_URL ||
  "http://localhost:8000";

export type Defaults = {
  tickers: string[];
  weights: number[];
  portfolio_value: number;
  confidence: number;
  confidence_levels: number[];
  risk_free_rate: number;
  lookback_years: number;
};

export type AnalyzeRequest = {
  tickers: string[];
  weights: number[];
  portfolio_value: number;
  confidence: number;
  risk_free_rate: number;
  start_date: string;
  end_date: string;
};

export type TickerStats = {
  ticker: string;
  weight: number;
  annual_return: number;
  annual_volatility: number;
  sharpe: number;
};

export type AnalyzeResponse = {
  meta: {
    start_date: string;
    end_date: string;
    data_source?: string;
    [k: string]: any;
  };
  overview: {
    rows: TickerStats[];
    portfolio: TickerStats;
  };
  portfolio: {
    ann_return: number;
    ann_vol: number;
    sharpe: number;
    max_drawdown: number;
    mdd_pct: number;
    portfolio_value: number;
  };
  var: {
    historical: { var_pct: number; var_eur: number };
    parametric: { var_pct: number; var_eur: number };
    cornish_fisher: { var_pct: number; var_eur: number };
    cvar_historical: { cvar_pct: number; cvar_eur: number };
    cvar_parametric: { cvar_pct: number; cvar_eur: number };
    confidence: number;
  };
  normality: {
    statistic: number;
    p_value: number;
    skewness: number;
    excess_kurtosis: number;
    normal: boolean;
    interpretation: string;
  };
  correlation: {
    matrix_png_b64?: string;
    correlation?: string;
    highest_pair: { pair: string; correlation: number };
    lowest_pair: { pair: string; correlation: number };
  };
  charts: {
    distribution: string;
    performance: string;
    rolling_var: string;
    drawdown: string;
    correlation: string;
  };
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getDefaults: () => http<Defaults>("/api/defaults"),
  analyze: (body: AnalyzeRequest) =>
    http<AnalyzeResponse>("/api/portfolio/analyze", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
