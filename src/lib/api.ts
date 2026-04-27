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

export type OverviewRow = {
  ticker: string;
  weight: number;
  ann_return: number;
  ann_vol: number;
  sharpe: number;
};

export type VarMethod = {
  method?: string;
  confidence?: number;
  var_pct: number;
  var_eur: number;
  mu_daily?: number;
  sigma_daily?: number;
  skewness?: number;
  excess_kurtosis?: number;
  z_cf?: number;
};

export type CVarMethod = {
  method?: string;
  confidence?: number;
  cvar_pct: number;
  cvar_eur: number;
};

export type Pair = { pair: string; correlation: number };

export type AnalyzeResponse = {
  meta: {
    start_date: string;
    end_date: string;
    data_source?: string;
    [k: string]: any;
  };
  overview: OverviewRow[];
  portfolio: {
    ann_return: number;
    ann_vol: number;
    sharpe: number;
    max_drawdown: number;
    mdd_pct: number;
    trough_date?: string;
    duration_days?: number;
    portfolio_value?: number;
  };
  var: {
    historical: VarMethod;
    parametric: VarMethod;
    cornish_fisher: VarMethod;
    cvar_historical: CVarMethod;
    cvar_parametric: CVarMethod;
    confidence?: number;
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
    matrix: number[][];
    labels: string[];
    highest_pair: Pair;
    lowest_pair: Pair;
    avg_correlation: number;
    interpretation: string;
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
